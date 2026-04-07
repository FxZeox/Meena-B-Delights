import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME || 'meena_b'

let clientPromise

function getClientPromise() {
  if (!uri) {
    throw new Error('Missing MONGODB_URI in environment variables.')
  }

  if (!globalThis.__meenaMongoClientPromise) {
    const client = new MongoClient(uri)
    globalThis.__meenaMongoClientPromise = client.connect()
  }

  return globalThis.__meenaMongoClientPromise
}

export async function getDb() {
  if (!clientPromise) {
    clientPromise = getClientPromise()
  }

  const client = await clientPromise
  return client.db(dbName)
}
