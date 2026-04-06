import axios from 'axios';

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
};

// Menu API
export const menuAPI = {
  getAvailableItems: () => apiClient.get('/menu'),
  getAllItems: () => apiClient.get('/menu/all'),
  getItemById: (id) => apiClient.get(`/menu/${id}`),
  getByCategory: (categoryId) => apiClient.get(`/menu/category/${categoryId}`),
  searchItems: (keyword) => apiClient.get('/menu/search', { params: { keyword } }),
};

// Category API
export const categoryAPI = {
  getAllCategories: () => apiClient.get('/category'),
  getCategoryById: (id) => apiClient.get(`/category/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => apiClient.get('/cart'),
  addItem: (data) => apiClient.post('/cart/items', data),
  removeItem: (itemId) => apiClient.delete(`/cart/items/${itemId}`),
  updateItem: (itemId, data) => apiClient.put(`/cart/items/${itemId}`, data),
  clearCart: () => apiClient.delete('/cart'),
};

// Order API
export const orderAPI = {
  createOrder: (data) => apiClient.post('/order', data),
  getOrders: () => apiClient.get('/order'),
  getOrderById: (id) => apiClient.get(`/order/${id}`),
  cancelOrder: (id) => apiClient.put(`/order/${id}/cancel`),
};

// Admin API
export const adminAPI = {
  createMenuItem: (data) => apiClient.post('/admin/menu', data),
  updateMenuItem: (id, data) => apiClient.put(`/admin/menu/${id}`, data),
  deleteMenuItem: (id) => apiClient.delete(`/admin/menu/${id}`),
  createCategory: (data) => apiClient.post('/admin/category', data),
  updateCategory: (id, data) => apiClient.put(`/admin/category/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`/admin/category/${id}`),
};

export default apiClient;
