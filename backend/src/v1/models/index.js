const mongoose = require('mongoose');

// Import all model schemas
const userSchema = require('./schemas/userSchema');
const boardSchema = require('./schemas/boardSchema');
const listSchema = require('./schemas/listSchema.js');
const cardSchema = require('./schemas/cardSchema.js');

// Create models (only if they haven't been created)
const models = {
  User: mongoose.models.User || mongoose.model('User', userSchema),
  Board: mongoose.models.Board || mongoose.model('Board', boardSchema),
  List: mongoose.models.List || mongoose.model('List', listSchema),
  Card: mongoose.models.Card || mongoose.model('Card', cardSchema)
};

module.exports = models;
