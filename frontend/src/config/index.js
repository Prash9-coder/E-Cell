/**
 * Frontend configuration module that loads all environment variables
 * with validation and default values
 */
const config = {
  // API configuration
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  },
  
  // Application information
  app: {
    name: import.meta.env.VITE_APP_NAME || 'E-Cell',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Entrepreneurship Cell Website',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  
  // Feature flags
  features: {
    enableBlog: import.meta.env.VITE_ENABLE_BLOG === 'true',
    enableGallery: import.meta.env.VITE_ENABLE_GALLERY === 'true',
    enableNewsletter: import.meta.env.VITE_ENABLE_NEWSLETTER === 'true',
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  },
  
  // Social media links
  social: {
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK || 'https://facebook.com/your_ecell',
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || 'https://instagram.com/your_ecell',
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN || 'https://linkedin.com/company/your_ecell',
  },
  
  // Contact information
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'contact@ecell.org',
    phone: import.meta.env.VITE_CONTACT_PHONE || '+91 1234567890',
  },
  
  // Environment detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate configuration in development
if (config.isDevelopment) {
  // Check if API URL is set
  if (!import.meta.env.VITE_API_URL) {
    console.warn('⚠️ VITE_API_URL is not set. Using default: http://localhost:5000/api');
  }
  
  // Log configuration
  console.log('📝 Frontend Configuration:', config);
}

export default config;