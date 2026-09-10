import { put } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const isBlobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    if (!isBlobConfigured) {
      return res.status(200).json({
        success: false,
        configured: false,
        message: 'Vercel Blob is not connected. In your Vercel Dashboard, go to Storage -> Create Database -> Blob to activate global image hosting.'
      });
    }

    const { image, filename = 'photo.jpg' } = req.body || {};
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ success: false, error: 'Missing image data URL' });
    }

    // Parse data URL (e.g. data:image/jpeg;base64,/9j/4AAQSkZJRg...)
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already an external HTTP/HTTPS URL, return it directly
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return res.status(200).json({
          success: true,
          configured: true,
          url: image
        });
      }
      return res.status(400).json({ success: false, error: 'Invalid data URL format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const pathname = `fleet/${Date.now()}-${cleanName}`;

    const blob = await put(pathname, buffer, {
      access: 'public',
      contentType: mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return res.status(200).json({
      success: true,
      configured: true,
      url: blob.url,
      size: buffer.length
    });
  } catch (error) {
    console.error('API /api/upload error:', error);
    const isPrivateError = error.message?.toLowerCase().includes('private') || error.message?.toLowerCase().includes('access');
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      tip: isPrivateError 
        ? 'Your Vercel Blob store was created as "Private". Recreate or set your Blob store to "Public" in Vercel Storage so visitors can view photos.' 
        : undefined
    });
  }
}
