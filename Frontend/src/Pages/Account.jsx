import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX, FiShield, FiCreditCard, FiShoppingBag, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi';

const Account = ({ colors }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    firstName: 'Ahmed',
    lastName: 'Khan',
    email: 'ahmed.khan@example.com',
    phone: '+92 300 1234567',
    address: '123 Main Street, Karachi, Pakistan',
    dateJoined: '2024-01-15'
  });
  const [editForm, setEditForm] = useState({ ...user });

  // Mock data
  const addresses = [
    {
      id: 1,
      type: 'Home',
      address: '123 Main Street, Karachi, Pakistan',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      address: '456 Park Avenue, Lahore, Pakistan',
      isDefault: false
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'Credit Card',
      last4: '1234',
      brand: 'visa',
      isDefault: true
    },
    {
      id: 2,
      type: 'Debit Card',
      last4: '5678',
      brand: 'mastercard',
      isDefault: false
    }
  ];

  const handleSave = () => {
    setUser({ ...editForm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...user });
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser className="w-4 h-4" /> },
    { id: 'addresses', label: 'Addresses', icon: <FiMapPin className="w-4 h-4" /> },
    { id: 'payment', label: 'Payment Methods', icon: <FiCreditCard className="w-4 h-4" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <FiHeart className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-lg font-medium text-gray-900">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Member since {new Date(user.dateJoined).toLocaleDateString()}</p>
              </div>

              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    <span className="ml-3">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <FiLogOut className="w-4 h-4" />
                  <span className="ml-3">Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          <FiSave className="w-4 h-4 mr-2" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FiX className="w-4 h-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Shipping Addresses</h3>
                    <button className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                      Add New Address
                    </button>
                  </div>

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">{address.type}</h4>
                              {address.isDefault && (
                                <span className="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-100 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">{address.address}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-emerald-600 hover:text-emerald-700">
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700">
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                    <button className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                      Add New Card
                    </button>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-600 uppercase">{method.brand}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{method.type}</p>
                              <p className="text-sm text-gray-600">•••• {method.last4}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault && (
                              <span className="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-100 rounded-full">
                                Default
                              </span>
                            )}
                            <button className="text-emerald-600 hover:text-emerald-700">
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700">
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">My Wishlist</h3>
                    <span className="text-sm text-gray-600">3 items</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1578632292375-2cf464ed0944?w=300&h=200&fit=crop"
                          alt="Product"
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Premium Pakistani Shawl</h4>
                          <p className="text-lg font-semibold text-emerald-600 mb-4">PKR 8,500</p>
                          <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                              Add to Cart
                            </button>
                            <button className="text-red-600 hover:text-red-700">
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Account Settings</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Notifications</h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                          <span className="ml-3 text-sm text-gray-700">Email notifications for orders</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                          <span className="ml-3 text-sm text-gray-700">SMS notifications for delivery updates</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                          <span className="ml-3 text-sm text-gray-700">Promotional emails and offers</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Privacy</h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                          <span className="ml-3 text-sm text-gray-700">Show profile to other users</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                          <span className="ml-3 text-sm text-gray-700">Share purchase history for recommendations</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Security</h4>
                      <div className="space-y-3">
                        <button className="flex items-center justify-between w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50">
                          <span className="text-sm font-medium text-gray-700">Change Password</span>
                          <FiShield className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="flex items-center justify-between w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50">
                          <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                          <FiShield className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Account;
