import { Router } from 'express'
import { cartsDB, productsDB } from '../models/db.js'

export const cartRouter = Router()

// Helper: get or create cart for a session/user
const getCart = (userId) => {
  if (!cartsDB[userId]) cartsDB[userId] = []
  return cartsDB[userId]
}

// GET /api/cart/:userId
// Fetch the server-side cart (syncs with localStorage on login)
cartRouter.get('/:userId', (req, res) => {
  const cart = getCart(req.params.userId)
  res.json(cart)
})

// POST /api/cart/:userId/add
// Add an item to the server-side cart
cartRouter.post('/:userId/add', (req, res) => {
  const { productId, qty = 1 } = req.body
  const cart = getCart(req.params.userId)

  const product = productsDB.find(p => p.id === productId)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  if (product.stock < qty) {
    return res.status(400).json({ error: `Only ${product.stock} in stock` })
  }

  const existing = cart.find(item => item.id === productId)
  if (existing) {
    existing.qty += qty
  } else {
    cart.push({ ...product, qty })
  }

  res.json(cart)
})

// DELETE /api/cart/:userId/remove/:productId
// Remove an item from the cart
cartRouter.delete('/:userId/remove/:productId', (req, res) => {
  const cart = getCart(req.params.userId)
  const idx = cart.findIndex(item => item.id === parseInt(req.params.productId))
  if (idx === -1) return res.status(404).json({ error: 'Item not in cart' })
  cart.splice(idx, 1)
  res.json(cart)
})

// PUT /api/cart/:userId/sync
// Full cart sync (frontend sends its localStorage cart, backend overwrites)
cartRouter.put('/:userId/sync', (req, res) => {
  const { items } = req.body
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items must be an array' })
  cartsDB[req.params.userId] = items
  res.json(items)
})

// DELETE /api/cart/:userId/clear
// Clear the entire cart (called after order is placed)
cartRouter.delete('/:userId/clear', (req, res) => {
  cartsDB[req.params.userId] = []
  res.json({ success: true })
})