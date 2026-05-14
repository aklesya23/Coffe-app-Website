# ☕ Coffee Shop — MERN Stack

A full-stack coffee shop web app built with **MongoDB, Express, React, and Node.js**.

---

## Project Structure

```
Coffe-app Website/
├── backend/                  ← Express + MongoDB API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js         ← MongoDB connection
│   │   │   └── seed.js       ← Optional: seed products via code
│   │   ├── models/
│   │   │   ├── Product.js    ← Mongoose Product schema
│   │   │   └── Order.js      ← Mongoose Order schema
│   │   ├── routes/
│   │   │   ├── products.js   ← GET /api/products, GET /api/products/:id
│   │   │   └── orders.js     ← POST /api/orders, GET /api/orders
│   │   └── server.js         ← App entry point
│   ├── .env                  ← Environment variables (never commit this)
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    └── coffe-app/            ← React + Vite frontend
        ├── src/
        │   ├── components/   ← Navbar, ProductCard, SearchBar, etc.
        │   ├── context/      ← CartContext, CacheContext
        │   ├── pages/        ← Home, Cart, Checkout, Orders, ProductDetails
        │   ├── services/
        │   │   └── api.js    ← All fetch calls to the backend
        │   └── App.jsx
        └── package.json
```

---

## Prerequisites

Make sure you have these installed before starting:

- [Node.js](https://nodejs.org) v18 or higher — check with `node -v`
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) — running locally
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) — optional but recommended for viewing data

---

## 1. Set Up MongoDB

### Option A — MongoDB Compass (recommended)

1. Open MongoDB Compass
2. Connect using: `mongodb://localhost:27017`
3. Click **Create Database**
   - Database name: `coffeedb`
   - Collection name: `products`
4. Create a second collection inside `coffeedb` called `orders`
5. Click into `products` → **Add Data** → **Insert Document** and add your products manually

### Option B — npm run seed (inserts 10 products automatically)

```bash
cd backend
npm run seed
```

---

## 2. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

---

## 3. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend/coffe-app
npm install
```

---

## 4. Run the App

You need two terminals open at the same time.

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected: localhost
☕ Coffee Shop API running on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend/coffe-app
npm run dev
```

You should see:
```
VITE ready on http://localhost:5173
```

Open your browser at **http://localhost:5173**

---

## 5. API Endpoints

Base URL: `http://localhost:3001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products?category=Coffee` | Filter by category |
| GET | `/api/products?search=yirg` | Search products |
| GET | `/api/products/:id` | Get one product by ID |
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get one order by ID |
| PATCH | `/api/orders/:id/status` | Update order status |
| GET | `/api/health` | Check if server is running |

### Example — Place an Order

```json
POST /api/orders
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, Addis Ababa"
  },
  "items": [
    { "id": "<mongodb_product_id>", "qty": 2 }
  ]
}
```

---

## 6. How the Frontend Connects to the Backend

All API calls go through `frontend/coffe-app/src/services/api.js`.

```js
// Fetch all products
const { products } = await productsAPI.getAll()

// Fetch one product
const product = await productsAPI.getById(id)

// Place an order
await ordersAPI.place({ customer, items })

// Get order history
const orders = await ordersAPI.getAll()
```

---

## 7. Common Issues

**MongoDB not connecting**
- Make sure MongoDB is running. On Windows open Services and check that MongoDB is started, or run `mongod` in a terminal.

**CORS error in browser**
- Make sure the backend is running on port 3001 and the frontend on port 5173. The backend is configured to allow only `http://localhost:5173`.

**Products not showing**
- Visit `http://localhost:3001/api/products` in your browser. If you see an empty array `[]`, you haven't inserted products yet — go to Compass and add them.

**Port already in use**
- Another process is using port 3001. Either stop it or change `PORT` in your `.env` file.

---

## 8. Tech Stack

| Layer | Technology |
|-------|------------|
| Database | MongoDB |
| ODM | Mongoose |
| Backend | Node.js + Express |
| Frontend | React + Vite |
| Styling | CSS (App.css) |
| Routing | React Router |
| State | React Context API |