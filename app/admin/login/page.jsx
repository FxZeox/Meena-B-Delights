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
        router.push('/admin')
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
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <FaShieldHalved className="login-icon" />
            <h1>Admin Login</h1>
            <p>Access the admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="icon-text-inline">
                <FaUser />
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="icon-text-inline">
                <FaKey />
                Password
              </label>
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
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
