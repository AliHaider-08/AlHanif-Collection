import React from 'react';
import { FiHome, FiBell, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardHeader = ({ user, notifications, orders }) => {

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-gray-200"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <motion.div 
          className="flex items-center justify-between"
          variants={itemVariants}
        >
          <motion.div 
            className="flex items-center space-x-4"
            variants={itemVariants}
          >
            <motion.h1 
              className="text-xl font-semibold text-gray-900"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Customer Dashboard
            </motion.h1>
            <motion.div 
              className="hidden md:flex items-center space-x-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
              >
                <FiHome className="w-4 h-4" />
              </motion.div>
              <span>/</span>
              <span>Dashboard</span>
            </motion.div>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-4"
            variants={itemVariants}
          >
            <motion.button 
              className="relative p-2 text-gray-600 hover:text-gray-900"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiBell className="w-5 h-5" />
              <AnimatePresence>
                {notifications > 0 && (
                  <motion.span 
                    className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
              >
                <FiUser className="w-4 h-4 text-emerald-600" />
              </motion.div>
              <motion.div 
                className="hidden md:block"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <motion.p 
                  className="text-sm font-medium text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.2 }}
                >
                  {user?.firstName}
                </motion.p>
                <motion.p 
                  className="text-xs text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.2 }}
                >
                  {user?.role === 'admin' ? 'Administrator' : (orders?.length > 5 ? 'Elite Member' : 'Member')}
                </motion.p>

              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
