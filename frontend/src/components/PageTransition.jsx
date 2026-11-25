import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div key={pathname} className="page-fade">
      {children}
    </div>
  );
};

export default PageTransition;
