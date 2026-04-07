import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Missing MONGODB_URI. Set it in your environment before running this script.');
  process.exit(1);
}

async function listDatabases() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    retryWrites: true,
  });
  
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✓ Successfully connected to MongoDB Atlas\n');
    
    // Get admin database and list all databases
    const adminDb = client.db('admin');
    const result = await adminDb.admin().listDatabases();
    
    console.log('=== Databases in Atlas Cluster ===\n');
    
    if (result.databases.length === 0) {
      console.log('No databases found.');
    } else {
      result.databases.forEach((db, index) => {
        const sizeMB = (db.sizeOnDisk / (1024 * 1024)).toFixed(2);
        console.log(`${index + 1}. ${db.name}`);
        console.log(`   Size: ${sizeMB} MB`);
      });
      
      console.log(`\n📊 Total: ${result.databases.length} database(s)`);
    }
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✓ Connection closed');
  }
}

listDatabases();
