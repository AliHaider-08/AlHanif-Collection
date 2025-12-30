import api from './api.js';

export const adminService = {
    getDashboardStats: async () => {
        try {
            const response = await api.get('/admin/dashboard');
            return response.success ? response.data : null;
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            throw error;
        }
    },

    getAllOrders: async (params) => {
        try {
            const response = await api.get('/admin/orders', { params });
            return response.success ? response.data : null;
        } catch (error) {
            console.error('Error fetching admin orders:', error);
            throw error;
        }
    },

    updateOrderStatus: async (id, statusData) => {
        try {
            const response = await api.put(`/admin/orders/${id}/status`, statusData);
            return response.success ? response.data.order : null;
        } catch (error) {
            console.error('Error updating status:', error);
            throw error;
        }
    },

    getAllUsers: async (params) => {
        try {
            const response = await api.get('/admin/users', { params });
            return response.success ? response.data : null;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    updateUserStatus: async (id, statusData) => {
        try {
            const response = await api.put(`/admin/users/${id}/status`, statusData);
            return response.success ? response.data.user : null;
        } catch (error) {
            console.error('Error updating user status:', error);
            throw error;
        }
    }
};
