import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Create the context
const BlogContext = createContext();

// Provider component
export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to fetch blog posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await api.blog.getAll();
      console.log('Fetched blog posts:', data.posts);
      setPosts(data.posts || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts. Please try again later.');
      
      // Set some default posts if API fails
      setPosts([
        {
          id: 1,
          title: '10 Essential Skills Every Entrepreneur Needs in 2024',
          slug: '10-essential-skills-every-entrepreneur-needs',
          category: 'entrepreneurship',
          author: 'Priya Sharma',
          date: '2024-01-15',
          status: 'Published',
          featured: true
        },
        {
          id: 2,
          title: 'How to Validate Your Startup Idea on a Budget',
          slug: 'validate-startup-idea-on-budget',
          category: 'startup',
          author: 'Rahul Verma',
          date: '2023-12-28',
          status: 'Published',
          featured: true
        },
        {
          id: 3,
          title: 'The Rise of AI in Entrepreneurship: Opportunities and Challenges',
          slug: 'ai-in-entrepreneurship',
          category: 'technology',
          author: 'Vikram Reddy',
          date: '2023-12-10',
          status: 'Published',
          featured: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch blog posts from API on component mount
  useEffect(() => {
    fetchPosts();
  }, []);
  
  // Add a new blog post
  const addPost = async (postData) => {
    try {
      setLoading(true);
      const newPost = await api.blog.create(postData);
      setPosts(prevPosts => [...prevPosts, newPost]);
      return newPost;
    } catch (error) {
      console.error('Error adding blog post:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing blog post
  const updatePost = async (id, postData) => {
    try {
      setLoading(true);
      const updatedPost = await api.blog.update(id, postData);
      setPosts(prevPosts => 
        prevPosts.map(post => post._id === id || post.id === id ? updatedPost : post)
      );
      return updatedPost;
    } catch (error) {
      console.error('Error updating blog post:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a blog post
  const deletePost = async (id) => {
    try {
      setLoading(true);
      console.log(`Deleting blog post with ID: ${id}`);
      
      // First update local state to provide immediate feedback
      setPosts(prevPosts => prevPosts.filter(post => post._id !== id && post.id !== id));
      
      // Then delete from API
      await api.blog.delete(id);
      console.log(`Blog post with ID: ${id} deleted successfully`);
      
      // Refresh posts from API to ensure consistency
      try {
        console.log('Refreshing posts after deletion');
        const data = await api.blog.getAll();
        setPosts(data.posts || []);
        console.log('Posts refreshed after deletion:', data.posts);
      } catch (refreshError) {
        console.error('Error refreshing posts after deletion:', refreshError);
        // We already updated the local state, so no need to throw this error
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle featured status
  const toggleFeatured = async (id, featured) => {
    try {
      setLoading(true);
      const post = posts.find(p => p._id === id || p.id === id);
      if (!post) throw new Error('Post not found');
      
      const updatedPost = await api.blog.update(id, { ...post, featured: !featured });
      setPosts(prevPosts => 
        prevPosts.map(post => post._id === id || post.id === id ? updatedPost : post)
      );
      return updatedPost;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to refresh posts from API
  const refreshPosts = async () => {
    console.log('Refreshing blog posts...');
    await fetchPosts();
    console.log('Blog posts refreshed');
    return posts;
  };

  return (
    <BlogContext.Provider 
      value={{ 
        posts, 
        loading, 
        error, 
        addPost, 
        updatePost, 
        deletePost,
        toggleFeatured,
        refreshPosts
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

// Custom hook to use the blog context
export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};