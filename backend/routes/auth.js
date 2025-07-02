import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role
    });

    // Save user to database (password hashing is done in the pre-save hook)
    await user.save();

    // Generate JWT token
    const token = user.getSignedJwtToken();
    
    // Return user data and token
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in register:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`Login attempt for email: ${email}`);

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`Login failed: User not found for email ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password using the model method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Login failed: Invalid password for email ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login time
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate JWT token
    const token = user.getSignedJwtToken();
    
    // Parse the token to get expiration time
    const tokenData = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const expiresAt = new Date(tokenData.exp * 1000).toISOString();
    
    console.log(`Login successful for ${user.name} (${user._id}), role: ${user.role}`);
    console.log(`Token expires at: ${expiresAt}`);
    
    // Return user data and token
    res.json({
      success: true,
      token,
      expiresAt,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Error in login:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    // User is already available in req.user from the authenticate middleware
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Error in get user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    
    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    // In a production app, you would send an email here
    console.log(`Password reset link: ${resetUrl}`);
    
    res.json({ 
      success: true, 
      message: 'Password reset email sent',
      // Only in development, send the token directly
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl })
    });
  } catch (error) {
    console.error('Error in forgot password:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/reset-password/:resetToken
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset-password/:resetToken', async (req, res) => {
  try {
    const { password } = req.body;
    
    // Hash the reset token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');
    
    // Find user by reset token and check if it's expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in reset password:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;