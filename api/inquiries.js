import { kv, isKVConfigured } from './_kv.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      if (!isKVConfigured() || !kv) {
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
      if (!inquiry) {
        return res.status(400).json({ success: false, error: 'Missing inquiry object' });
      }

      if (!isKVConfigured() || !kv) {
        return res.status(200).json({
          success: false,
          configured: false,
          message: 'Vercel KV not connected'
        });
      }

      const current = (await kv.get('otto:inquiries')) || [];
      const updated = [inquiry, ...(Array.isArray(current) ? current : [])];
      await kv.set('otto:inquiries', updated);
      return res.status(200).json({
        success: true,
        configured: true,
        message: 'Inquiry recorded in cloud database'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
