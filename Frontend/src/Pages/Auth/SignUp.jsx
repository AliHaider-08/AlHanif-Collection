import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus, FiPhone, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SignUp = ({ colors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();


  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    terms: false,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('First name is required'),
    lastName: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number')
      .min(10, 'Phone number must be at least 10 digits')
      .required('Phone number is required'),
    address: Yup.string()
      .min(10, 'Address must be at least 10 characters')
      .required('Shipping address is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Must contain at least one uppercase, one lowercase, one number and one special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    terms: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
      .required('You must accept the terms and conditions'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    setSubmitStatus(null);
    
    try {
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone
      };
      
      const result = await register(userData);
      
      if (result.success) {
        toast.success('Registration successful!');
        setSubmitStatus('success');
        
        setTimeout(() => {
          navigate('/customer-dashboard');
        }, 1000);
      } else {
        throw new Error(result.message || 'Registration failed');
      }
      
    } catch (error) {

      console.error('Registration error:', error);
      setSubmitStatus('error');
      
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-emerald-200/20 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, 20, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            transition: { duration: 0.3 }
          }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              <FiUserPlus className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.3,
                type: "spring",
                stiffness: 100
              }}
            >
              Create Account
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.4,
                duration: 0.6
              }}
            >
              Join Al Hanif Collection today
            </motion.p>
          </div>

          {submitStatus === 'success' && (
            <motion.div
              className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Account created successfully!</span>
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Registration failed. Please try again.</span>
              </div>
            </motion.div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6 pb-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Field
                        id="firstName"
                        name="firstName"
                        type="text"
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                          errors.firstName && touched.firstName 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                            : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 hover:bg-white hover:border-gray-300'
                        }`}
                        placeholder="John"
                      />
                    </motion.div>
                    <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </motion.div>

                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ 
                      delay: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FiUser className="w-4 h-4 mr-2 text-emerald-500" />
                      Last Name
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Field
                        id="lastName"
                        name="lastName"
                        type="text"
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                          errors.lastName && touched.lastName 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                            : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 hover:bg-white hover:border-gray-300'
                        }`}
                        placeholder="Doe"
                      />
                    </motion.div>
                    <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FiMail className="w-4 h-4 mr-2 text-emerald-500" />
                      Email Address
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                          errors.email && touched.email 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                            : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 hover:bg-white hover:border-gray-300'
                        }`}
                        placeholder="your@email.com"
                      />
                    </motion.div>
                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: 0.7,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FiPhone className="w-4 h-4 mr-2 text-emerald-500" />
                      Phone Number
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Field
                        id="phone"
                        name="phone"
                        type="tel"
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                          errors.phone && touched.phone 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                            : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 hover:bg-white hover:border-gray-300'
                        }`}
                        placeholder="+92 300 1234567"
                      />
                    </motion.div>
                    <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiMapPin className="w-4 h-4 mr-2 text-emerald-500" />
                    Shipping Address
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Field
                      id="address"
                      name="address"
                      type="text"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                        errors.address && touched.address 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 hover:bg-white hover:border-gray-300'
                      }`}
                      placeholder="Enter your complete shipping address"
                    />
                  </motion.div>
                  <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: 0.9,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FiLock className="w-4 h-4 mr-2 text-emerald-500" />
                      Password
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="relative">
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          className={`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                            errors.password && touched.password 
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 hover:bg-white hover:border-gray-300'
                          }`}
                          placeholder="••••••••"
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                        </motion.button>
                      </div>
                    </motion.div>
                    <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: 1.0,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FiLock className="w-4 h-4 mr-2 text-emerald-500" />
                      Confirm Password
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="relative">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className={`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                            errors.confirmPassword && touched.confirmPassword 
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 hover:bg-white hover:border-gray-300'
                          }`}
                          placeholder="••••••••"
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                        </motion.button>
                      </div>
                    </motion.div>
                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600 font-medium" />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="flex items-start">
                    <Field
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1"
                    />
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="text-emerald-600 hover:text-emerald-500 font-medium">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-emerald-600 hover:text-emerald-500 font-medium">
                          Privacy Policy
                        </a>
                      </label>
                      <ErrorMessage name="terms" component="div" className="mt-1 text-red-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.5)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                        ></motion.div>
                        <span className="text-lg">Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ rotate: -180, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          transition={{ delay: 1.3, duration: 0.5 }}
                        >
                          <FiUserPlus className="mr-3 h-5 w-5" />
                        </motion.div>
                        <span className="text-lg">Create Account</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/signin" className="font-medium text-emerald-600 hover:text-emerald-500">
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
