'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBakeryStore } from '../../../context/StoreContext'
import { FaShieldHalved, FaUser, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa6'

export default function AdminLoginPage() {
  const router = useRouter()
  const { loginAdmin } = useBakeryStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        loginAdmin()
        router.replace('/admin')
        router.refresh()
      } else {
        const data = await response.json().catch(() => ({}))
        setError(data.message || 'Invalid username or password')
        setPassword('')
      }
    } catch {
      setError('Unable to login right now. Please try again.')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="icon-text">
          <FaShieldHalved />
          Admin Login
        </h1>
        <p>Access the admin dashboard.</p>
      </div>

      <section className="account-layout">
        <form onSubmit={handleLogin} className="form-card">
          <label htmlFor="username">
            <span className="icon-text-inline">
              <FaUser />
              Username
            </span>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          <label htmlFor="password">
            <span className="icon-text-inline">
              <FaKey />
              Password
            </span>
            <div className="password-field-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          {error ? <p className="status-missing">{error}</p> : null}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </section>
    </div>
  )
}
