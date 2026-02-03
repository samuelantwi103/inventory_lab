# StockWise - Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Initial setup
cd backend
pnpm install
pnpm seed

# Start server
pnpm dev

# Access points
http://localhost:5000          # API root
http://localhost:5000/api-docs # Swagger UI
```

---

## 🔐 Test Credentials

```
Admin User:
  Email: admin@stockwise.com
  Password: admin123

Regular User:
  Email: john@example.com
  Password: password123
```

---

## 📡 Common API Calls

### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@stockwise.com",
  "password": "admin123"
}
```

### Get All Items
```http
GET http://localhost:5000/api/inventory?page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

### Create Item
```http
POST http://localhost:5000/api/inventory
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "category": "Electronics",
  "quantity": 100,
  "price": 99.99,
  "lowStockThreshold": 10
}
```

### Update Quantity
```http
PATCH http://localhost:5000/api/inventory/ITEM_ID/quantity
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "quantity": 75
}
```

### Search Items
```http
GET http://localhost:5000/api/inventory?search=laptop
Authorization: Bearer YOUR_TOKEN_HERE
```

### Low Stock Alert
```http
GET http://localhost:5000/api/inventory/lowstock/items
Authorization: Bearer YOUR_TOKEN_HERE
```

### Dashboard Stats
```http
GET http://localhost:5000/api/inventory/stats/summary
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📋 Valid Categories

- Electronics
- Furniture
- Clothing
- Food
- Books
- Toys
- Sports
- Other

---

## 🎨 Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "pagination": { ... }  // if applicable
}
```

### Error
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]  // for validation errors
}
```

---

## 🔍 Search & Filter Examples

```bash
# Search by name/SKU/description
GET /api/inventory?search=laptop

# Filter by category
GET /api/inventory?category=Electronics

# Pagination
GET /api/inventory?page=2&limit=20

# Sort (prefix with - for descending)
GET /api/inventory?sort=-price

# Combine filters
GET /api/inventory?category=Electronics&search=apple&page=1&limit=10
```

---

## 🛠️ Troubleshooting

### Server won't start
```bash
# Check if port is available
netstat -ano | findstr :5000

# Change port in .env if needed
PORT=5001
```

### MongoDB connection error
```bash
# Start MongoDB
mongod

# Or as service
net start MongoDB

# Check .env connection string
MONGODB_URI=mongodb://localhost:27017/stockwise
```

### Token expired/invalid
- Login again to get new token
- Check JWT_SECRET in .env
- Verify token format: Bearer <token>

### Validation errors
- Check required fields: name, category, quantity, price
- Ensure quantity >= 0
- Ensure price >= 0
- Use valid category name

---

## 📂 Project Structure (Simplified)

```
backend/src/
├── server.js          → Entry point
├── routes/            → API endpoints
├── controllers/       → Request handlers
├── services/          → Business logic
├── repositories/      → Database queries
├── models/            → Data schemas
├── middleware/        → Auth, validation, errors
├── validators/        → Input validation rules
├── utils/             → Helpers, constants, seeder
└── config/            → Database, Swagger setup
```

---

## 🎯 SOLID Principles in Action

**S** - Single Responsibility
→ Each file has ONE job (controller/service/repository)

**O** - Open/Closed
→ BaseRepository extends without modification

**L** - Liskov Substitution
→ All repositories work interchangeably

**I** - Interface Segregation
→ Focused validators per route

**D** - Dependency Inversion
→ Services use repositories, not direct DB

---

## 💡 Frontend Integration Hints

```javascript
// Axios setup
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', res.data.data.token);
  return res.data;
};

// Get inventory
const getInventory = async (params) => {
  const res = await api.get('/inventory', { params });
  return res.data;
};

// Create item
const createItem = async (itemData) => {
  const res = await api.post('/inventory', itemData);
  return res.data;
};
```

---

## 📞 Support

- **Swagger Docs**: http://localhost:5000/api-docs
- **Detailed API Guide**: See `API_DOCUMENTATION.md`
- **Setup Instructions**: See `SETUP_GUIDE.md`
- **Architecture Details**: See `ARCHITECTURE_REPORT.md`

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
