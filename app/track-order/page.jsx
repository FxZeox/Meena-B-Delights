'use client'

import { useMemo, useState } from 'react'
import { useBakeryStore } from '../../context/StoreContext'
import { FaBoxOpen, FaCalendarDays, FaLocationDot, FaMagnifyingGlass, FaMoneyCheckDollar, FaPhone, FaReceipt, FaTruckFast } from 'react-icons/fa6'

const normalizePhone = (value) => String(value || '').replace(/\D/g, '')

const getPhoneVariants = (value) => {
  const digits = normalizePhone(value)
  const variants = new Set([digits])

  if (digits.startsWith('0092')) {
    variants.add(`0${digits.slice(4)}`)
    variants.add(digits.slice(2))
  }

  if (digits.startsWith('92')) {
    variants.add(`0${digits.slice(2)}`)
  }

  if (digits.startsWith('0')) {
    variants.add(`92${digits.slice(1)}`)
    variants.add(`0092${digits.slice(1)}`)
  }

  return variants
}

const formatOrderDate = (value) =>
  new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

export default function TrackOrderPage() {
  const { orders } = useBakeryStore()
  const [phone, setPhone] = useState('')

  const visibleOrders = useMemo(() => {
    if (!orders.length || !phone.trim()) {
      return []
    }

    const phoneVariants = getPhoneVariants(phone)

    return orders
      .filter((order) => {
        const orderPhoneVariants = getPhoneVariants(order.customerPhone)
        return [...phoneVariants].some((variant) => variant && orderPhoneVariants.has(variant))
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [orders, phone])

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="icon-text">
          <FaTruckFast />
          Track Order
        </h1>
        <p>Enter the phone number used at checkout to view your order history.</p>
      </div>

      <section className="form-card">
        <label>
          <span className="icon-text-inline">
            <FaPhone />
            Phone Number
          </span>
          <div className="search-field">
            <FaMagnifyingGlass className="input-icon" />
            <input
              type="tel"
              placeholder="Example: 03336266499"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
        </label>
      </section>

      {!visibleOrders.length ? (
        <section className="empty-state">
          <h3>{phone.trim() ? 'No order found' : 'Enter your phone number'}</h3>
          <p>
            {phone.trim()
              ? 'No order history was found for this phone number.'
              : 'Use the same phone number you entered while placing your order.'}
          </p>
        </section>
      ) : (
        <>
          {visibleOrders.map((order) => (
            <section key={order.id} className="tracking-card">
              <div className="tracking-top">
                <h2>Order History</h2>
                <span>{order.status}</span>
              </div>

              <p className="icon-text-inline">
                <FaCalendarDays />
                Ordered: <strong>{formatOrderDate(order.createdAt)}</strong>
              </p>

              <div className="tracking-order-items">
                <strong className="icon-text-inline">
                  <FaReceipt />
                  Items Ordered
                </strong>
                <ul>
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.id}`}>
                      <span>{item.name}</span>
                      <strong>
                        x{item.quantity} - Rs {(item.unitPrice * item.quantity).toFixed(2)}
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="timeline-grid">
                {order.timeline.map((step, index) => {
                  const complete = index + 1 <= order.progress
                  return (
                    <div key={`${order.id}-${step}`} className={complete ? 'timeline-step complete-step' : 'timeline-step'}>
                      <strong className="icon-text-inline">
                        <FaBoxOpen />
                        {step}
                      </strong>
                      <p>{complete ? 'Completed' : 'Pending'}</p>
                    </div>
                  )
                })}
              </div>

              <p className="icon-text-inline">
                <FaMoneyCheckDollar />
                Total: <strong>Rs {order.total.toFixed(2)}</strong>
              </p>
              <p className="icon-text-inline">
                <FaTruckFast />
                Delivery: <strong>Free</strong>
              </p>
              <p className="icon-text-inline">
                <FaLocationDot />
                Area/Landmark: <strong>{order.customerArea || 'Area not provided'}</strong>
              </p>
              <p className="icon-text-inline">
                <FaLocationDot />
                Delivery Address: <strong>{order.address}</strong>
              </p>
              <p className="icon-text-inline">
                <FaPhone />
                Phone: <strong>{order.customerPhone || 'Phone not provided'}</strong>
              </p>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
