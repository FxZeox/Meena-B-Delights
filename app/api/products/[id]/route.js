import { NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'
import { ensureProductCollection, normalizeProductUpdate } from '../../../../lib/products'

export async function PATCH(request, { params }) {
  try {
    const routeParams = await params
    const productId = String(routeParams?.id || '').trim()
    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product id is required.',
        },
        { status: 400 },
      )
    }

    const payload = await request.json()
    const parsed = normalizeProductUpdate(payload)

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

    const updatePayload = {
      ...parsed,
      updatedAt: new Date().toISOString(),
    }

    const updateResult = await productsCollection.updateOne(
      { id: productId },
      { $set: updatePayload },
    )

    if (!updateResult.matchedCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found.',
        },
        { status: 404 },
      )
    }

    const updatedProduct = await productsCollection.findOne(
      { id: productId },
      { projection: { _id: 0 } },
    )

    return NextResponse.json({ success: true, product: updatedProduct })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Unable to update product.',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const routeParams = await params
    const productId = String(routeParams?.id || '').trim()
    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product id is required.',
        },
        { status: 400 },
      )
    }

    const db = await getDb()
    const productsCollection = await ensureProductCollection(db)
    const result = await productsCollection.deleteOne({ id: productId })

    if (!result.deletedCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found.',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Unable to delete product.',
      },
      { status: 500 },
    )
  }
}
