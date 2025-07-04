/**
 * API service for making requests to the backend
 * Includes fallback mechanisms for when the backend is unavailable
 */
import config from '../config';
import mockEventApi from './mockApi';

// Flag to enable mock API in development mode or when backend is not available
const USE_MOCK_API = import.meta.env.MODE !== 'production' || localStorage.getItem('force_mock_api') === 'true';

// Function to check if the backend is available
const checkBackendAvailability = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(`${config.api.url}/health`, { 
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Backend health check failed:', error.message);
    return false;
  }
};

// Initialize backend availability check
let isBackendAvailable = true;
checkBackendAvailability().then(available => {
  isBackendAvailable = available;
  if (!available && import.meta.env.MODE !== 'production') {
    console.warn('⚠️ Backend is not available. Using mock API services.');
    localStorage.setItem('force_mock_api', 'true');
  }
});

/**
 * Get the authentication token from localStorage
 */
const getToken = () => localStorage.getItem('token');

/**
 * Create headers with authentication token if available
 */
const createHeaders = (includeAuth = true, isFormData = false) => {
  const headers = {};
  
  // Only set Content-Type for non-FormData requests
  // For FormData, the browser will automatically set the correct Content-Type with boundary
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      // Ensure token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers['Authorization'] = formattedToken;
      
      // Log headers for debugging (remove in production)
      console.log('Request headers:', { 
        Authorization: formattedToken.substring(0, 20) + '...',
        url: window.location.pathname,
        isFormData
      });
    } else {
      console.warn('No authentication token available for request');
      
      // For development fallback - if we're in admin section but no token
      if (window.location.pathname.startsWith('/admin') && import.meta.env.MODE !== 'production') {
        console.log('Using development fallback token for admin request');
        const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjZhYTNkZTViNGFiYmQ4NzdkM2VjYSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibmFtZSI6IkFkbWluIFVzZXIiLCJpYXQiOjE3NTE1NjA0NzAsImV4cCI6MTc1MTY0Njg3MH0.Rh9KIGCgENhfTbKZ_beY3t7y3gYxlWvYhLJYk7mGaRU';
        headers['Authorization'] = `Bearer ${validToken}`;
      }
    }
  }
  
  return headers;
};

/**
 * Handle API response with comprehensive error handling
 */
const handleResponse = async (response) => {
  // For non-JSON responses (like 204 No Content)
  if (response.status === 204) {
    return { success: true };
  }
  
  // Get the current URL path for auth-related decisions
  const currentPath = window.location.pathname;
  const isAdminRoute = currentPath.startsWith('/admin');
  const isLoginRoute = currentPath.includes('/login');
  
  // Check content type to determine how to parse the response
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  let data;
  try {
    // Parse response based on content type
    data = isJson ? await response.json() : await response.text();
    
    // For text responses, try to create a structured object
    if (!isJson && typeof data === 'string') {
      try {
        // Check if it's actually JSON despite the content type
        const parsedData = JSON.parse(data);
        data = parsedData;
        console.warn('Response was parsed as JSON despite non-JSON content type');
      } catch (parseError) {
        // It's truly a text response, wrap it in an object
        data = { message: data, success: response.ok };
      }
    }
  } catch (error) {
    console.error('Error parsing response:', error, 'Response status:', response.status);
    
    // Handle network errors by switching to mock API in development
    if (error.name === 'TypeError' || error.name === 'AbortError') {
      if (import.meta.env.MODE !== 'production') {
        console.warn('⚠️ Network error detected. Switching to mock API for future requests.');
        localStorage.setItem('force_mock_api', 'true');
        
        // Check if backend is available
        checkBackendAvailability().then(available => {
          isBackendAvailable = available;
          console.log(`Backend availability check: ${available ? 'Available' : 'Unavailable'}`);
        });
      }
    }
    
    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401 && isAdminRoute && !isLoginRoute) {
        handleAuthError('Authentication failed (invalid token)');
      }
      
      // Create a detailed error object
      const errorObj = new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      errorObj.status = response.status;
      errorObj.statusText = response.statusText;
      errorObj.url = response.url;
      throw errorObj;
    }
    
    return { success: response.ok };
  }
  
  // Handle error responses
  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401 && isAdminRoute && !isLoginRoute) {
      handleAuthError(data.message || 'Authentication failed');
    }
    
    // Create a detailed error object with all available information
    let errorMessage = data.message || data.error || response.statusText || 'Request failed';
    
    // For validation errors, provide more specific details
    if (data.details) {
      if (typeof data.details === 'object') {
        const validationErrors = Object.entries(data.details).map(([field, err]) => {
          const message = err.message || err;
          return `${field}: ${message}`;
        }).join(', ');
        errorMessage += ' - ' + validationErrors;
      } else {
        errorMessage += ' - ' + data.details;
      }
    }
    
    // Handle mongoose validation errors
    if (data.errors) {
      const validationErrors = Object.entries(data.errors).map(([field, err]) => {
        const message = err.message || err;
        return `${field}: ${message}`;
      }).join(', ');
      errorMessage += ' - ' + validationErrors;
    }
    
    const errorObj = new Error(errorMessage);
    errorObj.status = response.status;
    errorObj.statusText = response.statusText;
    errorObj.data = data;
    errorObj.url = response.url;
    
    // Log detailed error information
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      message: errorMessage,
      url: response.url,
      data
    });
    
    // Additional debugging for validation errors
    if (data.details) {
      console.error('Validation details:', data.details);
      console.error('Validation details type:', typeof data.details);
      console.error('Validation details stringified:', JSON.stringify(data.details, null, 2));
    }
    
    throw errorObj;
  }
  
  return data;
};

