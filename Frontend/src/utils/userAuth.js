// User Authentication Utility
export const userAuth = {
  // Save user data to localStorage
  saveUser: (userData) => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Login user
  login: (email, password) => {
    try {
      // For demo purposes, create a user object
      // In real app, this would validate against backend
      const userData = {
        id: `USER-${Date.now()}`,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        phone: '',
        address: '',
        city: '',
        zip: '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      return userAuth.saveUser(userData);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    try {
      localStorage.removeItem('currentUser');
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  },

  // Update user profile
  updateProfile: (updatedData) => {
    try {
      const currentUser = userAuth.getCurrentUser();
      if (!currentUser) throw new Error('No user logged in');
      
      const updatedUser = { ...currentUser, ...updatedData };
      return userAuth.saveUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return userAuth.getCurrentUser() !== null;
  }
};

// Customer Orders Utility
export const customerOrders = {
  // Get orders for current user
  getMyOrders: () => {
    try {
      const currentUser = userAuth.getCurrentUser();
      if (!currentUser) return [];
      
      const allOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
      
      // Filter orders by customer email (since we don't have user ID in orders yet)
      const myOrders = allOrders.filter(order => 
        order.customerInfo?.email === currentUser.email
      );
      
      return myOrders;
    } catch (error) {
      console.error('Error getting customer orders:', error);
      return [];
    }
  },

  // Get order statistics for customer
  getOrderStats: () => {
    try {
      const myOrders = customerOrders.getMyOrders();
      const stats = {
        total: myOrders.length,
        pending: myOrders.filter(o => o.status === 'pending').length,
        processing: myOrders.filter(o => o.status === 'processing').length,
        shipped: myOrders.filter(o => o.status === 'shipped').length,
        delivered: myOrders.filter(o => o.status === 'delivered').length,
        cancelled: myOrders.filter(o => o.status === 'cancelled').length,
        totalSpent: myOrders.reduce((sum, order) => {
          return order.pricing?.total ? sum + parseFloat(order.pricing.total) : sum;
        }, 0)
      };
      return stats;
    } catch (error) {
      console.error('Error getting customer order stats:', error);
      return {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalSpent: 0
      };
    }
  }
};
