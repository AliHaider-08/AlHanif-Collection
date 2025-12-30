import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSearch, FiChevronDown, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import Logoo from '../assets/Logoo.png';

// Reusable NavLink component with click and hover animations
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    setIsClicked(true);
    // Reset animation after it completes
    setTimeout(() => setIsClicked(false), 500);
  };
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={to}
        onClick={handleClick}
        className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative overflow-hidden ${
          isActive ? 'text-matte-gold' : 'text-warm-beige hover:text-matte-gold'
        }`}
      >
        <span className={`relative z-10 inline-block ${isClicked ? 'animate-bounce' : ''}`}>
          {children}
        </span>
        {/* Click effect */}
        {isClicked && (
          <span 
            className="absolute inset-0 bg-matte-gold/20 rounded-md"
            style={{
              animation: 'clickEffect 0.5s ease-out forwards',
            }}
          />
        )}
      </Link>
      {/* Animated bottom border */}
      <div className="relative h-0.5 mt-1 overflow-hidden">
        <div 
          className={`absolute bottom-0 left-0 h-full bg-matte-gold transition-all duration-300 ${
            isActive ? 'w-full' : isHovered ? 'w-full' : 'w-0'
          }`}
          style={{
            transform: isActive || isHovered ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease, width 0.3s ease',
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

// Mobile NavLink with click animation and hover effect
const MobileNavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e) => {
    setIsClicked(true);
    if (onClick) onClick(e);
    // Reset animation after it completes
    setTimeout(() => setIsClicked(false), 500);
  };
  
  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={to}
        onClick={handleClick}
        className={`block px-4 py-3 mx-2 rounded-md text-base font-medium transition-all duration-300 transform ${
          isActive 
            ? 'bg-matte-gold/10 text-matte-gold' 
            : 'text-warm-beige hover:bg-matte-gold/5 hover:text-matte-gold'
        } ${isClicked ? 'animate-pulse' : ''} relative`}
      >
        <span className="relative z-10 flex items-center">
          {children}
          {/* Animated indicator for active/hover state */}
          <span 
            className={`absolute bottom-0 left-0 h-0.5 bg-matte-gold transition-all duration-300 ${
              isActive || isHovered ? 'w-full' : 'w-0'
            }`}
            style={{
              transform: isActive || isHovered ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left center',
            }}
          />
        </span>
        {/* Click effect */}
        {isClicked && (
          <span 
            className="absolute inset-0 bg-matte-gold/20 rounded-md"
            style={{
              animation: 'mobileClickEffect 0.5s ease-out forwards',
            }}
          />
        )}
      </Link>
    </div>
  );
};

const Navbar = ({ colors }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const location = useLocation();
  
  // Load cart from localStorage and listen for updates
  useEffect(() => {
    const loadCart = () => {
      try {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(localCart);
        updateCartStats(localCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
        updateCartStats([]);
      }
    };

    // Initial load
    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
      if (isCartOpen && !event.target.closest('.cart-dropdown')) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen, isCartOpen]);

  const updateCartStats = (items) => {
    const count = items.reduce((total, item) => total + (item.quantity || 0), 0);
    const total = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    setCartCount(count);
    setCartTotal(total);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(id);
      return;
    }
    
    const updatedItems = cartItems.map(item =>
      (item.id || item.productId) === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    updateCartStats(updatedItems);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter(item => (item.id || item.productId) !== id);
    setCartItems(updatedItems);
    updateCartStats(updatedItems);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getImageSrc = (item) => {
    // Handle different image formats from localStorage
    const imageIdentifier = item.image || item.sku || item.id;
    
    // For demo, return placeholder if no proper image
    if (imageIdentifier && imageIdentifier.startsWith('http')) {
      return imageIdentifier;
    }
    
    // Return placeholder for demo items
    return 'https://images.unsplash.com/photo-1578632292375-2cf464ed0944?w=80&h=80&fit=crop';
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav
      style={{
        position: 'relative',
        width: '100%',
        zIndex: 50,
        transition: 'all 0.3s',
        padding: scrolled ? '0.5rem 0' : '0.75rem 0',
        backgroundColor: colors.emerald,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-colors duration-200 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="h-6 w-6 transform transition-transform duration-200 hover:rotate-90" />
              ) : (
                <FiMenu className="h-6 w-6 transform transition-transform duration-200 hover:scale-110" />
              )}
            </button>
            
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 flex items-center h-16 w-auto"
            >
              <div className="relative group">
              <img
                className="h-16 w-auto object-contain transform transition-transform duration-300 group-hover:scale-105"
                src={Logoo}
                alt="Al Hanif Collection Logo"
                style={{
                  maxHeight: '80px',
                  maxWidth: '250px',
                  width: 'auto',
                  height: 'auto'
                }}
              />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent group-hover:bg-matte-gold transition-all duration-300"></div>
            </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <div className="relative group">
              <NavLink to="/Category">
                Category
                <FiChevronDown className="inline-block ml-1 transition-transform duration-200 group-hover:translate-y-0.5" />
              </NavLink>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                <Link to="/shop?category=men" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">Men's Collection</Link>
                <Link to="/shop?category=women" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">Women's Collection</Link>
              </div>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              className="relative p-2 rounded-full text-warm-beige hover:text-matte-gold transition-all duration-200 group"
              aria-label="Search"
            >
              <FiSearch className="h-5 w-5" />
              <span className="absolute inset-0 bg-matte-gold/0 rounded-full transform scale-90 group-hover:scale-100 group-hover:bg-matte-gold/10 transition-all duration-200"></span>
            </button>
            <div className="relative group cart-dropdown">
              <button 
                className="p-2 rounded-full text-warm-beige hover:text-matte-gold transition-all duration-200"
                aria-label="Cart"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <FiShoppingCart className="h-5 w-5" />
                <span className="absolute top-0 right-0 bg-matte-gold text-jet-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  {cartCount}
                </span>
              </button>
              
              {/* Cart Dropdown */}
              <div className={`absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 transition-all duration-200 ${
                isCartOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
              }`}>
                <div className="p-4 max-h-96 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping Cart</h3>
                  
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <FiShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Your cart is empty</p>
                      <Link 
                        to="/shop" 
                        className="inline-block px-4 py-2 bg-matte-gold text-jet-black rounded-md hover:bg-opacity-90 transition-colors"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-4">
                        {cartItems.map((item) => (
                          <div key={item.id || item.productId} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                            <img
                              src={getImageSrc(item)}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                              <p className="text-sm text-gray-600">Rs.{item.price}</p>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.id || item.productId, (item.quantity || 1) - 1)}
                                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                >
                                  <FiMinus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-medium w-8 text-center">{item.quantity || 1}</span>
                                <button
                                  onClick={() => updateQuantity(item.id || item.productId, (item.quantity || 1) + 1)}
                                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                >
                                  <FiPlus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id || item.productId)}
                                  className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors ml-auto"
                                >
                                  <FiTrash2 className="w-3 h-3 text-red-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Cart Summary */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold text-gray-900">Total:</span>
                          <span className="text-lg font-bold text-emerald-600">Rs.{cartTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <Link
                            to="/cart"
                            className="block w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                            onClick={() => setIsCartOpen(false)}
                          >
                            View Cart
                          </Link>
                          <Link
                            to="/checkout"
                            className="block w-full text-center px-4 py-2 bg-matte-gold text-jet-black rounded-md hover:bg-opacity-90 transition-colors"
                            onClick={() => setIsCartOpen(false)}
                          >
                            Checkout
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="relative group profile-dropdown">
              <button
                className="p-2 rounded-full text-warm-beige hover:text-matte-gold transition-all duration-200"
                aria-label="Account"
              >
                <FiUser className="h-5 w-5" />
              </button>
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Sign Up
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link
                  to="/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  My Account
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  My Orders
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-yellow-500 focus:outline-none"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-4 space-y-1 bg-jet-black border-t border-matte-gold/20">
          <MobileNavLink to="/">Home</MobileNavLink>
          <MobileNavLink to="/shop">Shop</MobileNavLink>
          <MobileNavLink to="/about">About</MobileNavLink>
          <MobileNavLink to="/contact">Contact</MobileNavLink>
          <div className="px-3 py-2">
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2 border border-matte-gold/30 rounded-md shadow-sm text-sm font-medium text-matte-gold hover:bg-matte-gold/10 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;