'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ProductCard from '../../components/ProductCard'
import { cakeSubcategories, mainBakeryCategories } from '../../data/products'
import { useBakeryStore } from '../../context/StoreContext'
import { FaMagnifyingGlass, FaUtensils } from 'react-icons/fa6'

export default function ProductsPage() {
  const { catalog, refreshCatalog } = useBakeryStore()

  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const searchInputRef = useRef(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    const initialCategory = url.searchParams.get('category')
    const isFocusSearch = url.searchParams.get('focus') === 'search'
    
    if (initialCategory) {
      setCategory(initialCategory)
    }

    // Auto-focus search field when coming from header search icon
    if (isFocusSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }

    // Refresh products from database to show any newly added items
    refreshCatalog()
  }, [refreshCatalog])

  const filtered = useMemo(
    () =>
      catalog.filter((item) => {
        const categoryMatch =
          category === 'All' ||
          item.category === category ||
          (category === 'Cakes' && (cakeSubcategories.includes(item.category) || item.category === 'Cakes'))
        const queryMatch = item.name.toLowerCase().includes(query.toLowerCase())
        return categoryMatch && queryMatch
      }),
    [catalog, category, query],
  )
  const showCakeSubcategories = category === 'Cakes' || cakeSubcategories.includes(category)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Menu</h1>
        <p>Browse fresh cakes, cupcakes, pastries, donuts, cookies, brownies, and desserts.</p>
      </div>

      <section className="filter-row">
        <div className="search-field">
          <FaMagnifyingGlass className="input-icon" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sweets"
          />
        </div>
        <div className="category-list">
          {mainBakeryCategories.map((item) => (
            <button
              key={item}
              className={item === category ? 'category-chip active-chip' : 'category-chip'}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {showCakeSubcategories ? (
          <div className="category-list category-sub-list" aria-label="Cake subcategories">
            {cakeSubcategories.map((item) => (
              <button
                key={item}
                className={item === category ? 'category-chip active-chip' : 'category-chip'}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="product-grid">
        {filtered.length ? (
          filtered.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="empty-inline icon-text">
            <FaUtensils />
            No sweets found for this search.
          </div>
        )}
      </section>
    </div>
  )
}
