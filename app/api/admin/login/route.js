import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { username = '', password = '' } = await request.json()

    const enteredUsername = String(username).trim()
    const enteredPassword = String(password).trim()

    const configuredUsername = String(process.env.ADMIN_USERNAME || '').trim()
    const configuredPassword = String(process.env.ADMIN_PASSWORD || '').trim()

    if (!configuredUsername || !configuredPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin credentials are not configured on the server.',
        },
        { status: 500 },
      )
    }

    if (enteredUsername !== configuredUsername || enteredPassword !== configuredPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid username or password',
        },
        { status: 401 },
      )
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set({
      name: 'admin_session',
      value: '1',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid login request',
      },
      { status: 400 },
    )
  }
}
