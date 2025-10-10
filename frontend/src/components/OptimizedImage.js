import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  priority = false,
  placeholder = 'blur',
  sizes = '100vw',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageSrc, setImageSrc] = useState(priority ? src : '');
  const imgRef = useRef();

  // Generate WebP and fallback URLs
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return '';
    
    // If it's already optimized or external, return as is
    if (originalSrc.includes('.webp') || originalSrc.includes('.avif') || originalSrc.startsWith('http')) {
      return originalSrc;
    }
    
    // For local images, we'd typically use a build-time optimization
    // For now, we'll use the original src
    return originalSrc;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error
  const handleError = (e) => {
    console.warn(`Failed to load image: ${src}`);
    // Try fallback to original src without WebP/AVIF optimization
    if (e.target.src !== src) {
      e.target.src = src;
      return;
    }
    setIsLoaded(true); // Still mark as loaded to remove placeholder
  };

  // Generate placeholder styles
  const getPlaceholderStyle = () => {
    if (placeholder === 'blur') {
      return {
        backgroundColor: '#f3f4f6',
        backgroundImage: `linear-gradient(45deg, #f9fafb 25%, transparent 25%), 
                         linear-gradient(-45deg, #f9fafb 25%, transparent 25%), 
                         linear-gradient(45deg, transparent 75%, #f9fafb 75%), 
                         linear-gradient(-45deg, transparent 75%, #f9fafb 75%)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        filter: 'blur(2px)',
        transition: 'filter 0.3s ease'
      };
    }
    return { backgroundColor: '#f3f4f6' };
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={getPlaceholderStyle()}
        />
      )}
      
      {/* Actual Image */}
      {(isInView || priority) && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`
            transition-opacity duration-300 ease-in-out
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${className}
          `}
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%'
          }}
          {...props}
        />
      )}
      
      {/* Loading indicator for priority images */}
      {priority && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
