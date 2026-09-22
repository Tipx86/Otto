import { Client, Databases, Storage, ID } from 'appwrite';

const ENDPOINT = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APPWRITE_ENDPOINT) || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APPWRITE_PROJECT_ID) || '6ab2b89c00003bec9a51';

export const DATABASE_ID = 'otto-db';
export const BUCKET_ID = 'fleet-photos';

export const COLLECTIONS = {
  FLEET: '6ab2c655000416c5ea2f',
  SITE_CONTENT: '6ab2c85900052579c2b5',
  BOOKINGS: '6ab2c911000b4b0f4f47',
  INQUIRIES: '6ab2c9ec0037037595db'
};

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

export const databases = new Databases(client);
export const storage = new Storage(client);

export const isSupabaseConfigured = true; // Compatibility flag for AppContext

// ─── PHOTO UPLOAD (APPWRITE STORAGE) ──────────────────────────────────────────

/**
 * Uploads an image file to the Appwrite Storage bucket `fleet-photos`.
 * Returns the permanent public CDN URL for the photo.
 */
export async function uploadImageToAppwrite(file, filename = 'photo.jpg') {
  try {
    let fileObj = file;
    if (typeof file === 'string' && file.startsWith('data:image/')) {
      // Convert base64 Data URL to Blob/File
      const arr = file.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      fileObj = new File([u8arr], filename, { type: mime });
    }

    if (fileObj instanceof File || fileObj instanceof Blob) {
      const fileId = ID.unique();
      const res = await storage.createFile(BUCKET_ID, fileId, fileObj);
      const fileUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.$id}/view?project=${PROJECT_ID}`;
      return { success: true, url: fileUrl, source: 'cloud' };
    }

    if (typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('/'))) {
      return { success: true, url: file, source: 'existing' };
    }

    return { success: false, error: 'Invalid file format' };
  } catch (err) {
    console.warn('[Appwrite Storage] Upload failed:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Upload any base64 images inside fleet before saving to database
 */
async function offloadFleetImages(fleetArray) {
  if (!Array.isArray(fleetArray)) return fleetArray;
  const processed = [];

  for (const car of fleetArray) {
    if (!car || !Array.isArray(car.images)) {
      processed.push(car);
      continue;
    }

    const cleanImages = [];
    for (const img of car.images) {
      if (typeof img === 'string' && img.startsWith('data:image/')) {
        const uploadRes = await uploadImageToAppwrite(img, `${car.id || 'car'}-${Date.now()}.jpg`);
        cleanImages.push(uploadRes.success ? uploadRes.url : `/cars/${car.id}.png`);
      } else {
        cleanImages.push(img);
      }
    }
    processed.push({ ...car, images: cleanImages });
  }

  return processed;
}

// ─── FLEET INVENTORY ──────────────────────────────────────────────────────────

export async function dbLoadFleet() {
  try {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.FLEET, 'main');
    if (!doc || !doc.data) return null;
    const parsed = typeof doc.data === 'string' ? JSON.parse(doc.data) : doc.data;
    return { fleet: parsed, updatedAt: doc.updated_at || doc.$updatedAt };
  } catch (err) {
    // 404 means collection or document doesn't exist yet
    return null;
  }
}

export async function dbSaveFleet(fleetArray) {
  try {
    const cleanFleet = await offloadFleetImages(fleetArray);
    const payload = {
      data: JSON.stringify(cleanFleet),
      updated_at: new Date().toISOString()
    };

    try {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.FLEET, 'main', payload);
    } catch (updateErr) {
      if (updateErr.code === 404) {
        await databases.createDocument(DATABASE_ID, COLLECTIONS.FLEET, 'main', payload);
      } else {
        throw updateErr;
      }
    }

    return { success: true, data: cleanFleet };
  } catch (err) {
    console.warn('[Appwrite] dbSaveFleet:', err);
    return { success: false, error: err.message };
  }
}

// ─── SITE CONTENT (CMS) ───────────────────────────────────────────────────────

export async function dbLoadContent() {
  try {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.SITE_CONTENT, 'main');
    if (!doc || !doc.data) return null;
    return typeof doc.data === 'string' ? JSON.parse(doc.data) : doc.data;
  } catch (err) {
    return null;
  }
}

export async function dbSaveContent(contentObj) {
  try {
    const payload = {
      data: JSON.stringify(contentObj),
      updated_at: new Date().toISOString()
    };

    try {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.SITE_CONTENT, 'main', payload);
    } catch (updateErr) {
      if (updateErr.code === 404) {
        await databases.createDocument(DATABASE_ID, COLLECTIONS.SITE_CONTENT, 'main', payload);
      } else {
        throw updateErr;
      }
    }

    return { success: true };
  } catch (err) {
    console.warn('[Appwrite] dbSaveContent:', err);
    return { success: false, error: err.message };
  }
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

export async function dbLoadBookings() {
  try {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BOOKINGS);
    return res.documents.map(doc => {
      const parsed = typeof doc.data === 'string' ? JSON.parse(doc.data) : (doc.data || {});
      return { ...parsed, id: doc.$id, status: doc.status || parsed.status || 'confirmed' };
    });
  } catch (err) {
    return [];
  }
}

export async function dbSaveBooking(bookingObj) {
  try {
    const id = bookingObj.bookingId || ID.unique();
    await databases.createDocument(DATABASE_ID, COLLECTIONS.BOOKINGS, id, {
      data: JSON.stringify(bookingObj),
      Status: bookingObj.status || 'confirmed',
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (err) {
    console.warn('[Appwrite] dbSaveBooking:', err);
    return { success: false, error: err.message };
  }
}

// ─── INQUIRIES ────────────────────────────────────────────────────────────────

export async function dbLoadInquiries() {
  try {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.INQUIRIES);
    return res.documents.map(doc => ({
      id: doc.$id,
      name: doc.name || '',
      phone: doc.phone || '',
      message: doc.message || '',
      createdAt: doc.createdAt || doc.$createdAt
    }));
  } catch (err) {
    return [];
  }
}

export async function dbSaveInquiry(inquiryObj) {
  try {
    const id = ID.unique();
    await databases.createDocument(DATABASE_ID, COLLECTIONS.INQUIRIES, id, {
      name: inquiryObj.name || inquiryObj.fullName || 'Anonymous',
      phone: inquiryObj.phone || inquiryObj.phoneOrEmail || '',
      message: inquiryObj.message || inquiryObj.notes || '',
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (err) {
    console.warn('[Appwrite] dbSaveInquiry:', err);
    return { success: false, error: err.message };
  }
}
