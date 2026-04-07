import { NextResponse } from 'next/server'
import { uploadImageBuffer } from '../../../lib/cloudinary'

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Image file is required.',
        },
        { status: 400 },
      )
    }

    if (!String(file.type || '').startsWith('image/')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Only image files are allowed.',
        },
        { status: 400 },
      )
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: 'Image size must be 5MB or less.',
        },
        { status: 400 },
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploaded = await uploadImageBuffer(buffer)

    return NextResponse.json({
      success: true,
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Image upload failed.',
      },
      { status: 500 },
    )
  }
}
