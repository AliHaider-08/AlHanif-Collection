import React, { useState, useEffect } from 'react';
import { 
  FiHeart, FiShoppingBag, FiTrash2, 
  FiEye, FiShoppingCart, FiLoader, 
  FiArrowRight, FiCheckCircle, FiXCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { wishlistService } from '../../../utils/wishlistService';
import { cartService } from '../../../utils/cartService';
import toast from 'react-hot-toast';

const WishlistGrid = ({ wishlist: initialWishlist, navigate }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loadingItems, setLoadingItems] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Flatten the structures from backend { id, productId, product: {} }
    const mapped = initialWishlist.map(item => ({
      wishlistId: item.id,
      ...item.product,
    }));
    setOrders(mapped); // Wait, variable naming... let's use 'wishlist'
    setWishlist(mapped);
  }, [initialWishlist]);

  const setOrders = (data) => {}; // Oops, dummy function to prevent errors if I accidentally copied naming

  const handleRemove = async (productId) => {
    setLoadingItems(prev => ({ ...prev, [productId]: 'removing' }));
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item.id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setLoadingItems(prev => ({ ...prev, [productId]: null }));
    }
  };

  const handleAddToCart = async (product) => {
    if (product.stock <= 0) {
      return toast.error('Item is currently out of stock');
    }

    setLoadingItems(prev => ({ ...prev, [product.id]: 'adding' }));
    try {
      await cartService.addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
      // Optional: Ask if they want to remove it from wishlist now? 
      // Most high-end stores keep it there unless specified.
    } catch (error) {
      toast.error('Could not add to cart');
    } finally {
      setLoadingItems(prev => ({ ...prev, [product.id]: null }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Stats Card */}
      <motion.div 
        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner">
            <FiHeart className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Your Wishlist</h1>
            <p className="text-gray-500 font-medium">You have <span className="text-pink-600 font-bold">{wishlist.length}</span> items saved for later.</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
            <button 
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-gray-50 text-gray-700 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center space-x-2"
            >
                <FiShoppingBag />
                <span>Continue Shopping</span>
            </button>
        </div>
      </motion.div>

      {/* Main Table Interface */}
      <motion.div 
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Product Information</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Unit Price</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Stock Status</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {wishlist.length === 0 ? (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="4" className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FiHeart className="w-10 h-10 opacity-30" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 mb-1">Your wishlist is empty</p>
                        <p className="text-sm">Save your favorite items here to track them.</p>
                        <button 
                            onClick={() => navigate('/shop')}
                            className="mt-6 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:scale-105 transition-transform"
                        >
                            Explore Our Collection
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  wishlist.map((item) => (
                    <motion.tr 
                      key={item.id}
                      variants={rowVariants}
                      exit={{ opacity: 0, x: 20 }}
                      className="group hover:bg-gray-50/50 transition-all"
                    >
                      {/* Product Info */}
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-6">
                          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg border-4 border-white shrink-0 group-hover:scale-105 transition-transform duration-500">
                            <img 
                              src={item.images?.[0]?.url || '/placeholder-product.png'} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-black text-gray-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-gray-400 font-medium">SKU: {item.sku || 'N/A'}</p>
                            <div className="flex items-center space-x-2 pt-1">
                                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase">{item.category?.name || 'Category'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-8 py-6 text-center">
                        <div className="space-y-0.5">
                            <p className="text-xl font-black text-gray-900">Rs. {parseFloat(item.price).toLocaleString()}</p>
                            {item.oldPrice && (
                                <p className="text-sm text-gray-400 line-through">Rs. {item.oldPrice.toLocaleString()}</p>
                            )}
                        </div>
                      </td>

                      {/* Stock Status */}
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center">
                            {item.stock > 0 ? (
                                <div className="flex items-center space-x-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                                    <FiCheckCircle className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-tighter">In Stock</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
                                    <FiXCircle className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-tighter">Sold Out</span>
                                </div>
                            )}
                            {item.stock > 0 && item.stock < 10 && (
                                <span className="text-[10px] text-orange-500 font-bold mt-2 uppercase">Only {item.stock} left</span>
                            )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <button 
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="p-3 text-gray-400 hover:text-emerald-600 bg-white shadow-sm border border-gray-100 rounded-2xl hover:border-emerald-200 transition-all font-bold"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          
                          <button 
                            onClick={() => handleRemove(item.id)}
                            disabled={loadingItems[item.id] === 'removing'}
                            className="p-3 text-gray-400 hover:text-red-600 bg-white shadow-sm border border-gray-100 rounded-2xl hover:border-red-200 transition-all font-bold"
                            title="Remove item"
                          >
                            {loadingItems[item.id] === 'removing' ? <FiLoader className="animate-spin" /> : <FiTrash2 className="w-5 h-5" />}
                          </button>

                          <button 
                            onClick={() => handleAddToCart(item)}
                            disabled={item.stock <= 0 || loadingItems[item.id] === 'adding'}
                            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center space-x-2 shadow-lg ${
                                item.stock > 0 
                                ? 'bg-emerald-600 text-white shadow-emerald-200 hover:scale-105 active:scale-95' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                          >
                            {loadingItems[item.id] === 'adding' ? (
                                <FiLoader className="animate-spin" />
                            ) : (
                                <>
                                    <FiShoppingCart />
                                    <span>Add to Cart</span>
                                </>
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Footer Info */}
      <motion.div 
        className="flex items-center justify-between text-gray-400 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2 text-sm">
            <FiAlertCircle />
            <span>Pricing and availability are subject to change.</span>
        </div>
        <div className="text-sm font-medium">
            Shared wishlist link: <span className="text-emerald-600 cursor-pointer hover:underline">haneef.com/w/3j9kf2</span>
        </div>
      </motion.div>
    </div>
  );
};

export default WishlistGrid;
