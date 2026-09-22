const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6ab2b89c00003bec9a51';
const API_KEY = 'standard_ddb60eedacf54fa15ee290d0627579b589f9918456938d39e94609b3db3eae7f8e5e787565ece77b85833eb36a4a7f31db10dd08520ffed98347d1df44b925d2ddff2fd1f7a5d2f7ed4b0bbc1870424c7d2ee79e61b899670b0150df7f1957ed081b30111f371eeaa0448eb80af0c7d46aa90b7c55ef77140dbc234fa0da5939';

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY
};

async function api(path, method = 'GET', body = null) {
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${ENDPOINT}${path}`, opts);
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function main() {
  console.log('Testing collections...');
  let res = await api('/databases/otto-db/collections', 'POST', {
    collectionId: 'fleet',
    name: 'Fleet',
    permissions: ['read("any")', 'create("any")', 'update("any")', 'delete("any")']
  });
  console.log('Result:', res.status, res.data);
}

main().catch(console.error);
