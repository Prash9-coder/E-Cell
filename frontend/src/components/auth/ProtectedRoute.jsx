import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * Enhanced Protected Route component with advanced security features:
 * - Role-based access control
 * - Permission-based access control
 * - Token validation
 * - Secure redirects with return paths
 * - Detailed security logging
 */
const ProtectedRoute = ({ 
  requireAdmin = false,
  requiredPermissions = [],
  redirectTo = "/admin/login"
}) => {
  const { 
    currentUser, 
    loading, 
    isAdmin, 
    hasPermission, 
    validateToken 
  } = useAuth();
  
  const [tokenValidated, setTokenValidated] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const location = useLocation();
  
  // Validate token on component mount
  useEffect(() => {
    const checkToken = async () => {
      try {
        if (!loading) {
          const isValid = await validateToken();
          setTokenValid(isValid);
          setTokenValidated(true);
          
          if (!isValid) {
            console.warn('ProtectedRoute: Token validation failed');
            // Store the current path to redirect back after login
            sessionStorage.setItem('returnPath', location.pathname);
          }
        }
      } catch (error) {
        console.error('ProtectedRoute: Error validating token', error);
        setTokenValid(false);
        setTokenValidated(true);
      }
    };
    
    checkToken();
  }, [loading, validateToken, location.pathname]);
  
  // Show loading spinner while checking authentication
  if (loading || !tokenValidated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" message="Verifying authentication..." />
      </div>
    );
  }
  
  // If token is invalid or user is not authenticated, redirect to login
  if (!tokenValid || !currentUser) {
    console.log('ProtectedRoute: Authentication required, redirecting to login');
    
    // Store the current path to redirect back after login
    sessionStorage.setItem('returnPath', location.pathname);
    
    // Add a message to show after redirect
    sessionStorage.setItem('authMessage', 'Please log in to access this page');
    
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  
  // Check admin role if required
  if (requireAdmin && !isAdmin()) {
    console.warn(`ProtectedRoute: Admin access required but user (${currentUser.email}) is not an admin`);
    
    // Log security event in non-production environments
    if (import.meta.env.MODE !== 'production') {
      console.error('Security Event: Unauthorized admin access attempt', {
        user: currentUser.email,
        role: currentUser.role,
        path: location.pathname,
        timestamp: new Date().toISOString()
      });
    }
    
    // Store unauthorized access message
    sessionStorage.setItem('authMessage', 'You do not have permission to access the admin area');
    
    return <Navigate to="/" replace />;
  }
  
  // Check required permissions if specified
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );
    
    if (!hasAllPermissions) {
      console.warn(`ProtectedRoute: User (${currentUser.email}) lacks required permissions`, {
        required: requiredPermissions,
        userPermissions: currentUser.permissions || []
      });
      
      // Log security event in non-production environments
      if (import.meta.env.MODE !== 'production') {
        console.error('Security Event: Permission denied', {
          user: currentUser.email,
          role: currentUser.role,
          requiredPermissions,
          userPermissions: currentUser.permissions || [],
          path: location.pathname,
          timestamp: new Date().toISOString()
        });
      }
      
      // Store permission denied message
      sessionStorage.setItem('authMessage', 'You do not have permission to access this resource');
      
      return <Navigate to="/" replace />;
    }
  }
  
  // If authenticated and has required role/permissions, render the child routes
  console.log(`ProtectedRoute: User (${currentUser.email}) authenticated with proper permissions`);
  return <Outlet />;
};

export default ProtectedRoute;