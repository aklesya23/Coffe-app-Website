import { Router } from 'express'
import { usersDB, sessionsDB, generateId } from '../models/db.js'

export const authRouter = Router()

// POST /api/auth/register
// Creates a new user account
authRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' })
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  const existing = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (existing) {
    return res.status(409).json({ error: 'An account with that email already exists' })
  }

  // In a real app: hash the password with bcrypt before storing
  // const passwordHash = await bcrypt.hash(password, 10)
  const user = {
    id: generateId(),
    name,
    email: email.toLowerCase(),
    password, // ⚠️ Demo only — use bcrypt in production!
    createdAt: new Date().toISOString(),
  }
  usersDB.push(user)

  // Auto-login after registration
  const token = generateId().toString()
  sessionsDB[token] = user.id

  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  })
})

// POST /api/auth/login
// Authenticates a user and returns a session token
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const user = usersDB.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    // Real app: u.email === email && await bcrypt.compare(password, u.passwordHash)
  )

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = generateId().toString()
  sessionsDB[token] = user.id

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  })
})

// POST /api/auth/logout
// Invalidates the session token
authRouter.post('/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) delete sessionsDB[token]
  res.json({ success: true })
})

// GET /api/auth/me
// Returns the current logged-in user (verifies token)
authRouter.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token || !sessionsDB[token]) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  const userId = sessionsDB[token]
  const user = usersDB.find(u => u.id === userId)
  if (!user) return res.status(404).json({ error: 'User not found' })

  res.json({ id: user.id, name: user.name, email: user.email })
})