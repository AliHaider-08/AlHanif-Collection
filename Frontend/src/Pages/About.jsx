import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaAward, FaShippingFast, FaHeadset, FaGem, FaCrown, FaHandshake, FaStar, FaGlobe, FaMobile, FaBox, FaTruck, FaShieldAlt, FaClock, FaUsers, FaShoppingBag } from 'react-icons/fa';
import { GiClothes, GiWorld } from 'react-icons/gi';
import { BsShieldCheck, BsClockHistory, BsCreditCard, BsTruck } from 'react-icons/bs';

const About = ({ colors }) => {
  // Auto Text Generator for Header
  const headerTexts = [
    "Pakistan's Premier Heritage Fashion Destination",
    "Authentic Pakistani Shawls & Chadars Since 2010",
    "Traditional Craftsmanship Meets Modern E-commerce",
    "Global Gateway to Pakistani Heritage Fashion",
    "Your Trusted Source for Premium Pakistani Textiles"
  ];
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  
  useEffect(() => {
    const currentFullText = headerTexts[currentTextIndex];
    
    const typingTimeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing effect
        if (charIndex < currentFullText.length) {
          setDisplayText(currentFullText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Pause before deleting
          setTimeout(() => {
            setIsDeleting(true);
          }, 2000);
        }
      } else {
        // Deleting effect
        if (charIndex > 0) {
          setDisplayText(currentFullText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % headerTexts.length);
        }
      }
    }, isDeleting ? 30 : 100); // Faster deleting, slower typing
    
    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, currentTextIndex, headerTexts]);
  
  // Cursor blink effect
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);
  const teamMembers = [
    {
      name: 'Ahmed Ali Haider',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      bio: 'Leading our digital transformation with 15+ years of e-commerce expertise and a passion for bringing Pakistani heritage online.'
    },
    {
      name: 'Fatima Al-Haneef',
      role: 'Digital Marketing Director',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      bio: 'Driving our online presence and connecting global customers with authentic Pakistani craftsmanship through digital innovation.'
    },
    {
      name: 'Omar Hassan',
      role: 'Head of E-commerce Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      bio: 'Ensuring seamless online shopping experience from order placement to doorstep delivery across 25+ countries.'
    }
  ];

  const milestones = [
    { year: '2010', title: 'Digital Launch', description: 'Started as Pakistan\'s first online heritage textile store' },
    { year: '2015', title: 'Mobile App', description: 'Launched iOS and Android apps for global accessibility' },
    { year: '2018', title: 'Global Expansion', description: 'Expanded to 25+ countries with international shipping' },
    { year: '2024', title: 'AI Platform', description: 'Introduced AI-powered personalization and virtual try-on' }
  ];

  const onlineFeatures = [
    {
      icon: <FaGlobe className="h-8 w-8 text-[#009F6B]" />,
      title: 'Global Reach',
      description: 'Shipping to 25+ countries worldwide with express delivery options and real-time tracking.'
    },
    {
      icon: <FaMobile className="h-8 w-8 text-[#009F6B]" />,
      title: 'Mobile First',
      description: 'Optimized shopping experience on all devices with dedicated iOS and Android apps.'
    },
    {
      icon: <BsCreditCard className="h-8 w-8 text-[#009F6B]" />,
      title: 'Secure Payments',
      description: 'Multiple payment options including PayPal, credit cards, and local payment methods.'
    },
    {
      icon: <FaBox className="h-8 w-8 text-[#009F6B]" />,
      title: 'Smart Packaging',
      description: 'Eco-friendly packaging with unboxing experience designed for social media sharing.'
    }
  ];

  const onlineStats = [
    { number: '25+', label: 'Countries', description: 'Global shipping network' },
    { number: '99.2%', label: 'Satisfaction', description: 'Customer satisfaction rate' },
    { number: '24/7', label: 'Support', description: 'Round-the-clock assistance' },
    { number: '48H', label: 'Delivery', description: 'Express shipping option' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-br from-[#009F6B] to-[#007A52] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center relative z-10">
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block">Al Haneef</span>
              <span className="block text-[#D4AF37]">Collection</span>
            </motion.h1>
            <motion.div 
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 min-h-[2.5rem]"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="inline-block">
                {displayText}
                <motion.span 
                  className="inline-block w-1 h-6 bg-[#D4AF37] ml-1"
                  animate={{ opacity: showCursor ? 1 : 0 }}
                  transition={{ duration: 0.1 }}
                />
              </span>
            </motion.div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-4 text-white/90">
                <FaGlobe className="text-2xl" />
                <span className="font-medium">Shipping to 25+ Countries</span>
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <FaMobile className="text-2xl" />
                <span className="font-medium">Mobile App Available</span>
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <FaTruck className="text-2xl" />
                <span className="font-medium">48H Express Delivery</span>
              </div>
            </motion.div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <a
                href="/shop"
                className="px-8 py-4 bg-[#D4AF37] text-[#009F6B] font-bold rounded-lg hover:bg-[#B8941F] transition-all duration-300 transform hover:scale-105"
              >
                Shop Online Now
              </a>
              <a
                href="/contact"
                className="px-8 py-4 bg-transparent text-white border-2 border-white font-bold rounded-lg hover:bg-white hover:text-[#009F6B] transition-all duration-300 transform hover:scale-105"
              >
                Download App
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Online Journey Section */}
      <motion.section 
        className="py-20 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 
                className="text-4xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Our <span className="text-[#009F6B]">Digital Journey</span>
              </motion.h2>
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-lg text-gray-700 leading-relaxed">
                  Al Haneef Collection pioneered Pakistan's online heritage fashion market in 2010, 
                  transforming from a local textile business into a global e-commerce powerhouse. 
                  We revolutionized how Pakistani fashion reaches the world.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Today, we're Pakistan's most trusted online destination for authentic heritage fashion, 
                  serving customers across 25+ countries with cutting-edge technology, AI-powered recommendations, 
                  and a seamless mobile shopping experience that brings traditional craftsmanship to your fingertips.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#009F6B]">14+</div>
                    <div className="text-sm text-gray-600">Years Online</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#009F6B]">25+</div>
                    <div className="text-sm text-gray-600">Countries Served</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#009F6B]">1M+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#009F6B]">4.9★</div>
                    <div className="text-sm text-gray-600">App Rating</div>
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=500&fit=crop"
                alt="E-commerce online shopping experience"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#D4AF37] text-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <FaAward className="text-3xl" />
                  <div>
                    <div className="font-bold">Best E-commerce</div>
                    <div className="text-sm">Fashion Platform 2023</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Online Features Section */}
      <motion.section 
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Shop <span className="text-[#009F6B]">Online With Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of Pakistani fashion shopping with our cutting-edge online platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {onlineFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-[#009F6B]/10 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Online Stats Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-[#009F6B] to-[#007A52] relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Our <span className="text-[#D4AF37]">Online Impact</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Numbers that speak for our commitment to excellence in online fashion retail
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {onlineStats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-bold text-[#D4AF37] mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-white/80">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Digital Timeline Section */}
      <motion.section 
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#009F6B]">Digital Evolution</span>
            </h2>
            <p className="text-xl text-gray-600">From Pakistan's first online heritage store to a global e-commerce leader</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#009F6B]/20"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-1/2"></div>
                  <div className="relative flex items-center justify-center w-12 h-12 bg-[#009F6B] rounded-full border-4 border-white shadow-lg">
                    <span className="text-white font-bold">{milestone.year.slice(-2)}</span>
                  </div>
                  <div className="w-1/2 px-8">
                    <div className="bg-gray-50 p-6 rounded-xl shadow-lg">
                      <div className="text-2xl font-bold text-[#009F6B] mb-2">{milestone.year}</div>
                      <div className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</div>
                      <div className="text-gray-600">{milestone.description}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Digital Team Section */}
      <motion.section 
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#009F6B]">Digital Leadership</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The e-commerce experts driving Al Haneef Collection's online success and global expansion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <img
                  className="w-full h-64 object-cover"
                  src={member.image}
                  alt={member.name}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-[#009F6B] font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-[#009F6B] to-[#007A52] relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Start Your <span className="text-[#D4AF37]">Online Shopping</span> Journey
          </motion.h2>
          <motion.p 
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join millions of satisfied customers worldwide and experience the convenience of authentic Pakistani fashion at your fingertips
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <a
              href="/shop"
              className="px-8 py-4 bg-[#D4AF37] text-[#009F6B] font-bold rounded-lg hover:bg-[#B8941F] transition-all duration-300 transform hover:scale-105"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="px-8 py-4 bg-transparent text-white border-2 border-white font-bold rounded-lg hover:bg-white hover:text-[#009F6B] transition-all duration-300 transform hover:scale-105"
            >
              Download App
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
