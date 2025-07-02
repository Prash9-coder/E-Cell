import express from 'express';
import Team from '../models/Team.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/team
 * @desc    Get all team members
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const query = { isActive: true };
    
    // Allow admins to see inactive team members with a query param
    if (req.query.includeInactive === 'true' && req.user && req.user.role === 'admin') {
      delete query.isActive;
    }
    
    const teamMembers = await Team.find(query).sort({ order: 1, name: 1 });
    
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/team/:id
 * @desc    Get team member by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    // Only allow admins to see inactive team members
    if (!teamMember.isActive && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    res.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/team
 * @desc    Create a new team member
 * @access  Private (Admin only)
 */
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, position, bio, image, social, order, isActive } = req.body;
    
    const teamMember = await Team.create({
      name,
      position,
      bio,
      image,
      social,
      order,
      isActive
    });
    
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/team/:id
 * @desc    Update a team member
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, position, bio, image, social, order, isActive } = req.body;
    
    let teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    teamMember = await Team.findByIdAndUpdate(
      req.params.id,
      {
        name,
        position,
        bio,
        image,
        social,
        order,
        isActive,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    res.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/team/:id
 * @desc    Delete a team member
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    await Team.deleteOne({ _id: teamMember._id });
    
    res.json({ message: 'Team member removed' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;