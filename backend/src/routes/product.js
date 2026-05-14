import { Router } from 'express'
import { Product } from '../models/Product.js'

export const productsRouter = Router()

// GET /api/products
// Supports ?category=Coffee&search=yirg&sort=price-asc&minPrice=10&maxPrice=25
productsRouter.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query

    // Build MongoDB query filter
    const filter = {}
    if (category && category !== 'All') filter.category = category
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { origin: { $regex: search, $options: 'i' } },
    ]
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }

    // Build sort
    let sortObj = {}
    if (sort === 'price-asc')  sortObj = { price: 1 }
    if (sort === 'price-desc') sortObj = { price: -1 }
    if (sort === 'rating')     sortObj = { rating: -1 }
    if (sort === 'name')       sortObj = { name: 1 }

    const products = await Product.find(filter).sort(sortObj)
    const allCategories = await Product.distinct('category')

    res.json({
      products,
      total: products.length,
      categories: ['All', ...allCategories],
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/products/:id
productsRouter.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})