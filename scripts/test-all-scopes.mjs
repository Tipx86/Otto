const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6ab2b89c00003bec9a51';
const API_KEY = 'standard_51b7a10a5877b1de66f2d2d428b8a82b2907444aa297b02729e5aea026a55ce3c95805a24249ca348c15d90dda9df646db62623a93340e424f84e6bc2fb9028f47e96dcbef63150f0579fcefe19739f754dde2c0297f71cbb138b309f89b8a99d54291ca03eab7839ab50ee0257c10add33f04ed45530ae8c7b630d4bef4800e';

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY
};

async function test(name, url, method = 'GET') {
  const res = await fetch(`${ENDPOINT}${url}`, { method, headers });
  const data = await res.json().catch(() => null);
  console.log(`${name}: ${res.status}`, res.status >= 400 ? (data?.message || data) : 'SUCCESS');
}

async function run() {
  await test('databases', '/databases');
  await test('users', '/users');
  await test('teams', '/teams');
  await test('storage buckets', '/storage/buckets');
  await test('functions', '/functions');
  await test('health', '/health');
}

run().catch(console.error);
