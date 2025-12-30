import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiPlus, FiMinus, FiX, FiArrowLeft } from 'react-icons/fi';
import { cartService } from '../utils/cartService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Import product images
import S1 from '../assets/S1.jpg';
import S2 from '../assets/S2.jpg';
import S3 from '../assets/S3.jpg';
import S4 from '../assets/S4.jpg';
import S5 from '../assets/S5.jpg';
import S6 from '../assets/S6.jpg';
import S7 from '../assets/S7.jpg';
import S8 from '../assets/S8.jpg';

const Cart = ({ colors = { emerald: '#10B981', ivory: '#FFFFF0' } }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], subtotal: 0, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Animation variants
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
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { y: -20, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  useEffect(() => {
    loadCart();
    // Listen for cart updates from other components
    const handleStorageChange = () => {
      loadCart();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      
      // Try API first
      try {
        const cartData = await cartService.getCart();
        setCart(cartData);
        setIsOfflineMode(false);
      } catch (apiError) {
        console.log('API failed, using localStorage:', apiError);
        
        // Fallback to localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const subtotal = localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = localCart.reduce((sum, item) => sum + item.quantity, 0);
        
        setCart({
          items: localCart,
          subtotal,
          totalItems
        });
        setIsOfflineMode(true);
        
        if (localCart.length > 0) {
          toast.success('Cart loaded from local storage');
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      if (isOfflineMode) {
        // Update localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemIndex = localCart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
          localCart[itemIndex].quantity = newQuantity;
          localStorage.setItem('cart', JSON.stringify(localCart));
          
          const subtotal = localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const totalItems = localCart.reduce((sum, item) => sum + item.quantity, 0);
          
          setCart({
            items: localCart,
            subtotal,
            totalItems
          });
          
          // Dispatch event to notify other components
          window.dispatchEvent(new Event('cartUpdated'));
          toast.success('Cart updated');
        }
      } else {
        // Update via API
        const updatedCart = await cartService.updateCartItem(productId, newQuantity);
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error(error.message || 'Failed to update cart');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeFromCart = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      if (isOfflineMode) {
        // Remove from localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = localCart.filter(item => item.id !== productId);
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        const subtotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        
        setCart({
          items: updatedCart,
          subtotal,
          totalItems
        });
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('cartUpdated'));
        toast.success('Item removed from cart');
      } else {
        // Remove via API
        const updatedCart = await cartService.removeFromCart(productId);
        setCart(updatedCart);
        toast.success('Item removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(error.message || 'Failed to remove item');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const clearCart = async () => {
    try {
      if (isOfflineMode) {
        localStorage.removeItem('cart');
        setCart({ items: [], subtotal: 0, totalItems: 0 });
        window.dispatchEvent(new Event('cartUpdated'));
        toast.success('Cart cleared');
      } else {
        await cartService.clearCart();
        setCart({ items: [], subtotal: 0, totalItems: 0 });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getImageSrc = (product) => {
    // Handle both API and local cart formats
    const imageIdentifier = product.image || product.sku || product.id;
    
    const imageMap = {
      'SKU-BURGUNDY-001': S1,
      'SKU-BLACK-002': S2,
      'SKU-BROWN-003': S3,
      'SKU-NAVY-004': S4,
      'SKU-PINK-005': S5,
      'SKU-CREAM-006': S6,
      'SKU-GREEN-007': S7,
      'SKU-MAROON-008': S8,
      'S1.jpg': S1,
      'S2.jpg': S2,
      'S3.jpg': S3,
      'S4.jpg': S4,
      'S5.jpg': S5,
      'S6.jpg': S6,
      'S7.jpg': S7,
      'S8.jpg': S8
    };
    
    return imageMap[imageIdentifier] || S1;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.ivory }}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </motion.div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const isEmpty = cartItems.length === 0;
  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal > 0 ? 50 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <motion.div 
      className="min-h-screen" 
      style={{ backgroundColor: colors.ivory }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center text-gray-600 hover:text-emerald-600 mr-4 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Shop
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          </div>
          
          {isOfflineMode && (
            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Offline Mode
            </div>
          )}
        </motion.div>

        {isEmpty ? (
          <motion.div 
            className="text-center py-16"
            variants={containerVariants}
            initial="hidden"
            animate="animate"
          >
            <motion.div 
              className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FiShoppingCart className="w-12 h-12 text-gray-400" />
            </motion.div>
            <motion.h2 
              className="text-2xl font-semibold text-gray-800 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your cart is empty
            </motion.h2>
            <motion.p 
              className="text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Looks like you haven't added any items to your cart yet.
            </motion.p>
            <motion.button
              onClick={() => navigate('/shop')}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div 
              className="lg:col-span-2"
              variants={containerVariants}
              initial="hidden"
              animate="animate"
            >
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
                  {cartItems.length > 0 && (
                    <motion.button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear Cart
                    </motion.button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id || item.productId}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        variants={itemVariants}
                        custom={index}
                        layout
                      >
                        <motion.div 
                          className="w-20 h-20 overflow-hidden rounded-lg"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img
                            src={getImageSrc(item)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-gray-600 text-sm">SKU: {item.sku || item.productId}</p>
                          <p className="text-lg font-bold text-emerald-600">Rs.{item.price}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => updateQuantity(item.id || item.productId, item.quantity - 1)}
                            disabled={updatingItems.has(item.id || item.productId)}
                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiMinus className="w-4 h-4" />
                          </motion.button>
                          
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          
                          <motion.button
                            onClick={() => updateQuantity(item.id || item.productId, item.quantity + 1)}
                            disabled={updatingItems.has(item.id || item.productId)}
                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiPlus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                          <motion.button
                            onClick={() => removeFromCart(item.id || item.productId)}
                            disabled={updatingItems.has(item.id || item.productId)}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 mt-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiX className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs.{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Rs.{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium">Rs.{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-emerald-600">
                        Rs.{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold mb-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                </motion.button>
                
                <motion.button
                  onClick={() => navigate('/shop')}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;
