// Input validators — return an error string or null if valid

export function validateOrder({ customer, items }) {
  if (!customer) return 'customer is required'
  if (!customer.name?.trim()) return 'customer.name is required'
  if (!customer.email?.trim()) return 'customer.email is required'
  if (!customer.email.includes('@')) return 'customer.email must be a valid email'
  if (!customer.address?.trim()) return 'customer.address is required'

  if (!Array.isArray(items) || items.length === 0) return 'items must be a non-empty array'

  for (const item of items) {
    if (!item.id) return 'each item must have an id'
    if (!item.qty || item.qty < 1) return 'each item must have a qty >= 1'
  }

  return null // no error
}

export function validateCustomer({ name, email, address }) {
  const errors = {}
  if (!name?.trim()) errors.name = 'Name is required'
  if (!email?.trim()) errors.email = 'Email is required'
  else if (!email.includes('@')) errors.email = 'Valid email is required'
  if (!address?.trim()) errors.address = 'Address is required'
  return Object.keys(errors).length ? errors : null
}