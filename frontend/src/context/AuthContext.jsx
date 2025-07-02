import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

// Create context
const AuthContext = createContext();

// Helper function to check if token is expired
const isTokenExpired = (expiresAt) => {
  if (!expiresAt) return true;
  
  try {
    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();
    
    // Add a 5-minute buffer to ensure we refresh before actual expiration
    return currentTime > (expiryTime - 5 * 60 * 1000);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired if there's an error
  }
};

// Helper function to securely store auth data
const storeAuthData = (token, user, expiresAt) => {
  try {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    if (expiresAt) {
      localStorage.setItem('tokenExpires', expiresAt);
    } else {
      // If no expiration provided, set default to 24 hours from now
      const defaultExpiry = new Date();
      defaultExpiry.setHours(defaultExpiry.getHours() + 24);
      localStorage.setItem('tokenExpires', defaultExpiry.toISOString());
    }
    
    // Store the login timestamp
    localStorage.setItem('loginTime', new Date().toISOString());
    
    return true;
  } catch (error) {
    console.error('Error storing authentication data:', error);
    return false;
  }
};

// Helper function to clear auth data
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('tokenExpires');
  localStorage.removeItem('loginTime');
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenRefreshInProgress, setTokenRefreshInProgress] = useState(false);
  
  // Logout function defined early so it can be used in other functions
  const logout = useCallback(() => {
    console.log('Logging out user');
    clearAuthData();
    setCurrentUser(null);
    setError(null);
    console.log('User logged out successfully');
  }, []);
  
  // Function to validate and refresh token if needed
  const validateToken = useCallback(async (force = false) => {
    try {
      const token = localStorage.getItem('token');
      const tokenExpires = localStorage.getItem('tokenExpires');
      
      if (!token) {
        console.log('No token found, user is not authenticated');
        return false;
      }
      
      // Check if token is expired or force refresh is requested
      if (force || isTokenExpired(tokenExpires)) {
        console.log('Token expired or force refresh requested, attempting to refresh...');
        
        if (tokenRefreshInProgress) {
          console.log('Token refresh already in progress, waiting...');
          return false;
        }
        
        setTokenRefreshInProgress(true);
        
        try {
          // Attempt to refresh the token
          const refreshData = await api.auth.refreshToken();
          
          if (refreshData && refreshData.token) {
            console.log('Token refreshed successfully');
            
            // Store the new token and user data
            storeAuthData(
              refreshData.token, 
              refreshData.user || currentUser, 
              refreshData.expiresAt
            );
            
            // Update current user if provided
            if (refreshData.user) {
              setCurrentUser(refreshData.user);
            }
            
            setTokenRefreshInProgress(false);
            return true;
          } else {
            throw new Error('Invalid refresh response');
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          logout();
          setTokenRefreshInProgress(false);
          return false;
        }
      }
      
      return true; // Token is valid
    } catch (error) {
      console.error('Error validating token:', error);
      logout();
      return false;
    }
  }, [currentUser, logout, tokenRefreshInProgress]);
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          console.log('Token found in localStorage, validating...');
          
          // First set the user from localStorage to avoid flicker
          try {
            const parsedUser = JSON.parse(storedUser);
            setCurrentUser(parsedUser);
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
          }
          
          try {
            // Validate the token with the server
            const userData = await api.auth.getCurrentUser();
            console.log('User data retrieved successfully:', userData);
            
            if (userData && userData.user) {
              setCurrentUser(userData.user);
              console.log('User authenticated:', userData.user.name);
              
              // Update stored user data if it's different
              if (JSON.stringify(userData.user) !== storedUser) {
                localStorage.setItem('user', JSON.stringify(userData.user));
              }
            } else {
              throw new Error('Invalid user data received');
            }
          } catch (error) {
            console.error('Token validation failed:', error);
            clearAuthData();
            setCurrentUser(null);
          }
        } else {
          console.log('No authentication token found');
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        clearAuthData();
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);
  
  // Set up a token refresh interval
  useEffect(() => {
    // If there's no user, don't set up refresh
    if (!currentUser) return;
    
    // Check token validity immediately
    validateToken();
    
    // Refresh token every 15 minutes to keep the session alive
    const refreshInterval = setInterval(() => {
      validateToken(true); // Force refresh
    }, 15 * 60 * 1000); // 15 minutes
    
    return () => clearInterval(refreshInterval);
  }, [currentUser, validateToken]);
  
  // Login user with enhanced security and error handling
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      console.log(`Attempting login for ${email}...`);
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Attempt login
      const data = await api.auth.login({ email, password });
      console.log('Login API response received');
      
      if (!data || !data.token) {
        throw new Error('No token received from server');
      }
      
      // Store authentication data securely
      const stored = storeAuthData(data.token, data.user, data.expiresAt);
      
      if (!stored) {
        throw new Error('Failed to store authentication data');
      }
      
      console.log(`Login successful for ${data.user.name}`);
      setCurrentUser(data.user);
      
      // Track login analytics in non-production environments
      if (import.meta.env.MODE !== 'production') {
        console.log('Login analytics:', {
          timestamp: new Date().toISOString(),
          user: data.user.email,
          role: data.user.role
        });
      }
      
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.status === 401) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.status === 403) {
        errorMessage = 'Your account has been disabled. Please contact an administrator.';
      } else if (error.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Register user with enhanced security and validation
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Validate required fields
      const requiredFields = ['name', 'email', 'password'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      }
      
      console.log('Registering new user:', userData.email);
      
      // Attempt registration
      const data = await api.auth.register(userData);
      
      if (!data || !data.token) {
        throw new Error('No token received from server');
      }
      
      // Store authentication data securely
      const stored = storeAuthData(data.token, data.user, data.expiresAt);
      
      if (!stored) {
        throw new Error('Failed to store authentication data');
      }
      
      console.log(`Registration successful for ${data.user.name}`);
      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.status === 409) {
        errorMessage = 'An account with this email already exists.';
      } else if (error.status === 400) {
        errorMessage = error.message || 'Invalid registration data. Please check your information.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user is admin with role-based authorization
  const isAdmin = useCallback(() => {
    return currentUser && ['admin', 'super-admin'].includes(currentUser.role);
  }, [currentUser]);
  
  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    if (!currentUser || !currentUser.permissions) {
      return false;
    }
    
    // Super admins have all permissions
    if (currentUser.role === 'super-admin') {
      return true;
    }
    
    // Check if user has the specific permission
    return currentUser.permissions.includes(permission);
  }, [currentUser]);
  
  // Forgot password with improved error handling
  const forgotPassword = async (email) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!email) {
        throw new Error('Email is required');
      }
      
      const result = await api.auth.forgotPassword(email);
      
      // Show success message even if the email doesn't exist for security reasons
      return {
        success: true,
        message: 'If an account with that email exists, password reset instructions have been sent.'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      
      // Don't expose whether the email exists or not
      setError('If an account with that email exists, password reset instructions have been sent.');
      
      // Still throw the error for handling in the component
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password with validation
  const resetPassword = async (token, password, confirmPassword) => {
    try {
      setError(null);
      setLoading(true);
      
      // Validate inputs
      if (!token) {
        throw new Error('Reset token is missing or invalid');
      }
      
      if (!password) {
        throw new Error('New password is required');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // Password strength validation
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      const result = await api.auth.resetPassword(token, password);
      
      return {
        success: true,
        message: 'Password has been reset successfully. You can now log in with your new password.'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      
      let errorMessage = 'Password reset failed. Please try again.';
      
      if (error.status === 400) {
        errorMessage = 'Invalid or expired reset token. Please request a new password reset.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!currentUser) {
        throw new Error('You must be logged in to update your profile');
      }
      
      const updatedUser = await api.auth.updateProfile(userData);
      
      if (!updatedUser || !updatedUser.user) {
        throw new Error('Failed to update profile');
      }
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser.user));
      setCurrentUser(updatedUser.user);
      
      return updatedUser.user;
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Change password
  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!currentUser) {
        throw new Error('You must be logged in to change your password');
      }
      
      // Validate inputs
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('All password fields are required');
      }
      
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      // Password strength validation
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }
      
      const result = await api.auth.changePassword({
        currentPassword,
        newPassword
      });
      
      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Change password error:', error);
      
      let errorMessage = 'Failed to change password';
      
      if (error.status === 401) {
        errorMessage = 'Current password is incorrect';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        login,
        register,
        logout,
        isAdmin,
        hasPermission,
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
        validateToken,
        setError // Expose setError to allow components to clear errors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};