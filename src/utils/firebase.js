import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs
} from 'firebase/firestore';

// ─── FIREBASE CONFIG ──────────────────────────────────────────────────────────
// Firebase API keys are SAFE to be public — security is enforced by
// Firestore Security Rules, not by keeping the key secret.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCuFzNXcoliS_YC8UObijpwgQq2f3jBImU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ottorental-4ddf3.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ottorental-4ddf3',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ottorental-4ddf3.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '297295116729',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:297295116729:web:f7baef8b0fdd901c1cde68'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const isSupabaseConfigured = true; // Keeps AppContext compatibility

// ─── FLEET ────────────────────────────────────────────────────────────────────

/**
 * Load fleet from Firestore > config > fleet
 * Returns { fleet: [], updatedAt: string } or null
 */
export async function dbLoadFleet() {
  try {
    const snap = await getDoc(doc(db, 'config', 'fleet'));
    if (!snap.exists()) return null;
    const data = snap.data();
    if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) return null;
    return { fleet: data.data, updatedAt: data.updated_at };
  } catch (e) {
    console.warn('[Firebase] loadFleet:', e.message);
    return null;
  }
}

/**
 * Save fleet to Firestore > config > fleet
 * Offloads any base64 images to Vercel Blob first.
 */
export async function dbSaveFleet(fleetArray) {
  try {
    // Upload any base64 images to Vercel Blob first
    const cleanFleet = await offloadFleetImages(fleetArray);

    // Safety net: strip any remaining base64 strings (Firestore has 1MB doc limit)
    const safeFleet = cleanFleet.map(car => ({
      ...car,
      images: Array.isArray(car.images)
        ? car.images.map(img =>
            typeof img === 'string' && img.startsWith('data:image/')
              ? `https://www.ottorental.com/cars/${car.id}.png`
              : img
          )
        : car.images
    }));

    await setDoc(doc(db, 'config', 'fleet'), {
      data: safeFleet,
      updated_at: new Date().toISOString()
    });

    return { success: true, data: safeFleet };
  } catch (e) {
    console.error('[Firebase] saveFleet:', e.message);
    return { success: false, error: e.message };
  }
}

// ─── SITE CONTENT ─────────────────────────────────────────────────────────────

/**
 * Load site content from Firestore > config > site_content
 */
export async function dbLoadContent() {
  try {
    const snap = await getDoc(doc(db, 'config', 'site_content'));
    if (!snap.exists()) return null;
    return snap.data()?.data || null;
  } catch (e) {
    console.warn('[Firebase] loadContent:', e.message);
    return null;
  }
}

/**
 * Save site content to Firestore > config > site_content
 */
export async function dbSaveContent(contentObj) {
  try {
    await setDoc(doc(db, 'config', 'site_content'), {
      data: contentObj,
      updated_at: new Date().toISOString()
    });
    return { success: true };
  } catch (e) {
    console.error('[Firebase] saveContent:', e.message);
    return { success: false, error: e.message };
  }
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

/**
 * Load all bookings from Firestore > bookings collection
 */
export async function dbLoadBookings() {
  try {
    const snap = await getDocs(collection(db, 'bookings'));
    if (snap.empty) return null;
    return snap.docs
      .map(d => d.data())
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch (e) {
    console.warn('[Firebase] loadBookings:', e.message);
    return null;
  }
}

/**
 * Save a single booking document to Firestore > bookings > {booking.id}
 */
export async function dbSaveBooking(booking) {
  try {
    await setDoc(doc(db, 'bookings', booking.id), booking);
    return true;
  } catch (e) {
    console.error('[Firebase] saveBooking:', e.message);
    return false;
  }
}

// ─── INQUIRIES ────────────────────────────────────────────────────────────────

/**
 * Load all inquiries from Firestore > inquiries collection
 */
export async function dbLoadInquiries() {
  try {
    const snap = await getDocs(collection(db, 'inquiries'));
    if (snap.empty) return null;
    return snap.docs
      .map(d => d.data())
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch (e) {
    console.warn('[Firebase] loadInquiries:', e.message);
    return null;
  }
}

/**
 * Save a single inquiry document to Firestore > inquiries > {inquiry.id}
 */
export async function dbSaveInquiry(inquiry) {
  try {
    await setDoc(doc(db, 'inquiries', inquiry.id), inquiry);
    return true;
  } catch (e) {
    console.error('[Firebase] saveInquiry:', e.message);
    return false;
  }
}

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────

/**
 * Upload a single base64 image to Vercel Blob via the /api/upload serverless function.
 * Firebase Storage requires a paid plan, so we use Vercel Blob instead.
 * Returns the permanent CDN URL, or the original src if upload fails.
 */
export async function uploadImageToSupabase(dataUrl, carId = 'car', index = 0) {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl;

  try {
    const ext = dataUrl.split(';')[0].split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
    const cleanId = (carId || 'car').replace(/[^a-zA-Z0-9_-]/g, '-');
    const filename = `${cleanId}-${index}-${Date.now()}.${ext}`;

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl, filename })
    });

    if (!response.ok) throw new Error(`Upload returned ${response.status}`);
    const result = await response.json();

    if (result.url) {
      console.info('[Blob] ✅ Uploaded:', result.url);
      return result.url;
    }
    return dataUrl;
  } catch (e) {
    console.warn('[Blob] Image upload error:', e.message);
    return dataUrl;
  }
}

/**
 * Scans a fleet array and uploads any base64 images to Vercel Blob.
 * Returns cleaned fleet with permanent CDN URLs.
 */
export async function offloadFleetImages(fleetArray) {
  if (!Array.isArray(fleetArray)) return fleetArray;

  return Promise.all(fleetArray.map(async (car) => {
    if (!car || !Array.isArray(car.images) || car.images.length === 0) return car;

    const uploadedImages = await Promise.all(
      car.images.map((img, idx) =>
        typeof img === 'string' && img.startsWith('data:image/')
          ? uploadImageToSupabase(img, car.id || 'car', idx)
          : Promise.resolve(img)
      )
    );

    return { ...car, images: uploadedImages };
  }));
}
