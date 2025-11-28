const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  slug: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// The third parameter 'categories' ensures it uses your existing collection
module.exports = mongoose.model('Category', categorySchema, 'categories');
