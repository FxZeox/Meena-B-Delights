import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { MongoClient } from 'mongodb'

// Load .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.join(__dirname, '.env.local')

const envFile = fs.readFileSync(envPath, 'utf-8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const trimmedLine = line.trim()
  if (!trimmedLine || trimmedLine.startsWith('#')) return
  
  const eqIndex = trimmedLine.indexOf('=')
  if (eqIndex === -1) return
  
  const key = trimmedLine.substring(0, eqIndex).trim()
  const value = trimmedLine.substring(eqIndex + 1).trim()
  
  if (key && value) {
    envVars[key] = value
  }
})

Object.assign(process.env, envVars)

async function testConnection() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB_NAME || 'meena_b'

  if (!uri) {
    console.error('❌ MONGODB_URI not set in environment variables')
    process.exit(1)
  }

  console.log('Testing MongoDB connection...')
  console.log('Database:', dbName)
  console.log('Using URI:', uri.split('@')[0] + '@...') // Log sanitized URI

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
