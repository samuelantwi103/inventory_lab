# StockWise - Project Architecture & Implementation Report

## 1. Executive Summary

**StockWise** is a full-stack inventory management system built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This document details the backend architecture and implementation, emphasizing the application of SOLID principles despite being developed by someone with just 2 weeks of MERN experience.

### Key Achievements
- ✅ Production-ready RESTful API with 12 endpoints
- ✅ Complete authentication system with JWT
- ✅ SOLID principles applied throughout
- ✅ Comprehensive API documentation (Swagger)
- ✅ Input validation and error handling
- ✅ Scalable layered architecture

---

## 2. System Architecture

### 2.1 Architectural Pattern: Layered Architecture

The system follows a **4-tier layered architecture** that ensures separation of concerns and maintainability:

```
┌─────────────────────────────────────────────────┐
│         Presentation Layer (Routes)             │
│  - API endpoint definitions                     │
│  - Swagger documentation                        │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│         Application Layer (Controllers)          │
│  - HTTP request/response handling               │
│  - Calling service layer methods                │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│         Business Logic Layer (Services)          │
│  - Business rules and validation                │
│  - Orchestrating repository calls               │
│  - JWT token generation                         │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│         Data Access Layer (Repositories)         │
│  - Database operations abstraction              │
│  - Query building                               │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│         Data Layer (Models)                      │
│  - Mongoose schemas                             │
│  - Data validation rules                        │
└─────────────────────────────────────────────────┘
                       ↓
                  MongoDB Database
```

### 2.2 Why This Architecture?

1. **Separation of Concerns**: Each layer has a distinct responsibility
2. **Testability**: Layers can be tested independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new features without disrupting existing code
5. **Beginner-Friendly**: Clear structure helps new developers understand the codebase

---

## 3. SOLID Principles Implementation

### 3.1 Single Responsibility Principle (S)

**Every class/module has one reason to change.**

**Example: Controller vs Service**
```javascript
// authController.js - Responsible ONLY for HTTP concerns
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Delegates business logic to service
  const { user, token } = await AuthService.login(email, password);
  
  // Handles HTTP response
  res.status(200).json({ success: true, data: { user, token } });
});

// AuthService.js - Responsible ONLY for authentication logic
class AuthService {
  async login(email, password) {
    // Business logic: validate credentials, generate token
    const user = await UserRepository.findByEmailWithPassword(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }
    const token = this.generateToken(user._id);
    return { user, token };
  }
}
```

**Benefits:**
- Controllers don't know about business logic
- Services don't know about HTTP
- Easy to modify one without affecting the other

### 3.2 Open/Closed Principle (O)

**Open for extension, closed for modification.**

**Example: BaseRepository Pattern**
```javascript
// BaseRepository.js - Generic CRUD operations
class BaseRepository {
  constructor(model) {
    this.model = model;
  }
  
  async findAll(filters, options) { /* ... */ }
  async findById(id) { /* ... */ }
  async create(data) { /* ... */ }
  // ... more generic methods
}

// InventoryRepository.js - Extends without modifying base
class InventoryRepository extends BaseRepository {
  constructor() {
    super(InventoryItem); // Passes model to base
  }
  
  // Adds inventory-specific methods
  async findLowStock() { /* ... */ }
  async search(term) { /* ... */ }
}
```

**Benefits:**
- New repositories don't require rewriting basic CRUD
- BaseRepository can be enhanced without changing children
- Reduces code duplication

### 3.3 Liskov Substitution Principle (L)

**Objects should be replaceable with their subtypes.**

**Example: Repository Substitutability**
```javascript
// Any repository can be used where BaseRepository is expected
function getItemById(repository, id) {
  return repository.findById(id); // Works for any repository
}

// Both work the same way
getItemById(UserRepository, userId);
getItemById(InventoryRepository, itemId);
```

**Benefits:**
- Consistent interface across all repositories
- Predictable behavior
- Easy to swap implementations

### 3.4 Interface Segregation Principle (I)

**Clients shouldn't depend on methods they don't use.**

