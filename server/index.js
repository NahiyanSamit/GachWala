const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load .env from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the Gachwala server!');
});

// Test route to check database
app.get('/api/test', async (req, res) => {
  try {
    const Category = require('./models/Category');
    const Product = require('./models/Product');
    const categories = await Category.find();
    const products = await Product.find();
    res.json({
      categoriesCount: categories.length,
      productsCount: products.length,
      categories,
      products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
