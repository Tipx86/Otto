import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://apwsjfpthawhwakersgf.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwd3NqZnB0aGF3aHdha2Vyc2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNjU5NjMsImV4cCI6MjEwNDY0MTk2M30.V4MZ7pTGHLX2KMEpsPMkpoYmwcdaUkKO5XAGsIp3D08';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const IMAGE_BUCKET = 'fleet-images';

// ─── FLEET ────────────────────────────────────────────────────────────────────

export async function dbLoadFleet() {
  try {
    const { data, error } = await supabase
      .from('fleet')
      .select('data, updated_at')
      .eq('id', 'main')
      .single();
    if (error || !data) return null;
    return { fleet: data.data, updatedAt: data.updated_at };
  } catch (e) {
    console.warn('[Supabase] loadFleet:', e.message);
    return null;
  }
}

export async function dbSaveFleet(fleetArray) {
  try {
    // Upload any base64 images to Supabase Storage first
    const cleanFleet = await offloadFleetImages(fleetArray);

    // Safety: strip any remaining base64 strings to prevent oversized DB payloads
    // (If Storage upload failed, replace base64 with a placeholder so DB save still works)
    const safeFleet = cleanFleet.map(car => ({
      ...car,
      images: Array.isArray(car.images)
        ? car.images.map(img =>
            typeof img === 'string' && img.startsWith('data:image/')
              ? '/placeholder-car.jpg'  // Storage upload failed - use placeholder
              : img
          )
        : car.images
    }));

    const { error } = await supabase
      .from('fleet')
      .upsert({ id: 'main', data: safeFleet, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) throw error;
    return { success: true, data: safeFleet };
  } catch (e) {
    console.error('[Supabase] saveFleet:', e.message);
    return { success: false };
  }
}


// ─── SITE CONTENT ─────────────────────────────────────────────────────────────

export async function dbLoadContent() {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('id', 'main')
      .single();
    if (error || !data) return null;
    return data.data;
  } catch (e) {
    console.warn('[Supabase] loadContent:', e.message);
    return null;
  }
}

export async function dbSaveContent(contentObj) {
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({ id: 'main', data: contentObj, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('[Supabase] saveContent:', e.message);
    return false;
  }
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

export async function dbLoadBookings() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('data')
      .order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(r => r.data);
  } catch (e) {
    return null;
  }
}

export async function dbSaveBooking(booking) {
  try {
    const { error } = await supabase
      .from('bookings')
      .upsert({ id: booking.id, data: booking }, { onConflict: 'id' });
    return !error;
  } catch { return false; }
}

// ─── INQUIRIES ────────────────────────────────────────────────────────────────

export async function dbLoadInquiries() {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('data')
      .order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(r => r.data);
  } catch (e) {
    return null;
  }
}

export async function dbSaveInquiry(inquiry) {
  try {
    const { error } = await supabase
      .from('inquiries')
      .upsert({ id: inquiry.id, data: inquiry }, { onConflict: 'id' });
    return !error;
  } catch { return false; }
}

// ─── IMAGE STORAGE ────────────────────────────────────────────────────────────

/**
 * Uploads a single base64 image to Supabase Storage.
 * Returns the permanent public CDN URL, or the original if upload fails.
 */
export async function uploadImageToSupabase(dataUrl, carId = 'car', index = 0) {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl;

  try {
    // Ensure bucket exists (safe to call if already created)
    await supabase.storage.createBucket(IMAGE_BUCKET, {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 10485760 // 10MB
    }).catch(() => {/* bucket already exists, that's fine */});

    const match = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!match) return dataUrl;

    const mimeType = match[1];
    const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
    const cleanId = (carId || 'car').replace(/[^a-zA-Z0-9_-]/g, '-');
    const filename = `${cleanId}/${index}-${Date.now()}.${ext}`;

    // Decode base64 to binary
    const binaryStr = atob(match[2]);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(filename, bytes.buffer, {
        contentType: mimeType,
        upsert: true
      });

    if (error) {
      console.warn('[Supabase Storage] Upload failed:', error.message);
      return dataUrl;
    }

    const { data: pub } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filename);
    console.info('[Supabase Storage] ✅ Uploaded:', pub.publicUrl);
    return pub.publicUrl;
  } catch (e) {
    console.warn('[Supabase Storage] Error:', e.message);
    return dataUrl;
  }
}

/**
 * Scans a fleet array and uploads any base64 images to Supabase Storage.
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
