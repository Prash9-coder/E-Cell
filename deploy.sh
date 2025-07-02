#!/bin/bash

# E-Cell Deployment Script
# This script helps prepare your project for deployment

echo "🚀 E-Cell Deployment Preparation Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
echo "Installing root dependencies..."
npm install

echo "Installing frontend dependencies..."
cd frontend && npm install
cd ..

echo "Installing backend dependencies..."
cd backend && npm install
cd ..

echo "🏗️ Building frontend..."
cd frontend && npm run build
cd ..

echo "🧪 Running health check..."
cd backend && npm run health
cd ..

echo "✅ Deployment preparation completed!"
echo ""
echo "Next steps:"
echo "1. Update environment variables in .env.production files"
echo "2. Deploy backend to Railway"
echo "3. Deploy frontend to Vercel"
echo "4. Update cross-references between services"
echo ""
echo "See DEPLOYMENT_GUIDE.md for detailed instructions"