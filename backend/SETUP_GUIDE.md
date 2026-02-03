# StockWise - Setup & Development Guide

## 📋 Project Overview

**StockWise** is a full-stack MERN inventory management system with:
- ✅ JWT-based authentication
- ✅ Complete CRUD operations for inventory
- ✅ SOLID principles architecture
- ✅ RESTful API with Swagger documentation
- ✅ Input validation and error handling
- ✅ Stock level tracking and alerts

---

## 🏗️ Architecture Highlights

### Layered Architecture (SOLID Compliant)
```
Routes → Controllers → Services → Repositories → Models → MongoDB
```

**Key Design Patterns:**
- **Repository Pattern**: Abstracts data access
- **Service Layer**: Encapsulates business logic
- **Controller Layer**: Handles HTTP concerns
- **Middleware**: Cross-cutting concerns (auth, validation, errors)

### SOLID Principles Applied

1. **Single Responsibility (S)**
   - Controllers handle HTTP only
   - Services contain business logic
   - Repositories manage data access

2. **Open/Closed (O)**
   - BaseRepository is extensible
   - New repositories extend base functionality

3. **Liskov Substitution (L)**
   - All repositories can be substituted through common interface

4. **Interface Segregation (I)**
   - Focused, specific methods in each layer

5. **Dependency Inversion (D)**
   - High-level modules (services) depend on abstractions (repositories)
   - Not on low-level modules (direct database calls)

---

## 🚀 Quick Start

### Prerequisites
```bash
# Required
- Node.js (v18+)
- MongoDB (v6+)
- pnpm

# Check versions
node --version
mongod --version
pnpm --version
```

### Installation Steps

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment**
   ```bash
   # .env file already created with default values
   # Update MongoDB URI if needed
   ```

4. **Start MongoDB** (if using local instance)
   ```bash
   # Windows (in separate terminal)
   mongod

   # Or if using MongoDB as a service, it should already be running
   ```

5. **Seed database** (optional but recommended)
   ```bash
   pnpm seed
   ```

6. **Start server**
   ```bash
   pnpm dev
   ```

7. **Access API**
   - Server: http://localhost:5000
   - Swagger Docs: http://localhost:5000/api-docs

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js           # MongoDB connection
│   │   └── swagger.js            # Swagger configuration
│   │
│   ├── models/
│   │   ├── User.js               # User schema with password hashing
│   │   └── InventoryItem.js      # Inventory schema with auto SKU
│   │
│   ├── repositories/
│   │   ├── BaseRepository.js     # Generic CRUD operations
│   │   ├── UserRepository.js     # User-specific queries
│   │   └── InventoryRepository.js # Inventory-specific queries
│   │
│   ├── services/
│   │   ├── AuthService.js        # Authentication business logic
│   │   └── InventoryService.js   # Inventory business logic
│   │
│   ├── controllers/
│   │   ├── authController.js     # Auth HTTP handlers
│   │   └── inventoryController.js # Inventory HTTP handlers
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints + Swagger docs
│   │   └── inventoryRoutes.js    # Inventory endpoints + Swagger docs
│   │
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── errorHandler.js       # Centralized error handling
│   │   └── asyncHandler.js       # Async/await wrapper
│   │
│   ├── validators/
│   │   ├── authValidator.js      # Auth input validation
│   │   ├── inventoryValidator.js # Inventory input validation
│   │   └── validationHandler.js  # Validation error handler
│   │
│   ├── utils/
│   │   ├── seeder.js             # Database seeder
│   │   ├── constants.js          # Application constants
│   │   └── responseFormatter.js  # API response helpers
│   │
│   └── server.js                 # Application entry point
│
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── API_DOCUMENTATION.md          # Detailed API guide
└── README.md                     # Project documentation
```

---

## 🔌 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

### Inventory (All Protected)
- `GET /api/inventory` - List all items (pagination, search, filter)
- `GET /api/inventory/:id` - Get single item
- `POST /api/inventory` - Create item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `PATCH /api/inventory/:id/quantity` - Update quantity
- `GET /api/inventory/lowstock/items` - Get low stock items
- `GET /api/inventory/stats/summary` - Get statistics

---

## 🗄️ Database Schemas

### User
```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  timestamps: true
}
```

### Inventory Item
```javascript
{
  name: String (required, max 100 chars),
  description: String (optional, max 500 chars),
  category: String (required, enum: categories),
  sku: String (unique, auto-generated),
  quantity: Number (required, min 0),
  price: Number (required, min 0),
  lowStockThreshold: Number (default 10),
  createdBy: ObjectId (ref: User),
  timestamps: true,
  virtual: stockStatus (calculated)
}
```

---

## 🧪 Testing the API

### Using Swagger UI
1. Start server
2. Visit http://localhost:5000/api-docs
3. Test endpoints interactively

### Using Postman/Thunder Client

**1. Register/Login**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@stockwise.com",
  "password": "admin123"
}
```

