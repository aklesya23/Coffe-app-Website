import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CacheProvider } from './context/CacheContext'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <CacheProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar/>
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
