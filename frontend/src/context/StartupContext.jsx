import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Create the context
const StartupContext = createContext();

// Default startups data for fallback
const defaultStartups = [
  {
    id: 1,
    name: 'EcoSolutions',
    category: 'Sustainability',
    foundedYear: 2025,
    stage: 'Seed',
    status: 'Active',
    featured: true,
    image: '/images/startups/eco-solutions.jpg',
    description: 'Developing sustainable solutions for waste management and renewable energy.'
  },
  {
    id: 2,
    name: 'LearnHub',
    category: 'Education',
    foundedYear: 2025,
    stage: 'Series A',
    status: 'Active',
    featured: true,
    image: '/images/startups/learn-hub.jpg',
    description: 'Online learning platform focused on skill development for college students.'
  },
  {
    id: 3,
    name: 'HealthTrack',
    category: 'Healthcare',
    foundedYear: 2025,
    stage: 'Acquired',
    status: 'Active',
    featured: true,
    image: '/images/startups/health-track.jpg',
    description: 'AI-powered health monitoring and diagnostics platform.'
  }
];

// Provider component
export const StartupProvider = ({ children }) => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch startups from API on component mount
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get startups from API
        const response = await api.startups.getAll();
        console.log('Startups fetched from API:', response);
        
        if (response && response.startups && response.startups.length > 0) {
          setStartups(response.startups);
        } else {
          // If no startups from API, try localStorage
          const savedStartups = localStorage.getItem('startups');
          if (savedStartups) {
            console.log('Using startups from localStorage');
            setStartups(JSON.parse(savedStartups));
          } else {
            // If no startups in localStorage, use default data
            console.log('Using default startup data');
            setStartups(defaultStartups);
            // Save default data to localStorage
            localStorage.setItem('startups', JSON.stringify(defaultStartups));
          }
        }
      } catch (error) {
        console.error('Error fetching startups:', error);
        
        // Try localStorage as fallback
        const savedStartups = localStorage.getItem('startups');
        if (savedStartups) {
          console.log('Using startups from localStorage after API error');
          setStartups(JSON.parse(savedStartups));
        } else {
          // Use default data as last resort
          console.log('Using default startup data after API error');
          setStartups(defaultStartups);
          // Save default data to localStorage
          localStorage.setItem('startups', JSON.stringify(defaultStartups));
        }
        
        setError('Failed to load startups from API. Using local data instead.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStartups();
  }, []);
  
  // Save startups to localStorage whenever they change
  useEffect(() => {
    if (startups.length > 0) {
      localStorage.setItem('startups', JSON.stringify(startups));
      console.log('Startups saved to localStorage:', startups);
    }
  }, [startups]);
  
  // Add a new startup
  const addStartup = async (startupData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to add startup via API
      try {
        const newStartup = await api.startups.create(startupData);
        console.log('Startup created via API:', newStartup);
        
        // Update state with the new startup
        setStartups(prevStartups => [...prevStartups, newStartup]);
        return newStartup;
      } catch (apiError) {
        console.error('API error when creating startup:', apiError);
        
        // Fallback to local storage if API fails
        const newId = Math.max(...startups.map(s => s.id || 0), 0) + 1;
        const newStartup = {
          id: newId,
          ...startupData,
          createdAt: new Date().toISOString()
        };
        
        setStartups(prevStartups => [...prevStartups, newStartup]);
        console.log('Startup created locally:', newStartup);
        
        return newStartup;
      }
    } catch (error) {
      console.error('Error adding startup:', error);
      setError(error.message || 'Failed to add startup');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing startup
  const updateStartup = async (id, startupData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to update startup via API
      try {
        const updatedStartup = await api.startups.update(id, startupData);
        console.log('Startup updated via API:', updatedStartup);
        
        // Update state with the updated startup
        setStartups(prevStartups => 
          prevStartups.map(startup => 
            (startup.id === id || startup._id === id) ? updatedStartup : startup
          )
        );
        
        return updatedStartup;
      } catch (apiError) {
        console.error('API error when updating startup:', apiError);
        
        // Fallback to local storage if API fails
        const updatedStartup = {
          ...startups.find(s => s.id === id || s._id === id),
          ...startupData,
          updatedAt: new Date().toISOString()
        };
        
        setStartups(prevStartups => 
          prevStartups.map(startup => 
            (startup.id === id || startup._id === id) ? updatedStartup : startup
          )
        );
        
        console.log('Startup updated locally:', updatedStartup);
        return updatedStartup;
      }
    } catch (error) {
      console.error('Error updating startup:', error);
      setError(error.message || 'Failed to update startup');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a startup
  const deleteStartup = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to delete startup via API
      try {
        await api.startups.delete(id);
        console.log('Startup deleted via API');
      } catch (apiError) {
        console.error('API error when deleting startup:', apiError);
        // Continue with local deletion even if API fails
      }
      
      // Update state by removing the startup
      setStartups(prevStartups => 
        prevStartups.filter(startup => startup.id !== id && startup._id !== id)
      );
      
      console.log('Startup removed from local state');
    } catch (error) {
      console.error('Error deleting startup:', error);
      setError(error.message || 'Failed to delete startup');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Get featured startups
  const getFeaturedStartups = (limit = 3) => {
    return startups
      .filter(startup => startup.featured)
      .slice(0, limit);
  };
  
  // Get recent startups
  const getRecentStartups = (limit = 3) => {
    return [...startups]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      })
      .slice(0, limit);
  };
  
  // Force refresh startups from API
  const refreshStartups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.startups.getAll();
      console.log('Startups refreshed from API:', response);
      
      if (response && response.startups) {
        setStartups(response.startups);
        return response.startups;
      }
      
      return startups;
    } catch (error) {
      console.error('Error refreshing startups:', error);
      setError('Failed to refresh startups');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <StartupContext.Provider 
      value={{ 
        startups, 
        setStartups,
        loading, 
        error, 
        addStartup, 
        updateStartup, 
        deleteStartup,
        getFeaturedStartups,
        getRecentStartups,
        refreshStartups
      }}
    >
      {children}
    </StartupContext.Provider>
  );
};

// Custom hook to use the startups context
export const useStartups = () => {
  const context = useContext(StartupContext);
  if (!context) {
    throw new Error('useStartups must be used within a StartupProvider');
  }
  return context;
};