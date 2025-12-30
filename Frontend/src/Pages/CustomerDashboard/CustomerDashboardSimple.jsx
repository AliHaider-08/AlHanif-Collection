import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiTruck, FiXCircle, FiPackage, FiHome, FiShoppingBag, FiHeart, FiUser, FiSettings, FiMenu, FiX, FiBell, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import DashboardSidebar from './components/DashboardSidebar';
import DashboardHeader from './components/DashboardHeader';

import DashboardOverview from './components/DashboardOverview';
import OrdersList from './components/OrdersList';
import WishlistGrid from './components/WishlistGrid';
import ProfileSection from './components/ProfileSection';
import SettingsPanel from './components/SettingsPanel';

// Import services
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../utils/orderService';
import { wishlistService } from '../../utils/wishlistService';
import { authService } from '../../utils/authService';
import { addressService } from '../../utils/addressService';
import { paymentService } from '../../utils/paymentService';



const CustomerDashboardSimple = ({ colors }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(0);

  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    try {
      const [ordersData, wishlistData, addressesData, paymentsData] = await Promise.all([
        orderService.getUserOrders(),
        wishlistService.getWishlist(),
        addressService.getAddresses(),
        paymentService.getPaymentMethods()
      ]);

      setOrders(ordersData || []);
      setWishlist(wishlistData || []);
      setAddresses(addressesData || []);
      setPaymentMethods(paymentsData || []);
    } catch (error) {


      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate customer stats
  const customerStats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + parseFloat(order.total), 0),
    pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    wishlistItems: wishlist.length,
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
    loyaltyPoints: Math.floor(orders.reduce((sum, order) => sum + parseFloat(order.total), 0) / 100),
    savedAmount: orders.reduce((sum, order) => sum + parseFloat(order.discount || 0), 0)
  };


  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <motion.p 
            className="text-gray-600"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Loading dashboard...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'processing':
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'shipped':
        return <FiTruck className="w-4 h-4" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return <FiPackage className="w-4 h-4" />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview user={user} orders={orders} customerStats={customerStats} setActiveTab={setActiveTab} />;
      case 'orders':
        return <OrdersList orders={orders} navigate={navigate} />;
      case 'wishlist':
        return <WishlistGrid wishlist={wishlist} navigate={navigate} />;
      case 'profile':
        return <ProfileSection user={user} addresses={addresses} paymentMethods={paymentMethods} />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return (
          <motion.div 
            className="bg-white rounded-lg shadow p-6"
            variants={itemVariants}
            initial="initial"
            animate="animate"
          >
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p>Content for {activeTab}</p>
          </motion.div>
        );
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 flex"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <DashboardSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        onLogout={logout}
      />
      
      <div className="lg:pl-64 flex flex-col flex-1">
        <DashboardHeader user={user} notifications={notifications} orders={orders} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default CustomerDashboardSimple;

