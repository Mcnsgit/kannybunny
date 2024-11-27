const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { schemaOptions } = require('./modelOptions');

const listSchema = new Schema({
  listId: {
    type: String,
    unique: true,
    required: true,
    default: () => 'list_' + new mongoose.Types.ObjectId().toString()
  },
  board: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
    index: true 
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled List'
  },
  position: {
    type: Number,
    required: true,
    default: 0
  },
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'Card'
  }],
  metadata: {
    lastModified: {
      type: Date,
      default: Date.now
    },
    cardCount: {
      type: Number,
      default: 0
    }
  }
}, schemaOptions);

// Ensure indexes for faster querying
listSchema.index({ listId: 1 });
listSchema.index({ board: 1, position: 1 });

module.exports = mongoose.model('List', listSchema);