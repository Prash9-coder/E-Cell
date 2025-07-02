/**
 * Central configuration file for the frontend application
 * Loads environment variables from .env file via Vite
 */

const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'E-Cell',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Entrepreneurship Cell Website',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0'
  },
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10)
  },
  features: {
    enableBlog: import.meta.env.VITE_ENABLE_BLOG !== 'false',
    enableGallery: import.meta.env.VITE_ENABLE_GALLERY !== 'false',
    enableNewsletter: import.meta.env.VITE_ENABLE_NEWSLETTER !== 'false'
  },
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID
  },
  social: {
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK,
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM,
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN
  },
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'contact@gmail.com',
    phone: import.meta.env.VITE_CONTACT_PHONE || '+91 6300472707'
  },
  auth: {
    tokenKey: 'token',
    userKey: 'user',
    expiryKey: 'tokenExpiry'
  }
};

export default config;