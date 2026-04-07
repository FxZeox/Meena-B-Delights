"use client"

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { bakeryCategories, bakeryProducts } from '../data/products'
import { useBakeryStore } from '../context/StoreContext'
import { FaEnvelope, FaPhone } from 'react-icons/fa6'

const FALLBACK_HERO_IMAGE = '/meena-b/logo.png'

const hasImage = (value) => typeof value === 'string' && value.trim().length > 0

export default function HomePage() {
  const { catalog } = useBakeryStore()
  const [activeSlide, setActiveSlide] = useState(0)

  const heroSlides = useMemo(() => {
    const latestUploads = catalog.filter((item) => hasImage(item.image)).slice(0, 5)

    if (latestUploads.length) {
      return latestUploads
    }

    return bakeryProducts.filter((item) => hasImage(item.image)).slice(0, 5)
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
  const heroTitle = 'Freshly Baked Happiness, Delivered Daily'
  const heroSubtitle = 'From celebration cakes to midnight cookie cravings, order handcrafted sweets in minutes.'
  const heroSlogan = 'Where Taste is legacy and Quality is law'

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Freshly Baked Every Morning</p>
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
          <p className="hero-slogan">{heroSlogan}</p>
        </div>
        <div className="hero-media hero-slider" aria-label="Latest product showcase">
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
          {bakeryCategories
            .filter((cat) => cat !== 'All')
            .map((category) => (
              <Link key={category} href={`/products?category=${category}`} className="category-chip">
                {category}
              </Link>
            ))}
        </div>
      </section>

      <section className="content-section about-short" id="about">
        <div>
          <h2>About Our Bakery</h2>
          <p>
            Meena B started as a tiny neighborhood kitchen and has grown into a full dessert studio. We bake in
            small batches, use high-quality ingredients, and focus on flavor that feels homemade yet premium.
          </p>
        </div>
        <div className="contact-card">
          <h3>Contact</h3>
          <p>G11/4 Islamabad</p>
          <p className="icon-text">
            <FaPhone />
            +92 300 1112233
          </p>
          <p className="icon-text">
            <FaEnvelope />
            hello@meenabdelights.com
          </p>
        </div>
      </section>
    </div>
  )
}
