'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { bakeryProducts } from '../data/products'

const STORAGE_KEY = 'meena-b-store-v1'
const CANCELLATION_WINDOW_MS = 2 * 60 * 1000

const BakeryStoreContext = createContext(null)

const guestProfile = {
  fullName: 'Guest Customer',
  email: 'guest@meenabdelights.com',
  phone: '+92 300 0000000',
  address: 'Type your address in checkout to save it here.',
}

const defaultAboutContent = {
  eyebrow: 'About Meena B Delights',
  title: 'Crafted with Purity, Served with Heart',
  description:
    'At Meena B Delights, our mission is to craft pure, flavourful creations using premium ingredients, fresh milk, and hygienic preparation-offering hand crafted chocolates, cakes, cookies, and wellness-friendly options like sugar-free treats. Every product is made with care and personalized with your name, turning every box into a story of quality, taste, and heartfelt delight.',
  coreValuesTitle: 'Core Values',
  coreValues: [
    'Premium Quality',
    'Thoughtful Crafting',
    'Signature Taste',
    'Pure Ingredients',
    'Freshness and Hygienic Environment',
    'Commitment to Excellence',
  ],
  advantageTitle: 'Comparative Advantage',
  advantageText:
    'Meena B Delights stands out for its pure ingredients, premium quality, and trusted hygiene-offering fresh, handcrafted creations with signature flavors that not only leave a lasting impression but tell a story in every bite.',
  nicheTitle: 'MB Delights Differentiated Niche Offering',
  nicheItems: [
    {
      title: 'Blended Chocolate Innovation',
      description:
        'Unique combinations of milk, white, and dark chocolate blended with real fruits, dry fruits, and signature cookie bits.',
    },
    {
      title: 'Personalized Gifting Experience',
      description:
        'Custom boxes beautifully tagged with customer names or messages, making every order a thoughtful gift.',
    },
    {
      title: 'Freshly Made, Not Factory Made',
      description:
        'Everything is made-to-order in a hygienic environment ensuring freshness, safety, and signature quality in every bite and sip.',
    },
    {
      title: 'Luxury Meets Storytelling',
      description:
        'Every product whether it is cake, chocolate, or frozen food items is crafted to tell a story, celebrate a moment, or share a memory.',
    },
  ],
  ctaTitle: 'Ready to Taste the Story?',
  ctaText: 'Explore handcrafted favorites made fresh for your celebrations, gifting, and everyday cravings.',
}

const defaultContent = {
  heroTitle: 'Freshly Baked Happiness, Delivered Daily',
  heroSubtitle:
    'From celebration cakes to midnight cookie cravings, order handcrafted sweets in minutes.',
  about: defaultAboutContent,
}

const defaultState = {
  catalog: bakeryProducts,
  cart: {},
  orders: [],
  profile: guestProfile,
  content: defaultContent,
  adminAuth: false,
  customerAuth: false,
  customerUserEmail: '',
  customerUsers: [],
}

const normalizeEmail = (value) => String(value || '').trim().toLowerCase()

const mergeContent = (content = {}) => ({
  ...defaultContent,
  ...content,
  about: {
    ...defaultAboutContent,
    ...(content.about || {}),
    nicheItems:
      Array.isArray(content.about?.nicheItems) && content.about.nicheItems.length
        ? content.about.nicheItems
        : defaultAboutContent.nicheItems,
    coreValues:
      Array.isArray(content.about?.coreValues) && content.about.coreValues.length
        ? content.about.coreValues
        : defaultAboutContent.coreValues,
  },
})

function readInitialState() {
  // Keep initial HTML deterministic for SSR/CSR hydration.
  return defaultState
}

async function parseApiResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return {
      success: false,
      message: data.message || 'Request failed.',
      data,
    }
  }

  return {
    success: true,
    data,
  }
}

