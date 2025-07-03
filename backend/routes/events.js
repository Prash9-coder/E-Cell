import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roles.js';
import { transformEventRequest, transformEventResponse } from '../middleware/eventTransform.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const eventsDir = path.join(uploadsDir, 'events');

// Ensure both directories exist
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(eventsDir)) {
  console.log('Creating events uploads directory:', eventsDir);
  fs.mkdirSync(eventsDir, { recursive: true });
}

console.log('Events uploads directory:', eventsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Multer destination:', eventsDir);
    cb(null, eventsDir);
  },
  filename: function (req, file, cb) {
    console.log('Multer filename:', file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'event-' + uniqueSuffix + ext;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    console.log('Multer fileFilter:', file.mimetype, file.originalname);
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed (jpg, jpeg, png, gif)'));
    }
    cb(null, true);
  }
});

// Apply response transformation middleware to all routes
router.use(transformEventResponse);

/**
 * @route   GET /api/events
 * @desc    Get all events with pagination and filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      isPast,
      isFeatured 
    } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by past/upcoming
    if (isPast !== undefined) {
      query.isPast = isPast === 'true';
    }
    
    // Filter by featured
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }
    
    // Search in title, description, location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const events = await Event.find(query)
      .sort({ date: isPast === 'true' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    // Get total count for pagination
    const total = await Event.countDocuments(query);
    
    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching event with ID:', req.params.id);
    
    // Try to find the event by ID (could be ObjectId or numeric ID)
    let event;
    
    // First try to find by MongoDB ObjectId
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        event = await Event.findById(req.params.id);
      }
    } catch (idError) {
      console.log('Error finding event by ObjectId:', idError.message);
    }
    
    // If not found, try to find by numeric ID (for mock data)
    if (!event) {
      console.log('Event not found by ObjectId, trying numeric ID');
      event = await Event.findOne({ id: req.params.id });
    }
    
    // If still not found, create a mock event for development
    if (!event && process.env.NODE_ENV !== 'production') {
      console.log('Creating mock event for development');
      
      // Create a new event with the mock data
      event = new Event({
        title: 'Mock Event ' + req.params.id,
        slug: 'mock-event-' + req.params.id,
        description: 'This is a mock event for development',
        longDescription: 'This is a mock event created for development purposes',
        date: new Date(),
        time: '10:00 AM - 4:00 PM',
        location: 'Virtual',
        category: 'workshop',
        registrations: [],
        createdBy: '000000000000000000000000', // Dummy ObjectId
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Save the mock event
      await event.save();
      console.log('Created mock event with ID:', event._id);
    }
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/events/slug/:slug
 * @desc    Get event by slug
 * @access  Public
 */
