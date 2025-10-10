import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle common error scenarios
    if (error.response?.status === 422) {
      // Validation errors
      const validationErrors = error.response.data?.detail || [];
      const errorMessages = validationErrors.map(err => 
        `${err.loc?.join('.')} - ${err.msg}`
      ).join(', ');
      throw new Error(`Erro de validação: ${errorMessages}`);
    }
    
    if (error.response?.status === 500) {
      throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Tempo limite excedido. Verifique sua conexão.');
    }
    
    throw error;
  }
);

// API Service functions
export const apiService = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  // Contact form
  async submitContact(contactData) {
    const response = await api.post('/api/contact', contactData);
    return response.data;
  },

  async getContacts(skip = 0, limit = 50) {
    const response = await api.get(`/api/contacts?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Budget requests
  async submitBudgetRequest(budgetData) {
    const response = await api.post('/api/budget', budgetData);
    return response.data;
  },

  async getBudgetRequests(skip = 0, limit = 50) {
    const response = await api.get(`/api/budgets?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Newsletter
  async subscribeNewsletter(subscriptionData) {
    const response = await api.post('/api/newsletter', subscriptionData);
    return response.data;
  },

  async unsubscribeNewsletter(email) {
    const response = await api.delete(`/api/newsletter/${encodeURIComponent(email)}`);
    return response.data;
  },

  // WhatsApp integration
  async generateWhatsAppRedirect(whatsappData) {
    const response = await api.post('/api/whatsapp/redirect', whatsappData);
    return response.data;
  },

  // Analytics
  async getAnalyticsSummary() {
    const response = await api.get('/api/analytics/summary');
    return response.data;
  },

  // Status (legacy)
  async getStatus() {
    const response = await api.get('/api/status');
    return response.data;
  },

  async createStatusCheck(statusData) {
    const response = await api.post('/api/status', statusData);
    return response.data;
  }
};

// Utility functions for form validation
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  },

  required: (value) => {
    return value && value.toString().trim().length > 0;
  },

  minLength: (value, min) => {
    return value && value.toString().length >= min;
  },

  maxLength: (value, max) => {
    return !value || value.toString().length <= max;
  }
};

// Form data formatters
export const formatters = {
  phone: (phone) => {
    if (!phone) return '';
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Add +55 prefix if it's a Brazilian number without country code
    if (!cleaned.startsWith('+') && cleaned.length >= 10) {
      cleaned = '+55' + cleaned;
    }
    
    return cleaned;
  },

  cleanString: (str) => {
    return str ? str.toString().trim() : '';
  }
};

// Error handling utilities
export const errorHandler = {
  getErrorMessage: (error) => {
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        return error.response.data.detail.map(err => err.msg).join(', ');
      }
      return error.response.data.detail;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Ocorreu um erro inesperado. Tente novamente.';
  },

  isValidationError: (error) => {
    return error.response?.status === 422;
  },

  isServerError: (error) => {
    return error.response?.status >= 500;
  },

  isNetworkError: (error) => {
    return !error.response && error.code !== 'ECONNABORTED';
  }
};

export default api;