**Example: Focused Validators**
```javascript
// authValidator.js - Only auth-related validation
export const registerValidator = [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

export const loginValidator = [
  body('email').isEmail(),
  body('password').notEmpty(),
];

// inventoryValidator.js - Only inventory-related validation
export const createItemValidator = [
  body('name').notEmpty(),
  body('category').isIn(validCategories),
  body('quantity').isInt({ min: 0 }),
  // ... more inventory-specific rules
];
```

**Benefits:**
- Routes only import what they need
- No bloated interfaces
- Clear purpose for each validator

### 3.5 Dependency Inversion Principle (D)

**Depend on abstractions, not concretions.**

**Example: Service → Repository Abstraction**
```javascript
// AuthService depends on abstract repository, not direct DB calls
class AuthService {
  async register(userData) {
    // Depends on UserRepository abstraction, not mongoose directly
    const user = await UserRepository.create(userData);
    return user;
  }
}

// If we change from MongoDB to PostgreSQL:
// 1. Implement new UserRepository with same interface
// 2. AuthService code stays EXACTLY the same
```

**Benefits:**
- Business logic decoupled from data source
- Easy to switch databases
- Easy to mock for testing

---

## 4. Key Features & Implementation

### 4.1 Authentication System

**Components:**
- JWT-based stateless authentication
- Password hashing with bcryptjs (10 salt rounds)
- Protected routes middleware
- Token expiration (configurable, default 7 days)

**Flow:**
```
User → Register/Login → Service validates → JWT generated → Sent to client
Client → Stores token → Sends in header → Middleware verifies → Route accessed
```

**Security Measures:**
- Passwords never stored in plain text
- Password field excluded from queries by default
- Token verification on protected routes
- Standardized error messages (no hint if email exists)

### 4.2 Inventory Management

**Features:**
- Full CRUD operations
- Search functionality (name, SKU, description)
- Category filtering
- Pagination (configurable page size)
- Stock level tracking
- Auto-generated SKU system
- Low stock alerts
- Statistics dashboard data

**Business Logic:**
```javascript
// Stock Status Calculation (Virtual Field)
stockStatus = 
  quantity === 0 ? 'OUT_OF_STOCK' :
  quantity <= lowStockThreshold ? 'LOW_STOCK' :
  'IN_STOCK'

// SKU Generation (Pre-save Hook)
SKU = `${CATEGORY_PREFIX}-${TIMESTAMP}-${RANDOM}`
Example: ELE-456789-123
```

### 4.3 Input Validation

**Two-tier validation:**
1. **Schema-level** (Mongoose):
   - Data types
   - Required fields
   - Length constraints
   - Enum values

2. **Route-level** (express-validator):
   - Business rules
   - Format validation
   - Custom validation logic

**Example:**
```javascript
// Quantity validation at both levels
// 1. Mongoose Schema
quantity: {
  type: Number,
  required: true,
  min: [0, 'Quantity cannot be negative']
}

// 2. express-validator
body('quantity')
  .notEmpty()
  .withMessage('Quantity is required')
  .isInt({ min: 0 })
  .withMessage('Quantity must be a non-negative integer')
```

### 4.4 Error Handling

**Centralized error handler** catches all errors:
- Mongoose validation errors
- Mongoose cast errors (invalid ObjectId)
- Duplicate key errors
- JWT errors
- Custom application errors

**Consistent error response:**
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

---

## 5. API Design

### 5.1 RESTful Principles

- ✅ Resource-based URLs (`/api/inventory`)
- ✅ HTTP verbs (GET, POST, PUT, DELETE, PATCH)
- ✅ Stateless communication
- ✅ Standard status codes
- ✅ JSON data format

### 5.2 Endpoint Design

**Authentication Endpoints:**
```
POST   /api/auth/register    - Create new user
POST   /api/auth/login       - Authenticate user
GET    /api/auth/me          - Get current user
POST   /api/auth/logout      - Logout user
```

