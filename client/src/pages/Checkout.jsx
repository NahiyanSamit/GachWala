import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cart, user, getTotalPrice, clearCart }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Shipping and delivery fees
  const SHIPPING_FEE = 50;
  const DELIVERY_FEE = 30;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cash_on_delivery'
  });

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || ''
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/shop');
    }
  }, [cart, navigate, orderPlaced]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const subtotal = getTotalPrice();
  const totalAmount = subtotal + SHIPPING_FEE + DELIVERY_FEE;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.street || !formData.city) {
      alert('Please fill in all required fields');
      return;
    }

    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          shippingAddress: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          },
          subtotal: subtotal,
          shippingFee: SHIPPING_FEE,
          deliveryFee: DELIVERY_FEE,
          totalAmount: totalAmount,
          paymentMethod: formData.paymentMethod
        })
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.order._id);
        setOrderDetails({
          subtotal: subtotal,
          shippingFee: SHIPPING_FEE,
          deliveryFee: DELIVERY_FEE,
          totalAmount: totalAmount
        });
        setOrderPlaced(true);
        clearCart();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order');
    } finally {
      setLoading(false);
    }
  };

  // Order Success Page
  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-20 pb-24 bg-green-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-4">Thank you for your order</p>
            
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="font-mono text-lg font-bold text-green-800">{orderId}</p>
            </div>

            <div className="text-left mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">৳{orderDetails?.subtotal || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee:</span>
                <span className="font-semibold">৳{orderDetails?.shippingFee || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-semibold">৳{orderDetails?.deliveryFee || 0}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-green-200">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-xl text-green-700">৳{orderDetails?.totalAmount || 0}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Payment Method:</strong> Cash on Delivery
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => navigate('/shop')}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/user')}
                className="w-full bg-white hover:bg-gray-50 text-green-700 border-2 border-green-700 font-bold py-3 rounded-lg"
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 bg-green-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-green-900 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-green-900 mb-6">Shipping Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Street Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="House/Flat no, Street name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      City <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      State/Division
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-xl font-bold text-green-900 mb-4">Payment Method</h3>
                  <div className="bg-green-50 border-2 border-green-600 rounded-lg p-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={formData.paymentMethod === 'cash_on_delivery'}
                        onChange={handleChange}
                        className="mr-3 w-5 h-5"
                      />
                      <div>
                        <span className="font-semibold text-green-900">Cash on Delivery</span>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-6 py-3 rounded-lg font-bold text-white ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-700 hover:bg-green-800'
                  }`}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-green-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.map(item => (
                  <div key={item._id} className="flex gap-3 pb-3 border-b">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-green-700 font-semibold">৳{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping Fee:</span>
                  <span className="font-semibold">৳{SHIPPING_FEE}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold">৳{DELIVERY_FEE}</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-green-200">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-2xl text-green-700">৳{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/shop')}
                className="w-full mt-4 bg-white hover:bg-gray-50 text-green-700 border-2 border-green-700 font-bold py-2 rounded-lg"
              >
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
