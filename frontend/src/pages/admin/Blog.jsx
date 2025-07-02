import { useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaSync } from 'react-icons/fa'
import { useBlog } from '../../context/BlogContext'
import ImageUploader from '../../components/admin/ImageUploader'
// Ensure we're using the same styling as other admin pages

const Blog = () => {
  const { posts, loading: contextLoading, error, addPost, updatePost, deletePost, toggleFeatured, refreshPosts } = useBlog()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'startup', name: 'Startup' },
    { id: 'technology', name: 'Technology' },
    { id: 'entrepreneurship', name: 'Entrepreneurship' },
    { id: 'innovation', name: 'Innovation' },
    { id: 'events', name: 'Events' }
  ]

  // Filter posts based on search term and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Handle edit post
  const handleEditPost = (post) => {
    setCurrentPost(post)
    setImagePreview(post.image)
    setImageFile(null)
    setShowModal(true)
  }
  
  // Handle image change
  const handleImageChange = (file) => {
    setImageFile(file)
  }

  // Handle delete post
  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setLoading(true)
        console.log(`Admin page: Deleting post with ID: ${id}`)
        
        // Delete the post
        await deletePost(id)
        
        // Explicitly refresh posts to ensure we have the latest data
        console.log('Admin page: Refreshing posts after deletion')
        await refreshPosts()
        
        alert('Post deleted successfully!')
      } catch (error) {
        console.error('Error deleting post:', error)
        alert(`Failed to delete post: ${error.message || 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }
  }

  // Handle add new post
  const handleAddPost = () => {
    setCurrentPost(null)
    setImagePreview(null)
    setImageFile(null)
    setShowModal(true)
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Get form data
    const formData = {
      title: e.target.title.value,
      slug: e.target.slug.value,
      category: e.target.category.value,
      author: e.target.author.value,
      date: e.target.date.value,
      status: e.target.status.value,
      featured: e.target.featured.value === 'true',
      excerpt: e.target.excerpt?.value || '',
      content: e.target.content?.value || '',
      // Handle image
      image: imageFile 
        ? URL.createObjectURL(imageFile) 
        : currentPost?.image || '/images/blog/default.jpg'
    }
    
    try {
      setLoading(true);
      if (currentPost) {
        // Update existing post
        await updatePost(currentPost._id || currentPost.id, formData)
        alert('Post updated successfully!')
      } else {
        // Add new post
        await addPost(formData)
        alert('Post added successfully!')
      }
      
      setShowModal(false)
      setCurrentPost(null)
    } catch (error) {
      console.error('Error saving post:', error)
      alert(`Failed to save post: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle toggle featured
  const handleToggleFeatured = async (id) => {
    try {
      setLoading(true)
      const post = posts.find(p => p._id === id || p.id === id)
      if (!post) return
      
      await toggleFeatured(id, post.featured)
    } catch (error) {
      console.error('Error toggling featured status:', error)
      alert(`Failed to update featured status: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Blog Management</h1>
        <div className="flex items-center space-x-2">
          {loading && (
            <div className="mr-3 text-sm text-gray-600">
              <span className="inline-block animate-spin mr-1">⟳</span> Processing...
            </div>
          )}
          <button
            onClick={async () => {
              try {
                setLoading(true);
                await refreshPosts();
                alert('Blog posts refreshed successfully!');
              } catch (error) {
                console.error('Error refreshing posts:', error);
                alert(`Failed to refresh posts: ${error.message || 'Unknown error'}`);
              } finally {
                setLoading(false);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
            disabled={loading || contextLoading}
          >
            <FaSync className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={handleAddPost}
            className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
            disabled={loading || contextLoading}
          >
            <FaPlus className="mr-1.5" /> Add Post
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-3 mb-4">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 h-4 w-4" />
            </div>
            <input
              type="text"
              className="pl-8 pr-3 py-1.5 text-sm w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="ml-3">
            <select
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="ml-3">
            <select
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              defaultValue="all"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      {post.image && (
                        <div className="flex-shrink-0 h-8 w-8 mr-2">
                          <img 
                            className="h-8 w-8 rounded object-cover" 
                            src={post.image} 
                            alt={post.title}
                            onError={(e) => {
                              e.target.src = '/images/blog/default.jpg';
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-medium text-gray-900">{post.title}</div>
                        <div className="text-xs text-gray-500">{post.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-xs text-gray-500">{post.author}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : post.status === 'Draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(post.id)}
                      className={`px-1.5 py-0.5 text-xs rounded ${
                        post.featured
                          ? 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {post.featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right text-xs font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      title="View Post"
                    >
                      <FaEye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleEditPost(post)}
                      className="text-primary-600 hover:text-primary-900 mr-2"
                      title="Edit"
                    >
                      <FaEdit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FaTrash className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No posts found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs text-gray-500">
          Showing <span className="font-medium">{filteredPosts.length}</span> of <span className="font-medium">{posts.length}</span> posts
        </div>
        <div className="flex space-x-1">
          <button className="px-2 py-1 border border-gray-300 rounded-md text-xs disabled:opacity-50">
            Previous
          </button>
          <button className="px-2 py-1 border border-gray-300 rounded-md text-xs bg-primary-50 text-primary-600 font-medium">
            1
          </button>
          <button className="px-2 py-1 border border-gray-300 rounded-md text-xs disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-4 pb-3 sm:p-5 sm:pb-4">
                  <h3 className="text-base leading-6 font-medium text-gray-900 mb-3">
                    {currentPost ? 'Edit Post' : 'Add New Post'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="title" className="block text-xs font-medium text-gray-700">
                        Post Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentPost?.title || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="slug" className="block text-xs font-medium text-gray-700">
                        Slug
                      </label>
                      <input
                        type="text"
                        id="slug"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentPost?.slug || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-xs font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        id="category"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentPost?.category || ''}
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="startup">Startup</option>
                        <option value="technology">Technology</option>
                        <option value="entrepreneurship">Entrepreneurship</option>
                        <option value="innovation">Innovation</option>
                        <option value="events">Events</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="author" className="block text-xs font-medium text-gray-700">
                          Author
                        </label>
                        <input
                          type="text"
                          id="author"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          defaultValue={currentPost?.author || ''}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="date" className="block text-xs font-medium text-gray-700">
                          Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          defaultValue={currentPost?.date || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="status" className="block text-xs font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          defaultValue={currentPost?.status || 'Draft'}
                          required
                        >
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="featured" className="block text-xs font-medium text-gray-700">
                          Featured
                        </label>
                        <select
                          id="featured"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          defaultValue={currentPost?.featured ? 'true' : 'false'}
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <ImageUploader
                        onImageChange={handleImageChange}
                        currentImage={currentPost?.image}
                        label="Featured Image"
                        helpText="Upload a featured image for the blog post (JPG, PNG, GIF up to 5MB)"
                      />
                    </div>
                    <div>
                      <label htmlFor="excerpt" className="block text-xs font-medium text-gray-700">
                        Excerpt
                      </label>
                      <textarea
                        id="excerpt"
                        rows="2"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentPost?.excerpt || ''}
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="content" className="block text-xs font-medium text-gray-700">
                        Content
                      </label>
                      <textarea
                        id="content"
                        rows="4"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentPost?.content || ''}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 sm:px-5 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 py-1.5 bg-primary-600 text-xs font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-2 sm:w-auto"
                  >
                    {currentPost ? 'Update Post' : 'Add Post'}
                  </button>
                  <button
                    type="button"
                    className="mt-2 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-2 sm:w-auto"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog