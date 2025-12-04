import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import User from './pages/user';
import Login from './pages/login';
import Shop from './pages/shop';
import Checkout from './pages/Checkout';
import Cart from './components/Cart';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);

  const verifyToken = useCallback(async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // defer the verification to avoid calling setState synchronously inside the effect
      setTimeout(() => {
        verifyToken(token);
      }, 0);
    }
  }, [verifyToken]);

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
      prev.map(item => {
        if (item._id === productId) {
          // Ensure quantity doesn't exceed stock
          const newQuantity = Math.min(quantity, item.stock);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <Navbar 
        cartCount={getTotalItems()} 
        onCartClick={() => setIsCartOpen(true)}
        user={user}
      />
      <Routes>
        <Route path="/" element={<Home setCart={setCart} user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/user" element={<User user={user} onLogout={handleLogout} />} />
        <Route 
          path="/shop" 
          element={
            <Shop 
              cart={cart} 
              setCart={setCart}
              user={user}
            />
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <Checkout 
              cart={cart} 
              user={user}
              getTotalPrice={getTotalPrice}
              clearCart={clearCart}
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
