import { useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';

// Custom hook for SEO management
export const useSEO = (pageKey) => {
  useEffect(() => {
    setupPageSEO(pageKey);
  }, [pageKey]);
};

// Hook for dynamic meta tags
export const useMetaTags = (config) => {
  useEffect(() => {
    if (config) {
      // Update title
      if (config.title) {
        document.title = config.title;
      }
      
      // Update meta description
      if (config.description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', config.description);
      }
      
      // Update Open Graph tags
      if (config.ogTitle) {
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
          ogTitle = document.createElement('meta');
          ogTitle.setAttribute('property', 'og:title');
          document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', config.ogTitle);
      }
      
      if (config.ogDescription) {
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (!ogDesc) {
          ogDesc = document.createElement('meta');
          ogDesc.setAttribute('property', 'og:description');
          document.head.appendChild(ogDesc);
        }
        ogDesc.setAttribute('content', config.ogDescription);
      }
      
      if (config.ogImage) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
          ogImage = document.createElement('meta');
          ogImage.setAttribute('property', 'og:image');
          document.head.appendChild(ogImage);
        }
        ogImage.setAttribute('content', config.ogImage);
      }
    }
  }, [config]);
};
