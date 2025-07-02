# 📋 E-Cell Deployment Checklist

## ✅ Pre-Deployment Tasks

### 🔒 Security & Credentials
- [ ] Generate Gmail App Password for email functionality
- [ ] Update `EMAIL_PASSWORD` in `backend/.env.production`
- [ ] Verify all secret keys are secure (JWT_SECRET, COOKIE_SECRET, etc.)
- [ ] Ensure `.env` files are in `.gitignore`

### 🗄️ Database
- [ ] MongoDB Atlas cluster is running
- [ ] Database connection string is correct
- [ ] Test database connectivity: `npm run health`

### 🏗️ Build & Test
- [ ] Frontend builds successfully: `npm run build:frontend`
- [ ] Backend health check passes: `npm run health`
- [ ] All dependencies are installed: `npm run install:all`

## 🚂 Railway Backend Deployment

### Setup
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Create new project from GitHub repo

### Configuration
- [ ] Set all environment variables (copy from `backend/.env.production`)
- [ ] Set build command: `cd backend && npm install`
- [ ] Set start command: `cd backend && npm start`
- [ ] Enable automatic deployments

### Testing
- [ ] Backend deploys successfully
- [ ] Health endpoint works: `https://your-app.up.railway.app/api/health`
- [ ] Events endpoint works: `https://your-app.up.railway.app/api/events`
- [ ] Note down Railway URL: `_______________________`

## ⚡ Vercel Frontend Deployment

### Setup
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Create new project from GitHub repo

### Configuration
- [ ] Set framework: Vite
- [ ] Set root directory: `frontend`
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Set all environment variables (copy from `frontend/.env.production`)

### Testing
- [ ] Frontend deploys successfully
- [ ] Website loads correctly
- [ ] Navigation works
- [ ] Note down Vercel URL: `_______________________`

## 🔄 Cross-Reference Updates

### Update Railway Environment Variables
- [ ] Update `FRONTEND_URL` with actual Vercel URL
- [ ] Update `CORS_ORIGIN` with actual Vercel URL
- [ ] Redeploy Railway service

### Update Vercel Environment Variables
- [ ] Update `VITE_API_URL` with actual Railway URL
- [ ] Redeploy Vercel service

## 🧪 Final Testing

### API Integration
- [ ] Test event registration from frontend
- [ ] Test contact form submission
- [ ] Test newsletter signup
- [ ] Test admin login functionality

### Performance
- [ ] Check page load speeds
- [ ] Test mobile responsiveness
- [ ] Verify image loading

### SEO & Analytics
- [ ] Add Google Analytics ID (if applicable)
- [ ] Test meta tags and descriptions
- [ ] Submit sitemap to search engines

## 📊 Post-Deployment

### Monitoring
- [ ] Set up error monitoring (Sentry/LogRocket)
- [ ] Monitor database usage
- [ ] Check both service dashboards regularly

### Documentation
- [ ] Update README with live URLs
- [ ] Document any deployment-specific configurations
- [ ] Create user guide for admin panel

### Backup & Security
- [ ] Set up database backups
- [ ] Enable security headers
- [ ] Test rate limiting

## 🎉 Go Live!

### Final Steps
- [ ] Announce launch to team
- [ ] Share URLs with stakeholders
- [ ] Monitor first 24 hours closely

### URLs to Share
- **Live Website**: `https://your-project.vercel.app`
- **Admin Panel**: `https://your-project.vercel.app/admin`
- **API Documentation**: `https://your-backend.up.railway.app/api/health`

---

## 📞 Support

If you encounter any issues during deployment:

1. Check deployment logs in respective platforms
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check database connectivity

**Happy Deploying! 🚀**