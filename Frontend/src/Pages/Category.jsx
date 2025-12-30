import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const Category = ({ colors }) => {
  const categories = [
    {
      id: 1,
      title: "Men's Collection",
      subtitle: "Premium Chadar",
      description: "Discover our exclusive collection of handcrafted men's chadar, blending traditional Pakistani craftsmanship with modern elegance.",
      image: "https://images.unsplash.com/photo-1598032895390-cb8f1a4e3b58?auto=format&fit=crop&w=1200&q=80",
      link: "/shop?category=men",
      badge: "Best Seller",
      features: ["Premium Wool", "Traditional Designs", "Perfect Fit"]
    },
    {
      id: 2,
      title: "Women's Collection", 
      subtitle: "Elegant Shawls",
      description: "Explore our stunning range of women's shawls featuring intricate embroidery and luxurious fabrics for the modern woman.",
      image: "https://images.unsplash.com/photo-1600181952931-1e46c12dbe5f?auto=format&fit=crop&w=1200&q=80",
      link: "/shop?category=women",
      badge: "New Arrival",
      features: ["Hand Embroidered", "Luxury Fabrics", "Timeless Style"]
    }
  ];

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#009F6B] to-[#00D084] py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Our Collections
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the timeless elegance of traditional Pakistani craftsmanship
          </motion.p>
          <div className="w-32 h-1 bg-white/80 mx-auto mt-8 rounded-full"></div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
                {/* Image Container */}
                <div className="relative h-[400px] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-6 left-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      category.badge === 'Best Seller' 
                        ? 'bg-[#D4AF37] text-white' 
                        : 'bg-[#009F6B] text-white'
                    }`}>
                      {category.badge}
                    </span>
                  </div>
                  
                  {/* Gold Accent Border on Hover */}
                  <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#D4AF37]/30 transition-all duration-500 rounded-3xl"></div>
                </div>

                {/* Content */}
                <div className="p-10">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{category.title}</h2>
                    <p className="text-lg text-[#009F6B] font-semibold mb-4">{category.subtitle}</p>
                    <p className="text-gray-600 leading-relaxed">{category.description}</p>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-3">
                      {category.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 px-4 py-2 bg-[#009F6B]/10 rounded-full"
                        >
                          <FiCheck className="w-4 h-4 text-[#009F6B]" />
                          <span className="text-sm font-medium text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={category.link}
                    className="group/btn inline-flex items-center bg-[#009F6B] hover:bg-[#007A52] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span>Shop Collection</span>
                    <FiArrowRight className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;