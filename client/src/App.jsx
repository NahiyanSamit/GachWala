import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import Shop from './pages/shop';
import Cart from './components/Cart';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Router>
      <Navbar 
        cartCount={getTotalItems()} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/shop" 
          element={
            <Shop 
              cart={cart} 
              setCart={setCart}
            />
          } 
        />
      </Routes>
      <Footer />
      
      <Cart
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </Router>
  );
}

export default App;
