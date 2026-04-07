import { bakeryProducts } from '../data/products'

const PRODUCT_COLLECTION = 'products'

const DEFAULT_RATING = 4.7

const toBoolean = (value, defaultValue = false) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true'
  }

  return defaultValue
}

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function normalizeProduct(payload, { requireId = false } = {}) {
  const product = payload || {}

  const id = String(product.id || '').trim()
  const name = String(product.name || '').trim()
  const category = String(product.category || '').trim() || 'Cakes'

  if (!name) {
    return { error: 'Product name is required.' }
  }

  if (requireId && !id) {
    return { error: 'Product id is required.' }
  }

  return {
    id,
    name,
    category,
    price: toNumber(product.price, 0),
    stock: Math.max(0, toNumber(product.stock, 0)),
    image: String(product.image || '').trim(),
    imagePublicId: String(product.imagePublicId || '').trim(),
    description: String(product.description || '').trim(),
    rating: toNumber(product.rating, DEFAULT_RATING),
    featured: toBoolean(product.featured, false),
    bestSeller: toBoolean(product.bestSeller, false),
  }
}

export function normalizeProductUpdate(payload) {
  const product = payload || {}
  const update = {}

  if (Object.prototype.hasOwnProperty.call(product, 'name')) {
    const name = String(product.name || '').trim()
    if (!name) {
      return { error: 'Product name cannot be empty.' }
    }
    update.name = name
  }

  if (Object.prototype.hasOwnProperty.call(product, 'category')) {
    update.category = String(product.category || '').trim() || 'Cakes'
  }

  if (Object.prototype.hasOwnProperty.call(product, 'price')) {
    update.price = toNumber(product.price, 0)
  }

  if (Object.prototype.hasOwnProperty.call(product, 'stock')) {
    update.stock = Math.max(0, toNumber(product.stock, 0))
  }

  if (Object.prototype.hasOwnProperty.call(product, 'image')) {
    update.image = String(product.image || '').trim()
  }

  if (Object.prototype.hasOwnProperty.call(product, 'imagePublicId')) {
    update.imagePublicId = String(product.imagePublicId || '').trim()
  }

  if (Object.prototype.hasOwnProperty.call(product, 'description')) {
    update.description = String(product.description || '').trim()
  }

  if (Object.prototype.hasOwnProperty.call(product, 'rating')) {
    update.rating = toNumber(product.rating, DEFAULT_RATING)
  }

  if (Object.prototype.hasOwnProperty.call(product, 'featured')) {
    update.featured = toBoolean(product.featured, false)
  }

  if (Object.prototype.hasOwnProperty.call(product, 'bestSeller')) {
    update.bestSeller = toBoolean(product.bestSeller, false)
  }

  if (!Object.keys(update).length) {
    return { error: 'No valid fields provided for update.' }
  }

  return update
}

export async function ensureProductCollection(db) {
  const collection = db.collection(PRODUCT_COLLECTION)
  await collection.createIndex({ id: 1 }, { unique: true })

  const count = await collection.countDocuments()
  if (count > 0) {
    return collection
  }

  const now = new Date().toISOString()
  const seeds = bakeryProducts.map((item) => ({
    ...item,
    imagePublicId: '',
    createdAt: now,
    updatedAt: now,
  }))

  if (seeds.length) {
    await collection.insertMany(seeds, { ordered: false })
  }

  return collection
}

export { PRODUCT_COLLECTION }
