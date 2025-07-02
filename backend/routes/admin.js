import express from 'express';
import mongoose from 'mongoose';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/admin
 * @desc    Admin root endpoint
 * @access  Private (Admin only)
 */
router.get('/', authenticate, authorize('admin', 'super-admin'), (req, res) => {
  res.json({ 
    message: 'Admin API endpoint', 
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin only)
 */
router.get('/dashboard', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    // Get database connection
    const db = mongoose.connection.db;
    
    // Get collection counts
    const [
      userCount,
      eventCount,
      startupCount,
      postCount
    ] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('events').countDocuments(),
      db.collection('startups').countDocuments(),
      db.collection('posts').countDocuments()
    ]);
    
    // Get recent users
    const recentUsers = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    // Get upcoming events
    const upcomingEvents = await db.collection('events')
      .find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(3)
      .toArray();
    
    // Get recent startups
    const recentStartups = await db.collection('startups')
      .find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();
    
    // Return dashboard data
    res.json({
      stats: {
        users: userCount,
        events: eventCount,
        startups: startupCount,
        posts: postCount
      },
      recentUsers: recentUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt
      })),
      upcomingEvents: upcomingEvents.map(event => ({
        id: event._id,
        title: event.title,
        date: event.date,
        registrations: event.registrations?.length || 0
      })),
      recentStartups: recentStartups.map(startup => ({
        id: startup._id,
        name: startup.name,
        category: startup.industry || startup.category,
        status: startup.status
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard data', 
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/admin/system
 * @desc    Get system information
 * @access  Private (Admin only)
 */
router.get('/system', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    // Get MongoDB stats
    const dbStats = await mongoose.connection.db.stats();
    
    // Get Node.js info
    const systemInfo = {
      node: process.version,
      platform: process.platform,
      memory: {
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
      },
      uptime: Math.round(process.uptime())
    };
    
    // Return system info
    res.json({
      database: {
        name: dbStats.db,
        collections: dbStats.collections,
        documents: dbStats.objects,
        storageSize: Math.round(dbStats.storageSize / 1024 / 1024),
        indexes: dbStats.indexes,
        indexSize: Math.round(dbStats.indexSize / 1024 / 1024)
      },
      system: systemInfo,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Error fetching system information:', error);
    res.status(500).json({ 
      message: 'Error fetching system information', 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/admin/maintenance
 * @desc    Toggle maintenance mode
 * @access  Private (Super Admin only)
 */
router.post('/maintenance', authenticate, authorize('super-admin'), async (req, res) => {
  try {
    const { enabled, message } = req.body;
    
    // In a real app, you would update this in a settings collection
    // For now, we'll just return a success message
    
    res.json({
      success: true,
      maintenance: {
        enabled: !!enabled,
        message: message || 'The site is currently undergoing scheduled maintenance.'
      }
    });
  } catch (error) {
    console.error('Error toggling maintenance mode:', error);
    res.status(500).json({ 
      message: 'Error toggling maintenance mode', 
      error: error.message 
    });
  }
});

export default router;