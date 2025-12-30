import api from './api.js';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data.order;
    } catch (error) {
      throw error;
    }
  },

  // Get user's orders
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data.orders;
    } catch (error) {
      throw error;
    }
  },

  // Get single order by ID
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      throw error;
    }
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data.order;
    } catch (error) {
      throw error;
    }
  },

  // Cancel order (user)
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

