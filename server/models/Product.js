const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  info: String,
  image: String,
  category_id: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  sale: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// The third parameter 'products' ensures it uses your existing collection
module.exports = mongoose.model('Product', productSchema, 'products');
