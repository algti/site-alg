import { useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';

// Atualiza título, meta tags e dados estruturados da página.
// Aceita a chave de uma página (ex.: 'home') ou um objeto de configuração.
export const useSEO = (pageKeyOrConfig) => {
  const id = typeof pageKeyOrConfig === 'string' ? pageKeyOrConfig : pageKeyOrConfig?.canonical;

  useEffect(() => {
    setupPageSEO(pageKeyOrConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
};
