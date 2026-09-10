import { getKVClient, isKVConfigured } from './_kv.js';
import { put } from '@vercel/blob';

/**
 * Automatically uploads any base64 images in fleet inventory to Vercel Blob,
 * replacing hefty data URLs (~100KB each) with lightweight CDN URLs (~50 bytes).
 * Keeps KV database payload ultra-lightweight and lightning fast.
 */
async function offloadBase64ImagesToBlob(fleetList) {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken || !Array.isArray(fleetList)) return fleetList;

  let convertedCount = 0;

  const processedFleet = await Promise.all(
    fleetList.map(async (car) => {
      if (!car || !Array.isArray(car.images) || car.images.length === 0) {
        return car;
      }

      const updatedImages = await Promise.all(
        car.images.map(async (img, idx) => {
          if (typeof img === 'string' && img.startsWith('data:image/')) {
            try {
              const match = img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
              if (match) {
                const mimeType = match[1];
                const buffer = Buffer.from(match[2], 'base64');
                const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
                const cleanCarId = (car.id || 'car').replace(/[^a-zA-Z0-9_-]/g, '_');
                const filename = `fleet/${cleanCarId}-${idx + 1}-${Date.now()}.${ext}`;

                const blob = await put(filename, buffer, {
                  access: 'public',
                  contentType: mimeType,
                  token: blobToken
                });

                convertedCount++;
                return blob.url;
              }
            } catch (err) {
              console.warn('[Blob Offload] Could not offload image to Vercel Blob:', err);
            }
          }
          return img;
        })
      );

      return {
        ...car,
        images: updatedImages
      };
    })
  );

  if (convertedCount > 0) {
    console.info(`[Blob Offload] Successfully uploaded ${convertedCount} photos to Vercel Blob CDN.`);
  }

  return processedFleet;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const kv = getKVClient();
  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const kvConfigured = isKVConfigured() && Boolean(kv);

  try {
    if (req.method === 'GET') {
      if (!kvConfigured) {
        return res.status(200).json({
          success: true,
          configured: false,
          blobConfigured,
          source: 'local',
          data: null
        });
      }

      const storedFleet = await kv.get('otto:fleet');
      if (storedFleet && Array.isArray(storedFleet) && storedFleet.length > 0) {
        return res.status(200).json({
          success: true,
          configured: true,
          blobConfigured,
          source: 'cloud',
          data: storedFleet
        });
      }

      return res.status(200).json({
        success: true,
        configured: true,
        blobConfigured,
        source: 'empty',
        data: null
      });
    }

    if (req.method === 'POST') {
      const { fleet } = req.body || {};
      if (!fleet || !Array.isArray(fleet)) {
        return res.status(400).json({ success: false, error: 'Invalid fleet payload' });
      }

      if (!kvConfigured) {
        return res.status(200).json({
          success: false,
          configured: false,
          blobConfigured,
          message: 'Vercel KV / Upstash Redis Storage not connected'
        });
      }

      // Automatically convert any base64 images to permanent Blob URLs
      const cleanedFleet = await offloadBase64ImagesToBlob(fleet);

      await kv.set('otto:fleet', cleanedFleet);
      return res.status(200).json({
        success: true,
        configured: true,
        blobConfigured,
        message: 'Fleet synced to cloud database',
        count: cleanedFleet.length,
        data: cleanedFleet
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API /api/fleet error:', error);
    return res.status(500).json({ success: false, error: error.message, blobConfigured, configured: kvConfigured });
  }
}