/**
 * Handle authentication errors consistently
 */
const handleAuthError = (message) => {
  console.error('Authentication error:', message);
  
  // Clear authentication data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Create a user-friendly message
  const errorMessage = 'Your session has expired. Please log in again.';
  
  // In production, redirect to login page
  if (import.meta.env.MODE === 'production') {
    // Store the error message to display after redirect
    sessionStorage.setItem('auth_error', errorMessage);
    window.location.href = '/admin/login';
  } else {
    console.warn('Development mode: Not redirecting to login page automatically');
    // Display a notification in development mode
    if (typeof window.showNotification === 'function') {
      window.showNotification(errorMessage, 'error');
    }
  }
};

/**
 * API methods
 */
const api = {
  // Auth endpoints
  auth: {
    login: async (credentials) => {
      try {
        console.log(`Attempting to login with email: ${credentials.email}`);
        console.log('Config API URL:', config.api.url);
        console.log('Full API URL:', `${config.api.url}/auth/login`);
        
        const response = await fetch(`${config.api.url}/auth/login`, {
          method: 'POST',
          headers: createHeaders(false),
          body: JSON.stringify(credentials)
        });
        
        const data = await handleResponse(response);
        console.log('Login successful, received data:', data);
        return data;
      } catch (error) {
        console.error('Login error:', error.message);
        throw error;
      }
    },
    
    register: async (userData) => {
      try {
        console.log('Registering new user:', userData.email);
        
        const response = await fetch(`${config.api.url}/auth/register`, {
          method: 'POST',
          headers: createHeaders(false),
          body: JSON.stringify(userData)
        });
        
        const data = await handleResponse(response);
        console.log('Registration successful');
        return data;
      } catch (error) {
        console.error('Registration error:', error.message);
        throw error;
      }
    },
    
    getCurrentUser: async () => {
      try {
        console.log('Fetching current user data');
        
        const response = await fetch(`${config.api.url}/auth/me`, {
          headers: createHeaders()
        });
        
        const data = await handleResponse(response);
        console.log('Current user data retrieved successfully');
        return data;
      } catch (error) {
        console.error('Error fetching current user:', error.message);
        throw error;
      }
    },
    
    forgotPassword: async (email) => {
      try {
        console.log(`Requesting password reset for: ${email}`);
        
        const response = await fetch(`${config.api.url}/auth/forgot-password`, {
          method: 'POST',
          headers: createHeaders(false),
          body: JSON.stringify({ email })
        });
        
        const data = await handleResponse(response);
        console.log('Password reset request successful');
        return data;
      } catch (error) {
        console.error('Password reset request error:', error.message);
        throw error;
      }
    },
    
    resetPassword: async (token, password) => {
      try {
        console.log('Resetting password with token');
        
        const response = await fetch(`${config.api.url}/auth/reset-password/${token}`, {
          method: 'POST',
          headers: createHeaders(false),
          body: JSON.stringify({ password })
        });
        
        const data = await handleResponse(response);
        console.log('Password reset successful');
        return data;
      } catch (error) {
        console.error('Password reset error:', error.message);
        throw error;
      }
    }
  },
  
  // Events endpoints
  events: {
    getAll: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add all params to query string
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value);
          }
        });
        
        const response = await fetch(`${config.api.url}/events?${queryParams.toString()}`, {
          headers: createHeaders(false)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching events:', error);
        
        // Only fall back to mock data if explicitly enabled
        if (USE_MOCK_API) {
          console.log('Falling back to mock data');
          return mockEventApi.getAll(params);
        }
        
        throw error;
      }
    },
    
    getById: async (id) => {
      try {
        const response = await fetch(`${config.api.url}/events/${id}`, {
          headers: createHeaders(false)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error fetching event with ID ${id}:`, error);
        
        // Only fall back to mock data if explicitly enabled
        if (USE_MOCK_API) {
          console.log('Falling back to mock data');
          return mockEventApi.getById(id);
        }
        
        throw error;
      }
    },
    
    getBySlug: async (slug) => {
      try {
        const response = await fetch(`${config.api.url}/events/slug/${slug}`, {
          headers: createHeaders(false)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error fetching event with slug ${slug}:`, error);
        
        // Only fall back to mock data if explicitly enabled
        if (USE_MOCK_API) {
          console.log('Falling back to mock data');
          return mockEventApi.getBySlug(slug);
        }
        
        throw error;
      }
    },
    
    create: async (eventData) => {
      try {
        // Validate and fix eventData before sending
        const validatedData = {
          ...eventData,
          // Ensure registrations is always an array
          registrations: Array.isArray(eventData.registrations) ? eventData.registrations : []
        };
        
        console.log('Creating event with data:', validatedData);
        console.log('Registrations field type:', typeof validatedData.registrations);
        console.log('Is registrations an array?', Array.isArray(validatedData.registrations));
        
        const response = await fetch(`${config.api.url}/events`, {
          method: 'POST',
          headers: createHeaders(),
          body: JSON.stringify(validatedData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error creating event:', error);
        console.error('Error details:', error.message);
        
        // Only fall back to mock data if explicitly enabled
        if (USE_MOCK_API) {
          console.log('Falling back to mock data');
          return mockEventApi.create(validatedData);
        }
        
        throw error;
      }
    },
    
    update: async (id, eventData) => {
      try {
        // Validate and fix eventData before sending
        const validatedData = {
          ...eventData,
          // Ensure registrations is always an array
          registrations: Array.isArray(eventData.registrations) ? eventData.registrations : []
        };
        
        console.log('Updating event with data:', validatedData);
        console.log('Registrations field type:', typeof validatedData.registrations);
        
        const response = await fetch(`${config.api.url}/events/${id}`, {
          method: 'PUT',
          headers: createHeaders(),
          body: JSON.stringify(validatedData)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error updating event with ID ${id}:`, error);
        
        // Only fall back to mock data if explicitly enabled
        if (USE_MOCK_API) {
          console.log('Falling back to mock data');
          return mockEventApi.update(id, validatedData);
        }
        
        throw error;
      }
    },
    
    delete: async (id) => {
      try {
        const response = await fetch(`${config.api.url}/events/${id}`, {
          method: 'DELETE',
          headers: createHeaders()
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error deleting event with ID ${id}:`, error);
        
        // Only fall back to mock data if explicitly enabled
        if (USE_MOCK_API) {
          console.log('Falling back to mock data');
          return mockEventApi.delete(id);
        }
        
        throw error;
      }
    },
    
    register: async (id, registrationData) => {
      try {
        console.log(`Attempting to register for event ${id} with data:`, registrationData);
        
        // In development mode, use mock API directly if enabled
        if (USE_MOCK_API) {
          console.log('Using mock API for event registration in development mode');
          try {
            const mockResult = await mockEventApi.register(id, registrationData);
            console.log('Mock registration result:', mockResult);
            return mockResult;
          } catch (mockError) {
            console.error('Error with mock registration:', mockError);
            throw mockError;
          }
        }
        
        // For event registration, we don't need authentication headers
        // This allows non-logged-in users to register
        const response = await fetch(`${config.api.url}/events/${id}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registrationData)
        });
        
        console.log('Registration response status:', response.status);
        
        // Try to parse the response
        let responseData;
        try {
          responseData = await response.json();
          console.log('Registration response data:', responseData);
        } catch (parseError) {
          console.error('Error parsing registration response:', parseError);
        }
        
        // Check if the response is successful
        if (!response.ok) {
          const errorMessage = responseData?.message || 'Registration failed';
          console.error('Registration error from server:', errorMessage);
          throw new Error(errorMessage);
        }
        
        return responseData;
      } catch (error) {
        console.error(`Error registering for event with ID ${id}:`, error);
        
        // Only fall back to mock data if explicitly enabled and not already using it
        if (USE_MOCK_API && !error.message.includes('Mock')) {
          console.log('Falling back to mock data for event registration');
          try {
            const mockResult = await mockEventApi.register(id, registrationData);
            console.log('Mock registration result:', mockResult);
            return mockResult;
          } catch (mockError) {
            console.error('Error with mock registration:', mockError);
            throw mockError;
          }
        }
        
        throw error;
      }
    },
    
    getRegistrations: async (id) => {
      try {
        const response = await fetch(`${config.api.url}/events/${id}/registrations`, {
          headers: createHeaders()
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error fetching registrations for event with ID ${id}:`, error);
        
        // Only fall back to mock data if explicitly enabled
        if (USE_MOCK_API) {
          console.log('Falling back to mock data');
          return mockEventApi.getRegistrations(id);
        }
        
        throw error;
      }
    },
    
    markAttendance: async (id, registrationIds) => {
      try {
        const response = await fetch(`${config.api.url}/events/${id}/attendance`, {
          method: 'PUT',
          headers: createHeaders(),
          body: JSON.stringify({ registrationIds })
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error marking attendance for event with ID ${id}:`, error);
        
        // Only fall back to mock data if explicitly enabled
        if (USE_MOCK_API) {
          console.log('Falling back to mock data');
          return mockEventApi.markAttendance(id, registrationIds);
        }
        
        throw error;
      }
    }
  },
  
  // Contact endpoints
  contact: {
    submit: async (contactData) => {
      const response = await fetch(`${config.api.url}/contact`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(contactData)
      });
      
      return handleResponse(response);
    },
    
    getAll: async (params = {}) => {
      const queryParams = new URLSearchParams();
      
      // Add all params to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const response = await fetch(`${config.api.url}/contact?${queryParams.toString()}`, {
        headers: createHeaders()
      });
      
      return handleResponse(response);
    },
    
    getById: async (id) => {
      const response = await fetch(`${config.api.url}/contact/${id}`, {
        headers: createHeaders()
      });
      
      return handleResponse(response);
    },
    
    update: async (id, updateData) => {
      const response = await fetch(`${config.api.url}/contact/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(updateData)
      });
      
      return handleResponse(response);
    },
    
    delete: async (id) => {
      const response = await fetch(`${config.api.url}/contact/${id}`, {
        method: 'DELETE',
        headers: createHeaders()
      });
      
      return handleResponse(response);
    }
  },
  
  // Newsletter endpoints
  newsletter: {
    subscribe: async (subscriptionData) => {
      const response = await fetch(`${config.api.url}/newsletter/subscribe`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(subscriptionData)
      });
      
      return handleResponse(response);
    },
    
    unsubscribe: async (token) => {
      const response = await fetch(`${config.api.url}/newsletter/unsubscribe/${token}`, {
        headers: createHeaders(false)
      });
      
      return handleResponse(response);
    },
    
    getSubscribers: async (params = {}) => {
      const queryParams = new URLSearchParams();
      
      // Add all params to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const response = await fetch(`${config.api.url}/newsletter/subscribers?${queryParams.toString()}`, {
        headers: createHeaders()
      });
      
      return handleResponse(response);
    },
    
    createNewsletter: async (newsletterData) => {
      const response = await fetch(`${config.api.url}/newsletter`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(newsletterData)
      });
      
      return handleResponse(response);
    },
    
    getNewsletters: async (params = {}) => {
      const queryParams = new URLSearchParams();
      
      // Add all params to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const response = await fetch(`${config.api.url}/newsletter?${queryParams.toString()}`, {
        headers: createHeaders()
      });
      
      return handleResponse(response);
    },
    
    getNewsletterById: async (id) => {
      const response = await fetch(`${config.api.url}/newsletter/${id}`, {
        headers: createHeaders()
      });
      
      return handleResponse(response);
    },
    
    updateNewsletter: async (id, newsletterData) => {
      const response = await fetch(`${config.api.url}/newsletter/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(newsletterData)
      });
      
      return handleResponse(response);
    },
    
    deleteNewsletter: async (id) => {
      const response = await fetch(`${config.api.url}/newsletter/${id}`, {
        method: 'DELETE',
        headers: createHeaders()
      });
      
      return handleResponse(response);
    }
  },
  
  // Blog endpoints
  blog: {
    getAll: async (params = {}) => {
      try {
        // Use mock API in development mode
        if (USE_MOCK_API) {
          console.log('[DEV MODE] Using mock API for blog posts');
          const mockBlogApi = (await import('./mockBlogApi')).default;
          return await mockBlogApi.getAll(params);
        }
        
        // Use real API in production
        const queryParams = new URLSearchParams();
        
        // Add all params to query string
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value);
          }
        });
        
        const response = await fetch(`${config.api.url}/blog?${queryParams.toString()}`, {
          headers: createHeaders(false)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error in blog.getAll:', error);
        
        // Fallback to mock API if real API fails
        if (import.meta.env.MODE !== 'production') {
          console.log('Falling back to mock API after error');
          const mockBlogApi = (await import('./mockBlogApi')).default;
          return await mockBlogApi.getAll(params);
        }
        throw error;
      }
    },
    
    getById: async (id) => {
      try {
        // Use mock API in development mode
        if (USE_MOCK_API) {
          console.log('[DEV MODE] Using mock API for blog post by ID');
          const mockBlogApi = (await import('./mockBlogApi')).default;
          return await mockBlogApi.getById(id);
        }
        
        // Use real API in production
        const response = await fetch(`${config.api.url}/blog/${id}`, {
          headers: createHeaders(false)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error in blog.getById(${id}):`, error);
        
        // Fallback to mock API if real API fails
        if (import.meta.env.MODE !== 'production') {
          console.log('Falling back to mock API after error');
          const mockBlogApi = (await import('./mockBlogApi')).default;
          return await mockBlogApi.getById(id);
        }
        throw error;
      }
    },
    
    getBySlug: async (slug) => {
      const response = await fetch(`${config.api.url}/blog/slug/${slug}`, {
        headers: createHeaders(false)
      });
      
      return handleResponse(response);
    },
    
    create: async (blogData) => {
      const response = await fetch(`${config.api.url}/blog`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(blogData)
      });
      
      return handleResponse(response);
    },
    
    update: async (id, blogData) => {
      const response = await fetch(`${config.api.url}/blog/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(blogData)
      });
      
      return handleResponse(response);
    },
    
    delete: async (id) => {
      try {
        // Use mock API in development mode
        if (USE_MOCK_API) {
          console.log('[DEV MODE] Using mock API to delete blog post');
          const mockBlogApi = (await import('./mockBlogApi')).default;
          return await mockBlogApi.delete(id);
        }
        
        // Use real API in production
        const response = await fetch(`${config.api.url}/blog/${id}`, {
          method: 'DELETE',
          headers: createHeaders()
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error in blog.delete(${id}):`, error);
        
        // Fallback to mock API if real API fails
        if (import.meta.env.MODE !== 'production') {
          console.log('Falling back to mock API after error');
          const mockBlogApi = (await import('./mockBlogApi')).default;
          return await mockBlogApi.delete(id);
        }
        throw error;
      }
    }
  },
  
  // Startups endpoints
  startups: {
    getAll: async (params = {}) => {
      const queryParams = new URLSearchParams();
      
      // Add all params to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const response = await fetch(`${config.api.url}/startups?${queryParams.toString()}`, {
        headers: createHeaders(false)
      });
      
      return handleResponse(response);
    },
    
    getById: async (id) => {
      const response = await fetch(`${config.api.url}/startups/${id}`, {
        headers: createHeaders(false)
      });
      
      return handleResponse(response);
    },
    
    create: async (startupData) => {
      const response = await fetch(`${config.api.url}/startups`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(startupData)
      });
      
      return handleResponse(response);
    },
    
    update: async (id, startupData) => {
      const response = await fetch(`${config.api.url}/startups/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(startupData)
      });
      
      return handleResponse(response);
    },
    
    delete: async (id) => {
      const response = await fetch(`${config.api.url}/startups/${id}`, {
        method: 'DELETE',
        headers: createHeaders()
      });
      
      return handleResponse(response);
    }
  },
  
  // Involvement endpoints
  involvement: {
    apply: async (applicationData) => {
      const response = await fetch(`${config.api.url}/involvement`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(applicationData)
      });
      
      return handleResponse(response);
    },
    
    getAll: async (params = {}) => {
      const queryParams = new URLSearchParams();
      
      // Add all params to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const response = await fetch(`${config.api.url}/involvement?${queryParams.toString()}`, {
        headers: createHeaders()
      });
      
      return handleResponse(response);
    },
    
    getById: async (id) => {
      const response = await fetch(`${config.api.url}/involvement/${id}`, {
        headers: createHeaders()
      });
      
      return handleResponse(response);
    },
    
    updateStatus: async (id, status) => {
      const response = await fetch(`${config.api.url}/involvement/${id}/status`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify({ status })
      });
      
      return handleResponse(response);
    }
  },
  
  // Team endpoints
  team: {
    getAll: async () => {
      const response = await fetch(`${config.api.url}/team`, {
        headers: createHeaders(false)
      });
      
      return handleResponse(response);
    },
    
    getById: async (id) => {
      const response = await fetch(`${config.api.url}/team/${id}`, {
        headers: createHeaders(false)
      });
      
      return handleResponse(response);
    },
    
    create: async (teamData) => {
      const response = await fetch(`${config.api.url}/team`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(teamData)
      });
      
      return handleResponse(response);
    },
    
    update: async (id, teamData) => {
      const response = await fetch(`${config.api.url}/team/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(teamData)
      });
      
      return handleResponse(response);
    },
    
    delete: async (id) => {
      const response = await fetch(`${config.api.url}/team/${id}`, {
        method: 'DELETE',
        headers: createHeaders()
      });
      
      return handleResponse(response);
    }
  },
  
  // Partners endpoints
  partners: {
    getAll: async () => {
      try {
        const response = await fetch(`${config.api.url}/partners`, {
          headers: createHeaders(false)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching partners:', error);
        throw error;
      }
    },
    
    getById: async (id) => {
      try {
        const response = await fetch(`${config.api.url}/partners/${id}`, {
          headers: createHeaders(false)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error fetching partner with ID ${id}:`, error);
        throw error;
      }
    },
    
    create: async (partnerData) => {
      try {
        const response = await fetch(`${config.api.url}/partners`, {
          method: 'POST',
          headers: createHeaders(),
          body: JSON.stringify(partnerData)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error creating partner:', error);
        throw error;
      }
    },
    
    update: async (id, partnerData) => {
      try {
        const response = await fetch(`${config.api.url}/partners/${id}`, {
          method: 'PUT',
          headers: createHeaders(),
          body: JSON.stringify(partnerData)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error updating partner with ID ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id) => {
      try {
        const response = await fetch(`${config.api.url}/partners/${id}`, {
          method: 'DELETE',
          headers: createHeaders()
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error deleting partner with ID ${id}:`, error);
        throw error;
      }
    }
  },
  
  team: {
    getAll: async () => {
      try {
        const response = await fetch(`${config.api.url}/team`, {
          headers: createHeaders(false)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching team members:', error);
        throw error;
      }
    },
    
    getById: async (id) => {
      try {
        const response = await fetch(`${config.api.url}/team/${id}`, {
          headers: createHeaders(false)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error fetching team member with ID ${id}:`, error);
        throw error;
      }
    },
    
    create: async (teamMemberData) => {
      try {
        const response = await fetch(`${config.api.url}/team`, {
          method: 'POST',
          headers: createHeaders(),
          body: JSON.stringify(teamMemberData)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error creating team member:', error);
        throw error;
      }
    },
    
    update: async (id, teamMemberData) => {
      try {
        const response = await fetch(`${config.api.url}/team/${id}`, {
          method: 'PUT',
          headers: createHeaders(),
          body: JSON.stringify(teamMemberData)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error updating team member with ID ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id) => {
      try {
        const response = await fetch(`${config.api.url}/team/${id}`, {
          method: 'DELETE',
          headers: createHeaders()
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error deleting team member with ID ${id}:`, error);
        throw error;
      }
    }
  },
  
  // Gallery endpoints
  gallery: {
    getAll: async () => {
      try {
        console.log('Fetching all gallery items');
        
        const response = await fetch(`${config.api.url}/gallery`, {
          headers: createHeaders(false)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching gallery items:', error);
        throw error;
      }
    },
    
    getById: async (id) => {
      try {
        console.log(`Fetching gallery item with ID ${id}`);
        
        const response = await fetch(`${config.api.url}/gallery/${id}`, {
          headers: createHeaders(false)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error fetching gallery item with ID ${id}:`, error);
        throw error;
      }
    },
    
    create: async (formData) => {
      try {
        console.log('Creating new gallery item');
        
        // Log the FormData contents for debugging
        console.log('FormData contents:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + (pair[0] === 'image' ? 'File object' : pair[1]));
        }
        
        const response = await fetch(`${config.api.url}/gallery`, {
          method: 'POST',
          headers: createHeaders(true, true), // Set isFormData to true
          body: formData
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error creating gallery item:', error);
        throw error;
      }
    },
    
    update: async (id, formData) => {
      try {
        console.log(`Updating gallery item with ID ${id}`);
        
        // Log the FormData contents for debugging
        console.log('FormData contents:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + (pair[0] === 'image' ? 'File object' : pair[1]));
        }
        
        const response = await fetch(`${config.api.url}/gallery/${id}`, {
          method: 'PUT',
          headers: createHeaders(true, true), // Set isFormData to true
          body: formData
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error updating gallery item with ID ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id) => {
      try {
        console.log(`Deleting gallery item with ID ${id}`);
        
        const response = await fetch(`${config.api.url}/gallery/${id}`, {
          method: 'DELETE',
          headers: createHeaders()
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error deleting gallery item with ID ${id}:`, error);
        throw error;
      }
    }
  },
  
  // Admin endpoints
  admin: {
    getDashboard: async () => {
      try {
        console.log('Fetching admin dashboard data');
        
        const response = await fetch(`${config.api.url}/admin/dashboard`, {
          headers: createHeaders()
        });
        
        const data = await handleResponse(response);
        console.log('Dashboard data retrieved successfully');
        return data;
      } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
        throw error;
      }
    },
    
    getSystemInfo: async () => {
      try {
        console.log('Fetching system information');
        
        const response = await fetch(`${config.api.url}/admin/system`, {
          headers: createHeaders()
        });
        
        const data = await handleResponse(response);
        console.log('System information retrieved successfully');
        return data;
      } catch (error) {
        console.error('Error fetching system information:', error.message);
        throw error;
      }
    },
    
    toggleMaintenance: async (maintenanceData) => {
      try {
        console.log('Toggling maintenance mode:', maintenanceData);
        
        const response = await fetch(`${config.api.url}/admin/maintenance`, {
          method: 'POST',
          headers: createHeaders(),
          body: JSON.stringify(maintenanceData)
        });
        
        const data = await handleResponse(response);
        console.log('Maintenance mode toggled successfully');
        return data;
      } catch (error) {
        console.error('Error toggling maintenance mode:', error.message);
        throw error;
      }
    }
  },
  
  // User management endpoints
  users: {
    getAll: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add all params to query string
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value);
          }
        });
        
        const response = await fetch(`${config.api.url}/users?${queryParams.toString()}`, {
          headers: createHeaders()
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    
    getById: async (id) => {
      try {
        const response = await fetch(`${config.api.url}/users/${id}`, {
          headers: createHeaders()
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
      }
    },
    
    update: async (id, userData) => {
      try {
        const response = await fetch(`${config.api.url}/users/${id}`, {
          method: 'PUT',
          headers: createHeaders(),
          body: JSON.stringify(userData)
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id) => {
      try {
        const response = await fetch(`${config.api.url}/users/${id}`, {
          method: 'DELETE',
          headers: createHeaders()
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
      }
    },
    
    getUserEvents: async (id) => {
      try {
        const response = await fetch(`${config.api.url}/users/${id}/events`, {
          headers: createHeaders()
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error(`Error fetching events for user with ID ${id}:`, error);
        throw error;
      }
    }
  }
};

export default api;