# 📦 StockWise - Inventory Management System

> A full-stack MERN application for inventory management with authentication and CRUD operations.
> Built with SOLID principles for maintainability and scalability.

## 🎯 Project Overview

**StockWise** is a comprehensive inventory management system that allows users to:
- ✅ Register and authenticate securely
- ✅ Add, view, update, and delete inventory items
- ✅ Track stock levels with automatic alerts
- ✅ Search and filter products
- ✅ View real-time inventory statistics

**Lab Context:** 2-person team project for MERN stack course
- Backend Developer: RESTful API, Authentication, Database (✅ COMPLETE)
- Frontend Developer: UI/UX, React Components (🔄 IN PROGRESS)

---

## 🏗️ Project Structure

```
inventory_lab/
├── backend/          ✅ Node.js + Express API (COMPLETE)
│   ├── src/          • 18 source files
│   ├── docs/         • 6 documentation files
│   └── tests/        • Ready for testing
│
└── frontend/         🔄 React.js application (TODO)
    └── (to be created by frontend developer)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB v6+
- pnpm package manager

### Backend Setup (5 Steps)

1. **Install dependencies**
   ```bash
   cd backend
   pnpm install
   ```

2. **Configure environment**
   ```bash
   # .env is already set up with defaults
   # Update MONGODB_URI if needed
   ```

3. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # Or manually
   mongod
   ```

4. **Seed database** (optional but recommended)
   ```bash
   pnpm seed
   ```

5. **Start server**
   ```bash
   pnpm dev
   ```

**🎉 Server running at:** http://localhost:5000
**📚 API Docs:** http://localhost:5000/api-docs

### Frontend Setup (Coming Soon)
```bash
cd frontend
pnpm install
pnpm dev
```

---

## 👥 Team Roles

### Backend Developer (Your Focus) ✅
**Responsibilities:**
- ✅ Node.js + Express.js server setup
- ✅ MongoDB schema design
- ✅ RESTful API implementation (12 endpoints)
- ✅ JWT authentication system
- ✅ Input validation & error handling
- ✅ API documentation (Swagger)
- ✅ Security middleware

**Status:** COMPLETE

### Frontend Developer (Partner) 🔄
**Responsibilities:**
- [ ] React.js UI implementation
- [ ] Authentication pages (login/register)
- [ ] Inventory dashboard
- [ ] CRUD forms for items
- [ ] Stock level indicators
- [ ] Responsive design
- [ ] API integration

**Status:** TODO

---

## 🔌 API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Authentication (Protected)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Inventory (All Protected)
- `GET /api/inventory` - List all items (pagination, search, filter)
- `GET /api/inventory/:id` - Get single item
- `POST /api/inventory` - Create item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `PATCH /api/inventory/:id/quantity` - Update quantity
- `GET /api/inventory/lowstock/items` - Low stock alerts
- `GET /api/inventory/stats/summary` - Dashboard statistics

**📚 Complete API Reference:** See `backend/API_DOCUMENTATION.md`

---

## 📚 Documentation

### For Backend Developer:
- [📖 SETUP_GUIDE.md](backend/SETUP_GUIDE.md) - Complete setup & development guide
- [🏗️ ARCHITECTURE_REPORT.md](backend/ARCHITECTURE_REPORT.md) - Architecture & SOLID principles
- [⚡ QUICK_REFERENCE.md](backend/QUICK_REFERENCE.md) - Quick commands & tips
- [📦 PROJECT_SUMMARY.md](backend/PROJECT_SUMMARY.md) - Complete project summary

