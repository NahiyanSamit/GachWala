import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ cartCount, onCartClick, user, onLogout }) => {
  return (
    <nav className="bg-slate-400 bg-opacity-70 shadow-md w-full p-3 h-16 z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-800">
          Gachwala
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to='/user' className="text-gray-700 hover:text-green-800 font-semibold">
                👤 {user.name}
              </Link>
              <button
                onClick={onLogout}
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-green-800">
              Login
            </Link>
          )}
          <button 
            onClick={onCartClick}
            className="text-gray-700 hover:text-green-800 relative flex items-center gap-1"
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
