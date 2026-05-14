import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  
  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }
  
  const isInStock = product.stock > 0
  
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          {!isInStock && <div className="out-of-stock-overlay">Out of Stock</div>}
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <div className="product-price-row">
            <span className="product-price">${product.price.toFixed(2)}</span>
            <span className={`stock-badge ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
              {isInStock ? product.stockStatus : 'Out of Stock'}
            </span>
          </div>
        </div>
      </Link>
      <button className={`add-to-cart-btn ${!isInStock ? 'disabled' : ''}`} onClick={handleAddToCart} disabled={!isInStock}>
        {added ? 'Added!' : 'Add to Cart'}
      </button>
    </div>
  )
}
