import express from 'express';
import Contact from '../models/Contact.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit a contact form
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      category
    } = req.body;
    
    // Create new contact entry
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      category,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer || req.headers.referrer
    });
    
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error submitting contact form:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/contact
 * @desc    Get all contact submissions (admin only)
 * @access  Private
 */
router.get('/', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Filtering
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.category) filter.category = req.query.category;
    
    // Search
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { subject: { $regex: req.query.search, $options: 'i' } },
        { message: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email');
    
    res.json({
      success: true,
      count: contacts.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/contact/:id
 * @desc    Get contact by ID
 * @access  Private
 */
router.get('/:id', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/contact/:id
 * @desc    Update contact status, priority, or assign to user
 * @access  Private
 */
router.put('/:id', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const { status, priority, assignedTo, note } = req.body;
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    // Update fields if provided
    if (status) contact.status = status;
    if (priority) contact.priority = priority;
    if (assignedTo) contact.assignedTo = assignedTo;
    
    // Add note if provided
    if (note) {
      contact.notes.push({
        text: note,
        addedBy: req.user.id
      });
    }
    
    await contact.save();
    
    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete contact
 * @access  Private
 */
router.delete('/:id', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    await contact.deleteOne();
    
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;