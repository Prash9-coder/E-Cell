import express from 'express';
import Startup from '../models/Startup.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/startups
 * @desc    Get all startups
 * @access  Public
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { industry, stage, featured, status, search } = req.query;
    
    // Build query
    const query = {};
    
    // Only show approved startups to public users
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super-admin')) {
      query.status = 'approved';
    } else if (status) {
      query.status = status;
    }
    
    if (industry) {
      query.industry = industry;
    }
    
    if (stage) {
      query.stage = stage;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const total = await Startup.countDocuments(query);
    const startups = await Startup.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    res.json({
      success: true,
      count: startups.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: startups
    });
  } catch (error) {
    console.error('Error fetching startups:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/startups/:id
 * @desc    Get startup by ID or slug
 * @access  Public
 */
router.get('/:idOrSlug', optionalAuth, async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let startup;
    
    // Check if parameter is a valid MongoDB ID
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      startup = await Startup.findById(idOrSlug);
    } else {
      // If not, treat as slug
      startup = await Startup.findOne({ slug: idOrSlug });
    }
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }
    
    // Check if user can view non-approved startup
    if (startup.status !== 'approved' && 
        (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super-admin'))) {
      return res.status(403).json({
        success: false,
        message: 'This startup is not yet approved'
      });
    }
    
    res.json({
      success: true,
      data: startup
    });
  } catch (error) {
    console.error('Error fetching startup:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/startups
 * @desc    Create a new startup
 * @access  Private
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      name,
      tagline,
      description,
      website,
      foundedYear,
      stage,
      industry,
      location,
      teamSize,
      founders,
      socialMedia
    } = req.body;
    
    // Create new startup
    const startup = new Startup({
      name,
      tagline,
      description,
      website,
      foundedYear,
      stage,
      industry,
      location,
      teamSize,
      founders,
      socialMedia,
      createdBy: req.user.id
    });
    
    // Auto-approve if admin
    if (req.user.role === 'admin' || req.user.role === 'super-admin') {
      startup.status = 'approved';
    }
    
    // Save to database
    await startup.save();
    
    res.status(201).json({
      success: true,
      message: 'Startup created successfully',
      data: startup
    });
  } catch (error) {
    console.error('Error creating startup:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/startups/:id
 * @desc    Update a startup
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    let startup = await Startup.findById(req.params.id);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }
    
    // Check ownership or admin rights
    if (startup.createdBy.toString() !== req.user.id && 
        req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this startup'
      });
    }
    
    // Update fields
    const updatedFields = { ...req.body };
    
    // Only admins can update status and featured flag
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      delete updatedFields.status;
      delete updatedFields.isFeatured;
    }
    
    // Update startup
    startup = await Startup.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Startup updated successfully',
      data: startup
    });
  } catch (error) {
    console.error('Error updating startup:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/startups/:id
 * @desc    Delete a startup
 * @access  Private
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'Startup not found'
      });
    }
    
    // Check ownership or admin rights
    if (startup.createdBy.toString() !== req.user.id && 
        req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this startup'
      });
    }
    
    await startup.remove();
    
    res.json({
      success: true,
      message: 'Startup deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting startup:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;