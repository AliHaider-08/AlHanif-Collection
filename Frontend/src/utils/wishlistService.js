import api from './api.js';

export const wishlistService = {
    // Get user's wishlist
    getWishlist: async () => {
        try {
            const response = await api.get('/wishlist');
            return response.data.wishlistItems;
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            throw error;
        }
    },

    // Add item to wishlist
    addToWishlist: async (productId) => {
        try {
            const response = await api.post('/wishlist/add', { productId });
            return response.data.wishlistItem;
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    },

    // Remove item from wishlist
    removeFromWishlist: async (productId) => {
        try {
            const response = await api.delete(`/wishlist/remove/${productId}`);
            return response;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        }
    },

    // Clear wishlist
    clearWishlist: async () => {
        try {
            const response = await api.delete('/wishlist/clear');
            return response;
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            throw error;
        }
    },

    // Check if product is in wishlist
    checkInWishlist: async (productId) => {
        try {
            const response = await api.get(`/wishlist/check/${productId}`);
            return response.data.isInWishlist;
        } catch (error) {
            console.error('Error checking wishlist:', error);
            throw error;
        }
    }
};
