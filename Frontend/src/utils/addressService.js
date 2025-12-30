import api from './api.js';

export const addressService = {
    getAddresses: async () => {
        try {
            const response = await api.get('/addresses');
            return response.success ? response.data.addresses : [];
        } catch (error) {
            console.error('Error getting addresses:', error);
            return [];
        }
    },

    addAddress: async (addressData) => {
        try {
            const response = await api.post('/addresses', addressData);
            return response.success ? response.data.address : null;
        } catch (error) {
            console.error('Error adding address:', error);
            throw error;
        }
    },

    updateAddress: async (id, addressData) => {
        try {
            const response = await api.put(`/addresses/${id}`, addressData);
            return response.success ? response.data.address : null;
        } catch (error) {
            console.error('Error updating address:', error);
            throw error;
        }
    },

    deleteAddress: async (id) => {
        try {
            const response = await api.delete(`/addresses/${id}`);
            return response.success;
        } catch (error) {
            console.error('Error deleting address:', error);
            throw error;
        }
    }
};
