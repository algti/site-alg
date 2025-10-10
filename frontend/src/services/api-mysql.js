import axios from 'axios';
import emailjs from '@emailjs/browser';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
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

// Hybrid API Service - MySQL with EmailJS fallback
export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.warn('Health check failed:', error.message);
      return { status: 'offline', database: 'unknown' };
    }
  },

  // Contact form with hybrid approach
  async submitContact(contactData) {
    try {
      // Try MySQL API first
      const response = await api.post('/api/contact', contactData);
      console.log('✅ Contact saved to MySQL database');
      return response.data;
    } catch (error) {
      console.warn('MySQL API failed, falling back to EmailJS:', error.message);
      
      // Fallback to EmailJS
      try {
        await emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_alg_tech',
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_contact',
          {
            from_name: contactData.name,
            from_email: contactData.email,
            phone: contactData.phone || 'Não informado',
            company: contactData.company || 'Não informado',
            subject: contactData.subject,
            message: contactData.message,
            to_email: 'contato@algti.com.br'
          },
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'w2MFhr68KahmhcpTL'
        );
        
        console.log('✅ Contact sent via EmailJS fallback');
        return {
          success: true,
          message: 'Mensagem enviada com sucesso!',
          method: 'emailjs',
          timestamp: new Date().toISOString()
        };
      } catch (emailError) {
        console.error('EmailJS fallback also failed:', emailError);
        throw new Error('Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente.');
      }
    }
  },

  async getContacts(limit = 100) {
    try {
      const response = await api.get(`/api/contact?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to get contacts:', error.message);
      return { contacts: [] };
    }
  },

  // Budget requests
  async submitBudgetRequest(budgetData) {
    try {
      const response = await api.post('/api/budget', budgetData);
      console.log('✅ Budget request saved to MySQL database');
      return response.data;
    } catch (error) {
      console.warn('MySQL API failed for budget request:', error.message);
      
      // For budget requests, we could also implement EmailJS fallback
      // but for now, we'll just throw the error
      throw new Error('Erro ao enviar solicitação de orçamento. Tente novamente.');
    }
  },

  async getBudgetRequests(limit = 100) {
    try {
      const response = await api.get(`/api/budget?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to get budget requests:', error.message);
      return { budget_requests: [] };
    }
  },

  // Newsletter
  async subscribeNewsletter(subscriptionData) {
    try {
      const response = await api.post('/api/newsletter', subscriptionData);
      console.log('✅ Newsletter subscription saved to MySQL database');
      return response.data;
    } catch (error) {
      console.warn('MySQL API failed for newsletter:', error.message);
      throw new Error('Erro ao assinar newsletter. Tente novamente.');
    }
  },

  // Status endpoints
  async getStatus() {
    try {
      const response = await api.get('/api/status');
      return response.data;
    } catch (error) {
      console.warn('Failed to get status:', error.message);
      return { status_checks: [] };
    }
  },

  async createStatusCheck(statusData) {
    try {
      const response = await api.post('/api/status', statusData);
      return response.data;
    } catch (error) {
      console.warn('Failed to create status check:', error.message);
      throw error;
    }
  },

  // API root endpoint
  async getApiInfo() {
    try {
      const response = await api.get('/api/');
      return response.data;
    } catch (error) {
      console.warn('Failed to get API info:', error.message);
      return { 
        message: 'ALG Tech Hub API', 
        version: '2.0.0', 
        status: 'unknown',
        database: 'mysql' 
      };
    }
  }
};

// Hook personalizado para usar a API
export const useApi = () => {
  const submitContact = async (contactData) => {
    return await apiService.submitContact(contactData);
  };

  const submitBudgetRequest = async (budgetData) => {
    return await apiService.submitBudgetRequest(budgetData);
  };

  const subscribeNewsletter = async (subscriptionData) => {
    return await apiService.subscribeNewsletter(subscriptionData);
  };

  const healthCheck = async () => {
    return await apiService.healthCheck();
  };

  return {
    submitContact,
    submitBudgetRequest,
    subscribeNewsletter,
    healthCheck,
    getContacts: apiService.getContacts,
    getBudgetRequests: apiService.getBudgetRequests,
    getStatus: apiService.getStatus,
    createStatusCheck: apiService.createStatusCheck,
    getApiInfo: apiService.getApiInfo
  };
};

// Utility functions for form validation (mantidas do original)
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

// Form data formatters (mantidos do original)
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

// Error handling utilities (mantidos do original)
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
