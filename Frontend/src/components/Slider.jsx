import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Slider = ({ images = [], texts = [], interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (images && images.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [images, interval]);

  // Handle manual slide change
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Get current text data
  const currentText = texts && texts[currentIndex] ? texts[currentIndex] : {
    title: "Al Hanif Collection",
    subtitle: "Premium Quality",
    description: "Discover our premium chadar and shawls",
    color: "#10B981",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700"
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-700 mb-2">No slides available</p>
          <p className="text-sm text-gray-500">Please check the image URLs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gray-900" style={{ height: '500px' }}>
      {/* Main Image Display */}
      <div className="w-full h-full relative">
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            backgroundColor: '#1a1a1a'
          }}
          onError={(e) => {
            console.error(`Failed to load image: ${images[currentIndex]}`);
            // Try a fallback approach
            if (images[currentIndex].startsWith('/')) {
              e.target.src = `.${images[currentIndex]}`;
            }
          }}
          onLoad={() => console.log(`Successfully loaded image: ${images[currentIndex]}`)}
        />
        
        {/* Overlay Text - Left Side */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center">
          <div className="text-white text-left px-8 md:px-16 lg:px-20 max-w-xl">
            <motion.h2 
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ color: currentText.color }}
            >
              {currentText.title}
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl mb-4 drop-shadow-md font-light"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              style={{ color: currentText.color }}
            >
              {currentText.subtitle}
            </motion.p>
            <motion.p 
              className="text-sm md:text-base lg:text-lg mb-8 drop-shadow-md max-w-md leading-relaxed"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              {currentText.description}
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <motion.button 
                className={`${currentText.buttonColor} text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/shop'}
              >
                Shop Now
              </motion.button>
              <motion.button 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-semibold transition-all hover:bg-white hover:text-gray-900 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/shop'}
              >
                View Collection
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => setCurrentIndex(prev => (prev - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={() => setCurrentIndex(prev => (prev + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Slider;
