import express from 'express';
import { Subscriber, Newsletter } from '../models/Newsletter.js';
import { authenticate, authorize } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * @route   POST /api/newsletter/subscribe
 * @desc    Subscribe to newsletter
 * @access  Public
 */
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name, interests } = req.body;
    
    // Check if already subscribed
    let subscriber = await Subscriber.findOne({ email });
    
    if (subscriber) {
      // If inactive, reactivate
      if (!subscriber.isActive) {
        subscriber.isActive = true;
        await subscriber.save();
        return res.json({
          success: true,
          message: 'Your subscription has been reactivated'
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'Email is already subscribed to the newsletter'
      });
    }
    
    // Generate unsubscribe token
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');
    
    // Create new subscriber
    subscriber = new Subscriber({
      email,
      name,
      interests,
      unsubscribeToken
    });
    
    await subscriber.save();
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the newsletter'
    });
  } catch (error) {
    console.error('Error in newsletter subscription:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/newsletter/unsubscribe/:token
 * @desc    Unsubscribe from newsletter
 * @access  Public
 */
router.get('/unsubscribe/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
    
    if (!subscriber) {
      return res.status(400).json({
        success: false,
        message: 'Invalid unsubscribe token'
      });
    }
    
    subscriber.isActive = false;
    await subscriber.save();
    
    res.json({
      success: true,
      message: 'Successfully unsubscribed from the newsletter'
    });
  } catch (error) {
    console.error('Error in newsletter unsubscription:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/newsletter/subscribers
 * @desc    Get all subscribers
 * @access  Private (Admin only)
 */
router.get('/subscribers', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const { active, search } = req.query;
    
    // Build query
    const query = {};
    
    if (active === 'true') {
      query.isActive = true;
    } else if (active === 'false') {
      query.isActive = false;
    }
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    const total = await Subscriber.countDocuments(query);
    const subscribers = await Subscriber.find(query)
      .sort({ subscriptionDate: -1 })
      .skip(startIndex)
      .limit(limit);
    
    res.json({
      success: true,
      count: subscribers.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: subscribers
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/newsletter
 * @desc    Create a new newsletter
 * @access  Private (Admin only)
 */
router.post('/', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const {
      title,
      subject,
      content,
      htmlContent,
      previewText,
      featuredImage,
      tags,
      targetGroups,
      scheduledFor,
      status
    } = req.body;
    
    // Create new newsletter
    const newsletter = new Newsletter({
      title,
      subject,
      content,
      htmlContent,
      previewText,
      featuredImage,
      tags,
      targetGroups,
      scheduledFor,
      status,
      createdBy: req.user.id
    });
    
    await newsletter.save();
    
    res.status(201).json({
      success: true,
      message: 'Newsletter created successfully',
      data: newsletter
    });
  } catch (error) {
    console.error('Error creating newsletter:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/newsletter
 * @desc    Get all newsletters
 * @access  Private (Admin only)
 */
router.get('/', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const { status, search } = req.query;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const total = await Newsletter.countDocuments(query);
    const newsletters = await Newsletter.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('createdBy', 'name email');
    
    res.json({
      success: true,
      count: newsletters.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: newsletters
    });
  } catch (error) {
    console.error('Error fetching newsletters:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/newsletter/:id
 * @desc    Get newsletter by ID
 * @access  Private (Admin only)
 */
router.get('/:id', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter not found'
      });
    }
    
    res.json({
      success: true,
      data: newsletter
    });
  } catch (error) {
    console.error('Error fetching newsletter:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/newsletter/:id
 * @desc    Update newsletter
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    let newsletter = await Newsletter.findById(req.params.id);
    
    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter not found'
      });
    }
    
    // Don't allow editing if already sent
    if (newsletter.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit a newsletter that has already been sent'
      });
    }
    
    // Update newsletter
    newsletter = await Newsletter.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Newsletter updated successfully',
      data: newsletter
    });
  } catch (error) {
    console.error('Error updating newsletter:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/newsletter/:id
 * @desc    Delete newsletter
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    
    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter not found'
      });
    }
    
    // Don't allow deleting if already sent
    if (newsletter.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a newsletter that has already been sent'
      });
    }
    
    await newsletter.remove();
    
    res.json({
      success: true,
      message: 'Newsletter deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting newsletter:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;