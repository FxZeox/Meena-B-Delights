import Link from 'next/link'
import {
  FaAward,
  FaCartShopping,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaTruckFast,
  FaUser,
} from 'react-icons/fa6'

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <section className="footer-grid">
        <div>
          <Link href="/" className="footer-brand">
            <img src="/meena-b/meena-b-delights-logo.jpeg" alt="Meena B Delights logo" />
            <span>
              <strong aria-label="Meena B">
                <span>Meena</span>
                <span>B</span>
              </strong>
              <small>Delights</small>
            </span>
          </Link>
          <p>
            Baking cakes, cupcakes, pastries, donuts, cookies, brownies, and desserts with premium ingredients
            every day.
          </p>
          <p className="icon-text">
            <FaPhone />
            Call: 03336266499
          </p>
          <p className="icon-text">
            <FaEnvelope />
            Email: sakeenaiqbal1962@gmail.com
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link href="/about" className="icon-text">
                <FaAward />
                About Meena B
              </Link>
            </li>
            <li>
              <Link href="/products" className="icon-text">
                <FaCartShopping />
                Browse Sweets
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="icon-text">
                <FaCartShopping />
                Checkout & Payment
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="icon-text">
                <FaTruckFast />
                Track Your Order
              </Link>
            </li>
            <li>
              <Link href="/account" className="icon-text">
                <FaUser />
                Customer Account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Follow Us</h4>
          <ul>
            <li>
              <a href="https://www.instagram.com/meenab_delights/" target="_blank" rel="noreferrer" className="icon-text">
                <FaInstagram />
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/profile.php?id=61592997773976" target="_blank" rel="noreferrer" className="icon-text">
                <FaFacebook />
                Facebook
              </a>
            </li>

          </ul>
        </div>
      </section>
    </footer>
  )
}
