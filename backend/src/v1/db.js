// dbModule.js
const mongoose = require('mongoose');
const { logger } = require('./utils/logger');
require('dotenv').config();
const Board = require('./models/Board'); // Adjust the import path as needed
const List = require('./models/list'); // Adjust the import path as needed
const Card = require('./models/card'); // Adjust the import path as needed

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    const mongoURI = process.env.MONGODB_URL;
    mongoose.set('strictPopulate', false);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    logger.info('MongoDB Connected Successfully');
    logger.info(`Connected to MongoDB instance at: ${mongoURI.split('@')[1]}`); // Only log the host part of the URL
  } catch (err) {
    logger.error('MongoDB Connection Error:', err.message);
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
    return Board.exists({ _id: boardId });
  },
  listExists: async (listId) => {
    return List.exists({ _id: listId });
  },
  cardExists: async (cardId) => {
    return Card.exists({ _id: cardId }, function (err, result) {
      if (err) {
        return false;
      }
      return result;
    });
  },
};

module.exports = { connectDB, dbModule };
