// dbModule.js
const mongoose = require('mongoose');
const { logger } = require('./utils/logger');
require('dotenv').config();

// Initialize models object
let models;

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URL environment variable is not set');
    }

    const mongoURI = process.env.MONGODB_URL;
    mongoose.set('strictPopulate', false);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    logger.info('MongoDB Connected Successfully');
    logger.info(`Connected to MongoDB instance at: ${mongoURI.split('@')[1]}`);

    // Load models
    try {
      models = require('./models');
      logger.info('Models loaded successfully');
    } catch (modelErr) {
      logger.error('Error loading models:', modelErr);
      throw modelErr;
    }
  } catch (err) {
    logger.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('Mongoose connection closed through app termination');
    process.exit(0);
  } catch (err) {
    logger.error('Error closing Mongoose connection:', err);
    process.exit(1);
  }
});

const dbModule = {
  boardExists: async (boardId) => {
    return models && models.Board.exists({ _id: boardId });
  },
  
  listExists: async (listId) => {
    return models && models.List.exists({ _id: listId });
  },
  
  cardExists: async (cardId) => {
    return models && models.Card.exists({ _id: cardId });
  }
};

module.exports = { connectDB, dbModule };
