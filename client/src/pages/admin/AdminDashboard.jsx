import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryManagement from '../../components/admin/CategoryManagement';
import ProductManagement from '../../components/admin/ProductManagement';
import OrderManagement from '../../components/admin/OrderManagement';
import AdminProfile from '../../components/admin/AdminProfile';
import AdminManagement from '../../components/admin/AdminManagement';

const AdminDashboard = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    pendingOrders: 0,
    totalOrders: 0
  });
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/categories'),
        fetch('http://localhost:5000/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const products = await productsRes.json();
      const categories = await categoriesRes.json();
      const orders = await ordersRes.json();

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    setTimeout(() => {
      fetchStats();
    }, 0);
  }, [admin, navigate]);

  const handleLogout = () => {
    onLogout();
    navigate('/admin/login');
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Gachwala Admin Panel</h1>
              <p className="text-green-100 text-sm">Welcome, {admin.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-green-700">{stats.totalProducts}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Categories</p>
                <p className="text-3xl font-bold text-blue-700">{stats.totalCategories}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.pendingOrders}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-8 h-8 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-purple-700">{stats.totalOrders}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-green-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-green-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-green-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Orders
            </button>
            {admin?.role === 'master_admin' && (
              <button
                onClick={() => setActiveTab('admins')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'admins'
                    ? 'bg-green-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Admins
              </button>
            )}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-green-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Profile
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'products' && <ProductManagement onUpdate={fetchStats} />}
          {activeTab === 'categories' && <CategoryManagement onUpdate={fetchStats} />}
          {activeTab === 'orders' && <OrderManagement onUpdate={fetchStats} />}
          {activeTab === 'admins' && admin?.role === 'master_admin' && <AdminManagement />}
          {activeTab === 'profile' && <AdminProfile admin={admin} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
