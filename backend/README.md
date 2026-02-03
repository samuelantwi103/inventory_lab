# 📦 StockWise - Inventory Management System (Backend)

> A modern, SOLID-compliant backend API for inventory management built with the MERN stack.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- pnpm (package manager)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (if running locally)
mongod

# Run the server in development mode
pnpm dev

# Seed the database with sample data (optional)
pnpm seed
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
stockwise-backend/
├── src/
│   ├── config/           # Configuration (Database, environment)
│   ├── models/           # Mongoose schemas
│   ├── repositories/     # Data access layer
│   ├── services/         # Business logic layer
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── validators/       # Input validation
│   ├── utils/            # Helper functions
│   └── server.js         # Application entry point
```

## 🏗️ Architecture

This project follows a **layered architecture** with SOLID principles:

- **Routes**: Define API endpoints
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Abstract data access
- **Models**: Define data schemas

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Inventory
- `GET /api/inventory` - Get all items (protected)
- `GET /api/inventory/:id` - Get single item (protected)
- `POST /api/inventory` - Create item (protected)
- `PUT /api/inventory/:id` - Update item (protected)
- `DELETE /api/inventory/:id` - Delete item (protected)
- `PATCH /api/inventory/:id/quantity` - Update quantity (protected)

## 📝 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🛠️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/stockwise |
| `JWT_SECRET` | Secret for JWT signing | (required) |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## 📚 SOLID Principles Applied

- **Single Responsibility**: Each class/module has one reason to change
- **Open/Closed**: Extensible through services, closed for modification
- **Liskov Substitution**: Repository pattern ensures substitutability
- **Interface Segregation**: Focused, specific interfaces
- **Dependency Inversion**: Services depend on abstractions (repositories)

## 🤝 Frontend Integration

For frontend developers:
- All endpoints return consistent JSON format
- CORS is configured for `http://localhost:3000`
- JWT token should be stored and sent with protected requests
- Detailed error messages are provided for validation failures

## 📄 License

ISC
