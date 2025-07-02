/**
 * Mock API service for blog posts in development mode
 * This provides fallback functionality when the backend is not available
 */

// In-memory storage for mock data
// Use localStorage to persist mock blog posts between page refreshes
const getStoredPosts = () => {
  try {
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
      return JSON.parse(storedPosts);
    }
  } catch (error) {
    console.error('Error retrieving stored blog posts:', error);
  }
  
  // Default blog posts if none are stored
  return [
    {
      id: '1',
      title: '10 Essential Skills Every Entrepreneur Needs in 2024',
      slug: '10-essential-skills-every-entrepreneur-needs',
      category: 'entrepreneurship',
      author: 'Priya Sharma',
      date: '2024-01-15',
      status: 'Published',
      featured: true,
      excerpt: 'From adaptability to digital literacy, discover the key skills that will help entrepreneurs thrive in today\'s rapidly evolving business landscape.',
      content: 'The entrepreneurial landscape is constantly evolving, and staying ahead requires a diverse set of skills...',
      image: '/images/blog/entrepreneur-skills.jpg',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'How to Validate Your Startup Idea on a Budget',
      slug: 'validate-startup-idea-on-budget',
      category: 'startup',
      author: 'Rahul Verma',
      date: '2023-12-28',
      status: 'Published',
      featured: true,
      excerpt: 'Learn cost-effective strategies to test your business concept and gather valuable market feedback before investing significant resources.',
      content: 'One of the biggest mistakes new entrepreneurs make is investing too much time and money into an idea before validating whether there\'s a market for it...',
      image: '/images/blog/idea-validation.jpg',
      createdAt: '2023-12-28T14:30:00Z',
      updatedAt: '2023-12-28T14:30:00Z'
    },
    {
      id: '3',
      title: 'The Rise of AI in Entrepreneurship: Opportunities and Challenges',
      slug: 'ai-in-entrepreneurship',
      category: 'technology',
      author: 'Vikram Reddy',
      date: '2023-12-10',
      status: 'Published',
      featured: true,
      excerpt: 'Explore how artificial intelligence is transforming the startup ecosystem and what founders need to know to leverage this technology effectively.',
      content: 'Artificial Intelligence (AI) is no longer just a buzzword or a technology of the future—it\'s here now and rapidly transforming the entrepreneurial landscape...',
      image: '/images/blog/ai-entrepreneurship.jpg',
      createdAt: '2023-12-10T09:15:00Z',
      updatedAt: '2023-12-10T09:15:00Z'
    }
  ];
};

// Initialize mock blog posts from localStorage or defaults
let mockPosts = getStoredPosts();

// Helper function to save blog posts to localStorage
const savePosts = () => {
  try {
    localStorage.setItem('blogPosts', JSON.stringify(mockPosts));
    console.log('Mock blog posts saved to localStorage:', mockPosts);
  } catch (error) {
    console.error('Error saving mock blog posts:', error);
  }
};

// Mock blog API
const mockBlogApi = {
  getAll: (params = {}) => {
    console.log('[MOCK API] Getting all blog posts with params:', params);
    
    // Refresh from localStorage to ensure we have the latest data
    mockPosts = getStoredPosts();
    
    console.log('[MOCK API] Current blog posts:', mockPosts);
    
    // Apply filters if provided
    let filteredPosts = [...mockPosts];
    
    if (params.category && params.category !== 'all') {
      filteredPosts = filteredPosts.filter(p => p.category === params.category);
    }
    
    if (params.featured !== undefined) {
      const isFeatured = params.featured === 'true' || params.featured === true;
      filteredPosts = filteredPosts.filter(p => p.featured === isFeatured);
    }
    
    if (params.status && params.status !== 'all') {
      filteredPosts = filteredPosts.filter(p => p.status === params.status);
    }
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredPosts = filteredPosts.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.excerpt.toLowerCase().includes(searchTerm) ||
        p.content.toLowerCase().includes(searchTerm) ||
        p.author.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply limit if provided
    if (params.limit) {
      filteredPosts = filteredPosts.slice(0, parseInt(params.limit));
    }
    
    return Promise.resolve({
      posts: filteredPosts,
      totalPages: 1,
      currentPage: 1,
      total: filteredPosts.length
    });
  },
  
  getById: (id) => {
    console.log(`[MOCK API] Getting blog post with ID: ${id}`);
    const post = mockPosts.find(p => p.id === id || p._id === id);
    if (!post) {
      return Promise.reject(new Error('Blog post not found'));
    }
    return Promise.resolve(post);
  },
  
  getBySlug: (slug) => {
    console.log(`[MOCK API] Getting blog post with slug: ${slug}`);
    const post = mockPosts.find(p => p.slug === slug);
    if (!post) {
      return Promise.reject(new Error('Blog post not found'));
    }
    return Promise.resolve(post);
  },
  
  create: (postData) => {
    console.log('[MOCK API] Creating new blog post:', postData);
    const newPost = {
      id: String(mockPosts.length + 1),
      _id: String(mockPosts.length + 1),
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to mock posts array
    mockPosts.push(newPost);
    
    // Save to localStorage
    savePosts();
    
    console.log('[MOCK API] New blog post created:', newPost);
    console.log('[MOCK API] Updated blog posts list:', mockPosts);
    
    return Promise.resolve(newPost);
  },
  
  update: (id, postData) => {
    console.log(`[MOCK API] Updating blog post with ID: ${id}`, postData);
    const index = mockPosts.findIndex(p => p.id === id || p._id === id);
    
    if (index === -1) {
      return Promise.reject(new Error('Blog post not found'));
    }
    
    const updatedPost = {
      ...mockPosts[index],
      ...postData,
      updatedAt: new Date().toISOString()
    };
    
    // Update in mock posts array
    mockPosts[index] = updatedPost;
    
    // Save to localStorage
    savePosts();
    
    console.log('[MOCK API] Blog post updated:', updatedPost);
    console.log('[MOCK API] Updated blog posts list:', mockPosts);
    
    return Promise.resolve(updatedPost);
  },
  
  delete: (id) => {
    console.log(`[MOCK API] Deleting blog post with ID: ${id}`);
    
    // Log current posts for debugging
    console.log('[MOCK API] Current blog posts before deletion:', mockPosts);
    
    // Convert id to string to ensure consistent comparison
    const idStr = String(id);
    
    // Find the post by id or _id
    const index = mockPosts.findIndex(p => 
      (p.id && String(p.id) === idStr) || (p._id && String(p._id) === idStr)
    );
    
    console.log(`[MOCK API] Found blog post at index: ${index}`);
    
    if (index === -1) {
      console.error(`[MOCK API] Blog post with ID ${id} not found`);
      return Promise.reject(new Error(`Blog post with ID ${id} not found`));
    }
    
    // Store the post being deleted for logging
    const deletedPost = mockPosts[index];
    console.log('[MOCK API] Deleting blog post:', deletedPost);
    
    // Remove from mock posts array
    mockPosts.splice(index, 1);
    
    // Save to localStorage
    savePosts();
    
    console.log('[MOCK API] Blog post deleted, updated posts list:', mockPosts);
    
    return Promise.resolve({ message: 'Blog post deleted successfully' });
  }
};

export default mockBlogApi;