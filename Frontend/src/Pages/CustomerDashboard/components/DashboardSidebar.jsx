import React from 'react';
import { FiTrendingUp, FiShoppingBag, FiHeart, FiUser, FiSettings, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardSidebar = ({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, onLogout }) => {
  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: FiTrendingUp },
    { id: 'orders', name: 'My Orders', icon: FiShoppingBag },
    { id: 'wishlist', name: 'Wishlist', icon: FiHeart },
    { id: 'profile', name: 'Profile', icon: FiUser },
    { id: 'settings', name: 'Settings', icon: FiSettings }
  ];


  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  const menuItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.3, ease: 'easeOut' }
    })
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.div 
        className="lg:hidden fixed top-4 left-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="lg:hidden fixed inset-0 z-40 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50" 
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              className="relative flex flex-col w-64 bg-white"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div 
                className="p-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold text-emerald-600">Al Hanif</h1>
              </motion.div>
              <nav className="flex-1 px-4">
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      custom={index}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        animate={{ rotate: activeTab === item.id ? 360 : 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <item.icon className="w-5 h-5" />
                      </motion.div>
                      <span>{item.name}</span>
                    </motion.button>
                  ))}
                </div>
              </nav>
              <div className="p-4 border-t border-gray-100">
                <motion.button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  variants={menuItemVariants}
                  custom={menuItems.length}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div 
        className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <motion.div 
            className="flex items-center flex-shrink-0 px-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-emerald-600">Al Hanif</h1>
          </motion.div>
          <nav className="mt-8 flex-1 px-4 space-y-2">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                custom={index}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ rotate: activeTab === item.id ? 360 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <span>{item.name}</span>
              </motion.button>
            ))}
          </nav>
          <div className="px-4 mt-auto pt-4 border-t border-gray-100">
            <motion.button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              variants={menuItemVariants}
              custom={menuItems.length}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};


export default DashboardSidebar;
