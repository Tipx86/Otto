import { Client, Databases, Storage, Account } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '6ab2b89c00003bec9a51');

export { client };
export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

// Ping Appwrite once when the app starts so the console confirms setup
client.ping().then((res) => {
  console.log('[Appwrite] Connection verified:', res);
}).catch((err) => {
  console.warn('[Appwrite] Ping check:', err);
});
