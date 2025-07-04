/**
 * Mock API service for development mode
 * This provides fallback functionality when the backend is not available
 */

// Helper function to validate and fix event data
const validateAndFixEvent = (event) => {
  // Ensure registrations is always an array
  if (!Array.isArray(event.registrations)) {
    console.warn('Fixing invalid registrations field for event:', event.title);
    event.registrations = [];
  }
  
  // Ensure other required fields have proper defaults
  if (!event.status) {
    event.status = event.isPast ? 'Completed' : 'Upcoming';
  }
  
  return event;
};

// In-memory storage for mock data
// Use localStorage to persist mock events between page refreshes
const getStoredEvents = () => {
  try {
    const storedEvents = localStorage.getItem('mockEvents');
    if (storedEvents) {
      const events = JSON.parse(storedEvents);
      // Validate and fix all loaded events
      return events.map(validateAndFixEvent);
    }
  } catch (error) {
    console.error('Error retrieving stored events:', error);
  }
  
  // Default events if none are stored
  return [
    {
      id: '1',
      title: 'Startup Workshop',
      slug: 'startup-workshop',
      description: 'Learn how to launch your startup',
      longDescription: 'A comprehensive workshop on startup fundamentals',
      date: '2024-07-15',
      time: '10:00 AM - 4:00 PM',
      location: 'E-Cell Innovation Hub',
      category: 'workshop',
      image: '/images/events/default.jpg',
      status: 'Upcoming',
      registrations: [],
      createdBy: '1',
      createdAt: '2024-05-01T10:00:00Z',
      updatedAt: '2024-05-01T10:00:00Z'
    },
    {
      id: '2',
      title: 'Pitch Competition',
      slug: 'pitch-competition',
      description: 'Pitch your business idea to investors',
      longDescription: 'A chance to win funding for your startup',
      date: '2024-08-20',
      time: '2:00 PM - 6:00 PM',
      location: 'Main Auditorium',
      category: 'competition',
      image: '/images/events/default.jpg',
      status: 'Upcoming',
      registrations: [],
      createdBy: '1',
      createdAt: '2024-05-05T14:30:00Z',
      updatedAt: '2024-05-05T14:30:00Z'
    }
  ];
};

// Initialize mock events from localStorage or defaults
let mockEvents = getStoredEvents();

// Helper function to save events to localStorage
const saveEvents = () => {
  try {
    // Validate and fix all events before saving
    const validatedEvents = mockEvents.map(validateAndFixEvent);
    localStorage.setItem('mockEvents', JSON.stringify(validatedEvents));
    console.log('Mock events saved to localStorage:', validatedEvents);
  } catch (error) {
    console.error('Error saving mock events:', error);
  }
};

// Function to clear mock data (useful for debugging)
const clearMockData = () => {
  try {
    localStorage.removeItem('mockEvents');
    mockEvents = getStoredEvents(); // This will reload the default events
    console.log('[MOCK API] Mock data cleared and reset to defaults');
  } catch (error) {
    console.error('Error clearing mock data:', error);
  }
};

