// coffe-app/src/pages/Checkout.jsx
// Replace your current Checkout.jsx with this.
// Key change: uses item._id || item.id when sending to backend

import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate, Link } from 'react-router-dom'
import { ordersAPI } from '../services/api'

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  if (cart.length === 0 && !orderComplete) {
    navigate('/cart')
    return null
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!form.email.includes('@')) newErrors.email = 'Valid email is required'
    if (!form.address.trim()) newErrors.address = 'Address is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setSubmitting(true)
    try {
      await ordersAPI.place({
        customer: form,
        // Support both MongoDB _id and legacy id
        items: cart.map(item => ({ id: item._id || item.id, qty: item.qty })),
      })
      clearCart()
      setOrderComplete(true)
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  if (orderComplete) {
    return (
      <div className="order-confirmation">
        <div className="confirmation-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase, {form.name}!</p>
        <p>Your order has been saved to the database.</p>
        <div className="confirmation-actions">
          <Link to="/orders" className="btn-primary">View Order History</Link>
          <Link to="/" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Shipping Information</h3>
          {errors.submit && (
            <div className="error-banner">⚠️ {errors.submit}</div>
          )}
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text" name="name" value={form.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Your full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Delivery Address *</label>
            <textarea
              name="address" value={form.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              placeholder="Your delivery address"
              rows="3"
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.map(item => (
              <div key={item._id || item.id} className="summary-item">
                <span>{item.name} x{item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleSubmit}
            className="btn-place-order"
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}