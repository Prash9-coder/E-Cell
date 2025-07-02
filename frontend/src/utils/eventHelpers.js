/**
 * Helper functions for working with events
 */

/**
 * Determine the status of an event based on its properties
 * @param {Object} event - The event object
 * @returns {String} - The status of the event (Upcoming, Ongoing, Completed, or Cancelled)
 */
export const getEventStatus = (event) => {
  // If status is already set, use it
  if (event.status) {
    return event.status;
  }
  
  // If the event is marked as past, it's completed
  if (event.isPast) {
    return 'Completed';
  }
  
  // Check if the event is currently happening
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
  
  // If the event date is in the future, it's upcoming
  return eventDate > now ? 'Upcoming' : 'Completed';
};

/**
 * Format a date for display
 * @param {String|Date} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {String} - The formatted date
 */
export const formatEventDate = (date, options = {}) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const defaultOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString(undefined, defaultOptions);
};

/**
 * Get the appropriate status badge color based on event status
 * @param {String} status - The event status
 * @returns {Object} - The CSS classes for the badge
 */
export const getStatusBadgeClasses = (status) => {
  switch (status) {
    case 'Upcoming':
      return 'bg-green-100 text-green-800';
    case 'Ongoing':
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
      return 'bg-gray-100 text-gray-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Check if an event is in the past
 * @param {Object} event - The event object
 * @returns {Boolean} - True if the event is in the past
 */
export const isEventPast = (event) => {
  if (event.isPast) {
    return true;
  }
  
  const now = new Date();
  const eventDate = new Date(event.date);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  
  if (endDate) {
    return endDate < now;
  }
  
  return eventDate < now;
};