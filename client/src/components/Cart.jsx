import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cart, updateQuantity, removeFromCart, getTotalPrice, isOpen, onClose }) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item._id} className="flex gap-4 mb-4 pb-4 border-b">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-green-700 font-semibold">৳{item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => {
                        if (item.quantity < item.stock) {
                          updateQuantity(item._id, item.quantity + 1);
                        } else {
                          alert(`Maximum stock available: ${item.stock}`);
                        }
                      }}
                      className={`px-3 py-1 rounded ${item.quantity >= item.stock ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="ml-auto text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  {item.quantity >= item.stock && (
                    <p className="text-xs text-red-600 mt-1">Max stock reached</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">৳{item.price * item.quantity}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-2xl font-bold text-green-700">৳{getTotalPrice()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
