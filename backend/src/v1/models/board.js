// models/Board.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { schemaOptions } = require('./modelOptions');

const boardSchema = new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }  ,
  icon: {
    type: String,
    default: ''
  },
  boardId: {
    type: String,
    unique: true,
    required: true,
    default: () => 'board_' + new mongoose.Types.ObjectId().toString()
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled Board'
  },
  description: {
    type: String,
    default: ''
  },
  favourite: {
    type: Boolean,
    default: false
  },
  position: {
    type: Number,
    required: true
  },
  lists: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    lastModified: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: String,
      required: true
    }
  }
}, schemaOptions);

// Ensure indexes for faster querying
boardSchema.index({ boardId: 1 });
boardSchema.index({ owner: 1 });
boardSchema.index({ 'metadata.lastModified': -1 });

module.exports = mongoose.model('Board', boardSchema);
