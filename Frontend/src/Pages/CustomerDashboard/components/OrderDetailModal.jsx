import React from 'react';
import { 
  FiX, FiPackage, FiTruck, FiCheckCircle, 
  FiClock, FiMapPin, FiCreditCard, FiHash,
  FiShoppingBag, FiInfo, FiCalendar, FiAlertCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const OrderDetailModal = ({ order, isOpen, onClose, onCancel }) => {
  if (!isOpen || !order) return null;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'delivered':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: <FiCheckCircle />, text: 'Order Delivered' };
      case 'processing':
        return { color: 'text-blue-600', bg: 'bg-blue-50', icon: <FiClock />, text: 'Processing Order' };
      case 'shipped':
        return { color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <FiTruck />, text: 'On the Way' };
      case 'cancelled':
        return { color: 'text-red-600', bg: 'bg-red-50', icon: <FiX />, text: 'Order Cancelled' };
      default:
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: <FiPackage />, text: 'Payment Pending' };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl ${statusInfo.bg} ${statusInfo.color}`}>
              {statusInfo.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                Order <span className="ml-2 text-emerald-600">#{order.orderNumber}</span>
              </h2>
              <p className="text-sm text-gray-500 font-medium">{statusInfo.text}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Order Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 italic text-center">
              <FiCalendar className="mx-auto mb-2 text-gray-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Placed On</p>
              <p className="text-sm font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 italic text-center">
              <FiCreditCard className="mx-auto mb-2 text-gray-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Payment</p>
              <p className="text-sm font-bold text-gray-800 capitalize">{order.paymentMethod} - {order.paymentStatus}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 italic text-center">
              <FiShoppingBag className="mx-auto mb-2 text-emerald-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Total Spent</p>
              <p className="text-lg font-black text-emerald-700">Rs. {parseFloat(order.total).toLocaleString()}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
              <FiHash className="mr-2" />
              Order Items
            </h3>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={item.productSnapshot?.image || '/placeholder-product.png'} 
                      alt={item.productSnapshot?.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.productSnapshot?.name}</h4>
                    <p className="text-xs text-gray-500">SKU: {item.productSnapshot?.sku || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">Rs. {parseFloat(item.price).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-black text-emerald-600">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
            {/* Shipping Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center">
                <FiMapPin className="mr-2" />
                Delivery Details
              </h3>
              <div className="bg-gray-50 p-6 rounded-2xl space-y-2">
                <p className="font-bold text-gray-900">{order.shippingAddress?.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{order.shippingAddress?.address}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.zip}</p>
                <p className="text-sm font-medium text-emerald-600 pt-2">{order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-4 text-right">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex justify-end items-center">
                <FiInfo className="mr-2" />
                Pricing Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">Rs. {parseFloat(order.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-900">Rs. {parseFloat(order.shippingCost).toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-500">Discount</span>
                    <span className="font-medium text-emerald-500">-Rs. {parseFloat(order.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-emerald-600">Rs. {parseFloat(order.total).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center text-sm text-gray-500">
            <FiAlertCircle className="mr-2" />
            Order tracked via Al Haneef Logistics
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            {order.status === 'pending' && (
              <button 
                onClick={() => {
                  if(window.confirm('Cancel this order?')) {
                    onCancel(order.id);
                  }
                }}
                className="px-6 py-2.5 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all border border-red-100"
              >
                Cancel Order
              </button>
            )}
            <button 
              onClick={onClose}
              className="px-8 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg"
            >
              Close Details
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailModal;
