import React from 'react';
import { FiShoppingBag, FiDollarSign, FiClock, FiHeart, FiTrendingUp, FiPackage, FiChevronRight, FiAward, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardOverview = ({ user, orders, customerStats, setActiveTab }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const statCardVariants = {
    hidden: { scale: 0.8, y: 30, opacity: 0 },
    animate: { scale: 1, y: 0, opacity: 1, transition: { duration: 0.4, type: 'spring' } },
    hover: { scale: 1.05, y: -5, transition: { duration: 0.2 } }
  };

  const countVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.2 } }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-yellow-600 bg-yellow-100';
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
        return <FiClock className="w-4 h-4" />;
      case 'shipped':
        return <FiTruck className="w-4 h-4" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return <FiPackage className="w-4 h-4" />;
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="animate"
    >
      {/* Welcome Banner */}
      <motion.div 
        className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-xl p-6 text-white"
        variants={itemVariants}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.h2 
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              Welcome back, {user?.firstName}! 👋
            </motion.h2>
            <motion.p 
              className="text-emerald-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              Your premium shopping experience continues
            </motion.p>
          </motion.div>
          <motion.div 
            className="mt-4 md:mt-0 flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <FiAward className="w-5 h-5" />
            </motion.div>
            <span className="font-medium">
              {user?.role === 'admin' ? 'Administrator' : (orders?.length > 5 ? 'Elite Member' : 'Member')}
            </span>

          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all"
          variants={statCardVariants}
          whileHover="hover"
          custom={0}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="bg-emerald-100 p-3 rounded-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <FiShoppingBag className="w-6 h-6 text-emerald-600" />
            </motion.div>
            <motion.span 
              className="text-xs text-emerald-600 font-medium"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              +12%
            </motion.span>
          </div>
          <motion.h3 
            className="text-2xl font-bold text-gray-800"
            variants={countVariants}
            initial="hidden"
            animate="animate"
          >
            {customerStats.totalOrders}
          </motion.h3>
          <p className="text-gray-600 text-sm">Total Orders</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all"
          variants={statCardVariants}
          whileHover="hover"
          custom={1}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="bg-blue-100 p-3 rounded-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <FiDollarSign className="w-6 h-6 text-blue-600" />
            </motion.div>
            <motion.span 
              className="text-xs text-blue-600 font-medium"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              +8%
            </motion.span>
          </div>
          <motion.h3 
            className="text-2xl font-bold text-gray-800"
            variants={countVariants}
            initial="hidden"
            animate="animate"
          >
            Rs. {customerStats.totalSpent.toLocaleString()}
          </motion.h3>
          <p className="text-gray-600 text-sm">Total Spent</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all"
          variants={statCardVariants}
          whileHover="hover"
          custom={2}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="bg-yellow-100 p-3 rounded-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <FiClock className="w-6 h-6 text-yellow-600" />
            </motion.div>
            <motion.span 
              className="text-xs text-yellow-600 font-medium"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              Active
            </motion.span>
          </div>
          <motion.h3 
            className="text-2xl font-bold text-gray-800"
            variants={countVariants}
            initial="hidden"
            animate="animate"
          >
            {customerStats.pendingOrders}
          </motion.h3>
          <p className="text-gray-600 text-sm">Pending Orders</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all"
          variants={statCardVariants}
          whileHover="hover"
          custom={3}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="bg-purple-100 p-3 rounded-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <FiHeart className="w-6 h-6 text-purple-600" />
            </motion.div>
            <motion.span 
              className="text-xs text-purple-600 font-medium"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            >
              New
            </motion.span>
          </div>
          <motion.h3 
            className="text-2xl font-bold text-gray-800"
            variants={countVariants}
            initial="hidden"
            animate="animate"
          >
            {customerStats.wishlistItems}
          </motion.h3>
          <p className="text-gray-600 text-sm">Wishlist Items</p>
        </motion.div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm"
        variants={itemVariants}
      >
        <motion.div 
          className="p-6 border-b border-gray-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <motion.h3 
              className="text-lg font-semibold text-gray-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            >
              Recent Orders
            </motion.h3>
            <motion.button
              onClick={() => setActiveTab('orders')}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center"
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.3 }}
            >
              View All 
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 1.5 }}
              >
                <FiChevronRight className="w-4 h-4 ml-1" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
        <motion.div 
          className="p-6"
          variants={containerVariants}
          initial="hidden"
          animate="animate"
        >
          <div className="space-y-4">
            {orders.slice(0, 3).map((order, index) => (
              <motion.div 
                key={order.id} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                custom={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FiPackage className="w-6 h-6 text-gray-400" />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="font-medium text-gray-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 + index * 0.1, duration: 0.3 }}
                    >
                      {order.orderNumber}
                    </motion.p>
                    <motion.p 
                      className="text-sm text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                    >
                      {new Date(order.createdAt).toLocaleDateString()}
                    </motion.p>
                  </div>
                </div>
                <motion.div 
                  className="text-right"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.3 }}
                >
                  <motion.p 
                    className="font-medium text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 + index * 0.1, duration: 0.3 }}
                  >
                    Rs. {parseFloat(order.total).toLocaleString()}
                  </motion.p>

                  <motion.span 
                    className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusColor(order.status)}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.5 + index * 0.1, duration: 0.3, type: 'spring' }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {getStatusIcon(order.status)}
                    </motion.div>
                    <span className="ml-1 capitalize">{order.status}</span>
                  </motion.span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;
