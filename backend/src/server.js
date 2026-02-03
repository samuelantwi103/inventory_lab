import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import DatabaseConfig from './config/database.js';
import swaggerSpec from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to database
DatabaseConfig.connect();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
})); // CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'StockWise API Documentation',
}));

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'StockWise API is running',
    documentation: '/api-docs',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║       StockWise API Server Running       ║
║                                            ║
║  Environment: ${process.env.NODE_ENV || 'development'}                  ║
║  Port: ${PORT}                                ║
║  API Docs: http://localhost:${PORT}/api-docs  ║
║                                            ║
╚════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