// Mock event API
const mockEventApi = {
  // Add clear function for debugging
  clearData: clearMockData,
  getAll: () => {
    console.log('[MOCK API] Getting all events');
    
    // Refresh from localStorage to ensure we have the latest data
    mockEvents = getStoredEvents();
    
    console.log('[MOCK API] Current events:', mockEvents);
    
    return Promise.resolve({
      events: mockEvents,
      totalPages: 1,
      currentPage: 1,
      total: mockEvents.length
    });
  },
  
  getById: (id) => {
    console.log(`[MOCK API] Getting event with ID: ${id}`);
    const event = mockEvents.find(e => e.id === id || e._id === id);
    if (!event) {
      return Promise.reject(new Error('Event not found'));
    }
    return Promise.resolve(event);
  },
  
  getBySlug: (slug) => {
    console.log(`[MOCK API] Getting event with slug: ${slug}`);
    const event = mockEvents.find(e => e.slug === slug);
    if (!event) {
      return Promise.reject(new Error('Event not found'));
    }
    return Promise.resolve(event);
  },
  
  create: (eventData) => {
    console.log('[MOCK API] Creating new event:', eventData);
    const newEvent = {
      id: String(mockEvents.length + 1),
      _id: String(mockEvents.length + 1),
      ...eventData,
      slug: eventData.title.toLowerCase().replace(/\s+/g, '-'),
      // Ensure status is set based on isPast if not provided
      status: eventData.status || (eventData.isPast ? 'Completed' : 'Upcoming'),
      // Ensure registrations is always an array
      registrations: Array.isArray(eventData.registrations) ? eventData.registrations : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '1' // Mock admin user ID
    };
    
    // Add to mock events array
    mockEvents.push(newEvent);
    
    // Save to localStorage
    saveEvents();
    
    console.log('[MOCK API] New event created:', newEvent);
    console.log('[MOCK API] Updated events list:', mockEvents);
    
    return Promise.resolve(newEvent);
  },
  
  update: (id, eventData) => {
    console.log(`[MOCK API] Updating event with ID: ${id}`, eventData);
    const index = mockEvents.findIndex(e => e.id === id || e._id === id);
    
    if (index === -1) {
      return Promise.reject(new Error('Event not found'));
    }
    
    const updatedEvent = {
      ...mockEvents[index],
      ...eventData,
      // Ensure status is set based on isPast if not provided
      status: eventData.status || (eventData.isPast ? 'Completed' : 'Upcoming'),
      // Ensure registrations is always an array
      registrations: Array.isArray(eventData.registrations) ? eventData.registrations : (mockEvents[index].registrations || []),
      updatedAt: new Date().toISOString()
    };
    
    // Update slug if title changed
    if (eventData.title && eventData.title !== mockEvents[index].title) {
      updatedEvent.slug = eventData.title.toLowerCase().replace(/\s+/g, '-');
    }
    
    // Update in mock events array
    mockEvents[index] = updatedEvent;
    
    // Save to localStorage
    saveEvents();
    
    console.log('[MOCK API] Event updated:', updatedEvent);
    console.log('[MOCK API] Updated events list:', mockEvents);
    
    return Promise.resolve(updatedEvent);
  },
  
  delete: (id) => {
    console.log(`[MOCK API] Deleting event with ID: ${id}`);
    
    // Log current events for debugging
    console.log('[MOCK API] Current events before deletion:', mockEvents);
    
    // Convert id to string to ensure consistent comparison
    const idStr = String(id);
    
    // Find the event by id or _id
    const index = mockEvents.findIndex(e => 
      (e.id && String(e.id) === idStr) || (e._id && String(e._id) === idStr)
    );
    
    console.log(`[MOCK API] Found event at index: ${index}`);
    
    if (index === -1) {
      console.error(`[MOCK API] Event with ID ${id} not found`);
      return Promise.reject(new Error(`Event with ID ${id} not found`));
    }
    
    // Store the event being deleted for logging
    const deletedEvent = mockEvents[index];
    console.log('[MOCK API] Deleting event:', deletedEvent);
    
    // Remove from mock events array
    mockEvents.splice(index, 1);
    
    // Save to localStorage
    saveEvents();
    
    console.log('[MOCK API] Event deleted, updated events list:', mockEvents);
    
    return Promise.resolve({ message: 'Event deleted successfully' });
  },
  
  register: (id, registrationData) => {
    console.log(`[MOCK API] Registering for event with ID: ${id}`, registrationData);
    const event = mockEvents.find(e => e.id === id || e._id === id);
    
    if (!event) {
      return Promise.reject(new Error('Event not found'));
    }
    
    // Add registration to the array
    if (!event.registrations) {
      event.registrations = [];
    }
    
    const newRegistration = {
      id: String(Math.floor(Math.random() * 1000)),
      ...registrationData,
      registeredAt: new Date().toISOString(),
      attended: false,
      certificateIssued: false
    };
    
    event.registrations.push(newRegistration);
    
    // Save to localStorage
    saveEvents();
    
    return Promise.resolve({ 
      message: 'Registration successful', 
      registration: newRegistration
    });
  },
  
  getRegistrations: (id) => {
    console.log(`[MOCK API] Getting registrations for event with ID: ${id}`);
    const event = mockEvents.find(e => e.id === id || e._id === id);
    
    if (!event) {
      return Promise.reject(new Error('Event not found'));
    }
    
    // Return actual registrations array or empty array if none
    return Promise.resolve(event.registrations || []);
  },
  
  markAttendance: (id, registrationIds) => {
    console.log(`[MOCK API] Marking attendance for event with ID: ${id}`, registrationIds);
    const event = mockEvents.find(e => e.id === id || e._id === id);
    
    if (!event) {
      return Promise.reject(new Error('Event not found'));
    }
    
    return Promise.resolve({ message: 'Attendance marked successfully' });
  }
};

export default mockEventApi;