'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBakeryStore } from '../../context/StoreContext'
import { FaCreditCard, FaLocationDot, FaMoneyCheckDollar, FaNoteSticky, FaPhone, FaTruckFast, FaUser } from 'react-icons/fa6'

const isIslamabadDeliveryAddress = (address, area) => {
  const details = `${address} ${area}`.toLowerCase()
  const islamabadSectorPattern = /\b[defghi]-?\s?\d{1,2}(?:\/\d)?\b/i
  return details.includes('islamabad') || islamabadSectorPattern.test(details)
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, cart, cartSubtotal, placeOrder, profile, customerAuth } = useBakeryStore()

  const [customerName, setCustomerName] = useState(customerAuth ? profile.fullName : '')
  const [customerPhone, setCustomerPhone] = useState(customerAuth ? profile.phone : '')
  const [address, setAddress] = useState(profile.address)
  const [customerArea, setCustomerArea] = useState('')
  const [paymentMethod] = useState('Cash On Delivery (COD)')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')

  const isIslamabadAddress = useMemo(
    () => isIslamabadDeliveryAddress(address, customerArea),
    [address, customerArea],
  )

  const deliveryFee = 0
  const checkoutTotal = cartSubtotal

  const disabled = useMemo(
    () =>
      !cartItems.length ||
      !customerName.trim() ||
      !customerPhone.trim() ||
      !customerArea.trim() ||
      !address.trim() ||
      !isIslamabadAddress,
    [cartItems.length, customerName, customerPhone, customerArea, address, isIslamabadAddress],
  )

  const submitOrder = () => {
    if (!customerName.trim() || !customerPhone.trim() || !customerArea.trim() || !address.trim()) {
      setMessage('Please enter your name, phone number, nearby area, and complete delivery address.')
      return
    }

    if (!isIslamabadAddress) {
      setMessage('Orders are currently available only for Islamabad residents.')
      return
    }

    const order = placeOrder({
      address,
      paymentMethod,
      notes,
      deliveryFee,
      customerName,
      customerPhone,
      customerArea,
    })
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
        <p>Free delivery is available for Islamabad residents only.</p>
      </div>

      <section className="checkout-layout">
        <article className="form-card">
          <p className="helper-text">
            You can place an order without creating an account. Register only if you want to save your details.
          </p>

          <label>
            <span className="icon-text-inline">
              <FaUser />
              Customer Name
            </span>
            <input
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Your full name"
            />
          </label>

          <label>
            <span className="icon-text-inline">
              <FaPhone />
              Phone Number
            </span>
            <input
              type="tel"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              placeholder="03336266499"
            />
          </label>

          <label>
            <span className="icon-text-inline">
              <FaLocationDot />
              Nearby Area / Landmark
            </span>
            <input
              type="text"
              value={customerArea}
              onChange={(event) => setCustomerArea(event.target.value)}
              placeholder="Example: G-11/4 Islamabad, near main markaz"
            />
          </label>

          <label>
            <span className="icon-text-inline">
              <FaLocationDot />
              Complete Delivery Address
            </span>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={4}
              placeholder="House number, street, sector, Islamabad"
            />
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
                <span>Free Delivery</span>
              </div>
              <p>Cash on Delivery with free delivery is available only for Islamabad residents.</p>
            </div>
          </label>

          {!isIslamabadAddress && address.trim() ? (
            <p className="status-missing">Orders are only available for Islamabad residents.</p>
          ) : null}

          {cartItems.length ? <p className="helper-text">Delivery Fee: Free</p> : null}

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
            <>
              {cartItems.map((item) => (
                <div key={item.id}>
                  <span className="icon-text-inline">
                    <FaMoneyCheckDollar />
                    {item.name} x {cart[item.id]}
                  </span>
                </div>
              ))}
              <div>
                <span>Delivery</span>
                <strong>Free</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>Rs {checkoutTotal.toFixed(2)}</strong>
              </div>
            </>
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