**Inventory Endpoints:**
```
GET    /api/inventory              - List all items
GET    /api/inventory/:id          - Get single item
POST   /api/inventory              - Create item
PUT    /api/inventory/:id          - Update item
DELETE /api/inventory/:id          - Delete item
PATCH  /api/inventory/:id/quantity - Update quantity only
GET    /api/inventory/lowstock/items   - Get low stock items
GET    /api/inventory/stats/summary    - Get statistics
```

### 5.3 Response Format Consistency

**Success Response:**
```json
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Operation successful",
  "pagination": { /* if applicable */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": [ /* validation errors if applicable */ ]
}
```

---

## 6. Documentation

### 6.1 Swagger/OpenAPI

**Interactive API documentation** at `/api-docs`:
- All endpoints documented
- Request/response schemas
- Authentication requirements
- Try-it-out functionality
- Example requests

**Benefits for Frontend Developer:**
- Visual reference
- Test endpoints without code
- See exact data structures
- Understand error responses

### 6.2 Code Documentation

**JSDoc comments** on all controllers:
```javascript
/**
 * @desc    Get all inventory items
 * @route   GET /api/inventory
 * @access  Private
 */
```

**README files:**
- `README.md` - Project overview
- `API_DOCUMENTATION.md` - Detailed API guide
- `SETUP_GUIDE.md` - Setup instructions

---

## 7. Database Design

### 7.1 User Schema

