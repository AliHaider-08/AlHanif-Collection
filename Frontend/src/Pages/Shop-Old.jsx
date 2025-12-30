import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import Checkout from './Checkout';
import { productService } from '../utils/productService';
import toast from 'react-hot-toast';

// Import S1-S14 images from assets
import S1 from '../assets/S1.jpg';
import S2 from '../assets/S2.jpg';
import S3 from '../assets/S3.jpg';
import S4 from '../assets/S4.jpg';
import S5 from '../assets/S5.jpg';
import S6 from '../assets/S6.jpg';
import S7 from '../assets/S7.jpg';
import S8 from '../assets/S8.jpg';
import S9 from '../assets/S9.jpg';
import S10 from '../assets/S10.png';
import S11 from '../assets/S11.webp';
import S12 from '../assets/S12.jpg';
import S13 from '../assets/S13.jpg';
import S14 from '../assets/S14.jpg';

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [cart, setCart] = useState([]);

  // Load products from backend
  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      const response = await productService.getProducts(filters);
      setProducts(response.products || []);
      setError(null);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Reload products when filters change
  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchTerm]);

  const men = [
    {
      id: 1,
      name: 'Men\'s Burgundy Embroidered Chadar',
      price: 3500,
      image: S1,
      category: 'men',
      description: 'Rich burgundy with intricate gold thread work'
    },
    {
      id: 2,
      name: 'Men\'s Classic Black Shawl',
      price: 3999,
      image: S2,
      category: 'men',
      description: 'Timeless black with subtle geometric patterns'
    },
    {
      id: 3,
      name: 'Men\'s Brown Heritage Chadar',
      price: 4500,
      image: S3,
      category: 'men',
      description: 'Traditional brown with Kashmiri embroidery'
    },
    {
      id: 4,
      name: 'Men\'s Navy Blue Premium Shawl',
      price: 5500,
      image: S4,
      category: 'men',
      description: 'Deep navy blue with elegant border design'
    },
    {
      id: 5,
      name: 'Men\'s Cream Traditional Chadar',
      price: 3200,
      image: S5,
      category: 'men',
      description: 'Pure cream with delicate floral patterns'
    },
    {
      id: 6,
      name: 'Men\'s Gray Wool Shawl',
      price: 4800,
      image: S6,
      category: 'men',
      description: 'Sophisticated gray with modern minimalist design'
    },
    {
      id: 7,
      name: 'Men\'s Forest Green Designer Chadar',
      price: 6200,
      image: S7,
      category: 'men',
      description: 'Luxurious forest green with gold accents'
    },
    {
      id: 8,
      name: 'Men\'s Beige Everyday Shawl',
      price: 2800,
      image: S8,
      category: 'men',
      description: 'Light beige perfect for daily wear'
    }
  ];

  const women = [
    {
      id: 9,
      name: 'Women\'s Ruby Red Premium Chadar',
      price: 5200,
      image: S9,
      category: 'women',
      description: 'Vibrant ruby red with exquisite hand embroidery'
    },
    {
      id: 10,
      name: 'Women\'s Rose Pink Classic Shawl',
      price: 4500,
      image: S10,
      category: 'women',
      description: 'Soft rose pink with delicate lace trim'
    },
    {
      id: 11,
      name: 'Women\'s Royal Purple Designer Chadar',
      price: 5800,
      image: S11,
      category: 'women',
      description: 'Regal purple with intricate silver work'
    },
    {
      id: 12,
      name: 'Women\'s Ivory White Luxury Shawl',
      price: 6500,
      image: S12,
      category: 'women',
      description: 'Pure ivory with pearl white embroidery'
    },
    {
      id: 13,
      name: 'Women\'s Olive Green Elegant Chadar',
      price: 4900,
      image: S13,
      category: 'women',
      description: 'Earthy olive green with traditional motifs'
    },
    {
      id: 14,
      name: 'Women\'s Multi-Color Traditional Shawl',
      price: 5500,
      image: S14,
      category: 'women',
      description: 'Vibrant multi-color with tribal patterns'
    },
    {
      id: 15,
      name: 'Women\'s Maroon Fashion Chadar',
      price: 4200,
      image: S1,
      category: 'women',
      description: 'Deep maroon with contemporary design'
    },
    {
      id: 16,
      name: 'Women\'s Black Casual Shawl',
      price: 2500,
      image: S2,
      category: 'women',
      description: 'Simple black with subtle elegance'
    }
  ]
};