### For Frontend Developer:
- [📡 API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) - **START HERE** - Complete API reference
- [🔗 Swagger UI](http://localhost:5000/api-docs) - Interactive API testing
- [⚡ QUICK_REFERENCE.md](backend/QUICK_REFERENCE.md) - Common API calls

### For Lab Report:
- [🎓 ARCHITECTURE_REPORT.md](backend/ARCHITECTURE_REPORT.md) - Use for academic report
- All documentation demonstrates SOLID principles application

---

## 🛠️ Tech Stack

### Backend (Complete)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Security:** Helmet, bcryptjs, CORS
- **Documentation:** Swagger (OpenAPI 3.0)
- **Logging:** Morgan

### Frontend (Planned)
- **Framework:** React.js
- **Routing:** React Router
- **HTTP Client:** Axios
- **State Management:** Context API / Redux
- **UI Library:** TBD (Material-UI, Tailwind, etc.)

### Package Manager
- **pnpm** (for both frontend and backend)

---

## 🏗️ Architecture

### Layered Architecture with SOLID Principles

```
┌─────────────────────────────────────┐
│         Routes (API Layer)          │  ← Define endpoints
├─────────────────────────────────────┤
│      Controllers (HTTP Layer)        │  ← Handle requests
├─────────────────────────────────────┤
│     Services (Business Logic)        │  ← Core logic
├─────────────────────────────────────┤
│   Repositories (Data Access)         │  ← Database queries
├─────────────────────────────────────┤
│      Models (Data Schemas)           │  ← Data structure
└─────────────────────────────────────┘
                 ↓
            MongoDB Database
```

**SOLID Principles Applied:**
- ✅ Single Responsibility
- ✅ Open/Closed
- ✅ Liskov Substitution
- ✅ Interface Segregation
- ✅ Dependency Inversion

See [ARCHITECTURE_REPORT.md](backend/ARCHITECTURE_REPORT.md) for detailed explanation.

---

## 🔐 Security Features

- ✅ Password hashing (bcrypt with 10 salt rounds)
- ✅ JWT token authentication
- ✅ Protected routes middleware
- ✅ Input validation & sanitization
- ✅ Security HTTP headers (Helmet)
- ✅ CORS configuration
- ✅ Environment variables for secrets

---

## 🧪 Testing

### Test Credentials (After Seeding)
```
Admin User:
  Email: admin@stockwise.com
  Password: admin123

Regular User:
  Email: john@example.com
  Password: password123
```

### Sample Data
Running `pnpm seed` creates:
- 2 users (admin & regular)
- 8 inventory items
- Multiple categories
- Some low-stock items for testing alerts

---

## 📊 Project Status

| Component | Status | Progress |
|-----------|--------|----------|
| Backend API | ✅ Complete | 100% |
| Database Schema | ✅ Complete | 100% |
| Authentication | ✅ Complete | 100% |
| Documentation | ✅ Complete | 100% |
| Frontend UI | 🔄 In Progress | 0% |
| Integration | ⏳ Pending | 0% |
| Deployment | ⏳ Pending | 0% |

---

## 🚀 Deployment (Future)

### Backend Options:
- Railway
- Render
- Heroku
- Digital Ocean

### Frontend Options:
- Vercel
- Netlify
- GitHub Pages

### Database:
- MongoDB Atlas (cloud)

---

## 📝 Lab Deliverables Checklist

### ✅ Completed:
- [x] Backend source code with SOLID principles
- [x] MongoDB schemas and collections
- [x] RESTful API endpoints (12 total)
- [x] Authentication system (JWT)
- [x] Input validation & error handling
- [x] API documentation (Swagger + Markdown)
- [x] Architecture documentation
- [x] Git-ready (.gitignore, README)

### 🔄 In Progress:
- [ ] Frontend source code
- [ ] React UI components
- [ ] Frontend-backend integration
- [ ] Lab report document

### ⏳ Pending:
- [ ] GitHub repository with commits from both
- [ ] Deployed application URL
- [ ] Final presentation materials

---

## 🤝 Contributing

### For Team Members:

**Backend changes:**
```bash
cd backend
# Make changes
# Test locally
git add .
git commit -m "feat: description"
git push origin backend-dev
```

**Frontend setup:**
```bash
# Create frontend folder
cd frontend
# Initialize React app
# Follow backend API documentation
```

### Commit Convention:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructure
- `test:` Testing

---

## 📞 Support & Resources

### Documentation:
- 📖 [Backend Setup Guide](backend/SETUP_GUIDE.md)
- 📡 [API Documentation](backend/API_DOCUMENTATION.md)
- 🏗️ [Architecture Report](backend/ARCHITECTURE_REPORT.md)
- ⚡ [Quick Reference](backend/QUICK_REFERENCE.md)

### Interactive:
- 🌐 API Server: http://localhost:5000
- 📚 Swagger Docs: http://localhost:5000/api-docs

### Troubleshooting:
See [SETUP_GUIDE.md](backend/SETUP_GUIDE.md) § Troubleshooting

---

## 🎓 Learning Outcomes

**This project demonstrates:**
- ✅ Full-stack development (MERN)
- ✅ RESTful API design principles
- ✅ SOLID software design principles
- ✅ Secure authentication implementation
- ✅ Database schema design
- ✅ Professional documentation practices
- ✅ Team collaboration workflow

**Key Takeaway:** Understanding core principles (SOLID) creates production-ready code, even for beginners!

---

## 📄 License

ISC

---

## 🎉 Acknowledgments

- MERN Stack Course Instructors
- MongoDB Documentation
- Express.js Community
- VS Code Copilot

---

**Project Name:** StockWise
**Version:** 1.0.0
**Status:** Backend Complete ✅ | Frontend In Progress 🔄
**Last Updated:** February 2026

---

*Built with the MERN stack, powered by SOLID principles* 🚀
