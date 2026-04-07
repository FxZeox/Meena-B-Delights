'use client'

import { useMemo, useState } from 'react'
import { useBakeryStore } from '../../context/StoreContext'
import { FaBoxOpen, FaLocationDot, FaMagnifyingGlass, FaTruckFast } from 'react-icons/fa6'

export default function TrackOrderPage() {
  const { orders } = useBakeryStore()
  const [query, setQuery] = useState('')

  const visibleOrders = useMemo(() => {
    if (!orders.length) {
      return []
    }
    if (!query.trim()) {
      return orders
    }
    return orders.filter((order) => order.id.toLowerCase() === query.trim().toLowerCase())
  }, [orders, query])

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="icon-text">
          <FaTruckFast />
          Track Order
        </h1>
        <p>View all your orders and follow each bakery stage in real-time.</p>
      </div>

      <section className="form-card">
        <label>
          <span className="icon-text-inline">
            <FaMagnifyingGlass />
            Order ID
          </span>
          <div className="search-field">
            <FaMagnifyingGlass className="input-icon" />
            <input
              type="text"
              placeholder="Example: MB-1234567"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </label>
      </section>

      {!visibleOrders.length ? (
        <section className="empty-state">
          <h3>No order found</h3>
          <p>Place an order from cart and checkout to see tracking updates here.</p>
        </section>
      ) : (
        <>
          {visibleOrders.map((order) => (
            <section key={order.id} className="tracking-card">
              <div className="tracking-top">
                <h2>{order.id}</h2>
                <span>{order.status}</span>
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
                <FaLocationDot />
                Delivery Address: <strong>{order.address}</strong>
              </p>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
