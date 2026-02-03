# StockWise API Documentation for Frontend Integration

## Base URL
```
http://localhost:5000
```

## Interactive Documentation
Once the server is running, visit:
```
http://localhost:5000/api-docs
```

---

## Authentication Flow

### 1. Register New User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-02-02T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### 2. Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### 3. Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 4. Logout
**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {},
  "message": "Logout successful"
}
```

---

## Inventory Operations

**All inventory endpoints require authentication!**

### 1. Get All Items (with pagination, search, filter)
**Endpoint:** `GET /api/inventory`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `search` (optional) - Search by name, SKU, or description
- `category` (optional) - Filter by category
- `sort` (optional, default: -createdAt) - Sort field (prefix with - for descending)

**Example:**
```
GET /api/inventory?page=1&limit=10&category=Electronics&search=laptop
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123...",
      "name": "MacBook Pro",
      "description": "High-performance laptop",
      "category": "Electronics",
      "sku": "ELE-123456-789",
      "quantity": 25,
      "price": 2499.99,
      "lowStockThreshold": 10,
      "stockStatus": "IN_STOCK",
      "createdBy": "65abc...",
      "createdAt": "2026-02-02T...",
      "updatedAt": "2026-02-02T..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### 2. Get Single Item
**Endpoint:** `GET /api/inventory/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "name": "MacBook Pro",
    "description": "High-performance laptop",
    "category": "Electronics",
    "sku": "ELE-123456-789",
    "quantity": 25,
    "price": 2499.99,
    "lowStockThreshold": 10,
    "stockStatus": "IN_STOCK",
    "createdBy": {
      "_id": "65abc...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-02-02T...",
    "updatedAt": "2026-02-02T..."
  }
}
```

### 3. Create Item
**Endpoint:** `POST /api/inventory`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "MacBook Pro",
  "description": "High-performance laptop",
  "category": "Electronics",
  "quantity": 25,
  "price": 2499.99,
  "lowStockThreshold": 10,
  "sku": "ELE-123456-789"
}
```

**Required Fields:** `name`, `category`, `quantity`, `price`

**Optional Fields:** `description`, `lowStockThreshold` (default: 10), `sku` (auto-generated if not provided)

**Valid Categories:** Electronics, Furniture, Clothing, Food, Books, Toys, Sports, Other

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "name": "MacBook Pro",
    "category": "Electronics",
    "sku": "ELE-123456-789",
    "quantity": 25,
    "price": 2499.99
  },
  "message": "Inventory item created successfully"
}
```

### 4. Update Item
**Endpoint:** `PUT /api/inventory/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "MacBook Pro 16",
  "description": "Updated description",
  "category": "Electronics",
  "quantity": 30,
  "price": 2599.99,
  "lowStockThreshold": 15
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "name": "MacBook Pro 16",
    "quantity": 30,
    "price": 2599.99
  },
  "message": "Inventory item updated successfully"
}
```

### 5. Delete Item
**Endpoint:** `DELETE /api/inventory/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {},
  "message": "Inventory item deleted successfully"
}
```

### 6. Update Quantity Only
**Endpoint:** `PATCH /api/inventory/:id/quantity`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 50
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "name": "MacBook Pro",
    "quantity": 50
  },
  "message": "Quantity updated successfully"
}
```

### 7. Get Low Stock Items
**Endpoint:** `GET /api/inventory/lowstock/items`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123...",
      "name": "USB-C Cable",
      "quantity": 5,
      "lowStockThreshold": 15,
      "stockStatus": "LOW_STOCK"
    }
  ],
  "count": 1
}
```

### 8. Get Statistics
**Endpoint:** `GET /api/inventory/stats/summary`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalItems": 50,
    "totalValue": "124999.50",
    "lowStockCount": 3,
    "outOfStockCount": 1
  }
}
```

---

## Error Responses

All error responses follow this format:

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": "Inventory item not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": "Server Error"
}
```

---

## Frontend Implementation Guide

### 1. Store JWT Token
After login/register, store the token:
```javascript
localStorage.setItem('token', response.data.token);
```

### 2. Axios Configuration
Create an axios instance with token:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 3. Usage Example
```javascript
// Login
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.data.token);
  return response.data;
};

// Get inventory
const getInventory = async (params) => {
  const response = await api.get('/inventory', { params });
  return response.data;
};

// Create item
const createItem = async (itemData) => {
  const response = await api.post('/inventory', itemData);
  return response.data;
};
```

### 4. Error Handling
```javascript
try {
  const data = await api.get('/inventory');
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error(error.response.data.error);
    if (error.response.status === 401) {
      // Redirect to login
    }
  }
}
```

---

## Test Credentials (After running seeder)

**Admin:**
- Email: admin@stockwise.com
- Password: admin123

**User:**
- Email: john@example.com
- Password: password123

---

## Stock Status Logic

The API automatically calculates `stockStatus` for each item:
- `OUT_OF_STOCK`: quantity = 0
- `LOW_STOCK`: quantity > 0 AND quantity <= lowStockThreshold
- `IN_STOCK`: quantity > lowStockThreshold

---

## Notes for Frontend Developer

1. **Authentication**: All inventory endpoints require JWT token in header
2. **Pagination**: Use page/limit params for large datasets
3. **Search**: Real-time search supported on name, SKU, description
4. **Categories**: Use the exact category names (case-sensitive)
5. **SKU**: Auto-generated if not provided during creation
6. **Stock Alerts**: Use `/lowstock/items` endpoint for dashboard alerts
7. **Statistics**: Use `/stats/summary` for dashboard metrics
8. **CORS**: Already configured for http://localhost:3000

---

## Quick Start Commands

```bash
# Install dependencies
cd backend
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI

# Seed database with sample data
pnpm seed

# Start development server
pnpm dev

# View API documentation
http://localhost:5000/api-docs
```
