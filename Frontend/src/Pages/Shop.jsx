import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Checkout from './Checkout';
import { productService } from '../utils/productService';
import { cartService } from '../utils/cartService';
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

const Shop = ({ colors = { emerald: '#10B981', ivory: '#FFFFF0' } }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  console.log('Shop component mounted with colors:', colors);

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
      setProducts(response.data?.products || []);
      setError(null);
    } catch (error) {
      console.error('Error loading products:', error);
      // Use mock data as fallback
      const mockProducts = [
        { id: 1, name: 'Burgundy Shawl', price: 2500, description: 'Elegant burgundy shawl', category: 'shawls', sku: 'SKU-BURGUNDY-001', isFeatured: true, rating: 4.5 },
        { id: 2, name: 'Black Chadar', price: 3000, description: 'Classic black chadar', category: 'chadars', sku: 'SKU-BLACK-002', isFeatured: false, rating: 4.8 },
        { id: 3, name: 'Brown Stole', price: 1800, description: 'Warm brown stole', category: 'stoles', sku: 'SKU-BROWN-003', isFeatured: true, rating: 4.3 },
        { id: 4, name: 'Navy Shawl', price: 2200, description: 'Deep navy blue shawl', category: 'shawls', sku: 'SKU-NAVY-004', isFeatured: false, rating: 4.6 },
        { id: 5, name: 'Pink Chadar', price: 2800, description: 'Beautiful pink chadar', category: 'chadars', sku: 'SKU-PINK-005', isFeatured: true, rating: 4.7 },
        { id: 6, name: 'Cream Stole', price: 1500, description: 'Light cream stole', category: 'stoles', sku: 'SKU-CREAM-006', isFeatured: false, rating: 4.4 },
        { id: 7, name: 'Green Shawl', price: 2600, description: 'Forest green shawl', category: 'shawls', sku: 'SKU-GREEN-007', isFeatured: true, rating: 4.5 },
        { id: 8, name: 'Maroon Chadar', price: 3200, description: 'Rich maroon chadar', category: 'chadars', sku: 'SKU-MAROON-008', isFeatured: false, rating: 4.9 }
      ];
      
      setProducts(mockProducts);
      setError(null);
      toast.success('Using demo products (offline mode)');
    } finally {
      setLoading(false);
    }
  };

  // Reload products when filters change
  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchTerm]);

  // Product Card Component
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

    const addToCart = async (product) => {
      setProcessingButtons(prev => new Set(prev).add(product.id));
      
      try {
        // Try API first
        await cartService.addToCart(product.id, 1);
        toast.success(`${product.name} added to cart!`);
        // Dispatch event to notify Cart page
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (error) {
        console.error('API Error, using local cart:', error);
        // Fallback to local cart
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = localCart.find(item => item.id === product.id);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          localCart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(localCart));
        toast.success(`${product.name} added to cart (local)!`);
        // Dispatch event to notify Navbar and Cart page
        window.dispatchEvent(new Event('cartUpdated'));
      } finally {
        setProcessingButtons(prev => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
      }
    };

    // Map product images from backend to local assets
    const getImageSrc = (product) => {
      const imageMap = {
        'SKU-BURGUNDY-001': S1,
        'SKU-BLACK-002': S2,
        'SKU-BROWN-003': S3,
        'SKU-NAVY-004': S4,
        'SKU-PINK-005': S5,
        'SKU-CREAM-006': S6,
        'SKU-GREEN-007': S7,
        'SKU-MAROON-008': S8
      };
      
      return imageMap[product.sku] || S1;
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
      >
        <div className="relative overflow-hidden">
          <img
            src={getImageSrc(product)}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
              wishlist.includes(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <FiHeart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
          </button>
          {product.isFeatured && (
            <span className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-emerald-600">Rs.{product.price}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">Rs.{product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
            </div>
          </div>
          
          <button
            onClick={() => addToCart(product)}
            disabled={processingButtons.has(product.id)}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              processingButtons.has(product.id)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105'
            }`}
          >
            {processingButtons.has(product.id) ? (
              <>
                <FiX className="w-4 h-4" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <FiShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  // Filter products based on category
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Debug logs
  console.log('Shop component state:', {
    loading,
    error,
    productsLength: products.length,
    filteredProductsLength: filteredProducts.length,
    selectedCategory,
    categories,
    sampleProduct: products[0],
    allProducts: products
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.ivory }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.ivory }}>
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={loadProducts}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.ivory }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            Our Collection
          </motion.h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our exquisite range of traditional and contemporary shawls, chadars, and stoles
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(product) => setCart(prev => [...prev, { ...product, quantity: 1 }])}
                onAddToWishlist={(productId) => console.log('Added to wishlist:', productId)}
              />
            ))}
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <Checkout
            cart={cart}
            onClose={() => setShowCheckout(false)}
            colors={colors}
          />
        )}
      </div>
    </div>
  );
};

export default Shop;
