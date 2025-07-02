import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import IncubationApplication from '../models/IncubationApplication.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Test route to verify the API is working
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Incubation API is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/pitchdecks');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'pitchdeck-' + uniqueSuffix + ext);
  }
});

// File filter to only allow certain file types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.pdf', '.ppt', '.pptx', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, PPT, PPTX, DOC, and DOCX files are allowed.'), false);
  }
};

// Set up multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// @route   POST /api/incubation
// @desc    Submit incubation application
// @access  Public
router.post('/', upload.single('pitchDeck'), async (req, res) => {
  try {
    console.log('Received incubation application request');
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    
    // Extract form data
    const {
      teamName,
      website,
      teamSize,
      leadName,
      leadEmail,
      leadPhone,
      leadRole,
      category, // This might be coming as category instead of industry
      stage,
      description,
      problem,
      solution,
      traction,
      expectations,
      referral
    } = req.body;
    
    // Validate required fields
    if (!teamName) {
      return res.status(400).json({
        success: false,
        message: 'Team name is required'
      });
    }
    
    if (!leadName || !leadEmail || !leadPhone) {
      return res.status(400).json({
        success: false,
        message: 'Lead contact information is required'
      });
    }
    
    // Map category to industry if needed
    const industry = category || req.body.industry;
    
    if (!industry) {
      return res.status(400).json({
        success: false,
        message: 'Industry/Category is required'
      });
    }

    // Create new incubation application
    const application = new IncubationApplication({
      teamName,
      website,
      teamSize,
      leadName,
      leadEmail,
      leadPhone,
      leadRole,
      industry, // Use the mapped value
      stage,
      description,
      problem,
      solution,
      traction,
      expectations,
      referral
    });
    
    console.log('Created application object:', application);

    // Add pitch deck file path if uploaded
    if (req.file) {
      application.pitchDeck = `/uploads/pitchdecks/${req.file.filename}`;
    }

    // Save application to database
    try {
      await application.save();
      console.log('Application saved successfully');
      
      // Return success response
      res.status(201).json({
        success: true,
        message: 'Incubation application submitted successfully',
        data: application
      });
    } catch (saveError) {
      console.error('Error saving application:', saveError);
      
      // Provide more detailed error message for validation errors
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.values(saveError.errors).map(err => err.message);
        
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationErrors,
          details: saveError.message
        });
      }
      
      throw saveError; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error('Error submitting incubation application:', error);
    
    // If there was a file upload, delete it on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    // Send detailed error response
    res.status(500).json({
      success: false,
      message: 'Failed to submit incubation application',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});

// @route   GET /api/incubation
// @desc    Get all incubation applications
// @access  Private/Admin
router.get('/', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }
    
    // Get all applications
    const applications = await IncubationApplication.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error getting incubation applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get incubation applications',
      error: error.message
    });
  }
});

// @route   GET /api/incubation/:id
// @desc    Get incubation application by ID
// @access  Private/Admin
router.get('/:id', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }
    
    // Get application by ID
    const application = await IncubationApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Incubation application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error getting incubation application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get incubation application',
      error: error.message
    });
  }
});

// @route   PUT /api/incubation/:id
// @desc    Update incubation application status
// @access  Private/Admin
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }
    
    const { status } = req.body;
    
    // Validate status
    if (!['pending', 'reviewing', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    // Update application status
    const application = await IncubationApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Incubation application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error updating incubation application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update incubation application',
      error: error.message
    });
  }
});

export default router;