// backend/server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import { productsRouter } from './routes/product.js'
import { ordersRouter } from './routes/orders.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' })
})

// Start server
const startServer = async () => {
  await connectDB()
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📝 API endpoint: http://localhost:${PORT}/api/products`)
  })
}

startServer()