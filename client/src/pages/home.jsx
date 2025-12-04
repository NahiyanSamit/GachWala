import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductModal from '../components/ProductModal';

const Home = ({ setCart, user }) => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch latest products (new arrivals)
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        // Get the latest 3 products
        const latest = data.slice(0, 3);
        setNewArrivals(latest);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item._id === product._id);
      if (existingItem) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="w-full">
      {/* Hero Section with Background */}
      <div
        className="min-h-screen w-full bg-cover bg-center relative pt-12 pb-24"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Welcome Box */}
        <div className="relative z-10 container mx-auto px-4 pt-20">
          <div className="text-center bg-black bg-opacity-50 p-10 rounded-lg max-w-2xl mx-auto mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white">Welcome to Gachwala</h1>
            <p className="text-xl mb-8 text-white">Your one-stop shop for all things green.</p>
            <Link
              to="/shop"
              className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg text-lg inline-block transition-colors"
            >
              Shop Now
            </Link>
          </div>

          {/* New Arrivals Section on Background */}
          <div className="py-8">
            <div className="mb-8">
              <h3 className="text-4xl font-bold text-yellow-300 mb-2 drop-shadow-lg">New Arrivals</h3>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {newArrivals.map(product => (
                  <div 
                    key={product._id}
                    onClick={() => openProductModal(product)}
                    className="bg-white bg-opacity-95 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:bg-opacity-100 relative group cursor-pointer"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                      <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                      <span className="text-2xl font-bold text-yellow-400">৳{product.price}</span>
                    </div>
                  </div>
                ))}
                
                {/* Explore More Button */}
                <Link
                  to="/shop"
                  className="bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-2xl flex flex-col items-center justify-center min-h-[16rem] group"
                >
                  <div className="text-center px-4">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">→</div>
                    <div className="text-2xl font-bold">Explore More</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
        onAddToCart={addToCart}
        user={user}
      />
    </div>
  );
};

export default Home;
