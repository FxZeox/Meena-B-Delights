import { NextResponse } from 'next/server'
import { getDb } from '../../../lib/mongodb'
import { ensureProductCollection, normalizeProduct } from '../../../lib/products'

export async function GET() {
  try {
    const db = await getDb()
    const productsCollection = await ensureProductCollection(db)
    const products = await productsCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      { success: true, products },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Unable to load products.',
      },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = normalizeProduct(body, { requireId: true })

    if (parsed.error) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error,
        },
        { status: 400 },
      )
    }

    const db = await getDb()
    const productsCollection = await ensureProductCollection(db)
    const now = new Date().toISOString()

    const newProduct = {
      ...parsed,
      createdAt: now,
      updatedAt: now,
    }

    await productsCollection.insertOne(newProduct)

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 })
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'This product id already exists. Use a different id.',
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Unable to create product.',
      },
      { status: 500 },
    )
  }
}
