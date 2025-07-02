/**
 * Middleware to check if user is an admin
 */
export const isAdmin = (req, res, next) => {
  // Check if user exists in request
  if (!req.user) {
    console.error('isAdmin middleware: No user found in request');
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // Log the user role for debugging
  console.log(`isAdmin middleware: User ${req.user.name} (${req.user._id}) has role: ${req.user.role}`);
  
  // Check if user has admin role
  if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
    console.error(`isAdmin middleware: Access denied for user with role ${req.user.role}`);
    return res.status(403).json({ message: 'Access denied. Admin role required' });
  }
  
  // Allow access for admin users
  console.log(`isAdmin middleware: Access granted for admin user ${req.user.name}`);
  next();
};

/**
 * Middleware to check if user is a super admin
 */
export const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'super-admin') {
    return res.status(403).json({ message: 'Access denied. Super Admin role required' });
  }
  
  next();
};