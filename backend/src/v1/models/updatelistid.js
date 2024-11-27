const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
mongoose.connect('process.env.MONGODB_URL');

const List = require('./models/list');

async function updateListIds() {
  try {
    const lists = await List.find({ listId: null });
    for (const list of lists) {
      list.listId = uuidv4(); // Assign a new unique UUID
      await list.save(); // Save the updated document
    }
    console.log('List IDs updated successfully');
  } catch (err) {
    console.error('Error updating list IDs:', err);
  } finally {
    mongoose.disconnect(); // Disconnect from MongoDB
  }
}

updateListIds();