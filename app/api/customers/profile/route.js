import { NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'
import { getCustomersCollection } from '../../../../lib/customers'

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { email, phone, address } = body

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required to update profile.',
        },
        { status: 400 },
      )
    }

    const normalizedEmail = String(email || '').trim().toLowerCase()

    const db = await getDb()
    const customersCollection = await getCustomersCollection(db)

    const updateData = {
      'profile.phone': String(phone || '').trim(),
      'profile.address': String(address || '').trim(),
      updatedAt: new Date().toISOString(),
    }

    const result = await customersCollection.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: updateData },
      {
        returnDocument: 'after',
        projection: {
          _id: 0,
          id: 1,
          email: 1,
          profile: 1,
        },
      },
    )

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Customer not found.',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      customer: result,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Unable to update profile.',
      },
      { status: 500 },
    )
  }
}
