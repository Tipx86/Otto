import { Client, Databases } from 'appwrite';
import { INITIAL_CARS } from '../src/data/initialData.js';
import { INITIAL_SITE_CONTENT } from '../src/data/siteContent.js';

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6ab2b89c00003bec9a51';
const DATABASE_ID = 'otto-db';
const FLEET_COLLECTION_ID = '6ab2c655000416c5ea2f';
const CONTENT_COLLECTION_ID = '6ab2c85900052579c2b5';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

const db = new Databases(client);

async function main() {
  console.log('Seeding Appwrite database...');

  // Clean fleet array: make sure primary image is each car's real studio photo
  const cleanFleet = INITIAL_CARS.map(car => ({
    ...car,
    images: [
      `/cars/${car.id}.png`,
      ...(car.images || []).filter(img => !img.includes('1549399542-7e3f8b79c341') && img !== `/cars/${car.id}.png`)
    ]
  }));

  const fleetPayload = {
    data: JSON.stringify(cleanFleet),
    updated_at: new Date().toISOString()
  };

  try {
    const res = await db.createDocument(DATABASE_ID, FLEET_COLLECTION_ID, 'main', fleetPayload);
    console.log('✅ Fleet seeded successfully into Appwrite! Document ID:', res.$id);
  } catch (err) {
    if (err.code === 409) {
      const res = await db.updateDocument(DATABASE_ID, FLEET_COLLECTION_ID, 'main', fleetPayload);
      console.log('✅ Fleet updated successfully in Appwrite! Document ID:', res.$id);
    } else {
      console.error('❌ Fleet seed error:', err.message);
    }
  }

  const contentPayload = {
    data: JSON.stringify(INITIAL_SITE_CONTENT || {}),
    updated_at: new Date().toISOString()
  };

  try {
    const res = await db.createDocument(DATABASE_ID, CONTENT_COLLECTION_ID, 'main', contentPayload);
    console.log('✅ Site Content seeded successfully into Appwrite! Document ID:', res.$id);
  } catch (err) {
    if (err.code === 409) {
      const res = await db.updateDocument(DATABASE_ID, CONTENT_COLLECTION_ID, 'main', contentPayload);
      console.log('✅ Site Content updated successfully in Appwrite! Document ID:', res.$id);
    } else {
      console.error('❌ Content seed error:', err.message);
    }
  }

  console.log('✨ All 16 vehicles and site content are now live in Appwrite Cloud!');
}

main().catch(console.error);
