import { MongoClient } from 'mongodb'

async function testConnection() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB_NAME || 'meena_b'

  if (!uri) {
    console.error('❌ MONGODB_URI not set in environment variables')
    process.exit(1)
  }

  console.log('Testing MongoDB connection...')
  console.log('Database:', dbName)

  let client

  try {
    client = new MongoClient(uri)
    await client.connect()
    console.log('✅ Successfully connected to MongoDB Atlas!')

    const db = client.db(dbName)
    const collections = await db.listCollections().toArray()
    console.log(`✅ Database "${dbName}" accessible`)
    console.log(`✅ Collections found: ${collections.length}`)

    if (collections.length > 0) {
      collections.forEach((col) => {
        console.log(`   - ${col.name}`)
      })
    }

    const productsCollection = db.collection('products')
    const productCount = await productsCollection.countDocuments()
    console.log(`✅ Products collection: ${productCount} documents`)

    const customersCollection = db.collection('customers')
    const customerCount = await customersCollection.countDocuments()
    console.log(`✅ Customers collection: ${customerCount} documents`)

    console.log('\n✅ All database checks passed!')
  } catch (error) {
    console.error('❌ MongoDB connection FAILED:')
    console.error('Error:', error.message)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

testConnection()
