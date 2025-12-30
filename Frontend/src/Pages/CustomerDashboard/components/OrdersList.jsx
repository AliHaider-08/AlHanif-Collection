import React, { useState } from 'react';
import { 
  FiSearch, FiPackage, FiEye, FiClock, 
  FiCheckCircle, FiTruck, FiXCircle, FiFilter,
  FiShoppingBag, FiArrowRight, FiChevronRight,
  FiMoreVertical, FiCalendar
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import OrderDetailModal from './OrderDetailModal';
import { orderService } from '../../../utils/orderService';
import toast from 'react-hot-toast';

const OrdersList = ({ orders: propOrders, navigate }) => {
  const [orders, setOrders] = useState(propOrders);
  
  // Sync local state when props change
  React.useEffect(() => {
    setOrders(propOrders);
  }, [propOrders]);

  const [searchTerm, setSearchTerm] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'shipped':
        return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FiCheckCircle />;
      case 'processing': return <FiClock />;
      case 'shipped': return <FiTruck />;
      case 'cancelled': return <FiXCircle />;
      default: return <FiPackage />;
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      toast.success('Order cancelled successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => 
                           (item.productSnapshot?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <motion.div 
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-white rounded-3xl shadow-xl border border-gray-100 space-y-4 lg:space-y-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID or product..."
              className="w-full pl-12 pr-6 h-12 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button 
            className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiFilter className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                statusFilter === status 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-emerald-200 hover:text-emerald-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Orders Grid/List */}
      <motion.div 
        className="grid grid-cols-1 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredOrders.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100"
            variants={itemVariants}
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FiPackage className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 text-center max-w-xs mb-8">
              We couldn't find any orders matching your search or filters.
            </p>
            <button 
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
            >
              Exlpore Shop
            </button>
          </motion.div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div 
              key={order.id}
              variants={itemVariants}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-emerald-100 transition-all group"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between space-y-6 md:space-y-0">
                <div className="flex items-center space-x-6">
                  {/* Order Preview Images */}
                  <div className="flex -space-x-4 overflow-hidden">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg overflow-hidden shrink-0 bg-gray-50">
                        <img 
                          src={item.productSnapshot?.image || '/placeholder-product.png'} 
                          alt="item" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg bg-gray-900 text-white flex items-center justify-center text-xs font-black shrink-0 relative z-10">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded">Order ID</span>
                        <h4 className="font-black text-gray-900">#{order.orderNumber}</h4>
                    </div>
                    <div className="flex items-center text-sm text-gray-400 font-medium">
                        <FiCalendar className="mr-2" />
                        {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
                    <div className="text-left md:text-right">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Grand Total</p>
                        <p className="text-2xl font-black text-gray-900">Rs. {parseFloat(order.total).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                        </div>
                        
                        <button 
                            onClick={() => {
                                setSelectedOrder(order);
                                setIsModalOpen(true);
                            }}
                            className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg group-hover:scale-110"
                        >
                            <FiEye className="w-5 h-5" />
                        </button>
                    </div>
                </div>
              </div>
              
              {/* Order Quick Progress Bar for Shipped/Processing */}
              {['processing', 'shipped'].includes(order.status) && (
                <div className="h-1.5 w-full bg-gray-100">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                        initial={{ width: 0 }}
                        animate={{ width: order.status === 'processing' ? '40%' : '75%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <OrderDetailModal 
            order={selectedOrder} 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCancel={handleCancelOrder}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersList;
