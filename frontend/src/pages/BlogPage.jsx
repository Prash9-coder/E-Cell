import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaFilter, FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa'
import { useBlog } from '../context/BlogContext'

const BlogPage = () => {
  // Use the BlogContext to get posts and refresh function
  const { posts, loading: contextLoading, refreshPosts } = useBlog()
  
  // State for filtering
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Blog categories
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'startup', name: 'Startup' },
    { id: 'technology', name: 'Technology' },
    { id: 'entrepreneurship', name: 'Entrepreneurship' },
    { id: 'innovation', name: 'Innovation' },
    { id: 'events', name: 'Events' }
  ]

  // Update loading state when context loading changes
  useEffect(() => {
    setIsLoading(contextLoading)
  }, [contextLoading])
  
  // Refresh posts when component mounts
  useEffect(() => {
    console.log('BlogPage mounted, refreshing posts...');
    refreshPosts().catch(error => {
      console.error('Error refreshing posts on BlogPage mount:', error);
    });
  }, [])

  // Filter posts based on search term and category
  useEffect(() => {
    if (posts.length > 0) {
      let filtered = [...posts]
      
      // Filter by category
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(post => post.category === categoryFilter)
      }
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(term) || 
          (post.excerpt && post.excerpt.toLowerCase().includes(term)) ||
          (post.content && post.content.toLowerCase().includes(term)) ||
          post.author.toLowerCase().includes(term)
        )
      }
      
      setFilteredPosts(filtered)
    }
  }, [posts, searchTerm, categoryFilter])

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary-800 text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="/images/blog/blog-hero-bg.jpg" 
            alt="E-Cell Blog" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">E-Cell Blog</h1>
            <p className="text-xl text-primary-100 mb-4">
              Insights, stories, and resources for student entrepreneurs and startup enthusiasts.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search */}
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <FaFilter className="text-gray-500 mr-1" />
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
                    categoryFilter === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setCategoryFilter(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {categoryFilter === 'all' && searchTerm === '' && (
        <section className="py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))
              ) : (
                posts.filter(post => post.featured).map(post => (
                  <Link 
                    key={post.id || post._id} 
                    to={`/blog/${post.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.image || '/images/blog/default.jpg'}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center mb-3">
                          <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                            {categories.find(cat => cat.id === post.category)?.name || post.category}
                          </span>
                          <span className="ml-2 text-xs text-gray-500 flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3 className="font-bold text-xl mb-2 group-hover:text-primary-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 flex-grow">{post.excerpt || post.content?.substring(0, 150) + '...'}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                              <FaUser className="text-primary-600" />
                            </div>
                            <span className="text-sm text-gray-700">{post.author}</span>
                          </div>
                          <span className="text-sm text-gray-500">{post.readTime || '5 min read'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">
            {categoryFilter !== 'all' 
              ? `${categories.find(cat => cat.id === categoryFilter)?.name || categoryFilter} Articles` 
              : 'All Articles'}
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-600">No blog posts found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <Link 
                  key={post.id || post._id} 
                  to={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.image || '/images/blog/default.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center mb-3">
                        <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                          {categories.find(cat => cat.id === post.category)?.name || post.category}
                        </span>
                        <span className="ml-2 text-xs text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-grow">{post.excerpt || post.content?.substring(0, 150) + '...'}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                            <FaUser className="text-primary-600" />
                          </div>
                          <span className="text-sm text-gray-700">{post.author}</span>
                        </div>
                        <span className="text-sm text-gray-500">{post.readTime || '5 min read'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-lg text-primary-100 mb-8">
              Get the latest entrepreneurship insights, startup resources, and E-Cell updates delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500"
                required
              />
              <button
                type="submit"
                className="bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium flex items-center justify-center"
              >
                Subscribe <FaArrowRight className="ml-2" />
              </button>
            </form>
            <p className="text-sm text-primary-200 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default BlogPage