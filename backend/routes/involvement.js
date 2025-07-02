import express from 'express';
import Involvement from '../models/Involvement.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/involvement
 * @desc    Submit a new involvement application
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      year,
      department,
      role,
      otherRole,
      experience,
      skills,
      whyJoin,
      linkedinProfile,
      resumeUrl
    } = req.body;

    // Create new involvement application
    const involvement = new Involvement({
      name,
      email,
      phone,
      college,
      year,
      department,
      role,
      otherRole,
      experience,
      skills,
      whyJoin,
      linkedinProfile,
      resumeUrl
    });

    // Save to database
    await involvement.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully. We will contact you soon!',
      data: involvement
    });
  } catch (error) {
    console.error('Error in involvement submission:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/involvement
 * @desc    Get all involvement applications
 * @access  Private (Admin only)
 */
router.get('/', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    // Query parameters for filtering
    const { status, role, search } = req.query;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get applications with pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const total = await Involvement.countDocuments(query);
    const applications = await Involvement.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Return response with pagination info
    res.json({
      success: true,
      count: applications.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: applications
    });
  } catch (error) {
    console.error('Error fetching involvement applications:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/involvement/:id
 * @desc    Get single involvement application
 * @access  Private (Admin only)
 */
router.get('/:id', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const application = await Involvement.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching involvement application:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/involvement/:id
 * @desc    Update involvement application status
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    // Find application
    let application = await Involvement.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Update fields
    application.status = status || application.status;
    if (notes) application.notes = notes;
    
    // Save changes
    await application.save();
    
    res.json({
      success: true,
      message: 'Application status updated',
      data: application
    });
  } catch (error) {
    console.error('Error updating involvement application:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/involvement/:id
 * @desc    Delete involvement application
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const application = await Involvement.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    await application.remove();
    
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting involvement application:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;