// coffe-app/src/pages/Home.jsx
// REPLACE your current Home.jsx with this.
// Key change: products come from MongoDB via API, not local data/products.js

import { useEffect, useState } from 'react'
import { useCache } from '../context/CacheContext'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import RecentSearches from '../components/RecentSearches'
import { productsAPI } from '../services/api'

export default function Home() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { getCachedProducts, setCachedProducts, filterCache, updateFilterCache, addRecentSearch } = useCache()

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        // Try cache first
        const cached = getCachedProducts()
        if (cached) {
          setProducts(cached)
          setLoading(false)
          return
        }
        // Fetch from MongoDB via API
        const { products: fetched, categories: cats } = await productsAPI.getAll()
        setProducts(fetched)
        setCategories(cats || ['All'])
        setCachedProducts(fetched)
      } catch (err) {
        setError('Failed to load products. Is the backend running?')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Client-side filtering (on top of server data)
  useEffect(() => {
    let result = [...products]
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory)
    }
    setFilteredProducts(result)
  }, [products, searchTerm, selectedCategory])

  // Restore filter state from cache
  useEffect(() => {
    if (filterCache.search) setSearchTerm(filterCache.search)
    if (filterCache.category) setSelectedCategory(filterCache.category)
  }, [])

  const handleSearch = (term) => {
    setSearchTerm(term)
    updateFilterCache('search', term)
    if (term.trim()) addRecentSearch(term)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    updateFilterCache('category', category)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>⚠️ {error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="filters-section">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <RecentSearches onSearchSelect={handleSearch} />
      </div>
      <div className="results-info">
        <p>Showing {filteredProducts.length} of {products.length} products</p>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <p>No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}