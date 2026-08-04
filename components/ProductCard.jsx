'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useBakeryStore } from '../context/StoreContext'
import { FaCartPlus, FaMinus, FaPlus } from 'react-icons/fa6'

const FALLBACK_PRODUCT_IMAGE = '/meena-b/meena-b-delights-logo.jpeg'

export default function ProductCard({ product }) {
  const { addToCart, cart, removeFromCart } = useBakeryStore()
  const qty = cart[product.id] || 0
  const [imageSrc, setImageSrc] = useState(product.image || FALLBACK_PRODUCT_IMAGE)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    setImageSrc(product.image || FALLBACK_PRODUCT_IMAGE)
  }, [product.image])

  useEffect(() => {
    if (!isPreviewOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsPreviewOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isPreviewOpen])

  const previewModal = isPreviewOpen
    ? createPortal(
        <div className="product-preview-backdrop" onClick={() => setIsPreviewOpen(false)}>
          <div className="product-preview-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="product-preview-close"
              onClick={() => setIsPreviewOpen(false)}
              aria-label="Close image preview"
            >
              ×
            </button>
            <img src={imageSrc} alt={product.name} className="product-preview-image" />
            <div className="product-preview-content">
              <p className="product-preview-category">{product.category}</p>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <strong>Rs {product.price}</strong>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null

  return (
    <>
      <article className="product-card">
        <button
          type="button"
          className="product-image-button"
          onClick={() => setIsPreviewOpen(true)}
          aria-label={`View larger image for ${product.name}`}
        >
          <img
            src={imageSrc}
            alt={product.name}
            className="product-image"
            loading="lazy"
            onError={() => setImageSrc(FALLBACK_PRODUCT_IMAGE)}
          />
        </button>
        <div className="product-body">
          <p className="product-category">{product.category}</p>
          <button
            type="button"
            className="product-details-button"
            onClick={() => setIsPreviewOpen(true)}
            aria-label={`View full details for ${product.name}`}
          >
            <span className="product-title">{product.name}</span>
            <span className="product-desc">{product.description}</span>
          </button>

          <div className="product-buy-row">
            <div className="product-meta">
              <strong className="icon-text-inline">Rs {product.price}</strong>
            </div>

            {qty === 0 ? (
              <button className="btn btn-primary product-cart-button" onClick={() => addToCart(product.id)}>
                <FaCartPlus />
                Add To Cart
              </button>
            ) : (
              <div className="qty-control">
                <button aria-label="decrease" onClick={() => removeFromCart(product.id)}>
                  <FaMinus />
                </button>
                <span>{qty}</span>
                <button aria-label="increase" onClick={() => addToCart(product.id)}>
                  <FaPlus />
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
      {previewModal}
    </>
  )
}
