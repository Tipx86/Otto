import { createClient } from '@vercel/kv';

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export function isKVConfigured() {
  return Boolean(url && token);
}

// Safely create KV client with support for both Vercel KV and Upstash Redis environment variables
export const kv = (url && token) 
  ? createClient({ url, token }) 
  : null;
