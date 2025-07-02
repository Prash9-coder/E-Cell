import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to authenticate users via JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    // Handle different token formats
    let token;
    if (!authHeader) {
      token = null;
    } else if (authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    } else {
      token = authHeader;
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }
    
    try {
      // Make sure we have a JWT_SECRET
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-for-development';
      
      // Verify token
      const decoded = jwt.verify(token, jwtSecret);
      
      // Check token expiration
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        return res.status(401).json({ 
          success: false,
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      // Find user by id
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }
      
      // Check if user is active (not suspended or deleted)
      if (user.status === 'suspended' || user.status === 'deleted') {
        return res.status(403).json({
          success: false,
          message: `Your account has been ${user.status}. Please contact support.`,
          code: 'ACCOUNT_INACTIVE'
        });
      }
      
      // Add user and token data to request object
      req.user = user;
      req.token = token;
      req.tokenData = decoded;
      
      // Update last active timestamp (but don't wait for it to complete)
      User.findByIdAndUpdate(user._id, { 
        lastActive: new Date() 
      }, { 
        new: true, 
        validateBeforeSave: false 
      }).catch(err => {
        console.error('Error updating last active timestamp:', err);
      });
      
      // Log successful authentication (only in development)
      if (process.env.NODE_ENV !== 'production') {
        console.log(`User authenticated: ${user.name} (${user._id}), role: ${user.role}`);
      }
      
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.message);
      return res.status(401).json({ 
        success: false,
        message: 'Token is not valid',
        code: 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication',
      code: 'SERVER_ERROR'
    });
  }
};

/**
 * Optional authentication - doesn't require auth but will use it if provided
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const optionalAuth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    
    if (!token) {
      return next();
    }
    
    try {
      // Make sure we have a JWT_SECRET
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-for-development';
      
      // Verify token
      const decoded = jwt.verify(token, jwtSecret);
      
      // Check token expiration
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        return next(); // Token expired, but continue as unauthenticated
      }
      
      // Find user by id
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        // Don't add user to request if account is inactive
        if (user.status === 'suspended' || user.status === 'deleted') {
          return next();
        }
        
        req.user = user;
        req.token = token;
        req.tokenData = decoded;
        
        // Update last active timestamp (but don't wait for it to complete)
        User.findByIdAndUpdate(user._id, { 
          lastActive: new Date() 
        }, { 
          new: true, 
          validateBeforeSave: false 
        }).catch(err => {
          console.error('Error updating last active timestamp:', err);
        });
      }
    } catch (jwtError) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Optional auth: Invalid token, continuing as unauthenticated');
      }
    }
    
    next();
  } catch (error) {
    // Just continue if token is invalid
    console.error('Optional auth error:', error.message);
    next();
  }
};

/**
 * Middleware to authorize users based on roles
 * @param {...String} roles - Roles that are allowed to access the route
 * @returns {Function} Express middleware function
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      // Log unauthorized access attempts in production
      if (process.env.NODE_ENV === 'production') {
        console.warn(`Unauthorized access attempt: User ${req.user._id} (${req.user.email}) with role ${req.user.role} attempted to access a resource requiring roles: ${roles.join(', ')}`);
      }
      
      return res.status(403).json({ 
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    next();
  };
};

/**
 * Middleware to check if user owns a resource or is an admin
 * @param {Function} getResourceOwnerId - Function to extract owner ID from request
 * @returns {Function} Express middleware function
 */
export const ownerOrAdmin = (getResourceOwnerId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }
      
      // Admins can access any resource
      if (req.user.role === 'admin' || req.user.role === 'super-admin') {
        return next();
      }
      
      // Get the owner ID of the resource
      const ownerId = await getResourceOwnerId(req);
      
      // Check if the user is the owner
      if (ownerId && ownerId.toString() === req.user._id.toString()) {
        return next();
      }
      
      // User is not the owner or an admin
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You do not own this resource.',
        code: 'NOT_RESOURCE_OWNER'
      });
    } catch (error) {
      console.error('Owner or admin check error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Server error during authorization',
        code: 'SERVER_ERROR'
      });
    }
  };
};