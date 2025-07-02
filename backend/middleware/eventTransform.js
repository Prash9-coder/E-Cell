/**
 * Middleware to transform event data between frontend and backend
 * This handles the conversion between the frontend 'status' field and the backend 'isPast' field
 */

// Transform event data from frontend to backend format
export const transformEventRequest = (req, res, next) => {
  try {
    // Only process if there's a body with event data
    if (req.body) {
      console.log('Transforming event request data');
      
      // If status is provided but isPast is not, set isPast based on status
      if (req.body.status !== undefined && req.body.isPast === undefined) {
        req.body.isPast = req.body.status === 'Completed' || req.body.status === 'Cancelled';
        console.log(`Set isPast to ${req.body.isPast} based on status: ${req.body.status}`);
      }
      
      // Remove status field as it's not in the backend model
      // This prevents Mongoose from complaining about unknown fields
      if (req.body.status !== undefined) {
        delete req.body.status;
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in transformEventRequest middleware:', error);
    next(error);
  }
};

// Transform event data from backend to frontend format
export const transformEventResponse = (req, res, next) => {
  // Store the original send function
  const originalSend = res.send;
  
  // Override the send function
  res.send = function(data) {
    try {
      // Only transform JSON responses with event data
      if (res.getHeader('content-type')?.includes('application/json')) {
        const body = JSON.parse(data);
        
        // Transform single event
        if (body && body._id && body.isPast !== undefined) {
          console.log('Transforming single event response');
          body.status = getStatusFromEvent(body);
        }
        
        // Transform event collections
        if (body && body.events && Array.isArray(body.events)) {
          console.log('Transforming event collection response');
          body.events = body.events.map(event => {
            if (event.isPast !== undefined) {
              event.status = getStatusFromEvent(event);
            }
            return event;
          });
        }
        
        // Send the transformed data
        return originalSend.call(this, JSON.stringify(body));
      }
    } catch (error) {
      console.error('Error in transformEventResponse middleware:', error);
    }
    
    // Fall back to original behavior
    return originalSend.apply(this, arguments);
  };
  
  next();
};

// Helper function to determine status from event data
function getStatusFromEvent(event) {
  if (event.isPast) {
    return 'Completed';
  } else {
    const now = new Date();
    const eventDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : null;
    
    if (endDate) {
      // If there's an end date, check if the event is currently happening
      if (eventDate <= now && now <= endDate) {
        return 'Ongoing';
      }
    } else {
      // Without an end date, consider it ongoing on the event day
      if (eventDate.toDateString() === now.toDateString()) {
        return 'Ongoing';
      }
    }
    
    return 'Upcoming';
  }
}