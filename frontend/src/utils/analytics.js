const STORAGE_KEY = 'alg-cookie-consent';

export const getConsent = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setConsent = (value) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // armazenamento indisponível (modo privado); a escolha vale apenas nesta sessão
  }
};

let started = false;

export const initAnalytics = async () => {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (started || !key) return;
  started = true;
  const { default: posthog } = await import('posthog-js');
  posthog.init(key, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only'
  });
};
