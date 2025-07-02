import React, { useState, useEffect } from 'react';
import PlaceholderImage from './PlaceholderImage';

/**
 * A component that renders an image with a fallback to PlaceholderImage if loading fails
 */
const ImageWithFallback = ({ 
  src, 
  alt, 
  width = '100%', 
  height = '100%', 
  className = '',
  style = {},
  placeholderText = 'Image',
  placeholderBgColor = '#0f172a'
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    // Reset error state when src changes
    setImageError(false);
    setImageSrc(src);
  }, [src]);

  const handleError = () => {
    console.log(`Image failed to load: ${src}`);
    setImageError(true);
  };

  if (!src || imageError) {
    return (
      <PlaceholderImage
        width={width}
        height={height}
        text={placeholderText}
        bgColor={placeholderBgColor}
        className={className}
        style={style}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`object-cover ${className}`}
      style={{ width, height, ...style }}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;