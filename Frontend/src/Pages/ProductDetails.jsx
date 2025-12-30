import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield, FiRotateCcw, FiChevronLeft, FiChevronRight, FiZoomIn, FiShare2, FiMinus, FiPlus } from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [selectedColor, setSelectedColor] = useState('Classic');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Product data - in a real app, this would come from an API
  const productDatabase = {
    'featured-1': {
      id: 'featured-1',
      name: 'Royal Heritage Chadar',
      price: 5999,
      originalPrice: 7999,
      images: [
        'https://images.unsplash.com/photo-1594753327229-744ed7f2d748?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584515979916-21ad5bb07252?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Exquisite handcrafted chadar featuring traditional Kashmiri embroidery. This premium piece showcases the finest craftsmanship with intricate patterns passed down through generations.',
      features: [
        '100% Premium Wool Blend',
        'Hand-embroidered Kashmiri patterns',
        'Traditional craftsmanship',
        'Premium quality fabric',
        'Elegant design for special occasions'
      ],
      specifications: {
        material: 'Premium Wool Blend',
        dimensions: '200cm x 100cm',
        weight: '0.5 kg',
        care: 'Dry clean only',
        origin: 'Handcrafted in Kashmir',
        sku: 'CHADAR-ROYAL-001'
      },
      sizes: ['Standard', 'Large', 'Extra Large'],
      colors: ['Classic', 'Ivory', 'Navy', 'Burgundy'],
      rating: 4.9,
      reviews: 127,
      badge: 'Best Seller',
      inStock: true,
      category: "Men's Chadar"
    },
    'new-1': {
      id: 'new-1',
      name: 'Winter Elegance Shawl',
      price: 4499,
      originalPrice: 5999,
      images: [
        'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584515979916-21ad5bb07252?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1594753327229-744ed7f2d748?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Elegant winter shawl designed for modern fashion while maintaining traditional charm. Perfect for cold weather with superior warmth and style.',
      features: [
        'Winter-special fabric',
        'Modern elegant design',
        'Superior warmth',
        'Lightweight yet cozy',
        'Versatile styling options'
      ],
      specifications: {
        material: 'Winter Blend Wool',
        dimensions: '180cm x 90cm',
        weight: '0.4 kg',
        care: 'Dry clean recommended',
        origin: 'Crafted in Lahore',
        sku: 'SHAWL-WINTER-002'
      },
      sizes: ['Standard', 'Large'],
      colors: ['Classic', 'Ivory', 'Gray'],
      rating: 4.7,
      reviews: 89,
      badge: 'New Arrival',
      inStock: true,
      category: "Women's Shawl"
    }
  };

  useEffect(() => {
    // Simulate loading product data
    setTimeout(() => {
      const foundProduct = productDatabase[id] || {
        id: id,
        name: 'Premium Chadar Collection',
        price: 3999,
        originalPrice: 4999,
        images: [
          'https://images.unsplash.com/photo-1578915351283-e353a9552fd0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Premium quality chadar with traditional design and modern appeal.',
        features: [
          'High-quality fabric',
          'Traditional patterns',
          'Modern styling',
          'Comfortable wear'
        ],
        specifications: {
          material: 'Premium Wool',
          dimensions: '200cm x 100cm',
          weight: '0.5 kg',
          care: 'Dry clean only',
          origin: 'Pakistan',
          sku: `CHADAR-${id}`
        },
        sizes: ['Standard', 'Large'],
        colors: ['Classic', 'Ivory'],
        rating: 4.8,
        reviews: 45,
        badge: 'Premium',
        inStock: true,
        category: 'Premium Collection'
      };
      
      setProduct(foundProduct);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity,
      size: selectedSize,
      color: selectedColor,
      totalPrice: product.price * quantity
    };
    
    // Store in localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    localStorage.setItem('cart', JSON.stringify([...existingCart, cartItem]));
    
    // Navigate to checkout
    navigate('/checkout', { state: { item: cartItem } });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} from Al Hanif Collection!`,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-emerald-600 transition-colors">Home</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate('/shop')} className="hover:text-emerald-600 transition-colors">Shop</button>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <button
                onClick={() => setShowZoomModal(true)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              {product.badge && (
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-emerald-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-gray-600">{product.rating} ({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-emerald-600">Rs. {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Product Options */}
            <div className="space-y-4">
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="flex space-x-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-emerald-400 transition-colors"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-emerald-400 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FiShoppingCart className="mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleWishlist}
                className="p-3 border border-gray-300 rounded-xl hover:border-emerald-400 transition-colors"
              >
                <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-red-500' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 border border-gray-300 rounded-xl hover:border-emerald-400 transition-colors"
              >
                <FiShare2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <FiTruck className="w-5 h-5 text-emerald-600" />
                <span className="text-sm">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <FiShield className="w-5 h-5 text-emerald-600" />
                <span className="text-sm">Quality Guaranteed</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <FiRotateCcw className="w-5 h-5 text-emerald-600" />
                <span className="text-sm">7-Day Return</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <FiHeart className="w-5 h-5 text-emerald-600" />
                <span className="text-sm">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['description', 'features', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  This exquisite piece represents the pinnacle of traditional craftsmanship combined with modern design sensibilities. 
                  Each chadar is carefully crafted by skilled artisans who have inherited their techniques through generations.
                </p>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="grid md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-gray-900">{product.rating}</div>
                    <div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{product.reviews} reviews</p>
                    </div>
                  </div>
                </div>
                
                {/* Sample Reviews */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">Ahmed Khan</p>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">Absolutely stunning quality! The embroidery is exquisite and the fabric feels premium.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoomModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowZoomModal(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
            >
              <FiChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
            >
              <FiChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