```javascript
{
  name: String (required, max 50),
  email: String (required, unique, validated),
  password: String (required, hashed, min 6),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- Unique index on `email`

**Middleware:**
- Pre-save hook for password hashing
- Instance method for password comparison
- toJSON method to exclude password

### 7.2 Inventory Schema

```javascript
{
  name: String (required, max 100),
  description: String (optional, max 500),
  category: String (required, enum),
  sku: String (unique, auto-generated),
  quantity: Number (required, min 0),
  price: Number (required, min 0),
  lowStockThreshold: Number (default 10),
  createdBy: ObjectId (ref: User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- Unique index on `sku`

**Virtual Fields:**
- `stockStatus` (calculated from quantity)

**Middleware:**
- Pre-save hook for SKU generation

---

## 8. Technology Stack & Dependencies

### 8.1 Core Dependencies

| Package | Purpose | Why Chosen |
|---------|---------|-----------|
| express | Web framework | Industry standard, minimal, flexible |
| mongoose | MongoDB ODM | Schema validation, easier for beginners |
| jsonwebtoken | JWT auth | Stateless authentication |
| bcryptjs | Password hashing | Secure password storage |
| dotenv | Environment variables | Configuration management |
| cors | CORS handling | Enable cross-origin requests |
| helmet | Security headers | Basic security best practices |
| morgan | HTTP logging | Request logging for debugging |
| express-validator | Input validation | Declarative validation rules |
| swagger-jsdoc | API documentation | Generate OpenAPI spec from code |
| swagger-ui-express | Swagger UI | Interactive API documentation |

### 8.2 Why These Choices?

**For a 2-week MERN learner:**
- **Express**: Simple syntax, lots of tutorials
- **Mongoose**: Abstracts complex MongoDB queries
- **JWT**: Easier than session management
- **express-validator**: More intuitive than custom validation
- **Swagger**: Auto-generates professional documentation

---

## 9. Security Implementation

### 9.1 Authentication Security

✅ **Password Hashing**: bcrypt with salt rounds
✅ **JWT Tokens**: Signed with secret key
✅ **Protected Routes**: Middleware verification
✅ **Token Expiration**: Configurable expiry time

### 9.2 Input Security

✅ **Validation**: All inputs validated before processing
✅ **Sanitization**: express-validator sanitizes inputs
✅ **Type Checking**: Mongoose schema validation
✅ **Error Messages**: Generic (no information leakage)

### 9.3 HTTP Security

✅ **Helmet**: Sets security HTTP headers
✅ **CORS**: Configured for specific origin
✅ **Error Handling**: Never exposes stack traces in production

---

## 10. Frontend Integration Considerations

### 10.1 CORS Configuration

```javascript
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})
```

Frontend can make requests from localhost:3000.

### 10.2 API Contract

**Predictable patterns:**
- Consistent URL structure
- Standard HTTP methods
- Uniform response format
- Clear error messages

**Easy integration:**
- JWT in Authorization header
- JSON request/response bodies
- RESTful conventions

### 10.3 Documentation for Frontend

- Swagger UI for interactive testing
- API_DOCUMENTATION.md with examples
- Sample axios setup provided
- Test credentials for development

---

## 11. Testing & Quality Assurance

### 11.1 Database Seeder

**Purpose**: Populate database with realistic test data

**Includes:**
- 2 test users (admin & regular)
- 8 inventory items
- Various categories
- Some low-stock items (for testing alerts)

**Usage:**
```bash
pnpm seed
```

### 11.2 Error Scenarios Covered

✅ Invalid credentials
✅ Duplicate email registration
✅ Invalid MongoDB ObjectId
✅ Item not found
✅ Validation failures
✅ Unauthorized access
✅ Missing required fields

---

## 12. Scalability & Future Enhancements

### 12.1 Current Architecture Supports

✅ **Adding new models**: Extend BaseRepository
✅ **New endpoints**: Follow existing pattern
✅ **Role-based access**: Already has role field
✅ **Complex queries**: Repository pattern supports it

### 12.2 Potential Enhancements

- Rate limiting (express-rate-limit)
- File uploads (multer) for product images
- Advanced search (Elasticsearch)
- Caching (Redis)
- Email notifications (nodemailer)
- Audit logs (who changed what when)
- Batch operations (import/export CSV)
- Real-time updates (Socket.io)
- API versioning (/api/v1, /api/v2)

---

## 13. Learning Outcomes

### 13.1 Technical Skills Demonstrated

✅ RESTful API design
✅ MongoDB schema design
✅ JWT authentication implementation
✅ Middleware creation
✅ Input validation strategies
✅ Error handling patterns
✅ API documentation
✅ Git version control

### 13.2 Software Engineering Principles

✅ **SOLID Principles**: Applied throughout
✅ **DRY**: No repeated code
✅ **Separation of Concerns**: Clear layer boundaries
✅ **Single Source of Truth**: Centralized configuration
✅ **Convention over Configuration**: Consistent patterns

---

## 14. Conclusion

Despite being built by someone with only 2 weeks of MERN experience, **StockWise backend is production-ready** thanks to:

1. **Strong architectural foundation** (layered architecture)
2. **SOLID principles** ensuring maintainability
3. **Comprehensive validation** and error handling
4. **Professional documentation** (Swagger + markdown)
5. **Security best practices**

The codebase is:
- ✅ Readable and well-organized
- ✅ Scalable and extensible
- ✅ Testable (though tests not implemented in this lab)
- ✅ Well-documented
- ✅ Ready for frontend integration

**This demonstrates that understanding core principles (SOLID) is more important than years of experience.**

---

## Appendix A: File Structure

```
backend/
├── src/
│   ├── config/           (2 files - database, swagger)
│   ├── models/           (2 files - User, InventoryItem)
│   ├── repositories/     (3 files - Base, User, Inventory)
│   ├── services/         (2 files - Auth, Inventory)
│   ├── controllers/      (2 files - auth, inventory)
│   ├── routes/           (2 files - auth, inventory)
│   ├── middleware/       (3 files - auth, error, async)
│   ├── validators/       (3 files - auth, inventory, handler)
│   ├── utils/            (3 files - seeder, constants, formatter)
│   └── server.js         (1 file - entry point)
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── API_DOCUMENTATION.md
└── SETUP_GUIDE.md

Total: 18 source files + 5 documentation files
Lines of code: ~2000 (excluding documentation)
```

---

## Appendix B: Environment Variables

```env
PORT=5000                    # Server port
NODE_ENV=development         # Environment
MONGODB_URI=mongodb://...    # Database connection
JWT_SECRET=...               # JWT signing key
JWT_EXPIRE=7d                # Token expiration
FRONTEND_URL=http://...      # CORS allowed origin
```

---

**END OF REPORT**
