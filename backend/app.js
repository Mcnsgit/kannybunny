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

const allowedOrigins = [
  'http://localhost:3000',
  'https://kannybunny.onrender.com',
  'http://kannybunny.vercel.app',
  process.env.FRONTEND_URL,
]

// Middleware
app.use(cors({
  origin: function(origin, callback){
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

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
