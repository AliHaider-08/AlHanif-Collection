import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Slider from "../components/Slider";
import { FiShoppingBag, FiHeart, FiStar, FiTruck, FiShield, FiAward, FiTrendingUp, FiClock, FiUsers, FiMail, FiPhone, FiMapPin, FiChevronRight, FiPlay } from 'react-icons/fi';

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

const Home = () => {
  const navigate = useNavigate();
  
  // Create image map for S1-S14
  const collectionImages = {
    S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14
  };
  
  // Local design images from public folder - using public paths
  const sliderImages = [
    "/Design1.png",
    "/Design2.png", 
    "/Design3.png",
    "/Design4.png"
  ];

  // Slider text content matching website colors
  const sliderTexts = [
    {
      title: "Premium Kashmiri Collection",
      subtitle: "Handcrafted with Love",
      description: "Discover our exquisite range of traditional Pakistani shawls",
      color: "#10B981", // emerald green
      buttonColor: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      title: "Luxury Winter Special",
      subtitle: "Stay Warm in Style",
      description: "Elegant chadars perfect for the winter season",
      color: "#D4AF37", // gold
      buttonColor: "bg-yellow-600 hover:bg-yellow-700"
    },
    {
      title: "Heritage Masterpieces",
      subtitle: "Timeless Elegance",
      description: "Traditional designs passed down through generations",
      color: "#10B981", // emerald green
      buttonColor: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      title: "Exclusive Bridal Collection",
      subtitle: "For Your Special Day",
      description: "Luxurious shawls designed for memorable occasions",
      color: "#D4AF37", // gold
      buttonColor: "bg-yellow-600 hover:bg-yellow-700"
    }
  ];
  
  // State management for interactive features
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [processingButtons, setProcessingButtons] = useState(new Set()); // Track individual buttons
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Advanced brand features state
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    years: 0,
    satisfaction: 0
  });
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  
  // Ensure the component re-renders on mount to fix any potential hydration issues
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Test if images are loading
    console.log('Testing image imports:', {
      S1, S2, S3, S4, S5, S6, S7, S8, S9
    });
    
    // Initialize brand data
    initializeBrandData();
    
    // Animate stats on mount
    animateStats();
    
    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(testimonialInterval);
  }, []);

  // Initialize brand-specific data
  const initializeBrandData = () => {
    // Featured Product
    setFeaturedProduct({
      id: 'featured-1',
      name: 'Ruby Red Premium Chadar',
      price: 5999,
      image: S9,
      description: 'Vibrant ruby red with exquisite hand embroidery',
      badge: 'Best Seller',
      rating: 4.9,
      reviews: 127
    });

    // Customer Testimonials
    setTestimonials([
      {
        id: 1,
        name: 'Fatima Khan',
        location: 'Karachi',
        text: 'Absolutely love the quality and craftsmanship! The chadar exceeded my expectations.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: 2,
        name: 'Ayesha Malik',
        location: 'Lahore',
        text: 'Beautiful designs and premium quality. Al Hanif Collection is my go-to for special occasions.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: 3,
        name: 'Sara Ahmed',
        location: 'Islamabad',
        text: 'The customer service is exceptional and the products are authentic. Highly recommended!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
      }
    ]);

    // New Arrivals
    setNewArrivals([
      {
        id: 'new-1',
        name: 'Burgundy Embroidered Chadar',
        price: 4499,
        image: S1,
        description: 'Rich burgundy with intricate gold thread work',
        isNew: true
      },
      {
        id: 'new-2',
        name: 'Classic Black Shawl',
        price: 5299,
        image: S2,
        description: 'Timeless black with subtle geometric patterns',
        isNew: true
      },
      {
        id: 'new-3',
        name: 'Brown Heritage Chadar',
        price: 5999,
        image: S3,
        description: 'Traditional brown with Kashmiri embroidery',
        isNew: true
      },
      {
        id: 'new-4',
        name: 'Navy Blue Premium Shawl',
        price: 6999,
        image: S4,
        description: 'Deep navy blue with elegant border design',
        isNew: true
      }
    ]);

    // Best Sellers
    setBestSellers([
      {
        id: 'bs-1',
        name: 'Cream Traditional Chadar',
        price: 3799,
        image: S5,
        description: 'Pure cream with delicate floral patterns',
        sold: 234,
        rating: 4.8
      },
      {
        id: 'bs-2',
        name: 'Gray Wool Shawl',
        price: 4599,
        image: S6,
        description: 'Sophisticated gray with modern minimalist design',
        sold: 189,
        rating: 4.9
      },
      {
        id: 'bs-3',
        name: 'Forest Green Designer Chadar',
        price: 6299,
        image: S7,
        description: 'Luxurious forest green with gold accents',
        sold: 156,
        rating: 4.7
      },
      {
        id: 'bs-4',
        name: 'Beige Everyday Shawl',
        price: 2999,
        image: S8,
        description: 'Light beige perfect for daily wear',
        sold: 298,
        rating: 4.6
      }
    ]);
  };

  // Animate statistics
  const animateStats = () => {
    const targetStats = { customers: 15000, products: 500, years: 25, satisfaction: 98 };
    const duration = 2000;
    const steps = 60;
    const increment = {
      customers: targetStats.customers / steps,
      products: targetStats.products / steps,
      years: targetStats.years / steps,
      satisfaction: targetStats.satisfaction / steps
    };

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setStats({
        customers: Math.floor(increment.customers * currentStep),
        products: Math.floor(increment.products * currentStep),
        years: Math.floor(increment.years * currentStep),
        satisfaction: Math.floor(increment.satisfaction * currentStep)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(targetStats);
      }
    }, duration / steps);
  };

  // Handle product quick view
  const handleQuickView = (product) => {
    navigate(`/product/${product.id}`);
  };

  // Handle video modal
  const handleVideoPlay = () => {
    setShowVideoModal(true);
  };

  // Handle testimonial navigation
  const handleTestimonialChange = (direction) => {
    if (direction === 'next') {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    } else {
      setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  // Handle wishlist toggle
  const toggleWishlist = (categoryId) => {
    setWishlist(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    // Navigate to shop page with category filter
    navigate(`/shop?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  // Handle Shop Now button click - Navigate to Checkout
  const handleShopNow = async (category) => {
    const buttonId = `shop-${category.id}`;
    console.log('Shop Now clicked for:', category.name);
    
    // Add this button to processing state
    setProcessingButtons(prev => new Set(prev).add(buttonId));
    
    try {
      console.log('Starting checkout process...');
      
      // Create product item for checkout
      const productItem = {
        id: category.id,
        name: `${category.name} - Premium Collection`,
        price: 2999, // PKR Rupees
        image: category.image,
        category: category.name,
        quantity: 1,
        size: 'Standard',
        color: 'Classic',
        sku: `SHAWL-${category.id}-STA`,
        description: `Premium quality ${category.name.toLowerCase()} from Al Hanif Collection`,
        weight: '0.5 kg',
        dimensions: '200cm x 100cm',
        material: 'Premium Wool Blend'
      };
      
      console.log('Product item created:', productItem);

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
          tax: productItem.price * 0.05, // 5% tax
          shipping: 5.99, // Fixed shipping
          total: productItem.price + (productItem.price * 0.05) + 5.99
        },
        paymentInfo: {
          method: 'Credit Card',
          status: 'Pending'
        },
        orderInfo: {
          orderNumber: `ORD-${Date.now()}`,
          estimatedDelivery: '3-5 business days',
          trackingNumber: null
        }
      };
      
      console.log('Bill data created:', billData);
      
      // Store in localStorage for checkout page
      localStorage.setItem('currentBill', JSON.stringify(billData));
      localStorage.setItem('cart', JSON.stringify([productItem]));
      
      console.log('Data stored in localStorage');
      
      // Simulate processing time for better UX
      console.log('Simulating processing delay...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success message
      setSuccessMessage(`${category.name} added to cart!`);
      setShowSuccessMessage(true);
      
      console.log('Navigating to checkout...');
      
      // Navigate immediately after showing message
      try {
        navigate('/checkout', { 
          state: { 
            item: productItem,
            billData: billData,
            fromHome: true,
            category: category.name
          } 
        });
        
        // Fallback: force navigation if state doesn't work
        setTimeout(() => {
          if (window.location.pathname !== '/checkout') {
            window.location.href = '/checkout';
          }
        }, 100);
      } catch (navError) {
        console.error('Navigation error:', navError);
        // Fallback to direct navigation
        window.location.href = '/checkout';
      }
      
      console.log('Navigation completed');
    } catch (error) {
      console.error('Error processing shop now:', error);
      setSuccessMessage('Error processing request. Please try again.');
      setShowSuccessMessage(true);
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } finally {
      // Remove this button from processing state
      setProcessingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(buttonId);
        return newSet;
      });
      console.log('Processing completed for:', category.name);
    }
  };

  // Handle Shop Sale button
  const handleShopSale = () => {
    navigate('/shop?sale=true');
  };

  const categories = [
    {
      id: 1,
      name: "Men's Chadar",
      image:
        S1,
    },
    {
      id: 2,
      name: "Women's Chadar",
      image:
        S2,
    },
    {
      id: 3,
      name: "Premium Shawls",
      image:
        S3,
    },
    {
      id: 4,
      name: "Seasonal Collection",
      image:
        S4,
    },
    {
      id: 5,
      name: "Pashmina Shawls",
      image:
        S5,
    },
    {
      id: 6,
      name: "Silk Shawls",
      image:
      S6,
    },
    {
      id: 7,
      name: "Woolen Shawls",
      image:
        S7,
    },
    {
      id: 8,
      name: "Designer Shawls",
      image:
        S8,
    },
    {
      id: 9,
      name: "Embroidered Shawls",
      image:
        S9,
    }
  ];

  // Removed slides array as we're using the Slider component now

  if (!isMounted) {
    return <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }

  return (
    <div className="w-full">
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Hero Slider - Full Width */}
      <div className="w-full">
        {isMounted && <Slider images={sliderImages} texts={sliderTexts} interval={12000} />}
      </div>
      
      {/* Brand Statistics */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl font-bold mb-2">{stats.customers.toLocaleString()}+</div>
              <div className="text-emerald-100">Happy Customers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-4xl font-bold mb-2">{stats.products}+</div>
              <div className="text-emerald-100">Premium Designs</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl font-bold mb-2">{stats.years}+</div>
              <div className="text-emerald-100">Years of Excellence</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-4xl font-bold mb-2">{stats.satisfaction}%</div>
              <div className="text-emerald-100">Customer Satisfaction</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Product Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Product</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our most exquisite piece this season</p>
        </div>
        
        {featuredProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <img 
                  src={featuredProduct.image} 
                  alt={featuredProduct.name} 
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    console.error('Featured Product image failed to load:', featuredProduct.name, featuredProduct.image);
                    e.target.src = 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&h=400&q=80';
                  }}
                />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {featuredProduct.badge}
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <FiHeart className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">{featuredProduct.name}</h3>
                <p className="text-gray-600 mb-6">{featuredProduct.description}</p>
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`w-5 h-5 ${i < Math.floor(featuredProduct.rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">{featuredProduct.rating} ({featuredProduct.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-3xl font-bold text-emerald-600">Rs. {featuredProduct.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleShopNow({ id: featuredProduct.id, name: featuredProduct.name, image: featuredProduct.image })}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center"
                  >
                    <FiShoppingBag className="mr-2" />
                    Shop Now
                  </button>
                  <button
                    onClick={() => handleQuickView(featuredProduct)}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:border-emerald-400 transition-colors"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* New Arrivals & Best Sellers */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* New Arrivals */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FiTrendingUp className="mr-2 text-emerald-600" />
                New Arrivals
              </h3>
              <div className="space-y-4">
                {newArrivals.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleQuickView(product)}
                  >
                    <div className="flex items-center space-x-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('New Arrivals image failed to load:', product.name, product.image);
                          e.target.src = 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=80&h=80&q=80';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        <p className="text-emerald-600 font-bold">Rs. {product.price.toLocaleString()}</p>
                      </div>
                      <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                        NEW
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Best Sellers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FiAward className="mr-2 text-emerald-600" />
                Best Sellers
              </h3>
              <div className="space-y-4">
                {bestSellers.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleQuickView(product)}
                  >
                    <div className="flex items-center space-x-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('Best Sellers image failed to load:', product.name, product.image);
                          e.target.src = 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=80&h=80&q=80';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({product.sold} sold)</span>
                        </div>
                        <p className="text-emerald-600 font-bold">Rs. {product.price.toLocaleString()}</p>
                      </div>
                      <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                        HOT
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Real experiences from our valued customers</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {testimonials[activeTestimonial] && (
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-xl p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].name} className="w-16 h-16 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-gray-600">{testimonials[activeTestimonial].location}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <FiStar key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-lg italic">"{testimonials[activeTestimonial].text}"</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => handleTestimonialChange('prev')}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <FiChevronRight className="w-5 h-5 transform rotate-180" />
            </button>
            <button
              onClick={() => handleTestimonialChange('next')}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Brand Story Video Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Heritage</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover the story behind Al Hanif Collection</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" alt="Our Heritage" className="w-full h-96 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <button
                  onClick={handleVideoPlay}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                >
                  <FiPlay className="w-8 h-8 text-emerald-600 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Original Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore our diverse collection of premium shawls and chadars</p>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div 
            whileHover={{ y: -5 }}
            className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600 mb-3">Finest materials and craftsmanship</p>
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600 mb-3">Quick and reliable shipping</p>
            <div className="text-sm text-emerald-600 font-semibold">2-3 Business Days</div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Customer Care</h3>
            <p className="text-gray-600 mb-3">Dedicated support team</p>
            <div className="text-sm text-emerald-600 font-semibold">24/7 Support</div>
          </motion.div>
        </div>

        {/* Special Offers Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 mb-16 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Limited Time Offer!</h2>
              <p className="text-xl mb-4">Get 20% off on all Premium Shawls</p>
              <div className="flex items-center space-x-4">
                <span className="bg-white text-emerald-600 px-3 py-1 rounded-full font-semibold">CODE: SHAWL20</span>
                <span className="text-sm">Ends in 3 days</span>
              </div>
            </div>
            <button 
              onClick={handleShopSale}
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mt-4 md:mt-0"
            >
              Shop Sale
            </button>
          </div>
        </motion.div>

        {/* Categories Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Shop by Category</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate('/shop')}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:border-emerald-400 transition-colors"
              >
                View All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.id ? 'border-emerald-500 shadow-2xl' : 'border-gray-200 hover:border-emerald-400'
                }`}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-56 w-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(cat.id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <svg 
                      className={`w-5 h-5 ${wishlist.includes(cat.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Starting from</span>
                    <span className="text-2xl font-bold text-emerald-600">Rs. 2,999</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Button clicked directly!');
                        handleShopNow(cat);
                      }}
                      disabled={processingButtons.has(`shop-${cat.id}`)}
                      className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {processingButtons.has(`shop-${cat.id}`) ? (
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
                        console.log('Quick view clicked for:', cat.name);
                        handleQuickView(cat);
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
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Excellent quality shawls and fast delivery. Very satisfied with my purchase!"</p>
              <p className="font-semibold">- Sarah Ahmed</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Beautiful designs and great customer service. Will definitely order again!"</p>
              <p className="font-semibold">- Fatima Khan</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"The best collection of traditional shawls I've found online. Highly recommended!"</p>
              <p className="font-semibold">- Aisha Rahman</p>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6 max-w-2xl mx-auto">Subscribe to our newsletter for exclusive offers, new arrivals, and style tips</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              required
            />
            <button 
              type="submit"
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 text-white bg-white/20 px-4 py-2 rounded-lg inline-block"
            >
              🎉 Thank you for subscribing!
            </motion.div>
          )}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
            <div className="text-gray-600">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
            <div className="text-gray-600">Designs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">4.9★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </motion.div>
      </div>
      
    </div>
  );
};

export default Home;
