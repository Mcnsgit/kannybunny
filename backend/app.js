const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { connectDB } = require('./src/v1/db');
const { logger: appLogger } = require('./src/v1/utils/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/v1/swagger');

const app = express();

// Initialize database connection
connectDB().catch(err => {
  appLogger.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/v1', require('./src/v1/routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  appLogger.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: err.validationErrors
    });
  }

  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
