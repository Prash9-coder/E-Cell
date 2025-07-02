import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const ResourceContext = createContext();

// Helper function to get resources from localStorage
const getStoredResources = () => {
  try {
    const storedResources = localStorage.getItem('ecell_resources');
    if (storedResources) {
      return JSON.parse(storedResources);
    }
  } catch (error) {
    console.error('Error retrieving stored resources:', error);
  }
  
  // Default resources if none are stored
  return [
    {
      id: 1,
      title: 'Startup Funding Guide',
      description: 'Learn how to secure funding for your startup with this comprehensive guide.',
      category: 'funding',
      type: 'PDF',
      url: '/resources/startup-funding-guide.pdf',
      thumbnail: '/images/resources/funding-guide.jpg',
      downloadLink: '/resources/startup-funding-guide.pdf',
      createdAt: '2024-01-15',
      featured: true
    },
    {
      id: 2,
      title: 'Business Model Canvas Template',
      description: 'A template to help you visualize and develop your business model.',
      category: 'templates',
      type: 'DOCX',
      url: '/resources/business-model-canvas.docx',
      thumbnail: '/images/resources/business-model-canvas.jpg',
      downloadLink: '/resources/business-model-canvas.docx',
      createdAt: '2024-01-20',
      featured: true
    },
    {
      id: 3,
      title: 'Pitch Deck Examples',
      description: 'Examples of successful pitch decks from various startups.',
      category: 'guides',
      type: 'PDF',
      url: '/resources/pitch-deck-examples.pdf',
      thumbnail: '/images/resources/pitch-deck.jpg',
      downloadLink: '/resources/pitch-deck-examples.pdf',
      createdAt: '2024-02-05',
      featured: false
    },
    {
      id: 4,
      title: 'Marketing Strategy for Startups',
      description: 'A guide to developing an effective marketing strategy for your startup.',
      category: 'guides',
      type: 'PDF',
      url: '/resources/marketing-strategy.pdf',
      thumbnail: '/images/resources/marketing-framework.jpg',
      downloadLink: '/resources/marketing-strategy.pdf',
      createdAt: '2024-02-10',
      featured: false
    },
    {
      id: 5,
      title: 'Financial Projections Template',
      description: 'Excel template for creating 3-year financial projections for your startup.',
      category: 'templates',
      type: 'XLSX',
      url: '/resources/financial-projections.xlsx',
      thumbnail: '/images/resources/financial-projections.jpg',
      downloadLink: '/resources/financial-projections.xlsx',
      createdAt: '2024-02-15',
      featured: true
    },
    {
      id: 6,
      title: 'Legal Checklist for Startups',
      description: 'Essential legal considerations for new startups.',
      category: 'guides',
      type: 'PDF',
      url: '/resources/legal-checklist.pdf',
      thumbnail: '/images/resources/legal-guide.jpg',
      downloadLink: '/resources/legal-checklist.pdf',
      createdAt: '2024-02-20',
      featured: false
    }
  ];
};

// Helper function to save resources to localStorage
const saveResourcesToStorage = (resources) => {
  try {
    localStorage.setItem('ecell_resources', JSON.stringify(resources));
    console.log('Resources saved to localStorage:', resources);
  } catch (error) {
    console.error('Error saving resources to localStorage:', error);
  }
};

// Provider component
export const ResourceProvider = ({ children }) => {
  const [resources, setResources] = useState(() => getStoredResources());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save resources to localStorage whenever they change
  useEffect(() => {
    saveResourcesToStorage(resources);
  }, [resources]);

  // Function to fetch all resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would call the API
      // const response = await api.resources.getAll();
      // const fetchedResources = response.resources;
      
      // For now, we'll use the stored resources or default mock data
      const storedResources = getStoredResources();
      
      setResources(storedResources);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources. Please try again later.');
      setLoading(false);
    }
  };

  // Function to add a new resource
  const addResource = async (resourceData) => {
    try {
      setLoading(true);
      
      // Create a new resource object
      const newId = Math.max(...resources.map(r => r.id), 0) + 1;
      const newResource = {
        id: newId,
        ...resourceData,
        createdAt: new Date().toISOString().split('T')[0],
        // Add default thumbnail based on type if not provided
        thumbnail: resourceData.thumbnail || `/images/resources/default-${resourceData.type.toLowerCase()}.jpg`
      };
      
      const updatedResources = [...resources, newResource];
      setResources(updatedResources);
      
      // Save to localStorage
      saveResourcesToStorage(updatedResources);
      
      setLoading(false);
      return newResource;
    } catch (error) {
      console.error('Error adding resource:', error);
      setError('Failed to add resource. Please try again later.');
      setLoading(false);
      throw error;
    }
  };

  // Function to update a resource
  const updateResource = async (id, resourceData) => {
    try {
      setLoading(true);
      
      // In a real app, this would call the API
      // const updatedResource = await api.resources.update(id, resourceData);
      
      // For now, we'll update the resource in our local state
      const updatedResources = resources.map(resource => 
        resource.id === id ? { ...resource, ...resourceData } : resource
      );
      
      setResources(updatedResources);
      
      // Save to localStorage
      saveResourcesToStorage(updatedResources);
      
      setLoading(false);
      
      // Return the updated resource
      return updatedResources.find(resource => resource.id === id);
    } catch (error) {
      console.error('Error updating resource:', error);
      setError('Failed to update resource. Please try again later.');
      setLoading(false);
      throw error;
    }
  };

  // Function to delete a resource
  const deleteResource = async (id) => {
    try {
      setLoading(true);
      
      // In a real app, this would call the API
      // await api.resources.delete(id);
      
      // For now, we'll just remove the resource from our local state
      const filteredResources = resources.filter(resource => resource.id !== id);
      setResources(filteredResources);
      
      // Save to localStorage
      saveResourcesToStorage(filteredResources);
      
      setLoading(false);
      
      return { success: true, message: 'Resource deleted successfully' };
    } catch (error) {
      console.error('Error deleting resource:', error);
      setError('Failed to delete resource. Please try again later.');
      setLoading(false);
      throw error;
    }
  };

  // Get featured resources
  const getFeaturedResources = () => {
    return resources.filter(resource => resource.featured);
  };

  return (
    <ResourceContext.Provider 
      value={{ 
        resources,
        loading,
        error,
        fetchResources,
        addResource,
        updateResource,
        deleteResource,
        getFeaturedResources
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

// Custom hook to use the resource context
export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
};