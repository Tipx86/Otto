import { kv, isKVConfigured } from './_kv.js';
import { put } from '@vercel/blob';

/**
 * Scan siteContent for base64 image strings and upload them to Vercel Blob
 */
async function offloadContentImages(contentObj) {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken || !contentObj || typeof contentObj !== 'object') return contentObj;

  const serialized = JSON.stringify(contentObj);
  // Quick check if there are any data URLs inside
  if (!serialized.includes('data:image/')) {
    return contentObj;
  }

  const cloned = JSON.parse(serialized);

  // Helper to check & upload single string
  const checkAndUpload = async (val, keyName) => {
    if (typeof val === 'string' && val.startsWith('data:image/')) {
      try {
        const match = val.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const buffer = Buffer.from(match[2], 'base64');
          const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
          const filename = `content/${keyName}-${Date.now()}.${ext}`;

          const blob = await put(filename, buffer, {
            access: 'public',
            contentType: mimeType,
            token: blobToken
          });
          return blob.url;
        }
      } catch (err) {
        console.warn('[Blob Offload Content] Failed:', err);
      }
    }
    return val;
  };

  // Check top level and nested fields
  if (cloned.brand?.logo) {
    cloned.brand.logo = await checkAndUpload(cloned.brand.logo, 'logo');
  }

  if (Array.isArray(cloned.destinations)) {
    cloned.destinations = await Promise.all(
      cloned.destinations.map(async (dest, i) => {
        if (dest.image) {
          dest.image = await checkAndUpload(dest.image, `dest-${i}`);
        }
        return dest;
      })
    );
  }

  return cloned;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  try {
    if (req.method === 'GET') {
      if (!isKVConfigured() || !kv) {
        return res.status(200).json({
          success: true,
          configured: false,
          blobConfigured,
          source: 'local',
          data: null
        });
      }

      const content = await kv.get('otto:content');
      return res.status(200).json({
        success: true,
        configured: true,
        blobConfigured,
        source: content ? 'cloud' : 'empty',
        data: content || null
      });
    }

    if (req.method === 'POST') {
      const { siteContent } = req.body || {};
      if (!siteContent) {
        return res.status(400).json({ success: false, error: 'Missing siteContent' });
      }

      if (!isKVConfigured() || !kv) {
        return res.status(200).json({
          success: false,
          configured: false,
          blobConfigured,
          message: 'Vercel KV not connected'
        });
      }

      const cleanContent = await offloadContentImages(siteContent);

      await kv.set('otto:content', cleanContent);
      return res.status(200).json({
        success: true,
        configured: true,
        blobConfigured,
        message: 'Content updated in cloud database',
        data: cleanContent
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, blobConfigured });
  }
}
