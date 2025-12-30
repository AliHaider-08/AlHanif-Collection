import api from './api.js';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.success) {
        // Save token and user data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        return response.data;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.success) {
        // Save token and user data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        return response.data;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Admin login
  adminLogin: async (email, password) => {
    try {
      const response = await api.post('/auth/admin-login', { email, password });

      if (response.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        return response.data;
      } else {
        throw new Error(response.message || 'Admin login failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Get current user from API
  fetchCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.success) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    return !!(token && user);
  },

  // Get current user from localStorage
  getUserFromStorage: () => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);

      if (response.success) {
        // Update user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user settings (notifications, etc)
  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/auth/settings', settingsData);
      if (response.success) {
        // Update user data in localStorage
        const currentUser = authService.getUserFromStorage();
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete/Deactivate account
  deleteAccount: async () => {
    try {
      const response = await api.delete('/auth/delete-account');
      if (response.success) {
        authService.logout();
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
};



