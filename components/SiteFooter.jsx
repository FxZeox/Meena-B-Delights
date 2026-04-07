import Link from 'next/link'
import {
  FaCartShopping,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaTruckFast,
  FaUser,
  FaYoutube,
} from 'react-icons/fa6'

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <section className="footer-grid">
        <div>
          <h3>Meena B Delights</h3>
          <p>
            Baking cakes, cupcakes, pastries, donuts, cookies, brownies, and desserts with premium ingredients
            every day.
          </p>
          <p className="icon-text">
            <FaPhone />
            Call: +92 300 1112233
          </p>
          <p className="icon-text">
            <FaEnvelope />
            Email: hello@meenabdelights.com
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
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
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="icon-text">
                <FaInstagram />
                Instagram
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="icon-text">
                <FaFacebook />
                Facebook
              </a>
            </li>
            <li>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="icon-text">
                <FaYoutube />
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </section>
    </footer>
  )
}
