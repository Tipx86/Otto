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
          source: 'local',
          data: null
        });
      }

      const storedFleet = await kv.get('otto:fleet');
      if (storedFleet && Array.isArray(storedFleet) && storedFleet.length > 0) {
        return res.status(200).json({
          success: true,
          configured: true,
          source: 'cloud',
          data: storedFleet
        });
      }

      return res.status(200).json({
        success: true,
        configured: true,
        source: 'empty',
        data: null
      });
    }

    if (req.method === 'POST') {
      const { fleet } = req.body || {};
      if (!fleet || !Array.isArray(fleet)) {
        return res.status(400).json({ success: false, error: 'Invalid fleet payload' });
      }

      if (!isKVConfigured() || !kv) {
        return res.status(200).json({
          success: false,
          configured: false,
          message: 'Vercel KV Storage not connected'
        });
      }

      await kv.set('otto:fleet', fleet);
      return res.status(200).json({
        success: true,
        configured: true,
        message: 'Fleet synced to cloud database',
        count: fleet.length
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API /api/fleet error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
