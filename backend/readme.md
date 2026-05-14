# Coffee Shop — Frontend ↔ Backend Integration Guide

## 1. Start the backend

```bash
# In the coffee-backend folder:
npm install
npm run dev   # runs on http://localhost:3001
```

---

## 2. Add api.js to the frontend

Copy `src/services/api.js` into `coffe-app/src/services/api.js`.

---

## 3. Update Checkout.jsx — replace localStorage with real API

**Before (current code):**
```js
// Checkout.jsx handleSubmit
const orders = JSON.parse(localStorage.getItem('orders')) || []
orders.unshift({ id: Date.now(), date: ..., customer: form, items: cart, total })
localStorage.setItem('orders', JSON.stringify(orders))
clearCart()
setOrderComplete(true)
```

**After (with backend):**
```js
import { ordersAPI } from '../services/api'

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return
  setSubmitting(true)
  try {
    // Send order to the backend
    await ordersAPI.place({
      customer: form,
      items: cart.map(item => ({ id: item.id, qty: item.qty })),
    })
    clearCart()
    setOrderComplete(true)
  } catch (err) {
    // Show the error from the server (e.g. "Not enough stock")
    setErrors({ submit: err.message })
  } finally {
    setSubmitting(false)
  }
}
```

---

## 4. Update Orders.jsx — replace localStorage with API

**Before:**
```js
useEffect(() => {
  const savedOrders = localStorage.getItem('orders')
  if (savedOrders) setOrders(JSON.parse(savedOrders))
}, [])
```

**After:**
```js
import { ordersAPI } from '../services/api'

useEffect(() => {
  ordersAPI.getAll()
    .then(setOrders)
    .catch(err => console.error('Failed to load orders:', err))
}, [])
```

---

## 5. Update Home.jsx — fetch products from API

**Before:**
```js
import { products as localProducts, categories } from '../data/products'
// ...
setProducts(localProducts)
```

**After:**
```js
import { productsAPI } from '../services/api'

const loadProducts = async () => {
  setLoading(true)
  const cached = getCachedProducts()
  if (cached) { setProducts(cached); setLoading(false); return }
  
  const { products, categories: cats } = await productsAPI.getAll()
  setProducts(products)
  setCategories(cats)          // add useState for categories
  setCachedProducts(products)
  setLoading(false)
}
```

Also pass `category` and `search` directly to the API instead of filtering client-side:
```js
const { products } = await productsAPI.getAll({ category: selectedCategory, search: searchTerm })
```

---

## 6. Update SearchBar — add live suggestions

```js
import { searchAPI } from '../services/api'
import { useState } from 'react'

export default function SearchBar({ searchTerm, onSearch }) {
  const [suggestions, setSuggestions] = useState([])

  const handleChange = async (e) => {
    const val = e.target.value
    onSearch(val)
    if (val.length >= 2) {
      const results = await searchAPI.getSuggestions(val)
      setSuggestions(results)
    } else {
      setSuggestions([])
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <input value={searchTerm} onChange={handleChange} placeholder="Search..." />
      {suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map(s => (
            <li key={s.id} onClick={() => { onSearch(s.name); setSuggestions([]) }}>
              {s.name} — ${s.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

## 7. ProductDetails.jsx — fetch from API

**Before:**
```js
const product = products.find(p => p.id === parseInt(id))
```

**After:**
```js
import { productsAPI } from '../services/api'

const [product, setProduct] = useState(null)
useEffect(() => {
  productsAPI.getById(id)
    .then(setProduct)
    .catch(() => setProduct(null))
}, [id])
```

---

## API Reference

| Method | URL | What it does |
|--------|-----|--------------|
| GET | `/api/products` | Get all products (supports `?category=&search=&sort=`) |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/search/suggestions?q=` | Live search suggestions |
| GET | `/api/search/recent/:userId` | Get recent searches |
| POST | `/api/search/recent/:userId` | Save a recent search |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Create account |
| GET | `/api/auth/me` | Get current user |

---

## Upgrade path (after school project)

| Current | Production upgrade |
|---|---|
| In-memory arrays | PostgreSQL / MongoDB |
| Plaintext passwords | `bcrypt` password hashing |
| Manual token strings | JWT or express-session |
| No HTTPS | Deploy to Railway / Render with SSL |
| Single server file | Add proper MVC controllers |