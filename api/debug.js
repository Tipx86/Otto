export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Show which env vars are present (without exposing secrets)
  const envCheck = {
    KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
    KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
    KV_URL: Boolean(process.env.KV_URL),
    KV_REST_API_READ_ONLY_TOKEN: Boolean(process.env.KV_REST_API_READ_ONLY_TOKEN),
    UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    // Show first 20 chars of URL for debugging (not a secret)
    KV_REST_API_URL_preview: process.env.KV_REST_API_URL ? process.env.KV_REST_API_URL.substring(0, 30) + '...' : null,
    UPSTASH_REDIS_REST_URL_preview: process.env.UPSTASH_REDIS_REST_URL ? process.env.UPSTASH_REDIS_REST_URL.substring(0, 30) + '...' : null,
    NODE_ENV: process.env.NODE_ENV
  };

  return res.status(200).json({
    message: 'Environment variable diagnostic',
    env: envCheck
  });
}
