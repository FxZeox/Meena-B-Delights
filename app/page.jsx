"use client"

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { bakeryProducts, mainBakeryCategories } from '../data/products'
import { useBakeryStore } from '../context/StoreContext'
import { FaEnvelope, FaPhone } from 'react-icons/fa6'

const FALLBACK_HERO_IMAGE = '/meena-b/meena-b-delights-logo.jpeg'

const hasImage = (value) => typeof value === 'string' && value.trim().length > 0
const getProductTime = (product) => Date.parse(product.updatedAt || product.createdAt || '') || 0

export default function HomePage() {
  const { catalog } = useBakeryStore()
  const [activeSlide, setActiveSlide] = useState(0)

  const heroSlides = useMemo(() => {
    const latestUploads = catalog
      .filter((item) => hasImage(item.image))
      .sort((a, b) => getProductTime(b) - getProductTime(a))
      .slice(0, 6)

    if (latestUploads.length) {
      return latestUploads
    }

    return bakeryProducts.filter((item) => hasImage(item.image)).slice(0, 6)
  }, [catalog])

  useEffect(() => {
    if (heroSlides.length <= 1) {
      setActiveSlide(0)
      return undefined
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [heroSlides.length])

  const featured = catalog.filter((item) => item.featured).slice(0, 6)
  const bestSellers = catalog.filter((item) => item.bestSeller).slice(0, 6)

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-slider" aria-label="Latest product showcase">
          {heroSlides.map((slide, index) => (
            <article
              key={slide.id}
              className={index === activeSlide ? 'hero-slide hero-slide-active' : 'hero-slide'}
              aria-hidden={index !== activeSlide}
            >
              <img
                src={slide.image || FALLBACK_HERO_IMAGE}
                alt={slide.name}
                className="hero-slide-image"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="hero-slide-overlay">
                <h3>{slide.name}</h3>
              </div>
            </article>
          ))}

          <div className="hero-dots" aria-label="Hero image navigation">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={index === activeSlide ? 'hero-dot hero-dot-active' : 'hero-dot'}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show product image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-head">
          <h2>Featured Cakes & Cupcakes</h2>
          <Link href="/products">View All</Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-head">
          <h2>Best-Selling Sweets</h2>
        </div>
        <div className="product-grid">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="content-section categories-wrap">
        <div className="section-head">
          <h2>Shop By Category</h2>
        </div>
        <div className="category-list">
          {mainBakeryCategories
            .filter((category) => category !== 'All')
            .map((category) => (
              <Link key={category} href={`/products?category=${category}`} className="category-chip">
                {category}
              </Link>
            ))}
        </div>
      </section>

      <section className="content-section about-short" id="about">
        <div>
          <h2>Discover Our Story</h2>
          <p>
            Learn about our mission, core values, signature taste philosophy, and what makes Meena B Delights a
            unique handcrafted dessert brand.
          </p>
          <Link href="/about" className="btn btn-primary">
            Read About Us
          </Link>
        </div>
        <div className="contact-card">
          <h3>Contact</h3>
          <p>G11/4 Islamabad</p>
          <p className="icon-text">
            <FaPhone />
            03369364888
          </p>
          <p className="icon-text">
            <FaEnvelope />
            sakeenaiqbal1962@gmail.com
          </p>
        </div>
      </section>
    </div>
  )
}
