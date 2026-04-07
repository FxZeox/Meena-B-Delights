import bcrypt from 'bcryptjs'

const CUSTOMER_COLLECTION = 'customers'

export async function getCustomersCollection(db) {
  const collection = db.collection(CUSTOMER_COLLECTION)
  await collection.createIndex({ email: 1 }, { unique: true })
  return collection
}

export function validateEmail(email) {
  const normalized = String(email || '').trim().toLowerCase()
  if (!normalized) {
    return { valid: false, error: 'Email is required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(normalized)) {
    return { valid: false, error: 'Invalid email format.' }
  }

  return { valid: true, email: normalized }
}

export function validatePassword(password) {
  const trimmed = String(password || '').trim()
  if (!trimmed) {
    return { valid: false, error: 'Password is required.' }
  }

  if (trimmed.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters.' }
  }

  return { valid: true, password: trimmed }
}

export function validateFullName(fullName) {
  const trimmed = String(fullName || '').trim()
  if (!trimmed) {
    return { valid: false, error: 'Full name is required.' }
  }

  if (trimmed.length < 3) {
    return { valid: false, error: 'Full name must be at least 3 characters.' }
  }

  return { valid: true, name: trimmed }
}

export function validatePhone(phone) {
  const normalized = String(phone || '').trim()
  if (!normalized) {
    return { valid: false, error: 'Phone number is required.' }
  }

  const digitsOnly = normalized.replace(/\D/g, '')
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { valid: false, error: 'Phone number must contain 10 to 15 digits.' }
  }

  return { valid: true, phone: normalized }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export function createCustomerProfile(email, fullName, phone = '') {
  return {
    email,
    fullName,
    phone: String(phone || '').trim(),
    address: '',
    createdAt: new Date().toISOString(),
  }
}
