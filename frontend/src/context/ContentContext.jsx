import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import mockEventApi from '../services/mockApi';

// Create the context
const ContentContext = createContext();

// Flag to enable mock API in development mode
const USE_MOCK_API = import.meta.env.MODE !== 'production';

// Provider component
export const ContentProvider = ({ children }) => {
  const [contentTypes, setContentTypes] = useState({
    events: {
      items: [],
      loading: true,
      error: null
    },
    blog: {
      items: [],
      loading: true,
      error: null
    },
    startups: {
      items: [],
      loading: true,
      error: null
    },
    gallery: {
      items: [],
      loading: true,
      error: null
    },
    team: {
      items: [],
      loading: true,
      error: null
    }
  });

  // Fetch events from API on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setContentTypes(prev => ({
          ...prev,
          events: {
            ...prev.events,
            loading: true
          }
        }));
        
        // Use mock API in development mode if enabled
        if (USE_MOCK_API) {
          console.log('[DEV MODE] Using mock API for initial events fetch');
          const data = await mockEventApi.getAll();
          setContentTypes(prev => ({
            ...prev,
            events: {
              items: data.events,
              loading: false,
              error: null
            }
          }));
        } else {
          const data = await api.events.getAll();
          setContentTypes(prev => ({
            ...prev,
            events: {
              items: data.events,
              loading: false,
              error: null
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        
        // Fallback to mock data if API fails
        if (import.meta.env.MODE !== 'production') {
          console.log('Falling back to mock data after API error');
          try {
            const data = await mockEventApi.getAll();
            setContentTypes(prev => ({
              ...prev,
              events: {
                items: data.events,
                loading: false,
                error: null
              }
            }));
          } catch (mockError) {
            console.error('Error with mock data:', mockError);
            setContentTypes(prev => ({
              ...prev,
              events: {
                ...prev.events,
                loading: false,
                error: 'Failed to load events. Please try again later.'
              }
            }));
          }
        } else {
          setContentTypes(prev => ({
            ...prev,
            events: {
              ...prev.events,
              loading: false,
              error: 'Failed to load events. Please try again later.'
            }
          }));
        }
      }
    };
    
    fetchEvents();
    
    // TODO: Add fetching for other content types
  }, []);

  // Generic function to add content
  const addContent = async (contentType, data) => {
    try {
      setContentTypes(prev => ({
        ...prev,
        [contentType]: {
          ...prev[contentType],
          loading: true,
          error: null
        }
      }));

      let newItem;
      
      // Handle different content types
      switch (contentType) {
        case 'events':
          if (USE_MOCK_API) {
            newItem = await mockEventApi.create(data);
          } else {
            newItem = await api.events.create(data);
          }
          break;
        // Add cases for other content types
        default:
          throw new Error(`Unsupported content type: ${contentType}`);
      }

      setContentTypes(prev => ({
        ...prev,
        [contentType]: {
          ...prev[contentType],
          items: [...prev[contentType].items, newItem],
          loading: false
        }
      }));

      return newItem;
    } catch (error) {
      console.error(`Error adding ${contentType}:`, error);
      
      setContentTypes(prev => ({
        ...prev,
        [contentType]: {
          ...prev[contentType],
          loading: false,
          error: error.message
        }
      }));
      
      throw error;
    }
  };

  // Generic function to update content
  const updateContent = async (contentType, id, data) => {
    try {
      setContentTypes(prev => ({
        ...prev,
        [contentType]: {
          ...prev[contentType],
          loading: true,
          error: null
        }
      }));

      let updatedItem;
      
      // Handle different content types
      switch (contentType) {
        case 'events':
          if (USE_MOCK_API) {
            updatedItem = await mockEventApi.update(id, data);
          } else {
            updatedItem = await api.events.update(id, data);
          }
          break;
        // Add cases for other content types
        default:
          throw new Error(`Unsupported content type: ${contentType}`);
      }

      setContentTypes(prev => ({
        ...prev,
        [contentType]: {
          ...prev[contentType],
          items: prev[contentType].items.map(item => 
            (item._id === id || item.id === id) ? updatedItem : item
          ),
          loading: false
        }
      }));

      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${contentType}:`, error);
      
      setContentTypes(prev => ({
        ...prev,
        [contentType]: {
          ...prev[contentType],
          loading: false,
          error: error.message
        }
      }));
      
      throw error;
    }
  };

  // Generic function to delete content
  const deleteContent = async (contentType, id) => {
    try {
      setContentTypes(prev => ({
        ...prev,
        [contentType]: {
          ...prev[contentType],
          loading: true,
          error: null
        }
      }));

      // Handle different content types
      switch (contentType) {
        case 'events':
          if (USE_MOCK_API) {
            await mockEventApi.delete(id);
          } else {
            await api.events.delete(id);
          }
          break;
        // Add cases for other content types
        default:
          throw new Error(`Unsupported content type: ${contentType}`);
      }

      setContentTypes(prev => ({
        ...prev,
        [contentType]: {
          ...prev[contentType],
          items: prev[contentType].items.filter(item => 
            item._id !== id && item.id !== id
          ),
          loading: false
        }
      }));
    } catch (error) {
      console.error(`Error deleting ${contentType}:`, error);
      
      setContentTypes(prev => ({
        ...prev,
        [contentType]: {
          ...prev[contentType],
          loading: false,
          error: error.message
        }
      }));
      
      throw error;
    }
  };

  // Get content by type
  const getContent = (contentType) => {
    return contentTypes[contentType] || { items: [], loading: false, error: null };
  };

  return (
    <ContentContext.Provider 
      value={{ 
        contentTypes,
        getContent,
        addContent,
        updateContent,
        deleteContent
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

// Custom hook to use the content context
export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

// Custom hook to use a specific content type
export const useContentType = (contentType) => {
  const { getContent, addContent, updateContent, deleteContent } = useContent();
  const { items, loading, error } = getContent(contentType);

  const add = async (data) => {
    return await addContent(contentType, data);
  };

  const update = async (id, data) => {
    return await updateContent(contentType, id, data);
  };

  const remove = async (id) => {
    return await deleteContent(contentType, id);
  };

  return {
    items,
    loading,
    error,
    add,
    update,
    remove
  };
};