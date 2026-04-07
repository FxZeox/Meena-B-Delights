import { v2 as cloudinary } from 'cloudinary'

let isConfigured = false

function ensureCloudinaryConfig() {
  if (isConfigured) {
    return
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables are not fully configured.')
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })

  isConfigured = true
}

export async function uploadImageBuffer(buffer, { folder = 'meena-b/products' } = {}) {
  ensureCloudinaryConfig()

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Image upload failed.'))
          return
        }

        resolve(result)
      },
    )

    uploadStream.end(buffer)
  })
}
