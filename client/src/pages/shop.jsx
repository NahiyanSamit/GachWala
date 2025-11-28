import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    // Fetch categories
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));

    // Fetch products
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) {
      return products;
    }
    return products.filter(product => 
      selectedCategories.includes(product.category_id)
    );
  }, [selectedCategories, products]);

  return (
    <div className="min-h-screen w-screen pt-20 pb-24 bg-green-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-green-900 text-center">Shop Page</h1>
        <p className="text-lg mb-6 text-green-800 text-center">Explore our collection of plants and gardening supplies!</p>
        
        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.category_id}
              onClick={() => toggleCategory(category.category_id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategories.includes(category.category_id)
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-green-700 border-2 border-green-700 hover:bg-green-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.info}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-green-700">৳{product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-yellow-600">⭐ {product.rating}</span>
                  <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No products found in selected categories.</p>
        )}
      </div>

      <Link
        to="/"
        className="fixed right-4 bottom-20 bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Shop;