**2. Copy token from response**

**3. Test inventory endpoint**
```http
GET http://localhost:5000/api/inventory
Authorization: Bearer <your_token_here>
```

### Test Credentials (after seeding)
- Admin: `admin@stockwise.com` / `admin123`
- User: `john@example.com` / `password123`

---

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based stateless authentication
- ✅ Protected routes with middleware
- ✅ Input validation with express-validator
- ✅ Security headers with helmet
- ✅ CORS configuration
- ✅ Error handling without exposing sensitive data

---

## 🤝 Frontend Integration

### For Your Frontend Partner

**Key Files to Share:**
1. `API_DOCUMENTATION.md` - Complete API reference
2. Swagger URL: `http://localhost:5000/api-docs`
3. Test credentials

**What They Need to Know:**
1. Base URL: `http://localhost:5000/api`
2. Auth: Send JWT in `Authorization: Bearer <token>` header
3. Response format is always consistent
4. CORS is configured for `http://localhost:3000`

**Example Axios Setup:**
```javascript
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

export default api;
```

---

## 📝 Available Scripts

```bash
# Start production server
pnpm start

# Start development server
pnpm dev

# Seed database with sample data
pnpm seed
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod

# Or start as service (Windows)
net start MongoDB

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/stockwise
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### JWT Token Error
```bash
# Ensure JWT_SECRET is set in .env
JWT_SECRET=your_secret_key_here
```

---

## 📊 Sample Data

After running `pnpm seed`, you'll have:
- 2 users (admin and regular user)
- 8 inventory items across various categories
- Some items with low stock for testing alerts

---

## 🎯 Next Steps for Lab Completion

### Backend (Your Part) ✅
- [x] Set up Node.js + Express server
- [x] Design MongoDB schemas
- [x] Implement authentication with JWT
- [x] Create RESTful API endpoints
- [x] Add validation and error handling
- [x] Document API with Swagger
- [x] Apply SOLID principles

### Frontend (Partner's Part)
- [ ] Set up React application
- [ ] Create authentication UI (login/register)
- [ ] Build inventory dashboard
- [ ] Implement CRUD UI for items
- [ ] Add stock level indicators
- [ ] Create responsive design
- [ ] Integrate with backend API

### Deployment (Both)
- [ ] Deploy backend (Render, Railway, Heroku)
- [ ] Deploy frontend (Vercel, Netlify)
- [ ] Set up MongoDB Atlas (cloud database)
- [ ] Configure environment variables
- [ ] Test production deployment

---

## 📚 Learning Resources

**SOLID Principles:**
- Repository Pattern in action (see `/repositories`)
- Service Layer Pattern (see `/services`)
- Dependency Injection (services use repositories)

**Best Practices:**
- Async/await for asynchronous code
- Centralized error handling
- Input validation at entry points
- Separation of concerns (layered architecture)
- DRY principle (BaseRepository)

---

## 📄 License
ISC

---

## 👨‍💻 Author
Backend Developer - MERN Stack Lab Project

---

## 🎓 Academic Notes

**This project demonstrates:**
1. ✅ Full RESTful API implementation
2. ✅ Proper application of SOLID principles
3. ✅ Security best practices (auth, validation)
4. ✅ Professional code organization
5. ✅ Comprehensive documentation
6. ✅ Scalable architecture suitable for real-world applications

**Despite being built by a 2-week MERN learner, the architecture is production-ready thanks to SOLID principles!**
