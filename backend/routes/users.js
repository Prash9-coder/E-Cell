import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (with pagination and filtering)
 * @access  Private (Admin only)
 */
router.get('/', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query based on filters
    const query = {};
    
    // Filter by role if provided
    if (req.query.role) {
      query.role = req.query.role;
    }
    
    // Filter by search term if provided
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin or own user)
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    // Only allow admins to view other users or users to view themselves
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to view this user' });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error(`Error fetching user with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Admin or own user)
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Only allow admins to update other users or users to update themselves
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    // Get the user to update
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Only admins can update roles
    if (req.body.role && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({ message: 'Not authorized to update user role' });
    }
    
    // Fields that can be updated
    const updatableFields = [
      'name', 'phone', 'college', 'year', 'department', 'bio', 
      'skills', 'interests', 'socialLinks', 'newsletterSubscribed'
    ];
    
    // Add role to updatable fields if user is admin
    if (req.user.role === 'admin' || req.user.role === 'super-admin') {
      updatableFields.push('role');
    }
    
    // Update only allowed fields
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });
    
    // Save the updated user
    await user.save();
    
    res.json({ 
      message: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // Include other updated fields
        ...updatableFields.reduce((obj, field) => {
          obj[field] = user[field];
          return obj;
        }, {})
      }
    });
  } catch (error) {
    console.error(`Error updating user with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting super-admin if current user is not super-admin
    if (user.role === 'super-admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({ message: 'Not authorized to delete a super-admin' });
    }
    
    await user.deleteOne();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(`Error deleting user with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

/**
 * @route   GET /api/users/:id/events
 * @desc    Get events registered by user
 * @access  Private (Admin or own user)
 */
router.get('/:id/events', authenticate, async (req, res) => {
  try {
    // Only allow admins to view other users' events or users to view their own
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to view this user\'s events' });
    }
    
    const user = await User.findById(req.params.id)
      .select('eventsRegistered')
      .populate('eventsRegistered', 'title date location status');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ events: user.eventsRegistered });
  } catch (error) {
    console.error(`Error fetching events for user with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching user events', error: error.message });
  }
});

export default router;