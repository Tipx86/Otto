import { getKVClient, isKVConfigured } from './_kv.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const kv = getKVClient();
  const kvConfigured = isKVConfigured() && Boolean(kv);

  try {
    if (req.method === 'GET') {
      if (!kvConfigured) {
        return res.status(200).json({
          success: true,
          configured: false,
          data: []
        });
      }

      const inquiries = await kv.get('otto:inquiries');
      return res.status(200).json({
        success: true,
        configured: true,
        data: Array.isArray(inquiries) ? inquiries : []
      });
    }

    if (req.method === 'POST') {
      const { inquiry } = req.body || {};
      if (!inquiry || !inquiry.id) {
        return res.status(400).json({ success: false, error: 'Invalid inquiry data' });
      }

      if (!kvConfigured) {
        return res.status(200).json({
          success: false,
          configured: false,
          message: 'Vercel KV not connected'
        });
      }

      const existing = (await kv.get('otto:inquiries')) || [];
      const updated = [inquiry, ...(Array.isArray(existing) ? existing.filter(i => i.id !== inquiry.id) : [])];
      await kv.set('otto:inquiries', updated);

      return res.status(200).json({
        success: true,
        configured: true,
        message: 'Inquiry saved to cloud',
        id: inquiry.id
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API /api/inquiries error:', error);
    return res.status(500).json({ success: false, error: error.message, configured: kvConfigured });
  }
}
