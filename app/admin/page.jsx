'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBakeryStore } from '../../context/StoreContext'
import {
  FaBoxOpen,
  FaClipboardList,
  FaLocationDot,
  FaMoneyCheckDollar,
  FaPhone,
  FaShieldHalved,
  FaUser,
  FaArrowRightFromBracket,
  FaPenToSquare,
  FaPlus,
  FaTrash,
} from 'react-icons/fa6'

const tabIcons = {
  products: FaBoxOpen,
  orders: FaClipboardList,
  customers: FaUser,
}

const progressOptions = [
  { label: 'Order Confirmed', value: 1 },
  { label: 'Baking', value: 2 },
  { label: 'Packed', value: 3 },
  { label: 'Out for Delivery', value: 4 },
]

const hasImage = (value) => typeof value === 'string' && value.trim().length > 0

export default function AdminPage() {
  const router = useRouter()
  const {
    catalog,
    catalogLoading,
    catalogError,
    orders,
    profile,
    updateOrderStatus,
    deleteProduct,
    refreshCatalog,
    logoutAdmin,
  } = useBakeryStore()

  const [tab, setTab] = useState('products')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0)
  const [registeredUsersLoading, setRegisteredUsersLoading] = useState(true)
  const [registeredUsersError, setRegisteredUsersError] = useState('')

  const missingImages = useMemo(() => catalog.filter((item) => !hasImage(item.image)), [catalog])
  const adminVisibleOrders = useMemo(
    () => orders.filter((order) => order.status !== 'Cancelled'),
    [orders],
  )

  useEffect(() => {
    let isMounted = true

    const loadRegisteredUsersCount = async () => {
      try {
        setRegisteredUsersLoading(true)
        setRegisteredUsersError('')

        const response = await fetch('/api/customers/count', { cache: 'no-store' })
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.message || 'Unable to fetch registered users count.')
        }

        if (isMounted) {
          setRegisteredUsersCount(Number(data.total || 0))
        }
      } catch (error) {
        if (isMounted) {
          setRegisteredUsersError(error.message || 'Unable to fetch registered users count.')
        }
      } finally {
        if (isMounted) {
          setRegisteredUsersLoading(false)
        }
      }
    }

    if (tab === 'customers') {
      loadRegisteredUsersCount()
    }

    return () => {
      isMounted = false
    }
  }, [tab])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', {
      method: 'POST',
    }).catch(() => null)

    logoutAdmin()
    router.push('/admin/login')
  }

  const handleDeleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(productId)
      if (!result.success) {
        setFormError(result.message)
        return
      }
      setFormSuccess('Product deleted.')
    }
  }

  return (
    <div className="page-container">
      <div className="admin-header-with-logout">
        <div className="page-header">
          <h1 className="icon-text">
            <FaShieldHalved />
            Admin Dashboard
          </h1>
          <p>Manage products, orders, and customers from one panel.</p>
        </div>
        <button className="btn btn-outline logout-btn" onClick={handleLogout}>
          <FaArrowRightFromBracket />
          Logout
        </button>
      </div>

      <section className="admin-tabs admin-main-tabs">
        {['products', 'orders', 'customers'].map((name) => {
          const Icon = tabIcons[name]
          return (
            <button key={name} className={tab === name ? 'active-tab' : ''} onClick={() => setTab(name)}>
              <Icon />
              {name}
            </button>
          )
        })}
      </section>

      {tab === 'products' ? (
        <section className="admin-panel">
          <h3 className="icon-text">
            <FaBoxOpen />
            Product Management
          </h3>
          {catalogLoading ? <p>Loading products from MongoDB Atlas...</p> : null}
          {catalogError ? <p className="status-missing">{catalogError}</p> : null}
          {formError ? <p className="status-missing">{formError}</p> : null}
          {formSuccess ? <p className="status-good">{formSuccess}</p> : null}
          <div className="admin-products-toolbar">
            <button className="btn btn-outline" onClick={() => refreshCatalog()}>
              Refresh Product List
            </button>
            <Link href="/admin/products/add" className="btn btn-primary">
              <FaPlus />
              Add Product
            </Link>
          </div>
          <div className="table-wrap">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Name">{item.name}</td>
                    <td data-label="Price">Rs {Number(item.price || 0).toFixed(2)}</td>
                    <td className="admin-image-cell" data-label="Image">
                      <div className="admin-image-content">
                        {hasImage(item.image) ? (
                          <img className="admin-product-thumb" src={item.image} alt={item.name} />
                        ) : (
                          <div className="admin-product-thumb admin-product-thumb-placeholder">No image</div>
                        )}
                        <span className={hasImage(item.image) ? 'status-good' : 'status-missing'}>
                          {hasImage(item.image) ? 'Available' : 'Needs image'}
                        </span>
                        {hasImage(item.image) ? (
                          <a href={item.image} target="_blank" rel="noreferrer" className="admin-image-link">
                            View full image
                          </a>
                        ) : (
                          <small>Add image from Edit Product.</small>
                        )}
                      </div>
                    </td>
                    <td className="admin-action-cell" data-label="Action">
                      <div className="admin-product-actions">
                        <Link
                          href={`/admin/products/edit/${encodeURIComponent(item.id)}`}
                          className="btn-table-action btn-table-action-edit"
                          title="Edit product"
                        >
                          <FaPenToSquare />
                          Edit
                        </Link>
                        <button
                          className="btn-table-action btn-table-action-delete"
                          onClick={() => handleDeleteProduct(item.id)}
                          title="Delete product"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="helper-text">
            Missing images: {missingImages.length}. Use Edit Product to update image and complete metadata.
          </p>
        </section>
      ) : null}

      {tab === 'orders' ? (
        <section className="admin-panel">
          <h3 className="icon-text">
            <FaClipboardList />
            Order Management
          </h3>
          {!adminVisibleOrders.length ? <p>No active orders yet.</p> : null}
          {adminVisibleOrders.map((order) => (
            <article key={order.id} className="order-admin-card">
              <div>
                <strong>{order.id}</strong>
                <p>{order.customerName}</p>
                <p>
                  Cakes:{' '}
                  {Array.isArray(order.items) && order.items.length
                    ? order.items
                        .map((item) => `${item.name || 'Cake'} x${Number(item.quantity || 0)}`)
                        .join(', ')
                    : 'No items found'}
                </p>
                <p className="icon-text-inline">
                  <FaPhone />
                  {order.customerPhone || 'Phone not provided'}
                </p>
                <p className="icon-text-inline">
                  <FaLocationDot />
                  {order.address || 'Address not provided'}
                </p>
                <p className="icon-text-inline">
                  <FaMoneyCheckDollar />
                  Rs {order.total.toFixed(2)}
                </p>
              </div>
              <select
                value={order.progress}
                onChange={(event) => updateOrderStatus(order.id, Number(event.target.value))}
              >
                {progressOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </article>
          ))}
        </section>
      ) : null}

      {tab === 'customers' ? (
        <section className="admin-panel">
          <h3 className="icon-text">
            <FaUser />
            Customer Management
          </h3>
          {registeredUsersLoading ? <p>Loading registered users count...</p> : null}
          {registeredUsersError ? <p className="status-missing">{registeredUsersError}</p> : null}
          {!registeredUsersLoading && !registeredUsersError ? (
            <p className="customer-count">Registered users: {registeredUsersCount}</p>
          ) : null}
          <ul className="customer-profile-list">
            <li>Name: {profile.fullName}</li>
            <li>Email: {profile.email}</li>
            <li>Phone: {profile.phone}</li>
            <li>Address: {profile.address}</li>
          </ul>
        </section>
      ) : null}
    </div>
  )
}