export function BakeryStoreProvider({ children }) {
  const [state, setState] = useState(readInitialState)
  const [storageReady, setStorageReady] = useState(false)
  const [catalogLoading, setCatalogLoading] = useState(false)
  const [catalogError, setCatalogError] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      setStorageReady(true)
      return
    }

    try {
      const parsed = JSON.parse(raw)
      setState((prev) => ({
        ...prev,
        ...parsed,
        content: mergeContent(parsed.content),
        adminAuth: false,
      }))
    } catch {
      // Ignore malformed persisted state and continue with defaults.
    } finally {
      setStorageReady(true)
    }
  }, [])

  useEffect(() => {
    if (!storageReady) {
      return
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, storageReady])

  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true)
    setCatalogError('')

    try {
      const response = await fetch('/api/products')
      const result = await parseApiResponse(response)

      if (!result.success) {
        setCatalogError(result.message)
        return { success: false, message: result.message }
      }

      const products = Array.isArray(result.data.products) ? result.data.products : []
      setState((prev) => ({
        ...prev,
        catalog: products,
      }))
      return { success: true }
    } catch {
      setCatalogError('Unable to connect to product service.')
      return { success: false, message: 'Unable to connect to product service.' }
    } finally {
      setCatalogLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCatalog()
  }, [])

  const addToCart = (productId) => {
    setState((prev) => ({
      ...prev,
      cart: {
        ...prev.cart,
        [productId]: (prev.cart[productId] || 0) + 1,
      },
    }))
  }

  const removeFromCart = (productId) => {
    setState((prev) => {
      const nextQty = (prev.cart[productId] || 0) - 1
      const nextCart = { ...prev.cart }

      if (nextQty <= 0) {
        delete nextCart[productId]
      } else {
        nextCart[productId] = nextQty
      }

      return { ...prev, cart: nextCart }
    })
  }

  const setCartQuantity = (productId, quantity) => {
    setState((prev) => {
      const nextCart = { ...prev.cart }
      if (quantity <= 0) {
        delete nextCart[productId]
      } else {
        nextCart[productId] = quantity
      }
      return { ...prev, cart: nextCart }
    })
  }

  const clearCart = () => {
    setState((prev) => ({ ...prev, cart: {} }))
  }

  const updateProfile = async (payload) => {
    try {
      const response = await fetch('/api/customers/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.profile.email,
          phone: payload.phone || state.profile.phone,
          address: payload.address || state.profile.address,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.message || 'Unable to update profile.' }
      }

      setState((prev) => ({
        ...prev,
        profile: {
          fullName: prev.profile.fullName,
          email: data.customer.profile.email,
          phone: data.customer.profile.phone,
          address: data.customer.profile.address,
        },
      }))

      return { success: true, message: data.message || 'Profile updated successfully.' }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Unable to update profile.',
      }
    }
  }

  const signupCustomer = async ({ fullName, email, password, phone }) => {
    try {
      const response = await fetch('/api/customers/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, phone }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.message || 'Signup failed.' }
      }

      if (data.customer) {
        setState((prev) => ({
          ...prev,
          customerAuth: true,
          customerUserEmail: data.customer.email,
          profile: {
            fullName: data.customer.profile.fullName,
            email: data.customer.profile.email,
            phone: data.customer.profile.phone || '',
            address: data.customer.profile.address || '',
          },
        }))
      }

      return { success: true, message: data.message || 'Account created successfully.' }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Unable to create account. Please try again.',
      }
    }
  }

  const signinCustomer = async ({ email, password }) => {
    try {
      const response = await fetch('/api/customers/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.message || 'Login failed.' }
      }

      if (data.customer) {
        setState((prev) => ({
          ...prev,
          customerAuth: true,
          customerUserEmail: data.customer.email,
          profile: {
            fullName: data.customer.profile.fullName,
            email: data.customer.profile.email,
            phone: data.customer.profile.phone || '',
            address: data.customer.profile.address || '',
          },
        }))
      }

      return { success: true, message: data.message || 'Signed in successfully.' }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Unable to login. Please try again.',
      }
    }
  }

  const signoutCustomer = () => {
    setState((prev) => ({
      ...prev,
      customerAuth: false,
      customerUserEmail: '',
      profile: guestProfile,
    }))
  }

  const updateHomeContent = (payload) => {
    setState((prev) => ({
      ...prev,
      content: { ...prev.content, ...payload },
    }))
  }

  const updateAboutContent = (payload) => {
    setState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        about: {
          ...defaultAboutContent,
          ...(prev.content.about || {}),
          ...payload,
        },
      },
    }))
  }

  const placeOrder = ({
    address,
    paymentMethod,
    notes = '',
    deliveryFee = 0,
    customerName,
    customerPhone,
    customerArea,
  }) => {
    const items = state.catalog
      .filter((product) => state.cart[product.id])
      .map((product) => ({
        id: product.id,
        name: product.name,
        quantity: state.cart[product.id],
        unitPrice: product.price,
      }))

    if (!items.length) {
      return null
    }

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const safeDeliveryFee = Number.isFinite(Number(deliveryFee)) ? Math.max(0, Number(deliveryFee)) : 0
    const total = subtotal + safeDeliveryFee
    const orderId = `MB-${Date.now().toString().slice(-7)}`

    const progressValue = 1
    const statusLabels = ['Order Confirmed', 'Baking', 'Packed', 'Out for Delivery']
    const calculatedStatus = progressValue >= 4 ? 'Delivered' : statusLabels[Math.max(0, progressValue - 1)]

    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: calculatedStatus,
      timeline: statusLabels,
      progress: progressValue,
      items,
      total,
      deliveryFee: safeDeliveryFee,
      paymentMethod,
      address,
      notes,
      customerName: String(customerName || state.profile.fullName || 'Guest Customer').trim(),
      customerPhone: String(customerPhone || state.profile.phone || '').trim(),
      customerArea: String(customerArea || '').trim(),
    }

    setState((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      cart: {},
      profile: {
        ...prev.profile,
        fullName: String(customerName || prev.profile.fullName || '').trim(),
        phone: String(customerPhone || prev.profile.phone || '').trim(),
        address,
      },
      catalog: prev.catalog.map((product) => {
        const ordered = prev.cart[product.id] || 0
        return {
          ...product,
          stock: Math.max(0, product.stock - ordered),
        }
      }),
    }))

    return newOrder
  }

  const updateOrderStatus = (orderId, progress) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((order) => {
        if (order.id !== orderId) {
          return order
        }
        const labels = ['Order Confirmed', 'Baking', 'Packed', 'Out for Delivery']
        return {
          ...order,
          progress,
          status: progress >= 4 ? 'Delivered' : labels[Math.max(0, progress - 1)],
        }
      }),
    }))
  }

  const cancelOrder = (orderId) => {
    let actionResult = {
      success: false,
      message: 'Unable to cancel order.',
    }

    setState((prev) => {
      const targetOrder = prev.orders.find((order) => order.id === orderId)
      if (!targetOrder) {
        actionResult = {
          success: false,
          message: 'Order not found.',
        }
        return prev
      }

      if (targetOrder.status === 'Cancelled') {
        actionResult = {
          success: false,
          message: 'Order is already cancelled.',
        }
        return prev
      }

      const createdAt = Date.parse(targetOrder.createdAt)
      const hasValidCreatedAt = Number.isFinite(createdAt)
      const windowExpired = !hasValidCreatedAt || Date.now() - createdAt >= CANCELLATION_WINDOW_MS

      if (targetOrder.progress !== 1 || windowExpired) {
        actionResult = {
          success: false,
          message: 'Cancellation window expired. Order is confirmed.',
        }

        return prev
      }

      const restoredStock = new Map(
        (targetOrder.items || []).map((item) => [item.id, Number(item.quantity || 0)]),
      )

      const nextCatalog = prev.catalog.map((product) => {
        const restoreQty = restoredStock.get(product.id) || 0
        if (!restoreQty) {
          return product
        }

        return {
          ...product,
          stock: Number(product.stock || 0) + restoreQty,
        }
      })

      const nextOrders = prev.orders.map((order) => {
        if (order.id !== orderId) {
          return order
        }

        return {
          ...order,
          status: 'Cancelled',
          progress: 0,
        }
      })

      actionResult = {
        success: true,
        message: 'Order cancelled successfully.',
      }

      return {
        ...prev,
        orders: nextOrders,
        catalog: nextCatalog,
      }
    })

    return actionResult
  }

  const updateProduct = async (productId, payload) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await parseApiResponse(response)
      if (!result.success) {
        return { success: false, message: result.message }
      }

      const updatedProduct = result.data.product
      setState((prev) => ({
        ...prev,
        catalog: prev.catalog.map((product) =>
          product.id === productId ? updatedProduct : product,
        ),
      }))

      return { success: true, product: updatedProduct }
    } catch {
      return { success: false, message: 'Unable to update product.' }
    }
  }

  const addProduct = async (product) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })

      const result = await parseApiResponse(response)
      if (!result.success) {
        return { success: false, message: result.message }
      }

      const createdProduct = result.data.product
      setState((prev) => ({
        ...prev,
        catalog: [createdProduct, ...prev.catalog],
      }))

      return { success: true, product: createdProduct }
    } catch {
      return { success: false, message: 'Unable to create product.' }
    }
  }

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      const result = await parseApiResponse(response)
      if (!result.success) {
        return { success: false, message: result.message }
      }

      setState((prev) => {
        const nextCart = { ...prev.cart }
        delete nextCart[productId]

        return {
          ...prev,
          cart: nextCart,
          catalog: prev.catalog.filter((product) => product.id !== productId),
        }
      })

      return { success: true }
    } catch {
      return { success: false, message: 'Unable to delete product.' }
    }
  }

  const uploadProductImage = async (file) => {
    if (!file) {
      return { success: false, message: 'Please choose an image file.' }
    }

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await parseApiResponse(response)
      if (!result.success) {
        return { success: false, message: result.message }
      }

      return {
        success: true,
        imageUrl: result.data.imageUrl,
        publicId: result.data.publicId,
      }
    } catch {
      return { success: false, message: 'Unable to upload image.' }
    }
  }

  const loginAdmin = () => {
    setState((prev) => ({
      ...prev,
      adminAuth: true,
    }))
  }

  const logoutAdmin = () => {
    setState((prev) => ({
      ...prev,
      adminAuth: false,
    }))
  }

  const cartItems = useMemo(
    () => state.catalog.filter((product) => state.cart[product.id]),
    [state.catalog, state.cart],
  )

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce((sum, product) => sum + product.price * (state.cart[product.id] || 0), 0),
    [cartItems, state.cart],
  )

  const deliveryFee = 0
  const total = cartSubtotal + deliveryFee

  const value = {
    catalog: state.catalog,
    cart: state.cart,
    cartItems,
    cartSubtotal,
    deliveryFee,
    total,
    orders: state.orders,
    profile: state.profile,
    content: state.content,
    catalogLoading,
    catalogError,
    adminAuth: state.adminAuth,
    customerAuth: state.customerAuth,
    addToCart,
    removeFromCart,
    setCartQuantity,
    clearCart,
    placeOrder,
    cancelOrder,
    updateProfile,
    updateOrderStatus,
    updateProduct,
    addProduct,
    deleteProduct,
    uploadProductImage,
    refreshCatalog: loadCatalog,
    updateHomeContent,
    updateAboutContent,
    loginAdmin,
    logoutAdmin,
    signupCustomer,
    signinCustomer,
    signoutCustomer,
  }

  return <BakeryStoreContext.Provider value={value}>{children}</BakeryStoreContext.Provider>
}

export function useBakeryStore() {
  const context = useContext(BakeryStoreContext)
  if (!context) {
    throw new Error('useBakeryStore must be used inside BakeryStoreProvider')
  }
  return context
}
