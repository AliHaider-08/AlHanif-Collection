import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiSend, FiUser, FiMessageSquare, FiClock, FiCheckCircle, FiAlertCircle, FiHeadphones, FiGlobe, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Contact = ({ colors }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = async (formData) => {
    try {
      // Using EmailJS service - you'll need to set this up
      const serviceID = 'service_your_service_id'; // Replace with your EmailJS service ID
      const templateID = 'template_your_template_id'; // Replace with your EmailJS template ID
      const publicKey = 'your_public_key'; // Replace with your EmailJS public key

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        to_email: 'alhanifcollection11@gmail.com', // Your email where you'll receive messages
        reply_to: formData.email
      };

      // For now, we'll simulate the email sending
      // In production, you would use EmailJS like this:
      // await emailjs.send(serviceID, templateID, templateParams, publicKey);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Email sent to: alhanefcollection11@gmail.com');
      console.log('Form data:', templateParams);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: 'Failed to send email. Please try again.' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await sendEmail(formData);
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setErrors({});
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardHover = {
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0, 159, 107, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const inputFocusVariants = {
    focus: {
      scale: 1.02,
      borderColor: "#009F6B",
      boxShadow: "0 0 0 3px rgba(0, 159, 107, 0.1)"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #009F6B 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #D4AF37 0%, transparent 50%)`,
          backgroundSize: '800px 800px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Professional Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="inline-flex items-center space-x-2 bg-[#009F6B]/10 px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-[#009F6B] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#009F6B]">Get in Touch</span>
          </div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          >
            Contact
            <span className="bg-gradient-to-r from-[#009F6B] to-[#00D084] bg-clip-text text-transparent"> Al Hanif</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            We're here to help you discover the perfect traditional Pakistani shawls and chadars. 
            Reach out to us for any questions or personalized assistance.
          </motion.p>
          <div className="w-32 h-1 bg-gradient-to-r from-[#009F6B] to-[#D4AF37] mx-auto mt-8 rounded-full"></div>
        </motion.div>

        {/* Professional Contact Info Cards */}
        <motion.div 
          className="grid md:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              icon: <FiPhone className="w-8 h-8 text-white" />,
              title: "Call Us",
              subtitle: "Speak with our experts",
              details: ["+92 42 3578 1234", "+92 300 1234567"],
              time: "Mon-Sat: 9AM-8PM",
              color: "from-[#009F6B] to-[#00D084]"
            },
            {
              icon: <FiMail className="w-8 h-8 text-white" />,
              title: "Email Us", 
              subtitle: "Get detailed assistance",
              details: ["info@alhaneefcollection.com", "support@alhaneefcollection.com"],
              time: "Response within 24 hours",
              color: "from-[#D4AF37] to-[#F4E4C1]"
            },
            {
              icon: <FiMapPin className="w-8 h-8 text-white" />,
              title: "Visit Our Showroom",
              subtitle: "Experience our collection",
              details: ["Gulberg, Main Boulevard", "Lahore, Pakistan"],
              time: "Near Liberty Market",
              color: "from-[#009F6B] to-[#007A52]"
            },
            {
              icon: <FiHeadphones className="w-8 h-8 text-white" />,
              title: "Live Support",
              subtitle: "Chat with our team",
              details: ["WhatsApp: +92 300 1234567", "Live Chat Available"],
              time: "Instant Response",
              color: "from-[#D4AF37] to-[#C19A6B]"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={itemVariants}
              whileHover={cardHover.hover}
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                   style={{ backgroundImage: `linear-gradient(135deg, ${item.color.split(' ').join(', ')})` }}>
              </div>
              <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{item.subtitle}</p>
                <div className="space-y-1">
                  {item.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-gray-900 font-medium">{detail}</p>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">{item.time}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Professional Contact Form */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#009F6B] to-[#00D084] p-8 text-white">
            <motion.h2 
              className="text-3xl font-bold mb-2"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Send us a message
            </motion.h2>
            <motion.p 
              className="text-white/90"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              Fill out the form below and our team will get back to you within 24 hours
            </motion.p>
          </div>
          
          <div className="p-8">
            {submitStatus === 'success' && (
              <motion.div
                className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium">Message sent successfully!</span>
                  <p className="text-sm mt-1">We've received your message and will respond to alhanefcollection11@gmail.com within 24 hours.</p>
                </div>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium">Failed to send message</span>
                  <p className="text-sm mt-1">Please try again or contact us directly at alhanefcollection11@gmail.com</p>
                </div>
              </motion.div>
            )}

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiUser className="mr-2 text-[#009F6B]" />
                    Full Name *
                  </label>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009F6B] focus:border-[#009F6B] transition-all duration-200 bg-gray-50/50 ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Enter your full name"
                    variants={inputFocusVariants}
                    whileFocus="focus"
                  />
                  {errors.name && (
                    <motion.p 
                      className="mt-1 text-xs text-red-600 flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <FiAlertCircle className="mr-1" />
                      {errors.name}
                    </motion.p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiMail className="mr-2 text-[#009F6B]" />
                    Email Address *
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009F6B] focus:border-[#009F6B] transition-all duration-200 bg-gray-50/50 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="your@email.com"
                    variants={inputFocusVariants}
                    whileFocus="focus"
                  />
                  {errors.email && (
                    <motion.p 
                      className="mt-1 text-xs text-red-600 flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <FiAlertCircle className="mr-1" />
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FiPhone className="mr-2 text-[#009F6B]" />
                  Phone Number (Optional)
                </label>
                <motion.input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009F6B] focus:border-[#009F6B] transition-all duration-200 bg-gray-50/50 ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="+92 300 1234567"
                  variants={inputFocusVariants}
                  whileFocus="focus"
                />
                {errors.phone && (
                  <motion.p 
                    className="mt-1 text-xs text-red-600 flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FiAlertCircle className="mr-1" />
                    {errors.phone}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FiMessageSquare className="mr-2 text-[#009F6B]" />
                  Subject *
                </label>
                <motion.input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009F6B] focus:border-[#009F6B] transition-all duration-200 bg-gray-50/50 ${
                    errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="How can we help you?"
                  variants={inputFocusVariants}
                  whileFocus="focus"
                />
                {errors.subject && (
                  <motion.p 
                    className="mt-1 text-xs text-red-600 flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FiAlertCircle className="mr-1" />
                    {errors.subject}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FiMessageSquare className="mr-2 text-[#009F6B]" />
                  Your Message *
                </label>
                <motion.textarea
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009F6B] focus:border-[#009F6B] transition-all duration-200 bg-gray-50/50 resize-none ${
                    errors.message ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Please tell us more about your inquiry or requirements..."
                  variants={inputFocusVariants}
                  whileFocus="focus"
                ></motion.textarea>
                {errors.message && (
                  <motion.p 
                    className="mt-1 text-xs text-red-600 flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FiAlertCircle className="mr-1" />
                    {errors.message}
                  </motion.p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    {formData.message.length}/500 characters
                  </p>
                  {formData.message.length > 500 && (
                    <motion.p 
                      className="text-xs text-orange-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Consider keeping your message concise
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#009F6B] to-[#00D084] hover:from-[#007A52] hover:to-[#00B089] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Sending Message...</span>
                    </motion.div>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>

        {/* Social Media & Additional Info */}
        <motion.div
          className="mt-16 grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {/* Social Media Links */}
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FiGlobe className="mr-2 text-[#009F6B]" />
              Follow Us
            </h3>
            <p className="text-gray-600 mb-6">Stay connected for latest updates and exclusive offers</p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="w-12 h-12 bg-gradient-to-r from-[#009F6B] to-[#00D084] rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiFacebook className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                className="w-12 h-12 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiInstagram className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                className="w-12 h-12 bg-gradient-to-r from-[#009F6B] to-[#007A52] rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTwitter className="w-6 h-6" />
              </motion.a>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            className="bg-gradient-to-r from-[#009F6B]/5 to-[#D4AF37]/5 p-8 rounded-2xl border border-[#009F6B]/20"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FiCheckCircle className="mr-2 text-[#009F6B]" />
              Why Choose Us
            </h3>
            <div className="space-y-3">
              {[
                "✓ Authentic Pakistani Shawls & Chadars",
                "✓ 15,000+ Satisfied Customers Worldwide",
                "✓ Secure Payment & Fast Delivery",
                "✓ 24/7 Customer Support",
                "✓ Quality Guarantee"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center text-gray-700"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                >
                  <span className="text-green-600 font-semibold mr-2">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center"><FiClock className="mr-1" />24/7 Customer Support</span>
            <span>•</span>
            <span className="flex items-center"><FiCheckCircle className="mr-1" />Secure & Private</span>
            <span>•</span>
            <span className="flex items-center"><FiCheckCircle className="mr-1" />Trusted by 15,000+ Customers</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
