/**
 * Comprehensive error handling utilities for the application
 */

// Error types for better categorization
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTHENTICATION_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  PERMISSION: 'PERMISSION_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Create a standardized error object with additional metadata
 */
export const createError = (message, type = ErrorTypes.UNKNOWN, originalError = null, metadata = {}) => {
  const error = new Error(message);
  error.type = type;
  error.originalError = originalError;
  error.metadata = metadata;
  error.timestamp = new Date().toISOString();
  
  // Add stack trace in development mode
  if (import.meta.env.MODE !== 'production') {
    error.stack = originalError?.stack || error.stack;
  }
  
  return error;
};

/**
 * Categorize HTTP errors by status code
 */
export const categorizeHttpError = (status) => {
  if (!status) return ErrorTypes.UNKNOWN;
  
  if (status >= 400 && status < 500) {
    if (status === 401 || status === 403) return ErrorTypes.AUTH;
    if (status === 404) return ErrorTypes.NOT_FOUND;
    if (status === 422) return ErrorTypes.VALIDATION;
    return ErrorTypes.CLIENT_ERROR;
  }
  
  if (status >= 500) return ErrorTypes.SERVER;
  
  return ErrorTypes.UNKNOWN;
};

/**
 * Get user-friendly error message based on error type and status
 */
export const getUserFriendlyMessage = (error) => {
  // If it's our custom error object with a message, use that
  if (error.message && error.type) {
    return error.message;
  }
  
  // Handle network errors
  if (error.name === 'TypeError' || error.name === 'AbortError') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  
  // Handle HTTP errors by status code
  if (error.status) {
    switch (error.status) {
      case 400:
        return error.message || 'The request was invalid. Please check your input and try again.';
      case 401:
        return 'You need to log in to access this resource.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'There was a conflict with the current state of the resource.';
      case 422:
        return 'Validation failed. Please check your input and try again.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'An unexpected error occurred on the server. Please try again later.';
      case 503:
        return 'The service is temporarily unavailable. Please try again later.';
      default:
        if (error.status >= 400 && error.status < 500) {
          return error.message || 'There was a problem with your request.';
        }
        if (error.status >= 500) {
          return 'An unexpected server error occurred. Please try again later.';
        }
    }
  }
  
  // Default message for unknown errors
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Log error with appropriate level and details
 */
export const logError = (error, context = {}) => {
  const errorDetails = {
    message: error.message,
    type: error.type || 'UNKNOWN',
    status: error.status,
    timestamp: error.timestamp || new Date().toISOString(),
    context,
    metadata: error.metadata || {}
  };
  
  // Add stack trace in development mode
  if (import.meta.env.MODE !== 'production') {
    errorDetails.stack = error.stack;
  }
  
  // Log with appropriate level based on error type
  if (error.type === ErrorTypes.NETWORK || error.type === ErrorTypes.TIMEOUT) {
    console.warn('Network Error:', errorDetails);
  } else if (error.type === ErrorTypes.VALIDATION) {
    console.warn('Validation Error:', errorDetails);
  } else if (error.type === ErrorTypes.AUTH) {
    console.error('Authentication Error:', errorDetails);
  } else if (error.type === ErrorTypes.SERVER) {
    console.error('Server Error:', errorDetails);
  } else {
    console.error('Error:', errorDetails);
  }
  
  // In production, you could send errors to a monitoring service
  if (import.meta.env.MODE === 'production' && typeof window.reportError === 'function') {
    window.reportError(errorDetails);
  }
};

/**
 * Handle API errors consistently across the application
 */
export const handleApiError = (error, context = {}) => {
  // Categorize the error
  let errorType = error.type;
  
  if (!errorType) {
    if (error.name === 'TypeError' || error.name === 'AbortError') {
      errorType = ErrorTypes.NETWORK;
    } else if (error.status) {
      errorType = categorizeHttpError(error.status);
    } else {
      errorType = ErrorTypes.UNKNOWN;
    }
  }
  
  // Create a standardized error object
  const standardError = createError(
    error.message || getUserFriendlyMessage({ status: error.status }),
    errorType,
    error,
    {
      status: error.status,
      url: error.url,
      data: error.data,
      ...context
    }
  );
  
  // Log the error
  logError(standardError, context);
  
  // Return the standardized error for further handling
  return standardError;
};

export default {
  ErrorTypes,
  createError,
  getUserFriendlyMessage,
  logError,
  handleApiError
};