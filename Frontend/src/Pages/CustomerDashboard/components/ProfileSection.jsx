import React, { useState } from 'react';
import { 
  FiUser, FiEdit, FiPlus, FiX, FiCreditCard, 
  FiMail, FiPhone, FiMapPin, FiSave, FiLoader, 
  FiTrash2, FiHome, FiBriefcase, FiCamera, FiCheck,
  FiShare2, FiShield, FiHeart, FiPackage
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../../utils/authService';
import { addressService } from '../../../utils/addressService';
import { paymentService } from '../../../utils/paymentService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileSection = ({ user, addresses: initialAddresses, paymentMethods: initialPaymentMethods }) => {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods || []);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });

  const [addressForm, setAddressForm] = useState({
    type: 'home',
    name: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    isDefault: false
  });

  const [paymentForm, setPaymentForm] = useState({
    brand: 'visa',
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    isDefault: false
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(formData);
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newAddr = await addressService.addAddress(addressForm);
      setAddresses([...addresses, newAddr]);
      setShowAddAddress(false);
      setAddressForm({ type: 'home', name: '', address: '', city: '', zip: '', phone: '', isDefault: false });
      toast.success('Address added successfully!');
    } catch (error) {
      toast.error('Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressService.deleteAddress(id);
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const mockLast4 = paymentForm.cardNumber.slice(-4);
      const newPayment = await paymentService.addPaymentMethod({
        brand: paymentForm.brand,
        last4: mockLast4,
        expiryMonth: parseInt(paymentForm.expiryMonth),
        expiryYear: parseInt(paymentForm.expiryYear),
        cardholderName: paymentForm.cardholderName,
        isDefault: paymentForm.isDefault
      });
      setPaymentMethods([...paymentMethods, newPayment]);
      setShowAddPayment(false);
      setPaymentForm({ brand: 'visa', cardholderName: '', cardNumber: '', expiryMonth: '', expiryYear: '', isDefault: false });
      toast.success('Card added successfully!');
    } catch (error) {
      toast.error('Failed to add card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await paymentService.deletePaymentMethod(id);
      setPaymentMethods(paymentMethods.filter(p => p.id !== id));
      toast.success('Card deleted');
    } catch (error) {
      toast.error('Failed to delete card');
    }
  };


  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Premium Profile Header */}
      <motion.div 
        className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100"
        variants={itemVariants}
      >
        {/* Cover Image Placeholder */}
        <div className="h-40 w-full bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-800 opacity-90 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
          <motion.button 
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiCamera className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row md:items-end -mt-16 md:-mt-12 space-y-4 md:space-y-0 md:space-x-6">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl p-1.5 shadow-2xl overflow-hidden">
                <div className="w-full h-full bg-emerald-50 rounded-xl flex items-center justify-center relative group">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <FiUser className="w-16 h-16 text-emerald-600" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl cursor-pointer">
                    <FiCamera className="text-white w-8 h-8" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-lg shadow-lg">
                <FiShield className="w-4 h-4" />
              </div>
            </motion.div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
                  <p className="text-emerald-600 font-medium flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    {user?.role === 'admin' ? 'System Administrator' : 'Premium Member'}
                  </p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <motion.button 
                    onClick={() => {
                        const baseUrl = window.location.origin;
                        navigator.clipboard.writeText(`${baseUrl}/referral/${user?.id}`);
                        toast.success('Referral link copied!');
                    }}
                    className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiShare2 className="w-5 h-5" />
                  </motion.button>
                  {!isEditing ? (
                    <motion.button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold flex items-center shadow-lg shadow-emerald-200"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiEdit className="mr-2" />
                      Edit Profile
                    </motion.button>
                  ) : (
                    <div className="flex space-x-2">
                         <motion.button 
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-all"
                            whileHover={{ scale: 1.02 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold flex items-center shadow-lg shadow-emerald-200 disabled:opacity-50"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
                            Save Changes
                        </motion.button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  <FiMail className="mr-2" /> {user?.email}
                </div>
                <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  <FiPhone className="mr-2" /> {user?.phone || 'No phone added'}
                </div>
                <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  <FiPackage className="mr-2" /> Joined {new Date(user?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Details Form Section */}
        <motion.div 
            className="lg:col-span-2 space-y-8"
            variants={itemVariants}
        >
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
                    Account Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 ml-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={isEditing ? formData.firstName : (user?.firstName || '')}
                            onChange={handleChange}
                            className={`w-full h-12 rounded-2xl px-5 transition-all outline-none border ${
                                isEditing 
                                ? 'border-emerald-200 focus:border-emerald-500 bg-white ring-4 ring-emerald-50' 
                                : 'border-gray-100 bg-gray-50/50 text-gray-700'
                            }`}
                            readOnly={!isEditing}
                            placeholder="e.g. Abdullah"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 ml-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={isEditing ? formData.lastName : (user?.lastName || '')}
                            onChange={handleChange}
                            className={`w-full h-12 rounded-2xl px-5 transition-all outline-none border ${
                                isEditing 
                                ? 'border-emerald-200 focus:border-emerald-500 bg-white ring-4 ring-emerald-50' 
                                : 'border-gray-100 bg-gray-50/50 text-gray-700'
                            }`}
                            readOnly={!isEditing}
                            placeholder="e.g. Al Haneef"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 ml-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={user?.email || ''}
                                className="w-full h-12 rounded-2xl px-5 border border-gray-100 bg-gray-50/50 text-gray-400 cursor-not-allowed outline-none"
                                readOnly
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">Locked</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 ml-1">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={isEditing ? formData.phone : (user?.phone || '')}
                            onChange={handleChange}
                            className={`w-full h-12 rounded-2xl px-5 transition-all outline-none border ${
                                isEditing 
                                ? 'border-emerald-200 focus:border-emerald-500 bg-white ring-4 ring-emerald-50' 
                                : 'border-gray-100 bg-gray-50/50 text-gray-700'
                            }`}
                            readOnly={!isEditing}
                            placeholder="+92 300 1234567"
                        />
                    </div>
                </div>
            </div>

            {/* Address Management Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
                        Shipping Addresses
                    </h2>
                    <motion.button 
                        onClick={() => setShowAddAddress(!showAddAddress)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-semibold ${
                            showAddAddress 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {showAddAddress ? <FiX /> : <FiPlus />}
                        <span>{showAddAddress ? 'Cancel' : 'Add New'}</span>
                    </motion.button>
                </div>

                <AnimatePresence>
                    {showAddAddress && (
                        <motion.form 
                            onSubmit={handleAddAddress} 
                            className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2 flex space-x-2">
                                    {['home', 'office', 'other'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setAddressForm({...addressForm, type})}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                                                addressForm.type === type 
                                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                                                : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-200'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                <div className="md:col-span-2">
                                    <input
                                        required
                                        placeholder="Address Label (e.g. My Home)"
                                        className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 outline-none focus:border-emerald-500 transition-all"
                                        value={addressForm.name}
                                        onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <textarea
                                        required
                                        placeholder="Detailed Street Address"
                                        className="w-full bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-emerald-500 transition-all"
                                        rows="2"
                                        value={addressForm.address}
                                        onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <input
                                        required
                                        placeholder="City"
                                        className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 outline-none focus:border-emerald-500 transition-all"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <input
                                        required
                                        placeholder="Delivery Phone"
                                        className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 outline-none focus:border-emerald-500 transition-all"
                                        value={addressForm.phone}
                                        onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-center">
                                    <label className="flex items-center cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={addressForm.isDefault}
                                                onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                                            />
                                            <div className={`block w-10 h-6 rounded-full border-2 transition-all ${addressForm.isDefault ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-200'}`}></div>
                                            <div className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition-all ${addressForm.isDefault ? 'translate-x-4 bg-white' : 'bg-gray-200'}`}></div>
                                        </div>
                                        <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-emerald-600 transition-colors">Set as default shipping address</span>
                                    </label>
                                </div>
                            </div>
                            <motion.button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                {isLoading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                                <span>Save Address</span>
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                        {addresses.length === 0 ? (
                            <motion.div 
                                className="col-span-2 py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                    <FiMapPin className="w-8 h-8 text-emerald-600" />
                                </div>
                                <p className="text-gray-400 font-medium">No saved addresses</p>
                                <button 
                                    onClick={() => setShowAddAddress(true)}
                                    className="mt-4 text-emerald-600 font-bold hover:underline"
                                >
                                    Add your first shipping label
                                </button>
                            </motion.div>
                        ) : (
                            addresses.map((addr) => (
                                <motion.div 
                                    key={addr.id} 
                                    className={`relative group p-5 rounded-2xl border-2 transition-all overflow-hidden ${
                                        addr.isDefault 
                                        ? 'border-emerald-500 bg-emerald-50/30' 
                                        : 'border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/10'
                                    }`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    {addr.isDefault && (
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm">
                                            Default
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg ${addr.type === 'home' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                            {addr.type === 'home' ? <FiHome className="w-5 h-5" /> : <FiBriefcase className="w-5 h-5" />}
                                        </div>
                                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-all hover:bg-red-50 rounded-lg"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight text-sm">{addr.name}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{addr.address}</p>
                                        <p className="text-xs font-semibold text-gray-700 pt-1">{addr.city}</p>
                                        <div className="flex items-center text-[11px] text-gray-400 pt-2 font-medium">
                                            <FiPhone className="mr-1.5 w-3 h-3" />
                                            {addr.phone}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>

        {/* Sidebar / Stats Section */}
        <motion.div 
            className="space-y-8"
            variants={itemVariants}
        >
            {/* Payment Methods Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
                        Payments
                    </h2>
                    <motion.button 
                        onClick={() => setShowAddPayment(!showAddPayment)}
                        className={`p-2 rounded-xl transition-all border ${
                          showAddPayment ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}
                        whileHover={{ scale: 1.1, rotate: showAddPayment ? 0 : 90 }}
                    >
                        {showAddPayment ? <FiX className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                    </motion.button>
                </div>
                
                <AnimatePresence>
                    {showAddPayment && (
                        <motion.form 
                            onSubmit={handleAddPayment}
                            className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <input
                                        required
                                        placeholder="Cardholder Name"
                                        className="w-full h-10 bg-white border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-emerald-500"
                                        value={paymentForm.cardholderName}
                                        onChange={(e) => setPaymentForm({...paymentForm, cardholderName: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        required
                                        placeholder="Card Number"
                                        maxLength="16"
                                        className="w-full h-10 bg-white border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-emerald-500 font-mono"
                                        value={paymentForm.cardNumber}
                                        onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <input
                                        required
                                        placeholder="MM"
                                        maxLength="2"
                                        className="w-full h-10 bg-white border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-emerald-500 text-center"
                                        value={paymentForm.expiryMonth}
                                        onChange={(e) => setPaymentForm({...paymentForm, expiryMonth: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <input
                                        required
                                        placeholder="YYYY"
                                        maxLength="4"
                                        className="w-full h-10 bg-white border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-emerald-500 text-center"
                                        value={paymentForm.expiryYear}
                                        onChange={(e) => setPaymentForm({...paymentForm, expiryYear: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-10 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center"
                            >
                                {isLoading ? <FiLoader className="animate-spin" /> : 'Save Card'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    {paymentMethods && paymentMethods.length > 0 ? (
                        paymentMethods.map(pm => (
                            <div key={pm.id} className="relative p-4 border border-gray-100 rounded-2xl hover:border-emerald-200 transition-all cursor-pointer group bg-gray-50/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                            <FiCreditCard className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                                        </div>
                                        <div>
                                            <div className="flex items-center">
                                              <p className="text-sm font-bold text-gray-900 capitalize">{pm.brand}</p>
                                              {pm.isDefault && <span className="ml-2 text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Default</span>}
                                            </div>
                                            <p className="text-xs text-gray-400">•••• {pm.last4}</p>
                                        </div>
                                    </div>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleDeletePayment(pm.id); }}
                                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                                    >
                                      <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                            <FiCreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Cards Saved</p>
                        </div>
                    )}
                </div>
                
                {!showAddPayment && (
                    <button 
                      onClick={() => setShowAddPayment(true)}
                      className="w-full mt-6 py-3.5 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center space-x-2"
                    >
                        <FiPlus />
                        <span>Add New Payment Method</span>
                    </button>
                )}
            </div>


            {/* Account Status Card */}
            <div className="bg-gradient-to-br from-gray-900 to-emerald-950 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FiShield className="w-24 h-24" />
                </div>
                <h3 className="text-lg font-bold mb-4 flex items-center">
                    <FiHeart className="mr-2 text-emerald-400" />
                    Member Benefits
                </h3>
                <div className="space-y-4 relative z-10">
                    <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-emerald-500/20 rounded flex items-center justify-center shrink-0 mt-0.5">
                            <FiCheck className="w-3 h-3 text-emerald-400" />
                        </div>
                        <p className="text-xs text-emerald-100/80 leading-relaxed italic border-l border-emerald-500/30 pl-3">"Priority delivery on all orders over Rs. 5000"</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-emerald-500/20 rounded flex items-center justify-center shrink-0 mt-0.5">
                            <FiCheck className="w-3 h-3 text-emerald-400" />
                        </div>
                        <p className="text-xs text-emerald-100/80 leading-relaxed italic border-l border-emerald-500/30 pl-3">"Access to exclusive pre-launch collections"</p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Status</p>
                        <p className="text-2xl font-black text-white">{user?.role === 'admin' ? 'ROOT' : 'GOLD'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">ID</p>
                        <p className="text-sm font-mono text-white/60">{user?.id?.substring(0, 8)}</p>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileSection;
