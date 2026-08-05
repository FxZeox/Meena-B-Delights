'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { FaArrowLeft, FaBoxOpen, FaCloudArrowUp, FaFloppyDisk } from 'react-icons/fa6'
import { useBakeryStore } from '../../../../../context/StoreContext'
import {
  adminMainCategories,
  cakeCategoryOptions,
  getMainBakeryCategory,
  isCakeCategory,
} from '../../../../../data/products'

export default function EditProductPage() {
  const params = useParams()
  const {
    catalog,
    catalogLoading,
    catalogError,
    updateProduct,
    uploadProductImage,
    refreshCatalog,
  } = useBakeryStore()

  const productId = useMemo(() => decodeURIComponent(String(params?.id || '')), [params?.id])
  const product = useMemo(() => catalog.find((item) => item.id === productId), [catalog, productId])

  const [uploadingImage, setUploadingImage] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [draft, setDraft] = useState(null)
  const selectedMainCategory = getMainBakeryCategory(draft?.category || 'Cakes')

  useEffect(() => {
    if (!draft && product) {
      setDraft({
        name: product.name || '',
        category: product.category || 'Cakes',
        price: String(product.price ?? ''),
        description: product.description || '',
      })
    }
  }, [draft, product])

  const updateMainCategory = (category) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            category: category === 'Cakes' ? 'Fresh Cakes' : category,
          }
        : prev,
    )
  }

  const saveProduct = async () => {
    if (!product || !draft) {
      return
    }

    setFormError('')
    setFormSuccess('')

    if (!draft.name.trim()) {
      setFormError('Product name is required.')
      return
    }

    const parsedPrice = Number(String(draft.price || '').trim())
    if (String(draft.price || '').trim() === '' || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError('Please enter a valid price.')
      return
    }

    setIsSaving(true)

    const result = await updateProduct(product.id, {
      name: draft.name.trim(),
      category: draft.category.trim() || 'Cakes',
      description: draft.description.trim(),
      price: parsedPrice,
    })

    if (!result.success) {
      setFormError(result.message)
      setIsSaving(false)
      return
    }

    setFormSuccess('Product updated successfully.')
    setIsSaving(false)
  }

  const replaceImage = async (file) => {
    if (!file || !product) {
      return
    }

    setUploadingImage(true)
    setFormError('')
    setFormSuccess('')

    const uploadResult = await uploadProductImage(file)
    if (!uploadResult.success) {
      setFormError(uploadResult.message)
      setUploadingImage(false)
      return
    }

    const updateResult = await updateProduct(product.id, {
      image: uploadResult.imageUrl,
      imagePublicId: uploadResult.publicId,
    })

    if (!updateResult.success) {
      setFormError(updateResult.message)
      setUploadingImage(false)
      return
    }

    setFormSuccess('Product image updated successfully.')
    setUploadingImage(false)
  }

  if (catalogLoading && !product) {
    return <div className="page-container"><p>Loading product details...</p></div>
  }

  if (catalogError && !product) {
    return <div className="page-container"><p className="status-missing">{catalogError}</p></div>
  }

  if (!product) {
    return (
      <div className="page-container">
        <section className="admin-panel">
          <h1 className="icon-text">
            <FaBoxOpen />
            Product Not Found
          </h1>
          <p>Could not find this product in the current catalog.</p>
          <div className="admin-products-toolbar">
            <button className="btn btn-outline" onClick={() => refreshCatalog()}>
              Refresh Product List
            </button>
            <Link href="/admin" className="btn btn-outline">
              <FaArrowLeft />
              Back To Admin
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="icon-text">
          <FaBoxOpen />
          Edit Product
        </h1>
        <p>Update product details, pricing, and image for {product.id}.</p>
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

        {draft ? (
          <div className="admin-form-grid admin-product-form-grid">
            <input
              placeholder="Product Name"
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
            />
            <select
              aria-label="Main category"
              value={selectedMainCategory}
              onChange={(event) => updateMainCategory(event.target.value)}
            >
              {adminMainCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {isCakeCategory(draft.category) ? (
              <select
                aria-label="Cake type"
                value={draft.category}
                onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
              >
                {cakeCategoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category === 'Cakes' ? 'Cakes (General)' : category}
                  </option>
                ))}
              </select>
            ) : null}
            <input
              type="number"
              className="price-input"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="Price"
              value={draft.price}
              onChange={(event) => setDraft((prev) => ({ ...prev, price: event.target.value }))}
            />

            <label className="admin-upload-label">
              <span className="icon-text-inline">
                <FaCloudArrowUp />
                Replace Product Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  void replaceImage(file)
                  event.target.value = ''
                }}
              />
              {uploadingImage ? <small>Uploading image...</small> : null}
            </label>

            <textarea
              rows={4}
              placeholder="Description"
              value={draft.description}
              onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
            />

            <button className="btn btn-primary" onClick={saveProduct} disabled={isSaving || uploadingImage}>
              <FaFloppyDisk />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
