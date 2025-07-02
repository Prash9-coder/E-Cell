import express from 'express';
import Partner from '../models/Partner.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/partners
 * @desc    Get all partners
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const query = { isActive: true };
    
    // Allow admins to see inactive partners with a query param
    if (req.query.includeInactive === 'true' && req.user && req.user.role === 'admin') {
      delete query.isActive;
    }
    
    // Filter by partnership type if provided
    if (req.query.type && ['sponsor', 'academic', 'industry', 'incubator', 'investor', 'other'].includes(req.query.type)) {
      query.partnershipType = req.query.type;
    }
    
    const partners = await Partner.find(query).sort({ order: 1, name: 1 });
    
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/partners/:id
 * @desc    Get partner by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    // Only allow admins to see inactive partners
    if (!partner.isActive && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    res.json(partner);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/partners
 * @desc    Create a new partner
 * @access  Private (Admin only)
 */
// Temporarily allow creating partners without authentication for testing
router.post('/', async (req, res) => {
  try {
    const { name, logo, website, description, partnershipType, order, isActive } = req.body;
    
    const partner = await Partner.create({
      name,
      logo,
      website,
      description,
      partnershipType,
      order,
      isActive
    });
    
    res.status(201).json(partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/partners/:id
 * @desc    Update a partner
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, logo, website, description, partnershipType, order, isActive } = req.body;
    
    let partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    partner = await Partner.findByIdAndUpdate(
      req.params.id,
      {
        name,
        logo,
        website,
        description,
        partnershipType,
        order,
        isActive,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    res.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/partners/:id
 * @desc    Delete a partner
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    await Partner.deleteOne({ _id: partner._id });
    
    res.json({ message: 'Partner removed' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;