const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');

async function updateDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

    // Drop old collections
    await mongoose.connection.db.dropCollection('categories').catch(() => console.log('Categories collection not found, creating new...'));
    await mongoose.connection.db.dropCollection('products').catch(() => console.log('Products collection not found, creating new...'));

    // Read JSON files
    const categories = JSON.parse(fs.readFileSync('./data/categories.json', 'utf8'));
    const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

    // Insert categories
    const categoriesCollection = mongoose.connection.db.collection('categories');
    await categoriesCollection.insertMany(categories);
    console.log(`✓ Inserted ${categories.length} categories`);

    // Insert products
    const productsCollection = mongoose.connection.db.collection('products');
    await productsCollection.insertMany(products);
    console.log(`✓ Inserted ${products.length} products`);

    console.log('\n✅ Database updated successfully!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

updateDatabase();
