/**
 * Mock API service for startups in development mode
 * This provides fallback functionality when the backend is not available
 */

// In-memory storage for mock data
// Use localStorage to persist mock startups between page refreshes
const getStoredStartups = () => {
  try {
    const storedStartups = localStorage.getItem('startups');
    if (storedStartups) {
      return JSON.parse(storedStartups);
    }
  } catch (error) {
    console.error('Error retrieving stored startups:', error);
  }
  
  // Default startups if none are stored
  return [
    {
      id: '1',
      name: 'EcoSolutions',
      category: 'Sustainability',
      foundedYear: 2025,
      stage: 'Seed',
      status: 'Active',
      featured: true,
      image: '/images/startups/eco-solutions.jpg',
      description: 'Developing sustainable solutions for waste management and renewable energy.',
      createdAt: '2024-05-01T10:00:00Z',
      updatedAt: '2024-05-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'LearnHub',
      category: 'Education',
      foundedYear: 2025,
      stage: 'Series A',
      status: 'Active',
      featured: true,
      image: '/images/startups/learn-hub.jpg',
      description: 'Online learning platform focused on skill development for college students.',
      createdAt: '2024-05-05T14:30:00Z',
      updatedAt: '2024-05-05T14:30:00Z'
    },
    {
      id: '3',
      name: 'HealthTrack',
      category: 'Healthcare',
      foundedYear: 2025,
      stage: 'Acquired',
      status: 'Active',
      featured: true,
      image: '/images/startups/health-track.jpg',
      description: 'AI-powered health monitoring and diagnostics platform.',
      createdAt: '2024-05-10T09:15:00Z',
      updatedAt: '2024-05-10T09:15:00Z'
    }
  ];
};

// Initialize mock startups from localStorage or defaults
let mockStartups = getStoredStartups();

// Helper function to save startups to localStorage
const saveStartups = () => {
  try {
    localStorage.setItem('startups', JSON.stringify(mockStartups));
    console.log('Mock startups saved to localStorage:', mockStartups);
  } catch (error) {
    console.error('Error saving mock startups:', error);
  }
};

// Mock startup API
const mockStartupApi = {
  getAll: (params = {}) => {
    console.log('[MOCK API] Getting all startups with params:', params);
    
    // Refresh from localStorage to ensure we have the latest data
    mockStartups = getStoredStartups();
    
    console.log('[MOCK API] Current startups:', mockStartups);
    
    // Apply filters if provided
    let filteredStartups = [...mockStartups];
    
    if (params.category && params.category !== 'all') {
      filteredStartups = filteredStartups.filter(s => s.category === params.category);
    }
    
    if (params.featured !== undefined) {
      const isFeatured = params.featured === 'true' || params.featured === true;
      filteredStartups = filteredStartups.filter(s => s.featured === isFeatured);
    }
    
    if (params.status && params.status !== 'all') {
      filteredStartups = filteredStartups.filter(s => s.status === params.status);
    }
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredStartups = filteredStartups.filter(s => 
        s.name.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm) ||
        s.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply limit if provided
    if (params.limit) {
      filteredStartups = filteredStartups.slice(0, parseInt(params.limit));
    }
    
    return Promise.resolve({
      startups: filteredStartups,
      totalPages: 1,
      currentPage: 1,
      total: filteredStartups.length
    });
  },
  
  getById: (id) => {
    console.log(`[MOCK API] Getting startup with ID: ${id}`);
    const startup = mockStartups.find(s => s.id === id || s._id === id);
    if (!startup) {
      return Promise.reject(new Error('Startup not found'));
    }
    return Promise.resolve(startup);
  },
  
  create: (startupData) => {
    console.log('[MOCK API] Creating new startup:', startupData);
    const newStartup = {
      id: String(mockStartups.length + 1),
      _id: String(mockStartups.length + 1),
      ...startupData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to mock startups array
    mockStartups.push(newStartup);
    
    // Save to localStorage
    saveStartups();
    
    console.log('[MOCK API] New startup created:', newStartup);
    console.log('[MOCK API] Updated startups list:', mockStartups);
    
    return Promise.resolve(newStartup);
  },
  
  update: (id, startupData) => {
    console.log(`[MOCK API] Updating startup with ID: ${id}`, startupData);
    const index = mockStartups.findIndex(s => s.id === id || s._id === id);
    
    if (index === -1) {
      return Promise.reject(new Error('Startup not found'));
    }
    
    const updatedStartup = {
      ...mockStartups[index],
      ...startupData,
      updatedAt: new Date().toISOString()
    };
    
    // Update in mock startups array
    mockStartups[index] = updatedStartup;
    
    // Save to localStorage
    saveStartups();
    
    console.log('[MOCK API] Startup updated:', updatedStartup);
    console.log('[MOCK API] Updated startups list:', mockStartups);
    
    return Promise.resolve(updatedStartup);
  },
  
  delete: (id) => {
    console.log(`[MOCK API] Deleting startup with ID: ${id}`);
    
    // Log current startups for debugging
    console.log('[MOCK API] Current startups before deletion:', mockStartups);
    
    // Convert id to string to ensure consistent comparison
    const idStr = String(id);
    
    // Find the startup by id or _id
    const index = mockStartups.findIndex(s => 
      (s.id && String(s.id) === idStr) || (s._id && String(s._id) === idStr)
    );
    
    console.log(`[MOCK API] Found startup at index: ${index}`);
    
    if (index === -1) {
      console.error(`[MOCK API] Startup with ID ${id} not found`);
      return Promise.reject(new Error(`Startup with ID ${id} not found`));
    }
    
    // Store the startup being deleted for logging
    const deletedStartup = mockStartups[index];
    console.log('[MOCK API] Deleting startup:', deletedStartup);
    
    // Remove from mock startups array
    mockStartups.splice(index, 1);
    
    // Save to localStorage
    saveStartups();
    
    console.log('[MOCK API] Startup deleted, updated startups list:', mockStartups);
    
    return Promise.resolve({ message: 'Startup deleted successfully' });
  }
};

export default mockStartupApi;