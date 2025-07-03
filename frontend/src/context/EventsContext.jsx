import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import mockEventApi from '../services/mockApi';
import { getEventStatus } from '../utils/eventHelpers';

// Flag to enable mock API in development mode
const USE_MOCK_API = import.meta.env.MODE !== 'production';

// Create the context
const EventsContext = createContext();

// Provider component
export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch events from API on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Use mock API in development mode if enabled
        if (USE_MOCK_API) {
          console.log('[DEV MODE] Using mock API for initial events fetch');
          const data = await mockEventApi.getAll();
          
          // Ensure all events have a status field
          const eventsWithStatus = data.events.map(event => {
            if (!event.status) {
              // Derive status from isPast if not provided by the API
              if (event.isPast) {
                event.status = 'Completed';
              } else {
                const now = new Date();
                const eventDate = new Date(event.date);
                event.status = eventDate > now ? 'Upcoming' : 'Ongoing';
              }
            }
            return event;
          });
          
          setEvents(eventsWithStatus);
          setError(null);
        } else {
          const data = await api.events.getAll();
          
          // Ensure all events have a status field
          const eventsWithStatus = data.events.map(event => {
            if (!event.status) {
              // Derive status from isPast if not provided by the API
              if (event.isPast) {
                event.status = 'Completed';
              } else {
                const now = new Date();
                const eventDate = new Date(event.date);
                event.status = eventDate > now ? 'Upcoming' : 'Ongoing';
              }
            }
            return event;
          });
          
          setEvents(eventsWithStatus);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        
        // Fallback to mock data if API fails
        if (import.meta.env.MODE !== 'production') {
          console.log('Falling back to mock data after API error');
          try {
            const data = await mockEventApi.getAll();
            
            // Ensure all events have a status field
            const eventsWithStatus = data.events.map(event => {
              if (!event.status) {
                // Derive status from isPast if not provided by the API
                if (event.isPast) {
                  event.status = 'Completed';
                } else {
                  const now = new Date();
                  const eventDate = new Date(event.date);
                  event.status = eventDate > now ? 'Upcoming' : 'Ongoing';
                }
              }
              return event;
            });
            
            setEvents(eventsWithStatus);
            setError(null);
          } catch (mockError) {
            console.error('Error with mock data:', mockError);
            setError('Failed to load events. Please try again later.');
          }
        } else {
          setError('Failed to load events. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Add a new event
  const addEvent = async (eventData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have a token before making the request
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log('Adding new event:', eventData);
      
      // In development mode, use mock API directly if enabled
      if (USE_MOCK_API) {
        console.log('[DEV MODE] Using mock API for creating event');
        try {
          const newEvent = await mockEventApi.create(eventData);
          console.log('Event created successfully with mock API:', newEvent);
          
          // Refresh the entire events list to ensure consistency
          const data = await mockEventApi.getAll();
          console.log('Refreshed events list after adding new event:', data.events);
          
          // Update the events state with the refreshed list
          setEvents(data.events);
          
          return newEvent;
        } catch (mockError) {
          console.error('Mock API error:', mockError);
          throw mockError;
        }
      } else {
        // Use real API
        const newEvent = await api.events.create(eventData);
        console.log('Event created successfully:', newEvent);
        setEvents(prevEvents => [...prevEvents, newEvent]);
        return newEvent;
      }
    } catch (error) {
      console.error('Error adding event:', error);
      
      // Handle token refresh message
      if (error.message === 'Token refreshed. Please try again.') {
        // Try again with the refreshed token
        try {
          console.log('Retrying with refreshed token...');
          const newEvent = await api.events.create(eventData);
          setEvents(prevEvents => [...prevEvents, newEvent]);
          return newEvent;
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          setError(retryError.message || 'Failed to create event after token refresh');
          throw retryError;
        }
      } else if (error.message.includes('Authentication') || error.message.includes('Token')) {
        // Authentication error
        setError('Authentication error: ' + error.message);
        throw new Error('Authentication error: ' + error.message);
      } else {
        // Other errors
        console.error('Full error object:', error);
        const errorMessage = error.message || error.error || 'Server error';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing event
  const updateEvent = async (id, eventData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have a token before making the request
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log(`Updating event ${id}:`, eventData);
      const updatedEvent = await api.events.update(id, eventData);
      console.log('Event updated successfully:', updatedEvent);
      
      setEvents(prevEvents => 
        prevEvents.map(event => (event._id === id || event.id === id) ? updatedEvent : event)
      );
      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      
      // Handle token refresh message
      if (error.message === 'Token refreshed. Please try again.') {
        // Try again with the refreshed token
        try {
          console.log('Retrying with refreshed token...');
          const updatedEvent = await api.events.update(id, eventData);
          setEvents(prevEvents => 
            prevEvents.map(event => (event._id === id || event.id === id) ? updatedEvent : event)
          );
          return updatedEvent;
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          setError(retryError.message);
          throw retryError;
        }
      } else {
        setError(error.message);
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Delete an event
  const deleteEvent = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have a token before making the request
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log(`Deleting event ${id}`);
      
      // In development mode, use mock API directly if enabled
      if (USE_MOCK_API) {
        console.log('[DEV MODE] Using mock API for deleting event');
        try {
          await mockEventApi.delete(id);
          console.log('Event deleted successfully with mock API');
          
          // Refresh the entire events list to ensure consistency
          const data = await mockEventApi.getAll();
          console.log('Refreshed events list after deleting event:', data.events);
          
          // Update the events state with the refreshed list
          setEvents(data.events);
        } catch (mockError) {
          console.error('Mock API error:', mockError);
          throw mockError;
        }
      } else {
        // Use real API
        await api.events.delete(id);
        console.log('Event deleted successfully');
        setEvents(prevEvents => prevEvents.filter(event => event._id !== id && event.id !== id));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      
      // Handle token refresh message
      if (error.message === 'Token refreshed. Please try again.') {
        // Try again with the refreshed token
        try {
          console.log('Retrying with refreshed token...');
          await api.events.delete(id);
          setEvents(prevEvents => prevEvents.filter(event => event._id !== id && event.id !== id));
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          setError(retryError.message || 'Failed to delete event after token refresh');
          throw retryError;
        }
      } else if (error.message && (error.message.includes('Authentication') || error.message.includes('Token'))) {
        // Authentication error
        setError('Authentication error: ' + error.message);
        throw new Error('Authentication error: ' + error.message);
      } else {
        // Other errors
        setError(error.message || 'Server error');
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Register for an event
  const registerForEvent = async (id, registrationData) => {
    try {
      setLoading(true);
      const result = await api.events.register(id, registrationData);
      
      // Update the event in the local state to reflect the new registration
      const updatedEvent = await api.events.getById(id);
      setEvents(prevEvents => 
        prevEvents.map(event => event._id === id ? updatedEvent : event)
      );
      
      return result;
    } catch (error) {
      console.error('Error registering for event:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Get event registrations
  const getEventRegistrations = async (id) => {
    try {
      setLoading(true);
      return await api.events.getRegistrations(id);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Mark attendance for event
  const markAttendance = async (id, registrationIds) => {
    try {
      setLoading(true);
      await api.events.markAttendance(id, registrationIds);
      
      // Update the event in the local state
      const updatedEvent = await api.events.getById(id);
      setEvents(prevEvents => 
        prevEvents.map(event => event._id === id ? updatedEvent : event)
      );
    } catch (error) {
      console.error('Error marking attendance:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <EventsContext.Provider 
      value={{ 
        events, 
        setEvents, // Expose setEvents function
        loading, 
        error, 
        addEvent, 
        updateEvent, 
        deleteEvent,
        registerForEvent,
        getEventRegistrations,
        markAttendance
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

// Custom hook to use the events context
export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};