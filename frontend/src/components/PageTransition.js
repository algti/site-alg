import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const PageTransition = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Start transition
    setIsLoading(true);
    setIsVisible(false);

    // Simulate loading time and then show content
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
      
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <LoadingSpinner 
          size="lg" 
          color="brand-primary" 
          text="Carregando..."
        />
      </div>
    );
  }

  return (
    <div 
      className={`
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {children}
    </div>
  );
};

export default PageTransition;
