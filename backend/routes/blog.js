import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Mock data for development
let blogPosts = [
  {
    id: 1,
    title: '10 Essential Skills Every Entrepreneur Needs in 2024',
    slug: '10-essential-skills-every-entrepreneur-needs',
    category: 'entrepreneurship',
    author: 'Priya Sharma',
    date: '2024-01-15',
    status: 'Published',
    featured: true,
    excerpt: 'Discover the key skills that will help entrepreneurs succeed in the rapidly evolving business landscape of 2024.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 2,
    title: 'How to Validate Your Startup Idea on a Budget',
    slug: 'validate-startup-idea-on-budget',
    category: 'startup',
    author: 'Rahul Verma',
    date: '2023-12-28',
    status: 'Published',
    featured: true,
    excerpt: 'Learn cost-effective strategies to test and validate your startup idea before investing significant resources.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    id: 3,
    title: 'The Rise of AI in Entrepreneurship: Opportunities and Challenges',
    slug: 'ai-in-entrepreneurship',
    category: 'technology',
    author: 'Vikram Reddy',
    date: '2023-12-10',
    status: 'Published',
    featured: true,
    excerpt: 'Explore how artificial intelligence is transforming the entrepreneurial landscape and what it means for founders.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }
];

// Get all blog posts
router.get('/', (req, res) => {
  try {
    // Filter by category if provided
    const { category, featured } = req.query;
    let filteredPosts = [...blogPosts];
    
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    
    if (featured === 'true') {
      filteredPosts = filteredPosts.filter(post => post.featured);
    }
    
    res.json({ 
      success: true, 
      posts: filteredPosts 
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blog posts' 
    });
  }
});

// Get blog post by ID
router.get('/:id', (req, res) => {
  try {
    const post = blogPosts.find(p => p.id.toString() === req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }
    
    res.json({ 
      success: true, 
      post 
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blog post' 
    });
  }
});

// Get blog post by slug
router.get('/slug/:slug', (req, res) => {
  try {
    const post = blogPosts.find(p => p.slug === req.params.slug);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }
    
    res.json({ 
      success: true, 
      post 
    });
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blog post' 
    });
  }
});

// Create a new blog post
router.post('/', 
  [
    // Validation middleware would go here in a production app
    // For now, we'll keep it simple
  ],
  (req, res) => {
    try {
      const newPost = {
        id: blogPosts.length > 0 ? Math.max(...blogPosts.map(p => p.id)) + 1 : 1,
        ...req.body,
        date: req.body.date || new Date().toISOString().split('T')[0]
      };
      
      blogPosts.push(newPost);
      
      res.status(201).json({ 
        success: true, 
        post: newPost,
        message: 'Blog post created successfully'
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create blog post' 
      });
    }
  }
);

// Update a blog post
router.put('/:id', (req, res) => {
  try {
    const postIndex = blogPosts.findIndex(p => p.id.toString() === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }
    
    // Update the post
    blogPosts[postIndex] = {
      ...blogPosts[postIndex],
      ...req.body,
      id: blogPosts[postIndex].id // Ensure ID doesn't change
    };
    
    res.json({ 
      success: true, 
      post: blogPosts[postIndex],
      message: 'Blog post updated successfully'
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update blog post' 
    });
  }
});

// Delete a blog post
router.delete('/:id', (req, res) => {
  try {
    const postIndex = blogPosts.findIndex(p => p.id.toString() === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }
    
    // Remove the post
    blogPosts.splice(postIndex, 1);
    
    res.json({ 
      success: true, 
      message: 'Blog post deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete blog post' 
    });
  }
});

export default router;