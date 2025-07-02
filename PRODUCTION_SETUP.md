# E-Cell Website Production Setup Guide

This guide provides instructions for setting up the E-Cell website in a production environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Security Considerations](#security-considerations)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (v4.4 or higher)
- A server or cloud hosting service (AWS, DigitalOcean, Heroku, etc.)
- Domain name (optional but recommended)
- SSL certificate (recommended for production)

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Connection
# Use a secure MongoDB connection string with authentication
MONGO_URI=mongodb+srv://username:password@your-cluster.mongodb.net/ecell

# JWT Configuration
# Generate a strong random string for JWT_SECRET
# You can use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_generated_secure_jwt_secret
JWT_EXPIRE=7d

# Frontend URL (for CORS and email links)
FRONTEND_URL=https://your-domain.com

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=E-Cell <your-email@gmail.com>

# Admin User (for initial setup)
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=strong_password_here

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5000000
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=combined

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_MESSAGE=Too many requests from this IP, please try again after 15 minutes

# Security
COOKIE_SECRET=your_generated_secure_cookie_secret
ENABLE_HTTPS=true
CORS_ORIGIN=https://your-domain.com

# Session Configuration
SESSION_SECRET=your_generated_secure_session_secret
SESSION_EXPIRY=86400000

# API Configuration
API_VERSION=v1
API_PREFIX=/api

# Maintenance Mode
MAINTENANCE_MODE=false
```

### Frontend Environment Variables

Create a `.env.production` file in the frontend directory with the following variables:

```
# API Configuration
VITE_API_URL=https://api.your-domain.com/api

# Application Configuration
VITE_APP_NAME=E-Cell
VITE_APP_DESCRIPTION=Entrepreneurship Cell Website
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_BLOG=true
VITE_ENABLE_GALLERY=true
VITE_ENABLE_NEWSLETTER=true

# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Social Media
VITE_SOCIAL_TWITTER=https://twitter.com/your_ecell
VITE_SOCIAL_FACEBOOK=https://facebook.com/your_ecell
VITE_SOCIAL_INSTAGRAM=https://instagram.com/your_ecell
VITE_SOCIAL_LINKEDIN=https://linkedin.com/company/your_ecell

# Contact Information
VITE_CONTACT_EMAIL=contact@your-domain.com
VITE_CONTACT_PHONE=+91 1234567890
```

## Database Setup

### MongoDB Atlas Setup (Recommended)

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database access with a secure username and password
4. Configure network access (IP whitelist)
5. Get your connection string and add it to your `.env` file as `MONGO_URI`

### Self-Hosted MongoDB

If you're hosting MongoDB yourself:

1. Install MongoDB on your server
2. Configure authentication
3. Create a database for the application
4. Set up regular backups
5. Update your `.env` file with the connection string

## Backend Deployment

### Option 1: Traditional Server Deployment

1. Clone the repository on your server
2. Install dependencies:
   ```bash
   cd backend
   npm install --production
   ```
3. Create the `.env` file with your production settings
4. Start the server with a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name ecell-backend
   pm2 save
   pm2 startup
   ```

### Option 2: Docker Deployment

1. Create a `Dockerfile` in the backend directory:
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 5000
   CMD ["node", "server.js"]
   ```
2. Build and run the Docker image:
   ```bash
   docker build -t ecell-backend .
   docker run -d -p 5000:5000 --env-file .env --name ecell-backend ecell-backend
   ```

## Frontend Deployment

### Build the Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create the `.env.production` file with your production settings
3. Build the application:
   ```bash
   npm run build
   ```
4. The build output will be in the `dist` directory

### Deployment Options

#### Option 1: Static Hosting

Deploy the contents of the `dist` directory to a static hosting service like:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

#### Option 2: Serve from the Backend

You can serve the frontend from the backend server by copying the `dist` directory to the backend's public directory.

## Security Considerations

1. **Use HTTPS**: Always use HTTPS in production
2. **Secure Secrets**: Never commit `.env` files to version control
3. **Regular Updates**: Keep all dependencies updated
4. **Database Security**:
   - Use strong passwords
   - Restrict network access
   - Enable authentication
5. **API Security**:
   - Implement rate limiting
   - Use proper authentication and authorization
   - Validate all inputs

## Monitoring and Maintenance

### Monitoring

1. Set up application monitoring with services like:
   - New Relic
   - Datadog
   - Sentry

2. Configure server monitoring:
   - CPU usage
   - Memory usage
   - Disk space
   - Network traffic

### Backups

1. Set up regular database backups
2. Store backups in a secure location
3. Test backup restoration periodically

### Updates and Maintenance

1. Regularly update dependencies
2. Apply security patches promptly
3. Monitor application logs for errors
4. Schedule regular maintenance windows

## Conclusion

Following this guide will help you set up a secure and reliable production environment for the E-Cell website. Remember to regularly review and update your security practices and keep all software components up to date.

For any issues or questions, please refer to the project documentation or contact the development team.