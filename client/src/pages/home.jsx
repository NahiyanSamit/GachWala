import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div
      className="h-screen w-screen m-0 p-0 bg-cover bg-center flex items-center justify-center text-white fixed inset-0"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="text-center bg-black bg-opacity-50 p-10 rounded-lg">
        <h1 className="text-5xl font-bold mb-4">Welcome to Gachwala</h1>
        <p className="text-xl mb-8">Your one-stop shop for all things green.</p>
        <Link
          to="/shop"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg text-lg"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
