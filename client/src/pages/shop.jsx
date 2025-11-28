import React from 'react';
import { Link } from 'react-router-dom';

const Shop = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-8">
      <h1 className="text-4xl font-bold mb-6 text-green-900">Shop Page</h1>
      <p className="text-lg mb-4 text-green-800">Explore our collection of plants and gardening supplies!</p>
      <Link
        to="/"
        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Shop;