router.get('/slug/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/events/upload
 * @desc    Upload event image
 * @access  Private (Admin only)
 */
router.post('/upload', authenticate, isAdmin, upload.single('image'), (req, res) => {
  try {
    console.log('File upload request received');
    console.log('File:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Construct the URL for the uploaded file
    const imageUrl = `/uploads/events/${req.file.filename}`;
    
    console.log('File uploaded successfully:', imageUrl);
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      message: 'Error uploading file', 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/events
 * @desc    Create a new event
 * @access  Private (Admin only)
 */
router.post('/', authenticate, isAdmin, transformEventRequest, async (req, res) => {
  try {
    console.log('Creating new event. User:', req.user.name, 'Role:', req.user.role);
    console.log('Event data received:', JSON.stringify(req.body, null, 2));
    
    // Add the current user as the creator
    if (req.user && req.user.id) {
      req.body.createdBy = req.user.id;
      
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(req.body.createdBy)) {
        console.error('Invalid createdBy ObjectId:', req.body.createdBy);
        
        // Try to find or create a default admin user
        try {
          let adminUser = await User.findOne({ email: 'admin@gmail.com' });
          if (!adminUser) {
            console.log('Creating default admin user for event creation...');
            adminUser = new User({
              name: 'Admin User',
              email: 'admin@gmail.com',
              password: 'tempPassword', // This should be hashed in production
              role: 'admin'
            });
            await adminUser.save();
            console.log('Default admin user created with ID:', adminUser._id);
          }
          req.body.createdBy = adminUser._id;
        } catch (userError) {
          console.error('Error handling admin user:', userError);
          return res.status(400).json({ 
            message: 'Invalid user ID format', 
            error: 'createdBy must be a valid ObjectId' 
          });
        }
      }
    } else {
      console.error('No user ID in request');
      return res.status(401).json({ 
        message: 'Authentication required', 
        error: 'User ID is required for event creation' 
      });
    }
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'longDescription', 'date', 'time', 'location', 'category'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        console.error(`Missing required field: ${field}`);
        return res.status(400).json({ 
          message: `Missing required field: ${field}`, 
          error: `${field} is required` 
        });
      }
    }
    
    // Create and save the event
    const event = new Event(req.body);
    console.log('Event object created, attempting to save...');
    await event.save();
    
    console.log('Event created successfully:', event._id);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        error: validationErrors.join(', '),
        details: error.errors
      });
    }
    
    // Handle MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate event', 
        error: 'An event with this title already exists' 
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/events/:id
 * @desc    Update an event
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, isAdmin, transformEventRequest, async (req, res) => {
  try {
    console.log(`Updating event ${req.params.id}. User:`, req.user.name, 'Role:', req.user.role);
    console.log('Update data:', req.body);
    
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      console.log(`Event not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Update the event
    event = await Event.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    console.log('Event updated successfully');
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    await event.deleteOne();
    
    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/events/:id/register
 * @desc    Register for an event
 * @access  Public (allows unauthenticated users to register)
 */
router.post('/:id/register', async (req, res) => {
  try {
    console.log('Registering for event with ID:', req.params.id);
    
    // Try to find the event by ID (could be ObjectId or numeric ID)
    let event;
    
    // First try to find by MongoDB ObjectId
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        event = await Event.findById(req.params.id);
      }
    } catch (idError) {
      console.log('Error finding event by ObjectId:', idError.message);
    }
    
    // If not found, try to find by numeric ID (for mock data)
    if (!event) {
      console.log('Event not found by ObjectId, trying numeric ID');
      event = await Event.findOne({ id: req.params.id });
    }
    
    // If still not found, create a mock event for development
    if (!event && process.env.NODE_ENV !== 'production') {
      console.log('Creating mock event for development');
      
      // Generate a unique slug
      const timestamp = Date.now();
      const uniqueSlug = `mock-event-${timestamp}`;
      
      // Create a new event with the mock data
      event = new Event({
        title: `Mock Event ${timestamp}`,
        slug: uniqueSlug,
        description: 'This is a mock event for development',
        longDescription: 'This is a mock event created for development purposes',
        date: new Date(),
        time: '10:00 AM - 4:00 PM',
        location: 'Virtual',
        category: 'workshop',
        registrations: [],
        createdBy: '000000000000000000000000', // Dummy ObjectId
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      try {
        // Save the mock event
        await event.save();
        console.log('Created mock event with ID:', event._id);
      } catch (saveError) {
        console.error('Error creating mock event:', saveError);
        throw saveError;
      }
    }
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if event is full
    if (event.maxParticipants > 0 && event.registrations.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }
    
    // Get user info from request body
    const { name, email, phone, college, year, expectations } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    // Create registration object
    const registration = {
      // If user is authenticated, link to their account
      user: req.user ? req.user.id : null,
      name,
      email,
      phone,
      college,
      year,
      expectations,
      registeredAt: Date.now()
    };
    
    // Add registration to event
    console.log('Before adding registration, event has:', event.registrations.length, 'registrations');
    event.registrations.push(registration);
    console.log('After adding registration, event has:', event.registrations.length, 'registrations');
    
    try {
      console.log('Attempting to save event with new registration...');
      const savedEvent = await event.save();
      console.log('Event saved successfully with new registration.');
      console.log('Saved event now has:', savedEvent.registrations.length, 'registrations');
      console.log('Last registration:', savedEvent.registrations[savedEvent.registrations.length - 1]);
      
      console.log(`New registration for event ${event.title}: ${name} (${email})`);
      
      res.status(201).json({ 
        message: 'Registration successful', 
        registration 
      });
    } catch (saveError) {
      console.error('Error saving event with new registration:', saveError);
      res.status(500).json({ 
        message: 'Error saving registration', 
        error: saveError.message 
      });
    }
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/events/:id/registrations
 * @desc    Get all registrations for an event
 * @access  Private (Admin only)
 */
router.get('/:id/registrations', authenticate, isAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registrations.user', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event.registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/events/:id/attendance
 * @desc    Mark attendance for event participants
 * @access  Private (Admin only)
 */
router.put('/:id/attendance', authenticate, isAdmin, async (req, res) => {
  try {
    const { registrationIds } = req.body;
    
    if (!registrationIds || !Array.isArray(registrationIds)) {
      return res.status(400).json({ message: 'Registration IDs are required' });
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Update attendance status
    registrationIds.forEach(id => {
      const registration = event.registrations.id(id);
      if (registration) {
        registration.attended = true;
      }
    });
    
    await event.save();
    
    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;