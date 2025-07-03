import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import config from './config/index.js';

// Import routes
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import startupRoutes from './routes/startups.js';
import blogRoutes from './routes/blog.js';
import galleryRoutes from './routes/gallery.js';
import contactRoutes from './routes/contact.js';
import newsletterRoutes from './routes/newsletter.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import involvementRoutes from './routes/involvement.js';
import teamRoutes from './routes/team.js';
import partnersRoutes from './routes/partners.js';
import incubationRoutes from './routes/incubation.js';
import resourcesRoutes from './routes/resources.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Initialize Express app
const app = express();
const PORT = config.server.port;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow cross-origin resource sharing
})); // Set security headers

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', config.cors.origin], // Allow frontend development server
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: config.rateLimit.message
});
app.use(config.server.apiPrefix, apiLimiter);

// Logging middleware
app.use(morgan(config.logging.format));

// Body parsing middleware
app.use(express.json({ limit: config.upload.maxSize }));
app.use(express.urlencoded({ 
  extended: true, 
  limit: config.upload.maxSize 
}));

// Serve uploaded files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Log the uploads directory path
console.log('Uploads directory:', path.join(__dirname, 'uploads'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/involvement', involvementRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/incubation', incubationRoutes);
app.use('/api/resources', resourcesRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// API-only mode - frontend is deployed separately on Vercel
// Add a simple root route for health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'E-Cell Backend API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      docs: 'Available endpoints: /api/auth, /api/events, /api/startups, /api/blog, /api/gallery, /api/contact, /api/newsletter, /api/users, /api/admin, /api/involvement, /api/team, /api/partners, /api/incubation, /api/resources'
    }
  });
});

// Catch all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.status(404).json({ 
      status: 'error', 
      message: 'API endpoint not found. This is a backend API server. Frontend is deployed separately.',
      availableEndpoints: '/api/*'
    });
  }
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Check for maintenance mode
    if (config.server.maintenanceMode) {
      console.log('⚠️ Server running in MAINTENANCE MODE');
      
      // Override all routes with maintenance message
      app.use('*', (req, res) => {
        res.status(503).json({ 
          status: 'error', 
          message: config.server.maintenanceMessage
        });
      });
    }
    
    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB at:', config.db.uri);
    try {
      await mongoose.connect(config.db.uri, config.db.options);
      console.log('✅ MongoDB connected successfully');
      
      // Test the connection by getting the collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name).join(', '));
      
      // Check if the events collection exists
      const eventsCollection = collections.find(c => c.name === 'events');
      if (eventsCollection) {
        console.log('Events collection found');
        
        // Count the number of events
        const eventCount = await mongoose.connection.db.collection('events').countDocuments();
        console.log('Number of events in database:', eventCount);
      } else {
        console.warn('⚠️ Events collection not found in database');
      }
    } catch (dbError) {
      console.error('❌ MongoDB connection error:', dbError);
      throw dbError;
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`
🚀 Server running in ${config.server.env} mode on port ${PORT}
📁 API available at ${config.server.apiPrefix}
🌐 CORS enabled for ${config.cors.origin}
      `);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

startServer();