import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiX, FiPlus, FiMinus, FiCreditCard, FiArrowLeft, FiXCircle, FiEdit2, FiPackage, FiTruck, FiShield, FiCheck } from 'react-icons/fi';
import { orderService } from '../utils/orderService';
import { cartService } from '../utils/cartService';
import { userAuth } from '../utils/userAuth';

const Checkout = ({ colors }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [billData, setBillData] = useState(null);
  
  // Product variations
  const productSizes = ['Small', 'Standard', 'Large', 'XL'];
  const productColors = ['Classic', 'Black', 'Navy', 'Burgundy', 'Forest Green'];
  
  // Load cart from backend and check for bill data from Home page
  useEffect(() => {
    loadCart();
    
    // Check if coming from Home page with bill data
    if (location.state?.billData) {
      setBillData(location.state.billData);
    }
    
    // Check if coming from Home page with individual item
    if (location.state?.item) {
      const newItem = location.state.item;
      setCart([newItem]);
    }
  }, [location.state]);

  const loadCart = async () => {
    try {
      const cartData = await cartService.getCart();
      setCart(cartData.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      // Fallback to localStorage for demo purposes
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(savedCart);
    }
  };
  
  // Dynamic E-commerce Functions
  
  // Update cart item quantity
  const updateCartItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    
    // Update localStorage
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    
    // Update localStorage
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Edit item variations
  const openEditModal = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  // Save edited item
  const saveEditedItem = (newSize, newColor, newQuantity) => {
    if (!editingItem) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              size: newSize, 
              color: newColor, 
              quantity: newQuantity,
              sku: `SHAWL-${item.baseId || item.id}-${newSize.substring(0,3).toUpperCase()}`
            } 
          : item
      )
    );
    
    // Update localStorage
    const updatedCart = cart.map(item => 
      item.id === editingItem.id 
        ? { 
            ...item, 
            size: newSize, 
            color: newColor, 
            quantity: newQuantity,
            sku: `SHAWL-${item.baseId || item.id}-${newSize.substring(0,3).toUpperCase()}`
          } 
        : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    setShowEditModal(false);
    setEditingItem(null);
  };

  // Calculate totals with tax and shipping
  const calculateTotals = () => {
    const subtotal = parseFloat(cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2));
    const tax = subtotal * 0.05; // 5% tax
    const shipping = cart.length > 0 ? 5.99 : 0;
    const total = subtotal + tax + shipping;
    
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };
  
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'bank_transfer',
    transactionId: '',
    paymentProof: null
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'paymentProof') {
      setFormData(prev => ({
        ...prev,
        paymentProof: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Shipping info validation
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.zip) newErrors.zip = 'ZIP code is required';
    
    // Payment validation
    if (!formData.transactionId) newErrors.transactionId = 'Transaction ID is required';
    if (!formData.paymentProof) newErrors.paymentProof = 'Payment proof is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const totals = calculateTotals();
      
      // Create order data for backend
      const orderData = {
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip
        },
        paymentMethod: formData.paymentMethod,
        notes: `Transaction ID: ${formData.transactionId}`
      };
      
      // Create order in backend
      const createdOrder = await orderService.createOrder(orderData);
      
      // Clear cart on successful order
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
        // Fallback to localStorage
        localStorage.removeItem('cart');
      }
      
      // Store order details for success page
      const finalBillData = {
        billId: createdOrder.orderNumber,
        date: createdOrder.createdAt,
        customerInfo: orderData.shippingAddress,
        items: cart,
        pricing: {
          subtotal: totals.subtotal,
          tax: totals.tax,
          shipping: totals.shipping,
          total: totals.total
        },
        paymentInfo: {
          method: formData.paymentMethod,
          transactionId: formData.transactionId,
          status: createdOrder.paymentStatus
        },
        orderInfo: {
          orderNumber: createdOrder.orderNumber,
          estimatedDelivery: '3-5 business days',
          trackingNumber: createdOrder.trackingNumber
        }
      };
      
      setBillData(finalBillData);
      setCheckoutStep(2);
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error(error.message || 'There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeOrder = () => {
    // Navigate back to shop with success message
    navigate('/shop?order=success');
  };

  const handleBackToShop = () => {
    navigate('/shop');
  };

  if (checkoutStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-teal-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-emerald-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-teal-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 animate-fade-in-up">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4">
                <svg className="w-10 h-10 text-white animate-check-mark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h2>
              <p className="text-emerald-100">Thank you for choosing Al Hanif Collection</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Order Details */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Order Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-semibold text-gray-900">{billData?.orderInfo?.orderNumber || `ORD-${Date.now()}`}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-600">Bill ID:</span>
                    <span className="font-semibold text-gray-900">{billData?.billId || `BILL-${Date.now()}`}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-semibold text-emerald-600">{billData?.orderInfo?.estimatedDelivery || '3-5 business days'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold text-gray-900">{billData?.paymentInfo?.method || 'Bank Transfer'}</span>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 animate-pulse">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">What's Next?</h4>
                <p className="text-gray-600 mb-4">Your order has been confirmed and will be delivered soon. You'll receive an email confirmation shortly.</p>
                
                {/* Timeline */}
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-600 rounded-full mr-2"></div>
                    <span className="text-gray-700">Order Confirmed</span>
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-gray-500">Processing</span>
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-gray-500">Delivered</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={completeOrder}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Continue Shopping
                </button>
                <button
                  onClick={handleBackToShop}
                  className="bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Shop
                </button>
              </div>
            </div>
          </div>

          {/* Floating Decorations */}
          <div className="absolute top-10 right-10 text-emerald-600 opacity-10 text-6xl animate-float">✨</div>
          <div className="absolute bottom-10 left-10 text-teal-600 opacity-10 text-4xl animate-float-delay">🎉</div>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes check-mark {
            0% {
              stroke-dasharray: 0 100;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 100 100;
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dasharray: 100 100;
              stroke-dashoffset: 100;
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes float-delay {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }

          .animate-check-mark {
            animation: check-mark 0.8s ease-out 0.3s both;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-float-delay {
            animation: float-delay 3s ease-in-out infinite 1s;
          }
        `}</style>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToShop}
              className="flex items-center text-gray-600 hover:text-emerald-600 transition-all duration-200 group"
            >
              <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Shop</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <FiShoppingCart className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-600">Cart ({getCartItemCount()} items)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="text-sm font-medium text-gray-900">Cart</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 rounded-full max-w-20"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm font-medium text-gray-900">Checkout</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 rounded-full max-w-20"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm text-gray-500">Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-600">Complete your order with our secure payment system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FiPackage className="mr-2" />
                  Shopping Cart ({getCartItemCount()} items)
                </h2>
              </div>
              
              <div className="p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <button
                      onClick={handleBackToShop}
                      className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={item.id} className="group hover:shadow-md transition-all duration-200 border border-gray-200 rounded-xl p-4 hover:border-emerald-300">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{item.name}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">SKU: {item.sku}</span>
                              <span className="text-sm text-gray-500">Size: {item.size}</span>
                              <span className="text-sm text-gray-500">Color: {item.color}</span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-2xl font-bold text-emerald-600">Rs. {item.price.toLocaleString()}</p>
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-emerald-300 transition-colors"
                                >
                                  <FiMinus className="w-4 h-4 mx-auto" />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-emerald-300 transition-colors"
                                >
                                  <FiPlus className="w-4 h-4 mx-auto" />
                                </button>
                                <button 
                                  onClick={() => openEditModal(item)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit item"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove item"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FiTruck className="mr-2" />
                  Shipping Information
                </h2>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="John Doe"
                        required
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="john@example.com"
                        required
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="+92 300 1234567"
                        required
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">ZIP Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="54000"
                        required
                      />
                      {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Delivery Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="123 Main Street, Block A"
                      required
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="Karachi"
                      required
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  {/* Payment Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiShield className="mr-2 text-emerald-600" />
                      Payment Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Payment Method</label>
                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        >
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="cash_on_delivery">Cash on Delivery</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Transaction ID</label>
                        <input
                          type="text"
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          placeholder="TRX123456789"
                          required
                        />
                        {errors.transactionId && <p className="text-red-500 text-sm mt-1">{errors.transactionId}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Payment Proof (Optional)</label>
                        <div className="relative">
                          <input
                            type="file"
                            name="paymentProof"
                            ref={fileInputRef}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            accept="image/*"
                          />
                        </div>
                        {errors.paymentProof && <p className="text-red-500 text-sm mt-1">{errors.paymentProof}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting || cart.length === 0}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Order...
                        </span>
                      ) : (
                        'Place Order • Rs. ' + parseFloat(totals.total).toLocaleString()
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">Rs. {parseFloat(totals.subtotal).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax (5%)</span>
                      <span className="font-medium">Rs. {parseFloat(totals.tax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Rs. {parseFloat(totals.shipping).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-emerald-600">Rs. {parseFloat(totals.total).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {billData && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order #:</span>
                          <span className="font-medium">{billData.orderInfo?.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bill ID:</span>
                          <span className="font-medium">{billData.billId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Est. Delivery:</span>
                          <span className="font-medium">{billData.orderInfo?.estimatedDelivery}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Why Shop With Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <FiShield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Secure Payment</p>
                      <p className="text-sm text-gray-600">100% secure transactions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <FiTruck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Fast Delivery</p>
                      <p className="text-sm text-gray-600">3-5 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <FiPackage className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Quality Products</p>
                      <p className="text-sm text-gray-600">Premium quality shawls</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit Item Details</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Size</label>
                  <select
                    defaultValue={editingItem.size}
                    id="editSize"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    {productSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                  <select
                    defaultValue={editingItem.color}
                    id="editColor"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    {productColors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    defaultValue={editingItem.quantity}
                    id="editQuantity"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    const newSize = document.getElementById('editSize').value;
                    const newColor = document.getElementById('editColor').value;
                    const newQuantity = parseInt(document.getElementById('editQuantity').value);
                    saveEditedItem(newSize, newColor, newQuantity);
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
