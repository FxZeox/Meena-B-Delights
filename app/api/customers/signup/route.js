import { NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'
import {
  getCustomersCollection,
  validateEmail,
  validatePassword,
  validateFullName,
  validatePhone,
  hashPassword,
  createCustomerProfile,
} from '../../../../lib/customers'

export async function POST(request) {
  try {
    const body = await request.json()
    const { fullName, email, password, phone } = body

    // Validate inputs
    const nameValidation = validateFullName(fullName)
    if (!nameValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: nameValidation.error,
        },
        { status: 400 },
      )
    }

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

    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: phoneValidation.error,
        },
        { status: 400 },
      )
    }

    const db = await getDb()
    const customersCollection = await getCustomersCollection(db)

    // Check if email already exists
    const existingUser = await customersCollection.findOne({
      email: emailValidation.email,
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this email already exists.',
        },
        { status: 409 },
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(passwordValidation.password)

    // Create customer document
    const newCustomer = {
      id: `CU-${Date.now()}`,
      email: emailValidation.email,
      passwordHash: hashedPassword,
      profile: createCustomerProfile(emailValidation.email, nameValidation.name, phoneValidation.phone),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await customersCollection.insertOne(newCustomer)

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully.',
        customer: {
          id: newCustomer.id,
          email: newCustomer.email,
          profile: newCustomer.profile,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Signup failed.',
      },
      { status: 500 },
    )
  }
}
