'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBakeryStore } from '../../context/StoreContext'
import { FaCartShopping, FaMinus, FaPlus, FaReceipt, FaTruckFast } from 'react-icons/fa6'

const FALLBACK_PRODUCT_IMAGE = '/meena-b/meena-b-delights-logo.jpeg'

export default function CartPage() {
  const router = useRouter()
  const { cartItems, cart, setCartQuantity, removeFromCart, addToCart, cartSubtotal, deliveryFee, total } =
    useBakeryStore()

  const proceedToCheckout = () => {
    router.push('/checkout')
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="icon-text">
          <FaCartShopping />
          Your Cart
        </h1>
        <p>Review your sweets before checkout.</p>
      </div>

      {!cartItems.length ? (
        <section className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add your favorite sweets to continue.</p>
          <Link href="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-item">
                <img
                  src={item.image || FALLBACK_PRODUCT_IMAGE}
                  alt={item.name}
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_PRODUCT_IMAGE
                  }}
                />
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                  <strong className="icon-text-inline">
                    <FaReceipt />Rs {item.price}
                  </strong>
                </div>
                <div className="qty-control">
                  <button onClick={() => removeFromCart(item.id)}>
                    <FaMinus />
                  </button>
                  <span>{cart[item.id]}</span>
                  <button onClick={() => addToCart(item.id)}>
                    <FaPlus />
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={cart[item.id]}
                  onChange={(event) => setCartQuantity(item.id, Number(event.target.value))}
                />
              </article>
            ))}
          </div>

          <aside className="order-summary">
            <h3>Order Summary</h3>
            <div>
              <span>Subtotal</span>
              <strong>Rs {cartSubtotal.toFixed(2)}</strong>
            </div>
            <div>
              <span className="icon-text-inline">
                <FaTruckFast />
                Delivery
              </span>
              <strong>{deliveryFee > 0 ? `Rs ${deliveryFee.toFixed(2)}` : 'Free'}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong>Rs {total.toFixed(2)}</strong>
            </div>

            <button className="btn btn-primary" onClick={proceedToCheckout}>
              Proceed To Checkout
            </button>
          </aside>
        </section>
      )}
    </div>
  )
}
