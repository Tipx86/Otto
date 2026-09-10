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

      const bookings = await kv.get('otto:bookings');
      return res.status(200).json({
        success: true,
        configured: true,
        data: Array.isArray(bookings) ? bookings : []
      });
    }

    if (req.method === 'POST') {
      const { booking } = req.body || {};
      if (!booking || !booking.id) {
        return res.status(400).json({ success: false, error: 'Invalid booking data' });
      }

      if (!kvConfigured) {
        return res.status(200).json({
          success: false,
          configured: false,
          message: 'Vercel KV not connected'
        });
      }

      const existing = (await kv.get('otto:bookings')) || [];
      const updated = [booking, ...(Array.isArray(existing) ? existing.filter(b => b.id !== booking.id) : [])];
      await kv.set('otto:bookings', updated);

      return res.status(200).json({
        success: true,
        configured: true,
        message: 'Booking saved to cloud',
        id: booking.id
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API /api/bookings error:', error);
    return res.status(500).json({ success: false, error: error.message, configured: kvConfigured });
  }
}
