import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CacheProvider } from './context/CacheContext'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import './App.css'

function App() {
  return (
    <CacheProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <nav className="navbar">
              <div className="nav-container">
                <Link to="/" className="nav-logo">Coffe shop</Link>
                <div className="nav-links">
                  <Link to="/" className="nav-link">Home</Link>
                  <Link to="/cart" className="nav-link">Cart</Link>
                  <Link to="/orders" className="nav-link">Orders</Link>
                </div>
              </div>
            </nav>
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </CacheProvider>
  )
}

export default App
