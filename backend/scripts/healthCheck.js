/**
 * System health check script
 * 
 * This script checks the health of various components of the system:
 * - MongoDB connection
 * - Required collections
 * - API endpoints
 * - File system access
 */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import http from 'http';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Required collections
const REQUIRED_COLLECTIONS = [
  'users',
  'events',
  'startups',
  'posts',
  'categories'
];

// Required directories
const REQUIRED_DIRS = [
  '../uploads',
  '../uploads/gallery',
  '../uploads/events',
  '../uploads/startups',
  '../uploads/blog'
];

// API endpoints to check
const API_ENDPOINTS = [
  { path: '/api/health', method: 'GET', expectedStatus: 200 },
  { path: '/api/events', method: 'GET', expectedStatus: 200 },
  { path: '/api/blog', method: 'GET', expectedStatus: 200 }
];

/**
 * Check MongoDB connection
 */
async function checkMongoDB() {
  console.log('\n🔍 Checking MongoDB connection...');
  
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://E-Cell:E-Cell@cluster0.lgsf3pb.mongodb.net/ecell';
    await mongoose.connect(uri);
    console.log('✅ MongoDB connection successful');
    
    // Check collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log(`📊 Found ${collections.length} collections: ${collectionNames.join(', ')}`);
    
    // Check required collections
    const missingCollections = REQUIRED_COLLECTIONS.filter(name => !collectionNames.includes(name));
    
    if (missingCollections.length > 0) {
      console.warn(`⚠️ Missing collections: ${missingCollections.join(', ')}`);
    } else {
      console.log('✅ All required collections exist');
    }
    
    // Check document counts
    for (const collection of REQUIRED_COLLECTIONS) {
      if (collectionNames.includes(collection)) {
        const count = await db.collection(collection).countDocuments();
        console.log(`📊 ${collection}: ${count} documents`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

/**
 * Check file system access
 */
function checkFileSystem() {
  console.log('\n🔍 Checking file system access...');
  
  try {
    // Check required directories
    for (const dir of REQUIRED_DIRS) {
      const fullPath = path.join(__dirname, dir);
      
      try {
        if (!fs.existsSync(fullPath)) {
          console.log(`📁 Creating directory: ${fullPath}`);
          fs.mkdirSync(fullPath, { recursive: true });
        }
        
        // Check if directory is writable
        const testFile = path.join(fullPath, '.test-write');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        
        console.log(`✅ Directory ${fullPath} exists and is writable`);
      } catch (err) {
        console.error(`❌ Error with directory ${fullPath}:`, err.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ File system check failed:', error.message);
    return false;
  }
}

/**
 * Check API endpoints
 */
async function checkAPIEndpoints() {
  console.log('\n🔍 Checking API endpoints...');
  
  const port = process.env.PORT || 5000;
  const host = 'localhost';
  
  let allEndpointsOK = true;
  
  for (const endpoint of API_ENDPOINTS) {
    try {
      const result = await new Promise((resolve, reject) => {
        const options = {
          hostname: host,
          port: port,
          path: endpoint.path,
          method: endpoint.method
        };
        
        const req = http.request(options, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              data: data
            });
          });
        });
        
        req.on('error', (error) => {
          reject(error);
        });
        
        req.end();
      });
      
      if (result.statusCode === endpoint.expectedStatus) {
        console.log(`✅ ${endpoint.method} ${endpoint.path} - Status: ${result.statusCode}`);
      } else {
        console.warn(`⚠️ ${endpoint.method} ${endpoint.path} - Expected status ${endpoint.expectedStatus}, got ${result.statusCode}`);
        allEndpointsOK = false;
      }
    } catch (error) {
      console.error(`❌ Error checking ${endpoint.method} ${endpoint.path}:`, error.message);
      allEndpointsOK = false;
    }
  }
  
  return allEndpointsOK;
}

/**
 * Run all health checks
 */
async function runHealthChecks() {
  console.log('🚀 Starting system health check...');
  
  const results = {
    mongodb: await checkMongoDB(),
    filesystem: checkFileSystem(),
    api: await checkAPIEndpoints()
  };
  
  console.log('\n📋 Health Check Summary:');
  console.log('------------------------');
  console.log(`MongoDB: ${results.mongodb ? '✅ OK' : '❌ Failed'}`);
  console.log(`File System: ${results.filesystem ? '✅ OK' : '❌ Failed'}`);
  console.log(`API Endpoints: ${results.api ? '✅ OK' : '❌ Failed'}`);
  console.log('------------------------');
  
  const overallStatus = Object.values(results).every(Boolean);
  console.log(`Overall Status: ${overallStatus ? '✅ System is healthy' : '❌ System has issues'}`);
  
  // Close MongoDB connection
  await mongoose.connection.close();
  
  return overallStatus;
}

// Run the health checks
runHealthChecks()
  .then(status => {
    process.exit(status ? 0 : 1);
  })
  .catch(error => {
    console.error('Error running health checks:', error);
    process.exit(1);
  });