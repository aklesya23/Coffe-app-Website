import { Router } from 'express'
import { productsDB } from '../models/db.js'

export const searchRouter = Router()

// Shared recent searches store (in real app: per-user in DB)
const recentSearchesStore = {}

// GET /api/search/suggestions?q=colo
// Returns live search suggestions as user types
searchRouter.get('/suggestions', (req, res) => {
  const { q } = req.query
  if (!q || q.trim().length < 2) return res.json([])

  const term = q.toLowerCase()
  const matches = productsDB
    .filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.origin.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    )
    .slice(0, 5)
    .map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price }))

  res.json(matches)
})

// GET /api/search/recent/:userId
// Get recent searches for a user
searchRouter.get('/recent/:userId', (req, res) => {
  const searches = recentSearchesStore[req.params.userId] || []
  res.json(searches)
})

// POST /api/search/recent/:userId
// Save a recent search term
searchRouter.post('/recent/:userId', (req, res) => {
  const { term } = req.body
  if (!term || !term.trim()) return res.status(400).json({ error: 'term is required' })

  if (!recentSearchesStore[req.params.userId]) recentSearchesStore[req.params.userId] = []
  const searches = recentSearchesStore[req.params.userId]

  // Remove duplicates, keep latest at front, max 5
  const filtered = searches.filter(s => s.toLowerCase() !== term.toLowerCase())
  recentSearchesStore[req.params.userId] = [term, ...filtered].slice(0, 5)

  res.json(recentSearchesStore[req.params.userId])
})

// DELETE /api/search/recent/:userId
// Clear all recent searches
searchRouter.delete('/recent/:userId', (req, res) => {
  recentSearchesStore[req.params.userId] = []
  res.json({ success: true })
})