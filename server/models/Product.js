const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  image: String,
  images: [String],
  stock: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// The third parameter 'products' ensures it uses your existing collection
module.exports = mongoose.model('Product', productSchema, 'products');
