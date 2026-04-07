import { NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'
import { getCustomersCollection } from '../../../../lib/customers'

export async function GET(request) {
  try {
    const adminSession = request.cookies.get('admin_session')?.value

    if (!adminSession || adminSession !== '1') {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      )
    }

    const db = await getDb()
    const customersCollection = await getCustomersCollection(db)
    const total = await customersCollection.countDocuments({})

    return NextResponse.json({
      success: true,
      total,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Unable to fetch customer count.',
      },
      { status: 500 },
    )
  }
}