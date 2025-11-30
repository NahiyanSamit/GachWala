import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const User = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [profileCompletion, setProfileCompletion] = useState(0);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        calculateProfileCompletion(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const calculateProfileCompletion = (data) => {
    const fields = [
      data.name,
      data.email,
      data.phone,
      data.address?.street,
      data.address?.city,
      data.address?.state,
      data.address?.zipCode
    ];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    const percentage = Math.round((filledFields / fields.length) * 100);
    setProfileCompletion(percentage);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchUserProfile();
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
        calculateProfileCompletion(data.user);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        setIsEditing(false);
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: 'Failed to update profile', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Server error', type: 'error' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'New passwords do not match!', type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: 'Password changed successfully!', type: 'success' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: data.message || 'Failed to change password', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Server error', type: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (!user) {
    return (
      <div className="min-h-screen w-screen pt-20 pb-24 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen pt-20 pb-24 bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Profile Completion */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-green-700">My Profile</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                🏠 Back to Home
              </Link>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                🚪 Logout
              </button>
            </div>
          </div>
          
          {/* Profile Completion Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-green-700">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 font-semibold ${activeTab === 'profile' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile Info
            </button>
            <button
              className={`flex-1 py-4 px-6 font-semibold ${activeTab === 'orders' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 My Orders
            </button>
            <button
              className={`flex-1 py-4 px-6 font-semibold ${activeTab === 'password' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('password')}
            >
              🔒 Change Password
            </button>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      ✏️ Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name || ''}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email || ''}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone || ''}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2">Street Address</label>
                        <input
                          type="text"
                          value={profileData.address?.street || ''}
                          onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, street: e.target.value } })}
                          disabled={!isEditing}
                          placeholder="Enter street address"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">City</label>
                        <input
                          type="text"
                          value={profileData.address?.city || ''}
                          onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, city: e.target.value } })}
                          disabled={!isEditing}
                          placeholder="Enter city"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">State</label>
                        <input
                          type="text"
                          value={profileData.address?.state || ''}
                          onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, state: e.target.value } })}
                          disabled={!isEditing}
                          placeholder="Enter state"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Zip Code</label>
                        <input
                          type="text"
                          value={profileData.address?.zipCode || ''}
                          onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, zipCode: e.target.value } })}
                          disabled={!isEditing}
                          placeholder="Enter zip code"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 mt-6">
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
                      >
                        💾 Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          fetchUserProfile();
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg mb-4">No orders yet</p>
                    <Link
                      to="/shop"
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg inline-block"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                            <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="space-y-2 mb-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.name} x {item.quantity}</span>
                              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-2 flex justify-between items-center">
                          <span className="font-bold text-gray-800">Total Amount:</span>
                          <span className="text-xl font-bold text-green-700">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
                  >
                    🔒 Change Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
