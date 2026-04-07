'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useBakeryStore } from '../../context/StoreContext'
import { FaEnvelope, FaLocationDot, FaPhone, FaReceipt, FaUser } from 'react-icons/fa6'

const CANCELLATION_WINDOW_MS = 2 * 60 * 1000

function AccountPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { profile, updateProfile, orders, customerAuth, signupCustomer, signinCustomer, signoutCustomer, cancelOrder } =
    useBakeryStore()

  const [form, setForm] = useState(profile)
  const [authMode, setAuthMode] = useState('signin')
  const [authForm, setAuthForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [message, setMessage] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [orderMessage, setOrderMessage] = useState('')
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const [nowMs, setNowMs] = useState(Date.now())

  useEffect(() => {
    setForm(profile)
  }, [profile])

  useEffect(() => {
    const modeParam = searchParams.get('mode')
    if (modeParam === 'signin' || modeParam === 'signup') {
      setAuthMode(modeParam)
    }
  }, [searchParams])

  useEffect(() => {
    const nextPath = searchParams.get('next')
    if (customerAuth && nextPath) {
      router.push(nextPath)
    }
  }, [customerAuth, router, searchParams])

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatRemaining = (ms) => {
    const safeMs = Math.max(0, ms)
    const minutes = Math.floor(safeMs / 60000)
    const seconds = Math.floor((safeMs % 60000) / 1000)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const getCancelState = (order) => {
    if (order.status === 'Cancelled') {
      return {
        canCancel: false,
        text: 'Order cancelled',
      }
    }

    if (order.progress !== 1) {
      return {
        canCancel: false,
        text: 'Cancellation unavailable after prep starts',
      }
    }

    const createdAt = Date.parse(order.createdAt)
    if (!Number.isFinite(createdAt)) {
      return {
        canCancel: false,
        text: 'Cancellation unavailable',
      }
    }

    const remainingMs = createdAt + CANCELLATION_WINDOW_MS - nowMs
    if (remainingMs <= 0) {
      return {
        canCancel: false,
        text: 'Order confirmed',
      }
    }

    return {
      canCancel: true,
      text: `Cancel in ${formatRemaining(remainingMs)}`,
    }
  }

  const onCancelOrder = (orderId) => {
    const result = cancelOrder(orderId)
    setOrderMessage(result.message)
  }

  const onSave = async () => {
    setMessage('')
    setIsSaveLoading(true)
    const result = await updateProfile(form)
    setMessage(result.message)
    setIsSaveLoading(false)
  }

  const onAuth = async () => {
    setAuthMessage('')
    setIsAuthLoading(true)

    const action =
      authMode === 'signup'
        ? await signupCustomer({
            fullName: authForm.fullName,
            email: authForm.email,
            phone: authForm.phone,
            password: authForm.password,
          })
        : await signinCustomer({
            email: authForm.email,
            password: authForm.password,
          })

    setAuthMessage(action.message)

    if (action.success) {
      setAuthForm({
        fullName: '',
        email: '',
        phone: '',
        password: '',
      })

      const nextPath = searchParams.get('next')
      if (nextPath) {
        router.push(nextPath)
      }
    }

    setIsAuthLoading(false)
  }

  const onSignOut = () => {
    signoutCustomer()
    setMessage('')
    setAuthMessage('You have been signed out.')
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="icon-text">
          <FaUser />
          Customer Account
        </h1>
        <p>Manage your profile, delivery details, and review order history.</p>
      </div>

      {!customerAuth ? (
        <section className="account-layout">
          <article className="form-card">
            <div className="admin-tabs">
              <button
                className={authMode === 'signin' ? 'active-tab' : ''}
                onClick={() => setAuthMode('signin')}
              >
                Sign In
              </button>
              <button
                className={authMode === 'signup' ? 'active-tab' : ''}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
              </button>
            </div>

            {authMode === 'signup' ? (
              <>
                <label>
                  <span className="icon-text-inline">
                    <FaUser />
                    Full Name
                  </span>
                  <input
                    value={authForm.fullName}
                    onChange={(event) =>
                      setAuthForm((prev) => ({ ...prev, fullName: event.target.value }))
                    }
                  />
                </label>

                <label>
                  <span className="icon-text-inline">
                    <FaPhone />
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    value={authForm.phone}
                    onChange={(event) =>
                      setAuthForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    placeholder="e.g. +92 300 1234567"
                  />
                </label>
              </>
            ) : null}

            <label>
              <span className="icon-text-inline">
                <FaEnvelope />
                Email
              </span>
              <input
                value={authForm.email}
                onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>

            <label>
              <span className="icon-text-inline">
                <FaPhone />
                Password
              </span>
              <input
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </label>

            <button className="btn btn-primary" onClick={onAuth} disabled={isAuthLoading}>
              {isAuthLoading ? 'Loading...' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
            {authMessage ? <p className="helper-text">{authMessage}</p> : null}
          </article>
        </section>
      ) : (
        <section className="account-layout">
          <article className="form-card">
            <label>
              <span className="icon-text-inline">
                <FaUser />
                Full Name
              </span>
              <input
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              />
            </label>

            <label>
              <span className="icon-text-inline">
                <FaEnvelope />
                Email
              </span>
              <input
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>

            <label>
              <span className="icon-text-inline">
                <FaPhone />
                Phone
              </span>
              <input
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </label>

            <label>
              <span className="icon-text-inline">
                <FaLocationDot />
                Default Address
              </span>
              <textarea
                rows={3}
                value={form.address}
                onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              />
            </label>

            <div className="account-actions">
              <button className="btn btn-primary" onClick={onSave} disabled={isSaveLoading}>
                {isSaveLoading ? 'Saving...' : 'Save Account'}
              </button>
              <button className="btn btn-outline" onClick={onSignOut}>
                Sign Out
              </button>
            </div>

            {message ? <p className="helper-text">{message}</p> : null}
            {authMessage ? <p className="helper-text">{authMessage}</p> : null}
            {orderMessage ? <p className="helper-text">{orderMessage}</p> : null}
          </article>

          <article className="order-history">
            <h3>All Orders</h3>
            {!orders.length ? (
              <p>No orders yet.</p>
            ) : (
              <ul>
                {orders.map((order) => {
                  const cancelState = getCancelState(order)

                  return (
                    <li key={order.id}>
                      <div className="order-history-main">
                        <span className="icon-text-inline">
                          <FaReceipt />
                          {order.id}
                        </span>
                        <span>{order.status}</span>
                        <strong>Rs {order.total.toFixed(2)}</strong>
                      </div>
                      <div className="order-history-actions">
                        {cancelState.canCancel ? (
                          <button className="btn-order-cancel" onClick={() => onCancelOrder(order.id)}>
                            Cancel Order
                          </button>
                        ) : null}
                        <small>{cancelState.text}</small>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </article>
        </section>
      )}
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="page-container"><p>Loading account...</p></div>}>
      <AccountPageContent />
    </Suspense>
  )
}
