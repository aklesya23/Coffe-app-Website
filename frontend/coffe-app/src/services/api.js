// ============================================================
// src/services/api.js  — place this in coffe-app/src/services/
// Connects your React frontend to the Express + MongoDB backend
// ============================================================

const BASE_URL = 'http://localhost:3001/api'

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body && { body: JSON.stringify(body) }),
  }
  const res = await fetch(`${BASE_URL}${path}`, options)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

// ─── PRODUCTS ────────────────────────────────────────────────

export const productsAPI = {
  // GET all (supports ?category=Coffee&search=yirg&sort=price-asc)
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request('GET', `/products${query ? '?' + query : ''}`)
  },
  // GET one by MongoDB _id
  getById: (id) => request('GET', `/products/${id}`),
}

// ─── ORDERS ──────────────────────────────────────────────────

export const ordersAPI = {
  // POST — place order. items = [{ id: mongoId, qty: number }]
  place: (orderData) => request('POST', '/orders', orderData),
  // GET all orders
  getAll: () => request('GET', '/orders'),
  // GET one order
  getById: (id) => request('GET', `/orders/${id}`),
}