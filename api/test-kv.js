import { getKVClient, isKVConfigured } from './_kv.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const kv = getKVClient();
  const kvConfigured = isKVConfigured() && Boolean(kv);

  const report = {
    timestamp: new Date().toISOString(),
    env: {
      KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
      KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
      UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
      UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
      BLOB_READ_WRITE_TOKEN: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    },
    kvConfigured,
    writeTest: null,
    readTest: null,
    fleetKeyExists: null,
    fleetCount: null,
    contentKeyExists: null,
    error: null
  };

  if (!kvConfigured) {
    report.error = 'KV client could not be initialized. Check environment variables.';
    return res.status(200).json(report);
  }

  try {
    // Test write
    await kv.set('otto:diagnostic', { ok: true, ts: Date.now() });
    report.writeTest = 'PASS';

    // Test read back
    const readBack = await kv.get('otto:diagnostic');
    report.readTest = readBack?.ok === true ? 'PASS' : 'FAIL - got: ' + JSON.stringify(readBack);

    // Check fleet key
    const fleet = await kv.get('otto:fleet');
    report.fleetKeyExists = fleet !== null && fleet !== undefined;
    report.fleetCount = Array.isArray(fleet) ? fleet.length : (fleet ? 'not-array' : 0);

    // Check content key
    const content = await kv.get('otto:content');
    report.contentKeyExists = content !== null && content !== undefined;

  } catch (err) {
    report.error = err.message;
    report.writeTest = 'FAIL';
  }

  return res.status(200).json(report);
}
