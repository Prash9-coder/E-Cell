import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Central configuration object that loads all environment variables
 * with validation and default values
 */
const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    env: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || '/api',
    apiVersion: process.env.API_VERSION || 'v1',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
    maintenanceMessage: process.env.MAINTENANCE_MESSAGE || 'The site is currently undergoing scheduled maintenance.'
  },
  
  // Database configuration
  db: {
    uri: process.env.MONGO_URI || 'mongodb+srv://E-Cell:E-Cell@cluster0.lgsf3pb.mongodb.net/ecell',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'development_jwt_secret',
    expire: process.env.JWT_EXPIRE || '3M'
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  
  // Frontend URL
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173'
  },
  
  // Email configuration
  email: {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'nimmalaprashanth9@gmail.com',
      pass: process.env.EMAIL_PASSWORD || '1090@Pr0'
    },
    from: process.env.EMAIL_FROM || 'E-Cell <noreply@gmail.com>'
  },
  
  // Admin user configuration
  admin: {
    name: process.env.ADMIN_NAME || 'Nimmala Prashanth',
    email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  },
  
  // File upload configuration
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5000000', 10),
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(',')
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || (process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
  },
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again after 15 minutes'
  },
  
  // Security configuration
  security: {
    cookieSecret: process.env.COOKIE_SECRET || 'development_cookie_secret',
    enableHttps: process.env.ENABLE_HTTPS === 'true',
    sessionSecret: process.env.SESSION_SECRET || 'development_session_secret',
    sessionExpiry: parseInt(process.env.SESSION_EXPIRY || '86400000', 10)
  }
};

// Validate critical configuration
const validateConfig = () => {
  const errors = [];
  
  // Check for JWT secret in production
  if (config.server.env === 'production' && 
      (config.jwt.secret === 'development_jwt_secret' || 
       config.jwt.secret === 'your_jwt_secret_key_change_this_in_production')) {
    errors.push('JWT_SECRET must be set to a secure value in production');
  }
  
  // Check for MongoDB URI in production
  if (config.server.env === 'production' && config.db.uri.includes('localhost')) {
    errors.push('MONGO_URI should not use localhost in production');
  }
  
  // Check for cookie and session secrets in production
  if (config.server.env === 'production' && 
      (config.security.cookieSecret === 'development_cookie_secret' || 
       config.security.sessionSecret === 'development_session_secret')) {
    errors.push('COOKIE_SECRET and SESSION_SECRET must be set to secure values in production');
  }
  
  // Log warnings for missing email configuration
  if (!config.email.host || !config.email.auth.user || !config.email.auth.pass) {
    console.warn('⚠️ Email configuration is incomplete. Password reset and email verification will not work.');
  }
  
  // If there are errors in production, exit the process
  if (errors.length > 0 && config.server.env === 'production') {
    console.error('❌ Configuration errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  } else if (errors.length > 0) {
    // Just warn in development
    console.warn('⚠️ Configuration warnings:');
    errors.forEach(error => console.warn(`  - ${error}`));
  }
};

// Run validation
validateConfig();

export default config;