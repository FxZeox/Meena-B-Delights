import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Missing MONGODB_URI. Set it in your environment before running this script.');
  process.exit(1);
}

async function testConnection() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  
  try {
    console.log('Connecting to MongoDB Atlas using MONGODB_URI...');
    await client.connect();
    console.log('✓ Connected to MongoDB Atlas');
    
    const adminDb = client.db('admin');
    const result = await adminDb.admin().listDatabases();
    
    console.log('\n=== Databases in Atlas Cluster ===\n');
    result.databases.forEach((db, index) => {
      const sizeMB = (db.sizeOnDisk / (1024 * 1024)).toFixed(2);
      console.log(`${index + 1}. ${db.name} (${sizeMB} MB)`);
    });
    
    console.log(`\nTotal: ${result.databases.length} database(s)`);
    
  } catch (error) {
    console.error('✗ Connection Error:', error.message);
    if (error.codeName) {
      console.error('  Code:', error.codeName);
    }
    process.exit(1);
  } finally {
    await client.close();
  }
}

testConnection();
