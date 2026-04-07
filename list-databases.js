const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Missing MONGODB_URI. Set it in your environment before running this script.');
  process.exit(1);
}

async function listDatabases() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✓ Connected to MongoDB Atlas');
    
    const adminDb = client.db('admin');
    const result = await adminDb.admin().listDatabases();
    
    console.log('\n=== Databases in Atlas Cluster ===\n');
    result.databases.forEach((db, index) => {
      console.log(`${index + 1}. ${db.name} (${(db.sizeOnDisk / (1024 * 1024)).toFixed(2)} MB)`);
    });
    
    console.log(`\nTotal: ${result.databases.length} database(s)`);
    
  } catch (error) {
    console.error('✗ Connection Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

listDatabases();
