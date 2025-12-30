import React, { useState, useEffect } from 'react';
import { 
  FiLock, FiShield, FiBell, FiTrash2, 
  FiLoader, FiEye, FiEyeOff, FiCheck, 
  FiX, FiAlertTriangle, FiSmartphone, FiMail 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../../utils/authService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const SettingsPanel = () => {
  const { user, updateUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user?.emailNotifications ?? true,
    smsNotifications: user?.smsNotifications ?? false
  });

  useEffect(() => {
    if (user) {
      setNotificationSettings({
        emailNotifications: user.emailNotifications,
        smsNotifications: user.smsNotifications
      });
    }
  }, [user]);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setIsLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = async (field) => {
    const newVal = !notificationSettings[field];
    const prevSettings = { ...notificationSettings };
    
    // Optimistic UI update
    setNotificationSettings(prev => ({ ...prev, [field]: newVal }));

    try {
      const updatedUser = await authService.updateSettings({
        [field]: newVal
      });
      updateUser(updatedUser);
      toast.success('Settings updated');
    } catch (error) {
      setNotificationSettings(prevSettings);
      toast.error('Failed to update settings');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you absolutely sure? This will deactivate your account and take you to the landing page. Your data will be preserved but you'll need support to reactivate."
    );
    
    if (confirmation) {
      try {
        await authService.deleteAccount();
        toast.success('Account deactivated. Farewell!');
        logout();
        window.location.href = '/';
      } catch (error) {
        toast.error('Failed to deactivate account');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500">Manage your security preferences and notifications.</p>
      </div>

      {/* Security Section */}
      <motion.div 
        className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        variants={itemVariants}
      >
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FiShield className="mr-3 text-emerald-600 w-6 h-6" />
            Security & Authentication
          </h2>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmitPassword} className="space-y-6 max-w-md">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-600 ml-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-5 focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all pr-12"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600 ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-5 focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all pr-12"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600 ml-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-5 focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="px-8 h-12 bg-emerald-600 text-white rounded-2xl font-bold border-b-4 border-emerald-800 hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? <FiLoader className="animate-spin" /> : <FiLock />}
              <span>Update Security Credentials</span>
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div 
        className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        variants={itemVariants}
      >
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FiBell className="mr-3 text-emerald-600 w-6 h-6" />
            Communication Preferences
          </h2>
        </div>
        <div className="p-8 divide-y divide-gray-50">
          {/* Email notifications */}
          <div className="py-6 first:pt-0 flex justify-between items-center group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                <FiMail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Email Notifications</h3>
                <p className="text-gray-500 text-sm">Vital order updates, invoices, and security alerts.</p>
              </div>
            </div>
            <button 
              onClick={() => toggleNotification('emailNotifications')}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all ring-offset-2 focus:ring-2 focus:ring-emerald-500 ${
                notificationSettings.emailNotifications ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                notificationSettings.emailNotifications ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* SMS notifications */}
          <div className="py-6 flex justify-between items-center group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                <FiSmartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">SMS Notifications</h3>
                <p className="text-gray-500 text-sm">Real-time shipping alerts via text message.</p>
              </div>
            </div>
            <button 
              onClick={() => toggleNotification('smsNotifications')}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all ring-offset-2 focus:ring-2 focus:ring-emerald-500 ${
                notificationSettings.smsNotifications ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                notificationSettings.smsNotifications ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div 
        className="bg-white rounded-3xl shadow-xl border border-red-50 overflow-hidden"
        variants={itemVariants}
      >
        <div className="p-8 border-b border-red-50 bg-red-50/30">
          <h2 className="text-xl font-bold text-red-600 flex items-center">
            <FiAlertTriangle className="mr-3 w-6 h-6" />
            Extreme Actions
          </h2>
        </div>
        <div className="p-8">
          <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 mb-8">
            <div className="flex items-start space-x-4">
              <div className="mt-1 p-2 bg-red-100 text-red-600 rounded-full">
                <FiTrash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Deactivate Account</h3>
                <p className="text-red-700/70 text-sm leading-relaxed mt-1">
                  Once you deactivate your account, your profile and history will be hidden. You can 
                  reactivate by contacting support within 30 days. After that, data may be permanently removed.
                </p>
                <motion.button 
                  onClick={handleDeleteAccount}
                  className="mt-6 px-8 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Confirm Deactivation
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPanel;
