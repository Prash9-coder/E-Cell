import { useState, useRef, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa'
import api from '../../services/api'

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Fetch gallery items from API
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await api.gallery.getAll()
        setGalleryItems(data)
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching gallery items:', error)
        setError('Failed to load gallery items. Please try again.')
        setIsLoading(false)
      }
    }
    
    fetchGalleryItems()
  }, [])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  // Categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'events', name: 'Events' },
    { id: 'workshops', name: 'Workshops' },
    { id: 'competitions', name: 'Competitions' },
    { id: 'team', name: 'Team' },
    { id: 'campus', name: 'Campus Life' }
  ]

  // Filter gallery items based on search term and category
  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Handle edit item
  const handleEditItem = (item) => {
    setCurrentItem(item)
    setImagePreview(null)
    setImageFile(null)
    setShowModal(true)
  }

  // Handle delete item
  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        // Delete from API
        await api.gallery.delete(id)
        
        // Update local state
        setGalleryItems(galleryItems.filter(item => item.id !== id))
      } catch (error) {
        console.error('Error deleting gallery item:', error)
        alert('Failed to delete gallery item. Please try again.')
      }
    }
  }

  // Handle add new item
  const handleAddItem = () => {
    setCurrentItem(null)
    setImagePreview(null)
    setImageFile(null)
    setShowModal(true)
  }

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setImageFile(file)
    
    // Create a preview URL for the image
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Create FormData object for file upload
      const formData = new FormData()
      formData.append('title', e.target.title.value)
      formData.append('description', e.target.description.value)
      formData.append('category', e.target.category.value)
      formData.append('date', e.target.date.value)
      
      // Handle image
      if (imageFile) {
        formData.append('image', imageFile)
      } else if (currentItem) {
        // If editing and no new image was selected, use the existing image URL
        formData.append('imageUrl', currentItem.image)
      } else {
        // If no image was selected for a new item, show an error
        alert('Please select an image')
        return
      }
      
      let response
      
      if (currentItem) {
        // Update existing item
        response = await api.gallery.update(currentItem.id, formData)
        
        // Update the local state
        setGalleryItems(galleryItems.map(item => 
          item.id === currentItem.id ? response : item
        ))
      } else {
        // Add new item
        response = await api.gallery.create(formData)
        
        // Add to the local state
        setGalleryItems([...galleryItems, response])
      }
      
      // Reset state and close modal
      setImageFile(null)
      setImagePreview(null)
      setShowModal(false)
      setCurrentItem(null)
    } catch (error) {
      console.error('Error saving gallery item:', error)
      
      // Show more detailed error message
      let errorMessage = 'Failed to save gallery item. '
      
      if (error.message) {
        errorMessage += error.message
      } else {
        errorMessage += 'Please try again.'
      }
      
      alert(errorMessage)
    }
  }

  // Handle view image
  const handleViewImage = (item) => {
    setSelectedImage(item)
  }

  // Close image viewer
  const closeImageViewer = () => {
    setSelectedImage(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery Management</h1>
        <button
          onClick={handleAddItem}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Image
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search gallery..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:ml-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Gallery Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No gallery items found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 overflow-hidden relative group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      console.error('Image failed to load:', item.image);
                      e.target.src = '/images/placeholder-image.jpg';
                      e.target.onerror = null; // Prevent infinite loop
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleViewImage(item)}
                      className="bg-white text-gray-800 p-2 rounded-full mr-2"
                      title="View Image"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEditItem(item)}
                      className="bg-white text-primary-600 p-2 rounded-full mr-2"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="bg-white text-red-600 p-2 rounded-full"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg text-gray-900 truncate">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
                      {categories.find(cat => cat.id === item.category)?.name || item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredItems.length}</span> of <span className="font-medium">{galleryItems.length}</span> items
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-primary-50 text-primary-600 font-medium">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {currentItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentItem?.title || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentItem?.description || ''}
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        id="category"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentItem?.category || ''}
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="events">Events</option>
                        <option value="workshops">Workshops</option>
                        <option value="competitions">Competitions</option>
                        <option value="team">Team</option>
                        <option value="campus">Campus Life</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentItem?.date || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Image
                      </label>
                      {currentItem?.image && (
                        <div className="mt-2 mb-4">
                          <img 
                            src={currentItem.image} 
                            alt={currentItem.title}
                            className="h-32 w-auto object-cover rounded-md"
                          />
                        </div>
                      )}
                      {imagePreview && (
                        <div className="mt-2 mb-4">
                          <img 
                            src={imagePreview} 
                            alt="Image Preview"
                            className="h-32 w-auto object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className="mt-1 flex items-center">
                        <input
                          type="file"
                          id="image"
                          ref={fileInputRef}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {currentItem ? 'Update Item' : 'Add Item'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

      {/* Image Viewer */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative max-w-4xl w-full p-4">
            <button 
              className="absolute top-4 right-4 text-white text-2xl z-10 bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center"
              onClick={closeImageViewer}
            >
              &times;
            </button>
            <img 
              src={selectedImage.image} 
              alt={selectedImage.title} 
              className="w-full h-auto max-h-[80vh] object-contain"
              onError={(e) => {
                console.error('Lightbox image failed to load:', selectedImage.image);
                e.target.src = '/images/placeholder-image.jpg';
                e.target.onerror = null; // Prevent infinite loop
              }}
            />
            <div className="bg-white p-4 mt-4 rounded-md">
              <h3 className="font-medium text-xl">{selectedImage.title}</h3>
              <p className="text-gray-600 mt-1">{selectedImage.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {new Date(selectedImage.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-600">
                  {categories.find(cat => cat.id === selectedImage.category)?.name || selectedImage.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery