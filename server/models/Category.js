const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// The third parameter 'categories' ensures it uses your existing collection
module.exports = mongoose.model('Category', categorySchema, 'categories');
