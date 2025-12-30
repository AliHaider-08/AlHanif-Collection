import api from './api.js';

export const productService = {
  // Get all products with filters
  getProducts: async (filters = {}) => {
    try {
      const response = await api.get('/products', { params: filters });
      return response; // API interceptor already returns response.data
    } catch (error) {
      throw error;
    }
  },

  // Get single product by ID
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.product; // API interceptor already returns response.data
    } catch (error) {
      throw error;
    }
  },

  // Get product categories
  getCategories: async () => {
    try {
      const response = await api.get('/products/categories/list');
      return response.categories; // API interceptor already returns response.data
    } catch (error) {
      throw error;
    }
  },

  // Create product (admin only)
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.product; // API interceptor already returns response.data
    } catch (error) {
      throw error;
    }
  },

  // Update product (admin only)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.product; // API interceptor already returns response.data
    } catch (error) {
      throw error;
    }
  },

  // Delete product (admin only)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
