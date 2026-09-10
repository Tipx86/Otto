import { Redis } from '@upstash/redis';

/**
 * Creates an Upstash Redis client using env vars.
 * Supports both Vercel KV and Upstash marketplace variable names.
 */
export function getKVClient() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    return new Redis({ url, token });
  } catch (err) {
    console.error('[KV] Failed to create Redis client:', err.message);
    return null;
  }
}

export function isKVConfigured() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return Boolean(url && token);
}
