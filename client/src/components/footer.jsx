import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 bg-opacity-70 text-white py-4 z-50" style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Gachwala. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
