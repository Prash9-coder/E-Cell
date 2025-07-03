import config from '../config';

/**
 * Construct the full image URL for display
 * @param {string} imagePath - The image path from the API
 * @returns {string} - The full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/images/events/default.svg';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a static asset path (starts with /images/), return as is
  if (imagePath.startsWith('/images/')) {
    return imagePath;
  }
  
  // If it's an upload path (starts with /uploads/ or uploads/), construct backend URL
  if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${config.api.url.replace('/api', '')}/${cleanPath}`;
  }
  
  // If it's just a filename, assume it's an upload
  if (!imagePath.includes('/')) {
    return `${config.api.url.replace('/api', '')}/uploads/events/${imagePath}`;
  }
  
  // Default fallback
  return '/images/events/default.svg';
};

/**
 * Get the appropriate image URL for different content types
 * @param {string} imagePath - The image path from the API
 * @param {string} contentType - The type of content (events, blog, startups, etc.)
 * @returns {string} - The full image URL
 */
export const getContentImageUrl = (imagePath, contentType = 'events') => {
  if (!imagePath) {
    return `/images/${contentType}/default.svg`;
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a static asset path, return as is
  if (imagePath.startsWith('/images/')) {
    return imagePath;
  }
  
  // If it's an upload path, construct backend URL
  if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${config.api.url.replace('/api', '')}/${cleanPath}`;
  }
  
  // If it's just a filename, assume it's an upload
  if (!imagePath.includes('/')) {
    return `${config.api.url.replace('/api', '')}/uploads/${contentType}/${imagePath}`;
  }
  
  // Default fallback
  return `/images/${contentType}/default.svg`;
};

/**
 * Check if an image URL is valid and accessible
 * @param {string} imageUrl - The image URL to check
 * @returns {Promise<boolean>} - Whether the image is accessible
 */
export const isImageAccessible = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Image accessibility check failed:', error);
    return false;
  }
};

/**
 * Get fallback image for different content types
 * @param {string} contentType - The type of content
 * @returns {string} - The fallback image path
 */
export const getFallbackImage = (contentType = 'events') => {
  const fallbacks = {
    events: '/images/events/default.svg',
    blog: '/images/blog/default.svg',
    startups: '/images/startups/default.svg',
    resources: '/images/resources/default.svg',
    team: '/images/team/default.svg',
    gallery: '/images/gallery/default.svg'
  };
  
  return fallbacks[contentType] || '/images/placeholder.svg';
};