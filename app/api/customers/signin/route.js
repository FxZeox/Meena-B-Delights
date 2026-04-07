import { NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'
import {
  getCustomersCollection,
  validateEmail,
  validatePassword,
  verifyPassword,
} from '../../../../lib/customers'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate inputs
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: emailValidation.error,
        },
        { status: 400 },
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: passwordValidation.error,
        },
        { status: 400 },
      )
    }

    const db = await getDb()
    const customersCollection = await getCustomersCollection(db)

    // Find customer by email
    const customer = await customersCollection.findOne(
      {
        email: emailValidation.email,
      },
      {
        projection: { passwordHash: 1, id: 1, email: 1, profile: 1 },
      },
    )

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password.',
        },
        { status: 401 },
      )
    }

    // Verify password
    const passwordMatch = await verifyPassword(
      passwordValidation.password,
      customer.passwordHash,
    )

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password.',
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully.',
      customer: {
        id: customer.id,
        email: customer.email,
        profile: customer.profile,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Login failed.',
      },
      { status: 500 },
    )
  }
}
