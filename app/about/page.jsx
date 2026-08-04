'use client'

import Link from 'next/link'
import { FaAward, FaCircleCheck, FaGem, FaGift, FaLeaf, FaShieldHeart, FaUtensils, FaWandSparkles } from 'react-icons/fa6'
import { useBakeryStore } from '../../context/StoreContext'

const edgeIcons = [FaWandSparkles, FaGift, FaLeaf, FaGem]

export default function AboutPage() {
  const { content } = useBakeryStore()
  const about = content.about

  return (
    <div className="about-page">
      <section className="about-hero">
        <p className="eyebrow">{about.eyebrow}</p>
        <h1>{about.title}</h1>
        <p>{about.description}</p>
      </section>

      <section className="content-section about-panel">
        <div className="section-head">
          <h2>{about.coreValuesTitle}</h2>
        </div>
        <div className="value-grid">
          {about.coreValues.map((value) => (
            <article key={value} className="value-card">
              <FaCircleCheck aria-hidden="true" />
              <p>{value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section about-panel">
        <div className="section-head">
          <h2>{about.advantageTitle}</h2>
        </div>
        <p className="highlight-note">{about.advantageText}</p>
      </section>

      <section className="content-section about-panel">
        <div className="section-head">
          <h2>{about.nicheTitle}</h2>
        </div>
        <div className="edge-grid">
          {about.nicheItems.map((item, index) => {
            const Icon = edgeIcons[index] || FaGem
            return (
              <article key={item.title} className="edge-card">
                <div className="edge-icon">
                  <Icon aria-hidden="true" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="about-cta">
        <h2>{about.ctaTitle}</h2>
        <p>{about.ctaText}</p>
        <div className="about-cta-actions">
          <Link href="/products" className="btn btn-primary">
            <FaUtensils />
            Browse Products
          </Link>
          <Link href="/checkout" className="btn btn-outline">
            <FaAward />
            Place an Order
          </Link>
          <Link href="/track-order" className="btn btn-outline">
            <FaShieldHeart />
            Track Order
          </Link>
        </div>
      </section>
    </div>
  )
}