const Shop = ({ colors = { emerald: '#10B981', ivory: '#FFFFF0' } }) => {
  // Product Card Component - Updated to match Home page design
  const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
    const [processingButtons, setProcessingButtons] = useState(new Set());
    const [wishlist, setWishlist] = useState([]);

    const toggleWishlist = (productId) => {
      setWishlist(prev => 
        prev.includes(productId) 
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      );
    };

    const handleShopNow = async (product) => {
      const buttonId = `shop-${product.id}`;
      setProcessingButtons(prev => new Set(prev).add(buttonId));
      
      try {
        // Create product item for checkout
        const productItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: 1,
          size: 'Standard',
          color: 'Classic',
          sku: `SHAWL-${product.id}-STA`,
          description: `Premium quality ${product.name.toLowerCase()} from Al Hanif Collection`,
          weight: '0.5 kg',
          dimensions: '200cm x 100cm',
          material: 'Premium Wool Blend'
        };

        // Create bill data
        const billData = {
          billId: `BILL-${Date.now()}`,
          date: new Date().toISOString(),
          customerInfo: {
            name: 'Guest User',
            email: 'guest@example.com',
            phone: '+1234567890',
            address: '123 Main Street, City, Country'
          },
          items: [productItem],
          pricing: {
            subtotal: productItem.price,
            tax: productItem.price * 0.05,
            shipping: 599,
            total: productItem.price + (productItem.price * 0.05) + 599
          },
          paymentInfo: {
            method: 'Bank Transfer',
            status: 'Pending'
          },
          orderInfo: {
            orderNumber: `ORD-${Date.now()}`,
            estimatedDelivery: '3-5 business days',
            trackingNumber: null
          }
        };
        
        // Store in localStorage
        localStorage.setItem('currentBill', JSON.stringify(billData));
        localStorage.setItem('cart', JSON.stringify([productItem]));
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Navigate to checkout
        navigate('/checkout', { 
          state: { 
            item: productItem,
            billData: billData,
            fromShop: true,
            category: product.name
          } 
        });
      } catch (error) {
        console.error('Error processing shop now:', error);
      } finally {
        setProcessingButtons(prev => {
          const newSet = new Set(prev);
          newSet.delete(buttonId);
          return newSet;
        });
      }
    };

    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-56 w-full object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <svg 
              className={`w-5 h-5 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
          <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-emerald-600">
            New Collection
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 italic">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Starting from</span>
            <span className="text-2xl font-bold text-emerald-600">Rs. {product.price.toLocaleString()}</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleShopNow(product);
              }}
              disabled={processingButtons.has(`shop-${product.id}`)}
              className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {processingButtons.has(`shop-${product.id}`) ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Shop Now'
              )}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(product);
              }}
              className="p-2 border border-gray-300 rounded-full hover:border-emerald-400 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [orderComplete, setOrderComplete] = useState(false);
  
  // URL parameter handling for category filtering
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  
  // Update selected category when URL params change
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    // Open the checkout page when an item is added to cart
    handleCheckout();
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }
    // Navigate to the checkout page
    navigate('/checkout');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (formData) => {
    try {
      setIsSubmitting(true);
      
      // Prepare order data
      const orderData = new FormData();
      
      // Add customer info
      orderData.append('name', formData.get('name'));
      orderData.append('email', formData.get('email'));
      orderData.append('phone', formData.get('phone'));
      orderData.append('address', formData.get('address'));
      orderData.append('city', formData.get('city'));
      orderData.append('zip', formData.get('zip'));
      orderData.append('transactionId', formData.get('transactionId'));
      orderData.append('paymentMethod', formData.get('paymentMethod') || 'bank_transfer');
      
      // Add cart items
      cart.forEach((item, index) => {
        orderData.append(`items[${index}][id]`, item.id);
        orderData.append(`items[${index}][name]`, item.name);
        orderData.append(`items[${index}][price]`, item.price);
        orderData.append(`items[${index}][quantity]`, item.quantity);
      });
      
      // Add payment proof if exists
      const paymentProof = formData.get('paymentProof');
      if (paymentProof) {
        orderData.append('paymentProof', paymentProof);
      }
      
      // In a real app, you would send this to your backend
      console.log('Submitting order:', {
        customer: {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          address: formData.get('address'),
          city: formData.get('city'),
          zip: formData.get('zip')
        },
        transactionId: formData.get('transactionId'),
        paymentMethod: formData.get('paymentMethod'),
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: getCartTotal()
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If successful, move to success step
      setCheckoutStep(2);
      
      // Clear cart and show success message
      setCart([]);
      setCheckoutStep(3); // Show order complete
    } catch (error) {
      console.error('Error submitting order:', error);
      // Show error message to user
      alert('There was an error processing your order. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
    return true;
  };

  const completeOrder = () => {
    // Clear the cart
    setCart([]);
    
    // Reset checkout state
    setIsCheckingOut(false);
    setCheckoutStep(1);
    
    // Reset form data
    setFormData({
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
    
    // Close any open modals
    setIsCartOpen(false);
    
    // Show success message
    alert('Thank you for your order! Your order has been placed successfully.');
  };

  const addToWishlist = (product) => {
    setWishlist([...wishlist, product]);
    // In a real app, you would update the wishlist in your state management
    console.log('Added to wishlist:', product);
  };

  const filterProducts = (products) => {
    let filtered = products;
    
    // Apply category filter if a specific category is selected
    if (selectedCategory !== 'all') {
      filtered = products.filter(product => product.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery)
      );
    }
    
    return filtered;
  };

  const filteredMenProducts = filterProducts(products.men);
  const filteredWomenProducts = filterProducts(products.women);
  
  // Determine which products to show based on selected category
  const showMenSection = selectedCategory === 'all' || selectedCategory === 'men';
  const showWomenSection = selectedCategory === 'all' || selectedCategory === 'women';

  // Cart Sidebar Component
  const CartSidebar = () => (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        ></div>
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                  <button
                    type="button"
                    className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-8">
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Your cart is empty</p>
                  ) : (
                    <div className="flow-root">
                      <ul className="-my-6 divide-y divide-gray-200">
                        {cart.map((item) => (
                          <li key={`${item.id}-${item.size}`} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-center object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center border rounded-md">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                  >
                                    <FiMinus size={14} />
                                  </button>
                                  <span className="px-2">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                  >
                                    <FiPlus size={14} />
                                  </button>
                                </div>

                                <div className="flex">
                                  <button
                                    type="button"
                                    className="font-medium text-emerald-600 hover:text-emerald-500"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${getCartTotal()}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    style={{
                      backgroundColor: cart.length === 0 ? '#9CA3AF' : colors.emerald,
                      '&:hover': {
                        backgroundColor: cart.length === 0 ? '#9CA3AF' : `${colors.emerald}CC`
                      }
                    }}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    Checkout
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="text-emerald-600 font-medium hover:text-emerald-500"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 relative" style={{ backgroundColor: colors.ivory }}>
      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed top-4 right-4 z-40 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Open cart"
      >
        <div className="relative">
          <FiShoppingCart className="h-6 w-6 text-gray-700" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {getCartItemCount()}
            </span>
          )}
        </div>
      </button>

      {/* Category Indicator */}
      {selectedCategory !== 'all' && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Showing:</span>
                <span className="text-sm font-semibold text-emerald-600 capitalize">
                  {selectedCategory === 'men' ? "Men's Collection" : "Women's Collection"}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  window.history.pushState({}, '', '/shop');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                View All Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && <CartSidebar />}

      {/* Checkout Component */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50">
          <Checkout 
            cart={cart}
            getCartTotal={getCartTotal}
            getCartItemCount={getCartItemCount}
            handleSubmitOrder={handleSubmitOrder}
            completeOrder={completeOrder}
            isCheckingOut={isCheckingOut}
            setIsCheckingOut={setIsCheckingOut}
          />
        </div>
      )}
      {/* Advanced Search Bar */}
      <div className="max-w-4xl mx-auto mb-12 px-4">
        <div className="relative group">
          {/* Search Input Container */}
          <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 focus-within:border-emerald-400 focus-within:shadow-emerald-100">
            {/* Search Icon */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
              <FiSearch className="text-emerald-600 text-xl group-hover:scale-110 transition-transform duration-200" />
            </div>
            
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search for premium shawls, chadars, collections..."
              className="w-full px-14 py-4 pr-32 text-gray-800 placeholder-gray-500 bg-transparent outline-none text-lg font-medium"
              value={searchQuery}
              onChange={handleSearch}
            />
            
            {/* Search Button */}
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2">
              <span>Search</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          
          {/* Search Suggestions Dropdown */}
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10 animate-fade-in">
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-3">Popular Searches</div>
                <div className="flex flex-wrap gap-2">
                  {['Premium Shawls', 'Classic Chadar', 'Designer Collection', 'Winter Special'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Quick Filters */}
        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Quick filters:</span>
            {['All', 'Men', 'Women', 'Premium', 'New'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  if (filter === 'All') setSearchQuery('');
                  else setSearchQuery(filter.toLowerCase());
                }}
                className={`px-3 py-1 rounded-full font-medium transition-all duration-200 ${
                  searchQuery === filter.toLowerCase() || (filter === 'All' && !searchQuery)
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Men's Section */}
      {showMenSection && (
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Men's Collection</h2>
          {filteredMenProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMenProducts.map(product => (
                <ProductCard 
                  key={`men-${product.id}`} 
                  product={product}
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No men's products found matching your search.</p>
          )}
        </div>
      )}

      {/* Women's Section */}
      {showWomenSection && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Women's Collection</h2>
          {filteredWomenProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWomenProducts.map(product => (
                <ProductCard 
                  key={`women-${product.id}`} 
                  product={product}
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No women's products found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );

  // Custom CSS for animations
  const customStyles = `
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
  `;

  // Inject styles into document head
  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = customStyles;
    if (!document.head.querySelector('style[data-shop-animations]')) {
      styleSheet.setAttribute('data-shop-animations', 'true');
      document.head.appendChild(styleSheet);
    }
  }
};

export default Shop;
