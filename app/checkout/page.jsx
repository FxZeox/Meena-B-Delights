'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBakeryStore } from '../../context/StoreContext'
import { FaCreditCard, FaLocationDot, FaMoneyCheckDollar, FaNoteSticky, FaTruckFast } from 'react-icons/fa6'

const FAR_ISLAMABAD_AREAS = [
  'bahria',
  'dha',
  'gulberg',
  'soan garden',
  'naval anchorage',
]

const getIslamabadDeliveryFee = (address) => {
  const normalized = String(address || '').toLowerCase()
  const isFarArea = FAR_ISLAMABAD_AREAS.some((area) => normalized.includes(area))
  return isFarArea ? 350 : 250
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, cart, cartSubtotal, placeOrder, profile } = useBakeryStore()

  const [address, setAddress] = useState(profile.address)
  const [paymentMethod] = useState('Cash On Delivery (COD)')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')

  const isIslamabadAddress = useMemo(
    () => String(address || '').toLowerCase().includes('islamabad'),
    [address],
  )

  const deliveryFee = useMemo(() => {
    if (!cartItems.length || !isIslamabadAddress) {
      return 0
    }
    return getIslamabadDeliveryFee(address)
  }, [address, cartItems.length, isIslamabadAddress])

  const checkoutTotal = useMemo(() => cartSubtotal + deliveryFee, [cartSubtotal, deliveryFee])

  const disabled = useMemo(
    () => !cartItems.length || !address.trim() || !isIslamabadAddress,
    [cartItems.length, address, isIslamabadAddress],
  )

  const submitOrder = () => {
    if (!isIslamabadAddress) {
      setMessage('COD is currently available only for Islamabad addresses.')
      return
    }

    const order = placeOrder({ address, paymentMethod, notes, deliveryFee })
    if (!order) {
      setMessage('Add products to your cart before placing an order.')
      return
    }

    setMessage(`Order ${order.id} placed successfully.`)
    setTimeout(() => {
      router.push('/track-order')
    }, 600)
  }

  return (
    <div className="page-container checkout-page">
      <div className="page-header">
        <h1 className="icon-text">
          <FaCreditCard />
          Checkout & Payment
        </h1>
        <p>Secure your order with your preferred payment method.</p>
      </div>

      <section className="checkout-layout">
        <article className="form-card">
          <label>
            <span className="icon-text-inline">
              <FaLocationDot />
              Delivery Address
            </span>
            <textarea value={address} onChange={(event) => setAddress(event.target.value)} rows={4} />
          </label>

          <label>
            <span className="icon-text-inline">
              <FaMoneyCheckDollar />
              Payment Method
            </span>
            <div className="payment-method-lock">
              <div className="cod-logo-badge">
                <span className="cod-logo-icon">
                  <FaTruckFast />
                </span>
                <span>COD</span>
              </div>
              <p>Cash on Delivery is available for Islamabad orders.</p>
            </div>
          </label>

          {!isIslamabadAddress && address.trim() ? (
            <p className="status-missing">COD is only available for Islamabad addresses.</p>
          ) : null}

          {isIslamabadAddress && cartItems.length ? (
            <p className="helper-text">Delivery Fee: Rs {deliveryFee.toFixed(2)}</p>
          ) : null}

          <label>
            <span className="icon-text-inline">
              <FaNoteSticky />
              Order Notes
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="Mention delivery timing or custom instructions"
            />
          </label>

          <button className="btn btn-primary" disabled={disabled} onClick={submitOrder}>
            <FaCreditCard />
            Place Order
          </button>

          {message ? <p className="helper-text">{message}</p> : null}
        </article>

        <aside className="order-summary">
          <h3>Items In Order</h3>
          {cartItems.length ? (
            cartItems.map((item) => (
              <div key={item.id}>
                <span className="icon-text-inline">
                  <FaMoneyCheckDollar />
                  {item.name} x {cart[item.id]}
                </span>
              </div>
            ))
          ) : (
            <p>No items yet.</p>
          )}

          <p>
            Need to adjust quantity? <Link href="/cart">Return to cart</Link>
          </p>
        </aside>
      </section>
    </div>
  )
}
