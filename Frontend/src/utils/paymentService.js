import api from './api.js';

export const paymentService = {
    getPaymentMethods: async () => {
        try {
            const response = await api.get('/payments');
            return response.success ? response.data.paymentMethods : [];
        } catch (error) {
            console.error('Error getting payment methods:', error);
            return [];
        }
    },

    addPaymentMethod: async (paymentData) => {
        try {
            const response = await api.post('/payments', paymentData);
            return response.success ? response.data.paymentMethod : null;
        } catch (error) {
            console.error('Error adding payment method:', error);
            throw error;
        }
    },

    deletePaymentMethod: async (id) => {
        try {
            const response = await api.delete(`/payments/${id}`);
            return response.success;
        } catch (error) {
            console.error('Error deleting payment method:', error);
            throw error;
        }
    }
};
