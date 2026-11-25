import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 422) {
      const details = error.response.data?.detail || [];
      const messages = Array.isArray(details)
        ? details.map((err) => `${err.loc?.slice(1).join('.')} - ${err.msg}`).join(', ')
        : details;
      throw new Error(`Erro de validação: ${messages}`);
    }
    if (status === 429) {
      throw new Error('Muitas solicitações. Aguarde alguns minutos e tente novamente.');
    }
    if (status >= 500) {
      throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Tempo limite excedido. Verifique sua conexão.');
    }
    throw error;
  }
);

export const apiService = {
  async submitContact(contactData) {
    const response = await api.post('/api/contact', contactData);
    return response.data;
  },

  async submitBudgetRequest(budgetData) {
    const response = await api.post('/api/budget', budgetData);
    return response.data;
  }
};

export const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

  phone: (phone) => /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[\s\-()]/g, '')),

  required: (value) => Boolean(value && value.toString().trim().length > 0),

  minLength: (value, min) => Boolean(value && value.toString().length >= min),

  maxLength: (value, max) => !value || value.toString().length <= max
};

export const formatters = {
  phone: (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+') && cleaned.length >= 10) {
      cleaned = '+55' + cleaned;
    }
    return cleaned;
  },

  cleanString: (str) => (str ? str.toString().trim() : '')
};

export const errorHandler = {
  getErrorMessage: (error) => {
    const detail = error.response?.data?.detail;
    if (detail) {
      return Array.isArray(detail) ? detail.map((err) => err.msg).join(', ') : detail;
    }
    return error.message || 'Ocorreu um erro inesperado. Tente novamente.';
  }
};

export default api;
