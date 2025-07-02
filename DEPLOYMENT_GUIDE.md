# 🚀 E-Cell Website Deployment Guide
## Vercel (Frontend) + Railway (Backend)

This guide will help you deploy your E-Cell website using Vercel for the frontend and Railway for the backend.

## 📋 Pre-Deployment Checklist

### ✅ Required Actions Before Deployment

1. **Update Email Configuration**
   - [ ] Replace `EMAIL_PASSWORD` in `backend/.env.production` with a valid Gmail App Password
   - [ ] Generate Gmail App Password: [Google Account Settings](https://myaccount.google.com/apppasswords)

2. **Update Domain URLs**
   - [ ] Replace `your-ecell-project.vercel.app` in `backend/.env.production` with your actual Vercel domain
   - [ ] Replace `your-backend-name.up.railway.app` in `frontend/.env.production` with your actual Railway domain

3. **Security Check**
   - [ ] Ensure `.env` files are in `.gitignore` (already configured ✅)
   - [ ] Verify strong passwords are set for admin accounts

## 🚂 Backend Deployment (Railway)

### Step 1: Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up/Sign in with GitHub
3. Connect your GitHub repository

### Step 2: Deploy Backend
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your E-Cell repository
3. Railway will auto-detect your Node.js backend

### Step 3: Configure Environment Variables
In Railway dashboard, go to Variables tab and add:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://E-Cell:E-Cell@cluster0.lgsf3pb.mongodb.net/ecell
JWT_SECRET=e8dc7cdc5e8f5a5e9e3f7d8c4a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4
JWT_EXPIRE=1d
FRONTEND_URL=https://your-ecell-project.vercel.app
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=nimmalaprashanth9@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM=E-Cell <nimmalaprashanth9@gmail.com>
ADMIN_NAME=Nimmala Prashanth
ADMIN_EMAIL=admin@ecell.org
ADMIN_PASSWORD=StrongAdminP@ssw0rd!
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5000000
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
LOG_LEVEL=warn
LOG_FORMAT=combined
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
COOKIE_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
ENABLE_HTTPS=true
CORS_ORIGIN=https://your-ecell-project.vercel.app
SESSION_SECRET=z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1
SESSION_EXPIRY=86400000
API_VERSION=v1
API_PREFIX=/api
MAINTENANCE_MODE=false
```

### Step 4: Configure Build Settings
1. Root Directory: Keep empty (Railway will detect backend automatically)
2. Build Command: `cd backend && npm install`
3. Start Command: `cd backend && npm start`

### Step 5: Deploy
1. Railway will automatically deploy after configuration
2. Note down your Railway URL (e.g., `https://your-app-name.up.railway.app`)

## ⚡ Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Sign in with GitHub
3. Install Vercel CLI (optional): `npm i -g vercel`

### Step 2: Deploy Frontend
1. Click "New Project" → Import your GitHub repository
2. Configure project settings:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables
In Vercel dashboard, go to Settings → Environment Variables and add:

```env
VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
VITE_APP_NAME=E-Cell
VITE_APP_DESCRIPTION=Entrepreneurship Cell Website
VITE_APP_VERSION=1.0.0
VITE_ENABLE_BLOG=true
VITE_ENABLE_GALLERY=true
VITE_ENABLE_NEWSLETTER=true
VITE_CONTACT_EMAIL=contact@ecell.org
VITE_CONTACT_PHONE=+91 6300472707
```

### Step 4: Deploy
1. Vercel will automatically build and deploy
2. Note down your Vercel URL (e.g., `https://your-project.vercel.app`)

## 🔄 Update Cross-References

After both deployments:

1. **Update Railway Environment Variables**:
   - Update `FRONTEND_URL` with your actual Vercel URL
   - Update `CORS_ORIGIN` with your actual Vercel URL

2. **Update Vercel Environment Variables**:
   - Update `VITE_API_URL` with your actual Railway URL

3. **Redeploy Both Services** after URL updates

## 🧪 Testing Your Deployment

### Backend Testing
1. Test health endpoint: `https://your-railway-url.up.railway.app/api/health`
2. Test events endpoint: `https://your-railway-url.up.railway.app/api/events`

### Frontend Testing
1. Visit your Vercel URL
2. Test navigation between pages
3. Test API calls (events, contact form, etc.)

### Integration Testing
1. Test event registration
2. Test contact form submission
3. Test admin login functionality

## 🛠️ Alternative: Render (Backend Alternative)

If you prefer Render over Railway:

### Render Deployment
1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

## 📊 Post-Deployment

### Set Up Monitoring
1. **Railway**: Monitor logs in Railway dashboard
2. **Vercel**: Monitor deployments and analytics in Vercel dashboard
3. **Database**: Monitor MongoDB Atlas usage

### Custom Domain (Optional)
1. **Vercel**: Add custom domain in project settings
2. **Railway**: Configure custom domain in project settings

### SSL/HTTPS
- Both Vercel and Railway provide automatic HTTPS
- No additional configuration needed

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` in backend matches your Vercel URL exactly
   - Check for trailing slashes in URLs

2. **API Connection Issues**
   - Verify `VITE_API_URL` points to correct Railway URL
   - Ensure Railway backend is running (check logs)

3. **Build Failures**
   - Check build logs in respective platforms
   - Ensure all environment variables are set

4. **Database Connection**
   - Verify MongoDB Atlas allows connections from Railway IPs
   - Check MongoDB connection string format

### Getting Help
- Railway: [Documentation](https://docs.railway.app)
- Vercel: [Documentation](https://vercel.com/docs)
- MongoDB: [Atlas Documentation](https://docs.atlas.mongodb.com)

## 🎉 Success!

Once deployed, your E-Cell website will be live and accessible to users worldwide!

**Frontend URL**: `https://your-project.vercel.app`  
**Backend API**: `https://your-backend.up.railway.app/api`

Remember to:
- Monitor both services regularly
- Keep dependencies updated
- Backup your database regularly
- Test thoroughly after any changes