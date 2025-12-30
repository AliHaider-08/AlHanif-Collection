// Order Management Utility
export const orderStorage = {
  // Save order to admin dashboard storage
  saveOrder: (orderData) => {
    try {
      const existingOrders = orderStorage.getAllOrders();
      const newOrder = {
        ...orderData,
        id: orderData.orderInfo?.orderNumber || `ORD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      
      existingOrders.push(newOrder);
      localStorage.setItem('adminOrders', JSON.stringify(existingOrders));
      return newOrder;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  },

  // Get all orders for admin dashboard
  getAllOrders: () => {
    try {
      const orders = localStorage.getItem('adminOrders');
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  },

  // Update order status
  updateOrderStatus: (orderId, newStatus) => {
    try {
      const orders = orderStorage.getAllOrders();
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
      return updatedOrders.find(order => order.id === orderId);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: (orderId) => {
    try {
      const orders = orderStorage.getAllOrders();
      const filteredOrders = orders.filter(order => order.id !== orderId);
      localStorage.setItem('adminOrders', JSON.stringify(filteredOrders));
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  },

  // Get order statistics
  getOrderStats: () => {
    try {
      const orders = orderStorage.getAllOrders();
      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, order) => {
          return order.pricing?.total ? sum + parseFloat(order.pricing.total) : sum;
        }, 0)
      };
      return stats;
    } catch (error) {
      console.error('Error getting order stats:', error);
      return {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0
      };
    }
  }
};
