import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white bg-opacity-70 shadow-md w-full p-3 h-16 z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-800">
          Gachwala
        </Link>
        <div className="flex items-center">
          <Link to="/login" className="text-gray-700 mx-4">
            Login
          </Link>
          <Link to="/cart" className="text-gray-700">
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
