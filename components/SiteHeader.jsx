'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useBakeryStore } from '../context/StoreContext'
import { FaCartShopping, FaMagnifyingGlass, FaUser } from 'react-icons/fa6'

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Menu', hideOnMobile: true },
  { href: '/about', label: 'About' },
  { href: '/track-order', label: 'Orders', hideOnMobile: true },
  { href: '/account', label: 'Account' },
  { href: '/admin', label: 'Admin' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { cart } = useBakeryStore()

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  const handleSearchClick = () => {
    router.push('/products?focus=search')
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand">
          <img src="/meena-b/logo-cropped.png" alt="Meena B Delights logo" className="brand-logo" />
        </Link>

        <nav className="main-nav">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${active ? 'nav-link nav-link-active' : 'nav-link'} ${link.hideOnMobile ? 'hide-mobile-link' : ''}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="header-actions">
          <button className="icon-action" aria-label="search" onClick={handleSearchClick}>
            <FaMagnifyingGlass />
          </button>
          <Link href="/account" className="icon-action" aria-label="account">
            <FaUser />
          </Link>
          <Link href="/cart" className="icon-action" aria-label="cart">
            <FaCartShopping />
            {cartCount > 0 ? <span className="tiny-pill">{cartCount}</span> : null}
          </Link>
        </div>
      </div>
    </header>
  )
}
