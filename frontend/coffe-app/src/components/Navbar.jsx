import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { itemCount } = useCart()

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Coffe shop</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/orders" className="nav-link">Orders</Link>
          <Link to="/cart" className="nav-link cart-nav-link">
            Cart
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}