// coffe-app/src/pages/ProductDetails.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { productsAPI } from '../services/api'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await productsAPI.getById(id)
        setProduct(data)
      } catch (err) {
        console.error('Failed to load product:', err)
        setError('Product not found')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      loadProduct()
    }
  }, [id])
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    )
  }
  
  if (error || !product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">Back to Shop</button>
      </div>
    )
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }
  
  const isInStock = product.stock > 0
  
  return (
    <div className="product-details-container">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>
      <div className="product-details-card">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-details-info">
          <h1>{product.name}</h1>
          <div className="product-meta">
            <span className="category-badge">{product.category}</span>
            <span className={`stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
              {isInStock ? `✓ ${product.stock} in stock` : '✗ Out of Stock'}
            </span>
          </div>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          {product.origin && (
            <div className="product-origin">
              <h3>Origin</h3>
              <p>{product.origin}</p>
            </div>
          )}
          {product.roast && (
            <div className="product-roast">
              <h3>Roast Level</h3>
              <p>{product.roast}</p>
            </div>
          )}
          {isInStock && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <input 
                  type="number" 
                  min="1" 
                  max={product.stock} 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))} 
                />
                <span className="stock-info">{product.stock} available</span>
              </div>
              <button onClick={handleAddToCart} className="btn-add-to-cart">Add to Cart</button>
              {addedToCart && <div className="added-message">✓ Added to cart!</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}