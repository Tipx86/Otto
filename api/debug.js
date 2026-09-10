export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Show which env vars are present (without exposing secrets)
  const envCheck = {
    KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
    KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
    KV_URL: Boolean(process.env.KV_URL),
    UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    BLOB_READ_WRITE_TOKEN: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    NODE_ENV: process.env.NODE_ENV
  };

  return res.status(200).json({
    message: 'Storage & Database Diagnostic',
    kvConnected: Boolean(
      (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
      (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
    ),
    blobConnected: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    env: envCheck
  });
}
