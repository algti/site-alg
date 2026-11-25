import { useState, useCallback } from 'react';
import { apiService, errorHandler } from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      return await apiFunction(...args);
    } catch (err) {
      setError(errorHandler.getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, callApi, clearError };
};

export const useBudgetRequest = () => {
  const { loading, error, callApi, clearError } = useApi();

  const submitBudgetRequest = useCallback(
    (budgetData) => callApi(apiService.submitBudgetRequest, budgetData),
    [callApi]
  );

  return { loading, error, submitBudgetRequest, clearError };
};
