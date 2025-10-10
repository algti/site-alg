import { useState, useCallback } from 'react';
import { apiService, errorHandler } from '../services/api';

// Custom hook for API calls with loading states and error handling
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const errorMessage = errorHandler.getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError
  };
};

// Specific hooks for different API endpoints
export const useContactForm = () => {
  const { loading, error, callApi, clearError } = useApi();

  const submitContact = useCallback(async (contactData) => {
    return callApi(apiService.submitContact, contactData);
  }, [callApi]);

  return {
    loading,
    error,
    submitContact,
    clearError
  };
};

export const useBudgetRequest = () => {
  const { loading, error, callApi, clearError } = useApi();

  const submitBudgetRequest = useCallback(async (budgetData) => {
    return callApi(apiService.submitBudgetRequest, budgetData);
  }, [callApi]);

  return {
    loading,
    error,
    submitBudgetRequest,
    clearError
  };
};

export const useNewsletter = () => {
  const { loading, error, callApi, clearError } = useApi();

  const subscribe = useCallback(async (subscriptionData) => {
    return callApi(apiService.subscribeNewsletter, subscriptionData);
  }, [callApi]);

  const unsubscribe = useCallback(async (email) => {
    return callApi(apiService.unsubscribeNewsletter, email);
  }, [callApi]);

  return {
    loading,
    error,
    subscribe,
    unsubscribe,
    clearError
  };
};

export const useWhatsApp = () => {
  const { loading, error, callApi, clearError } = useApi();

  const generateRedirect = useCallback(async (whatsappData) => {
    return callApi(apiService.generateWhatsAppRedirect, whatsappData);
  }, [callApi]);

  return {
    loading,
    error,
    generateRedirect,
    clearError
  };
};

export const useAnalytics = () => {
  const { loading, error, callApi, clearError } = useApi();

  const getSummary = useCallback(async () => {
    return callApi(apiService.getAnalyticsSummary);
  }, [callApi]);

  return {
    loading,
    error,
    getSummary,
    clearError
  };
};
