import Link from 'next/link'
import { FaAward, FaCircleCheck, FaGem, FaGift, FaLeaf, FaShieldHeart, FaUtensils, FaWandSparkles } from 'react-icons/fa6'

const coreValues = [
  'Premium Quality',
  'Thoughtful Crafting',
  'Signature Taste',
  'Pure Ingredients',
  'Freshness and Hygienic Environment',
  'Commitment to Excellence',
]

const edgeItems = [
  {
    title: 'Blended Chocolate Innovation',
    description:
      'Unique combinations of milk, white, and dark chocolate blended with real fruits, dry fruits, and signature cookie bits.',
    icon: FaWandSparkles,
  },
  {
    title: 'Personalized Gifting Experience',
    description:
      'Custom boxes beautifully tagged with customer names or messages, making every order a thoughtful gift.',
    icon: FaGift,
  },
  {
    title: 'Freshly Made, Not Factory Made',
    description:
      'Everything is made-to-order in a hygienic environment ensuring freshness, safety, and signature quality in every bite and sip.',
    icon: FaLeaf,
  },
  {
    title: 'Luxury Meets Storytelling',
    description:
      'Every product whether it is cake, chocolate, or frozen food items is crafted to tell a story, celebrate a moment, or share a memory.',
    icon: FaGem,
  },
]

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <p className="eyebrow">About Meena B Delights</p>
        <h1>Crafted with Purity, Served with Heart</h1>
        <p>
          At Meena B Delights, our mission is to craft pure, flavourful creations using premium ingredients, fresh
          milk, and hygienic preparation-offering hand crafted chocolates, cakes, cookies, and wellness-friendly
          options like sugar-free treats. Every product is made with care and personalized with your name, turning
          every box into a story of quality, taste, and heartfelt delight.
        </p>
      </section>

      <section className="content-section about-panel">
        <div className="section-head">
          <h2>Core Values</h2>
        </div>
        <div className="value-grid">
          {coreValues.map((value) => (
            <article key={value} className="value-card">
              <FaCircleCheck aria-hidden="true" />
              <p>{value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section about-panel">
        <div className="section-head">
          <h2>Comparative Advantage</h2>
        </div>
        <p className="highlight-note">
          Meena B Delights stands out for its pure ingredients, premium quality, and trusted hygiene-offering fresh,
          handcrafted creations with signature flavors that not only leave a lasting impression but tell a story in
          every bite.
        </p>
      </section>

      <section className="content-section about-panel">
        <div className="section-head">
          <h2>MB Delights Differentiated Niche Offering</h2>
        </div>
        <div className="edge-grid">
          {edgeItems.map((item) => {
            const Icon = item.icon
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
        <h2>Ready to Taste the Story?</h2>
        <p>Explore handcrafted favorites made fresh for your celebrations, gifting, and everyday cravings.</p>
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