const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { schemaOptions } = require('./modelOptions');

const cardSchema = new Schema({
  cardId: {
    type: String,
    unique: true,
    required: true,
    default: () => 'card_' + new mongoose.Types.ObjectId().toString()
  },
  list: {
    type: Schema.Types.ObjectId,
    ref: 'List',
    required: true,
    index: true
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
    default: 'Untitled Card'
  },
  content: {
    type: String,
    default: ''
  },
  position: {
    type: Number,
    required: true,
    default: 0
  },
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastModified: {
      type: Date,
      default: Date.now
    },
    labels: [{
      type: String,
      enum: ['urgent', 'important', 'bug', 'feature', 'enhancement']
    }],
    assignedTo: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
}, schemaOptions);

// Ensure indexes for faster querying
cardSchema.index({ cardId: 1 });
cardSchema.index({ list: 1, position: 1 });
cardSchema.index({ board: 1 });

module.exports = mongoose.model('Card', cardSchema);

