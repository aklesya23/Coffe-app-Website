// Run this once to seed the database:  npm run seed
import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './db.js'
import { Product } from '../models/Product.js'

const products = [
  {
    name: 'Ethiopian Yirgacheffe',
    price: 18.99,
    origin: 'Ethiopia',
    description: 'Bright citrus notes with a floral aroma. The birthplace of coffee.',
    category: 'Coffee',
    roast: 'Light Roast',
    stock: 15,
    rating: 4.8,
    reviews: 124,
    image: '/images/coffee1.jpg',
  },
  {
    name: 'Colombian Supremo',
    price: 16.99,
    origin: 'Colombia',
    description: 'Rich and balanced with caramel sweetness and a smooth finish.',
    category: 'Coffee',
    roast: 'Medium Roast',
    stock: 8,
    rating: 4.6,
    reviews: 89,
    image: '/images/coffee2.jpg',
  },
  {
    name: 'Brazilian Santos',
    price: 15.99,
    origin: 'Brazil',
    description: 'Smooth and chocolatey with low acidity. Perfect for espresso.',
    category: 'Coffee',
    roast: 'Medium Roast',
    stock: 12,
    rating: 4.4,
    reviews: 67,
    image: '/images/coffee3.jpg',
  },
  {
    name: 'Sumatra Mandheling',
    price: 19.99,
    origin: 'Indonesia',
    description: 'Full-bodied with herbal notes and low acidity. An earthy classic.',
    category: 'Coffee',
    roast: 'Dark Roast',
    stock: 6,
    rating: 4.7,
    reviews: 102,
    image: '/images/coffee4.jpg',
  },
  {
    name: 'Kenya AA',
    price: 21.99,
    origin: 'Kenya',
    description: 'Bright and fruity with a wine-like acidity and berry undertones.',
    category: 'Coffee',
    roast: 'Light Roast',
    stock: 10,
    rating: 4.9,
    reviews: 58,
    image: '/images/coffee1.jpg',
  },
  {
    name: 'Guatemala Antigua',
    price: 17.49,
    origin: 'Guatemala',
    description: 'Rich with smoky notes and a hint of chocolate. Volcanic soil origin.',
    category: 'Coffee',
    roast: 'Medium-Dark Roast',
    stock: 9,
    rating: 4.5,
    reviews: 74,
    image: '/images/coffee2.jpg',
  },
  {
    name: 'Costa Rica Tarrazu',
    price: 20.49,
    origin: 'Costa Rica',
    description: 'Bright acidity with honey sweetness and clean finish.',
    category: 'Coffee',
    roast: 'Medium Roast',
    stock: 7,
    rating: 4.6,
    reviews: 43,
    image: '/images/coffee3.jpg',
  },
  {
    name: 'Coffee Mug - Ceramic',
    price: 12.99,
    origin: 'USA',
    description: 'Double-walled ceramic mug that keeps your coffee warm for hours.',
    category: 'Accessories',
    stock: 20,
    rating: 4.5,
    reviews: 45,
    image: '/images/coffee-mug.jpg',
  },
  {
    name: 'Barista Backpack',
    price: 49.99,
    origin: 'USA',
    description: 'Padded laptop compartment and insulated coffee sleeve pocket.',
    category: 'Accessories',
    stock: 5,
    rating: 4.3,
    reviews: 28,
    image: '/images/backpack.jpg',
  },
  {
    name: 'Coffee Grinder - Manual',
    price: 34.99,
    origin: 'Germany',
    description: 'Stainless steel burr grinder with adjustable grind settings.',
    category: 'Accessories',
    stock: 8,
    rating: 4.7,
    reviews: 62,
    image: '/images/coffee-mug.jpg',
  },
]

async function seed() {
  await connectDB()
  await Product.deleteMany({})
  const inserted = await Product.insertMany(products)
  console.log(`✅ Seeded ${inserted.length} products`)
  await mongoose.disconnect()
  console.log('🔌 Disconnected from MongoDB')
}

seed()