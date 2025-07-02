import { useState, useEffect } from 'react';

/**
 * StableImage - A component that prevents layout shifts and blinking when images fail to load
 * 
 * @param {Object} props
 * @param {string} props.src - The source URL of the image
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - Additional CSS classes for the image
 * @param {string} props.fallbackSrc - Fallback image source to use if the main image fails to load
 * @param {string} props.placeholderColor - Background color for the placeholder (default: #f3f4f6)
 * @param {Object} props.style - Additional inline styles for the image
 * @param {Function} props.onLoad - Callback function when image loads successfully
 * @param {Function} props.onError - Callback function when image fails to load
 * @param {boolean} props.showPlaceholder - Whether to show a placeholder while the image is loading
 * @param {string} props.objectFit - CSS object-fit property (default: 'cover')
 * @param {React.ReactNode} props.placeholderContent - Custom content to show in the placeholder
 */
const StableImage = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.svg',
  placeholderColor = '#f3f4f6',
  style = {},
  onLoad,
  onError,
  showPlaceholder = true,
  objectFit = 'cover',
  placeholderContent,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset loading state when src changes
  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  // Preload the fallback image to ensure it's in browser cache
  useEffect(() => {
    const img = new Image();
    img.src = fallbackSrc;
  }, [fallbackSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setImgSrc(fallbackSrc);
    if (onError) onError();
  };

  return (
    <div 
      className={`stable-image-container ${className}`} 
      style={{ 
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: placeholderColor,
        ...style
      }}
    >
      {/* Placeholder shown during loading or if showPlaceholder is true */}
      {(isLoading && showPlaceholder) && (
        <div 
          className="stable-image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: placeholderColor,
            zIndex: 1
          }}
        >
          {placeholderContent || (
            <div 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#e5e7eb' 
              }}
            />
          )}
        </div>
      )}

      {/* Actual image */}
      <img
        src={imgSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: objectFit,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          position: 'relative',
          zIndex: 2
        }}
        {...rest}
      />
    </div>
  );
};

export default StableImage;