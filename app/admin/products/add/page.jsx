'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaBoxOpen, FaCloudArrowUp, FaFloppyDisk } from 'react-icons/fa6'
import { useBakeryStore } from '../../../../context/StoreContext'

const defaultDraft = {
  name: '',
  category: 'Cakes',
  price: '',
  description: '',
}

const createProductId = (name) => {
  const base = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const suffix = Date.now().toString().slice(-5)
  return `${base || 'product'}-${suffix}`
}

export default function AddProductPage() {
  const router = useRouter()
  const { adminAuth, addProduct, uploadProductImage } = useBakeryStore()

  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [draftImageFile, setDraftImageFile] = useState(null)
  const [draftProduct, setDraftProduct] = useState(defaultDraft)

  useEffect(() => {
    if (!adminAuth) {
      router.push('/admin/login')
    }
  }, [adminAuth, router])

  const createProduct = async () => {
    setFormError('')
    setFormSuccess('')

    if (!draftProduct.name.trim()) {
      setFormError('Product name is required.')
      return
    }

    const parsedPrice = Number(String(draftProduct.price || '').trim())
    if (String(draftProduct.price || '').trim() === '' || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError('Please enter a valid price.')
      return
    }

    setIsSaving(true)

    let imagePayload = {
      image: '',
      imagePublicId: '',
    }

    if (draftImageFile) {
      const uploadResult = await uploadProductImage(draftImageFile)
      if (!uploadResult.success) {
        setFormError(uploadResult.message)
        setIsSaving(false)
        return
      }

      imagePayload = {
        image: uploadResult.imageUrl,
        imagePublicId: uploadResult.publicId,
      }
    }

    const createResult = await addProduct({
      ...draftProduct,
      id: createProductId(draftProduct.name),
      name: draftProduct.name.trim(),
      category: draftProduct.category.trim(),
      description: draftProduct.description.trim(),
      price: parsedPrice,
      ...imagePayload,
    })

    if (!createResult.success) {
      setFormError(createResult.message)
      setIsSaving(false)
      return
    }

    setDraftProduct(defaultDraft)
    setDraftImageFile(null)
    setFormSuccess('Product added successfully.')
    setIsSaving(false)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="icon-text">
          <FaBoxOpen />
          Add Product
        </h1>
        <p>Create a new product record and upload product image before publishing.</p>
      </div>

      <section className="admin-panel">
        <div className="admin-products-toolbar">
          <Link href="/admin" className="btn btn-outline">
            <FaArrowLeft />
            Back To Admin
          </Link>
        </div>

        {formError ? <p className="status-missing">{formError}</p> : null}
        {formSuccess ? <p className="status-good">{formSuccess}</p> : null}

        <div className="admin-form-grid admin-product-form-grid">
          <input
            placeholder="Product Name"
            value={draftProduct.name}
            onChange={(event) => setDraftProduct((prev) => ({ ...prev, name: event.target.value }))}
          />
          <input
            placeholder="Category"
            value={draftProduct.category}
            onChange={(event) => setDraftProduct((prev) => ({ ...prev, category: event.target.value }))}
          />
          <input
            type="number"
            className="price-input"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="Price"
            value={draftProduct.price}
            onChange={(event) => setDraftProduct((prev) => ({ ...prev, price: event.target.value }))}
          />
          <label className="admin-upload-label">
            <span className="icon-text-inline">
              <FaCloudArrowUp />
              Product Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setDraftImageFile(event.target.files?.[0] || null)}
            />
          </label>
          <textarea
            rows={4}
            placeholder="Description"
            value={draftProduct.description}
            onChange={(event) => setDraftProduct((prev) => ({ ...prev, description: event.target.value }))}
          />
          <button className="btn btn-primary" onClick={createProduct} disabled={isSaving}>
            <FaFloppyDisk />
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </section>
    </div>
  )
}
