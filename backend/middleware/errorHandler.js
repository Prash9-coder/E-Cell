/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, statusCode, code = 'SERVER_ERROR', data = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.data = data;
    this.isOperational = true; // Indicates this is an operational error, not a programming error
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  // Log error details (but not in test environment)
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
      userId: req.user ? req.user._id : 'unauthenticated'
    });
  }
  
  // Default error response
  let errorResponse = {
    success: false,
    message: 'Something went wrong',
    code: 'SERVER_ERROR',
    statusCode: err.statusCode || 500
  };
  
  // Add request ID if available (useful for tracking errors in logs)
  if (req.id) {
    errorResponse.requestId = req.id;
  }
  
  // Handle ApiError instances
  if (err instanceof ApiError) {
    errorResponse.message = err.message;
    errorResponse.code = err.code;
    errorResponse.statusCode = err.statusCode;
    
    // Include additional data if available
    if (err.data) {
      errorResponse.data = err.data;
    }
  }
  // Mongoose validation error
  else if (err.name === 'ValidationError') {
    errorResponse.statusCode = 400;
    errorResponse.code = 'VALIDATION_ERROR';
    
    // Format validation errors
    const validationErrors = {};
    Object.keys(err.errors).forEach(field => {
      validationErrors[field] = err.errors[field].message;
    });
    
    errorResponse.message = 'Validation failed';
    errorResponse.data = { validationErrors };
  }
  // Mongoose duplicate key error
  else if (err.code === 11000) {
    errorResponse.statusCode = 400;
    errorResponse.code = 'DUPLICATE_KEY';
    errorResponse.message = 'Duplicate field value entered';
    
    // Try to extract the duplicate field
    const field = Object.keys(err.keyPattern)[0];
    if (field) {
      errorResponse.data = { field };
    }
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    errorResponse.statusCode = 401;
    errorResponse.code = 'INVALID_TOKEN';
    errorResponse.message = 'Invalid authentication token';
  }
  else if (err.name === 'TokenExpiredError') {
    errorResponse.statusCode = 401;
    errorResponse.code = 'TOKEN_EXPIRED';
    errorResponse.message = 'Authentication token has expired';
  }
  // SyntaxError (usually from JSON parsing)
  else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    errorResponse.statusCode = 400;
    errorResponse.code = 'INVALID_JSON';
    errorResponse.message = 'Invalid JSON in request body';
  }
  // Default for other errors
  else {
    errorResponse.message = err.message || 'Internal server error';
    
    // Don't expose internal error details in production
    if (process.env.NODE_ENV === 'production') {
      errorResponse.message = 'An unexpected error occurred';
    }
  }
  
  // Send the error response
  res.status(errorResponse.statusCode).json({
    success: false,
    message: errorResponse.message,
    code: errorResponse.code,
    ...(errorResponse.data && { data: errorResponse.data }),
    ...(errorResponse.requestId && { requestId: errorResponse.requestId })
  });
};