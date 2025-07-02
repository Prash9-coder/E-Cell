import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaSync } from 'react-icons/fa'
import ImageUploader from '../../components/admin/ImageUploader'
import { useStartups } from '../../context/StartupContext'

const Startups = () => {
  const { 
    startups, 
    setStartups, 
    loading, 
    error, 
    addStartup, 
    updateStartup, 
    deleteStartup,
    refreshStartups 
  } = useStartups();
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [currentStartup, setCurrentStartup] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  
  // Log startups whenever they change
  useEffect(() => {
    console.log('Startups in admin page updated:', startups);
  }, [startups])

  // Categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Healthcare', name: 'Healthcare' },
    { id: 'Education', name: 'Education' },
    { id: 'Fintech', name: 'Fintech' },
    { id: 'Sustainability', name: 'Sustainability' },
    { id: 'E-Commerce', name: 'E-Commerce' }
  ]

  // Filter startups based on search term and category
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = 
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.stage.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || startup.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Handle edit startup
  const handleEditStartup = (startup) => {
    setCurrentStartup(startup)
    setImagePreview(startup.image)
    setImageFile(null)
    setShowModal(true)
  }
  
  // Handle image change
  const handleImageChange = (file) => {
    setImageFile(file)
  }

  // Handle delete startup
  const handleDeleteStartup = async (id) => {
    if (window.confirm('Are you sure you want to delete this startup?')) {
      try {
        await deleteStartup(id);
        alert('Startup deleted successfully!');
      } catch (error) {
        console.error('Error deleting startup:', error);
        alert(`Failed to delete startup: ${error.message || 'Unknown error'}`);
      }
    }
  }

  // Handle add new startup
  const handleAddStartup = () => {
    setCurrentStartup(null)
    setImagePreview(null)
    setImageFile(null)
    setShowModal(true)
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get form data
      const form = e.target;
      const name = form.name.value;
      const category = form.category.value;
      const foundedYear = parseInt(form.foundedYear.value);
      const stage = form.stage.value;
      const status = form.status.value;
      const featured = form.featured.value === 'true';
      const description = form.description?.value || '';
      
      // Prepare startup data
      const startupData = {
        name,
        category,
        foundedYear,
        stage,
        status,
        featured,
        description,
        // Set image if one was selected, otherwise use a default or existing one
        image: imageFile 
          ? URL.createObjectURL(imageFile) 
          : (currentStartup?.image || '/images/startups/default.jpg')
      };
      
      if (currentStartup) {
        // Update existing startup
        const id = currentStartup.id || currentStartup._id;
        await updateStartup(id, startupData);
        alert('Startup updated successfully!');
      } else {
        // Add new startup
        await addStartup(startupData);
        alert('Startup added successfully!');
      }
      
      // Close modal
      setShowModal(false);
    } catch (error) {
      console.error('Error saving startup:', error);
      alert(`Failed to save startup: ${error.message || 'Unknown error'}`);
    }
  }

  // Handle toggle featured
  const handleToggleFeatured = async (id) => {
    try {
      // Find the startup to toggle
      const startup = startups.find(s => s.id === id || s._id === id);
      if (!startup) {
        console.error('Startup not found:', id);
        return;
      }
      
      // Update the startup with toggled featured status
      await updateStartup(id, { 
        ...startup, 
        featured: !startup.featured 
      });
      
      console.log(`Startup ${id} featured status toggled to ${!startup.featured}`);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert(`Failed to update startup: ${error.message || 'Unknown error'}`);
    }
  }
  
  // Handle view startup details
  const handleViewDetails = (startup) => {
    console.log("Viewing details for startup:", startup);
    setCurrentStartup(startup);
    setShowDetailsModal(true);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Startups Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={async () => {
              try {
                await refreshStartups();
                alert('Startups refreshed successfully!');
              } catch (error) {
                alert(`Failed to refresh startups: ${error.message || 'Unknown error'}`);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            disabled={loading}
          >
            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={handleAddStartup}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
            disabled={loading}
          >
            <FaPlus className="mr-2" /> Add Startup
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
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search startups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:ml-4 flex space-x-4">
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
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              defaultValue="all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Startups Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Startup Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Founded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStartups.map((startup) => (
                <tr key={startup.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {startup.image && (
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={startup.image} 
                            alt={startup.name}
                            onError={(e) => {
                              e.target.src = '/images/startups/default.jpg';
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900">{startup.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{startup.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{startup.foundedYear}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{startup.stage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      startup.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : startup.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {startup.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(startup.id)}
                      className={`px-2 py-1 text-xs rounded ${
                        startup.featured
                          ? 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {startup.featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(startup)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEditStartup(startup)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteStartup(startup.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStartups.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No startups found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredStartups.length}</span> of <span className="font-medium">{startups.length}</span> startups
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
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {currentStartup ? 'Edit Startup' : 'Add New Startup'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Startup Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentStartup?.name || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        id="category"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentStartup?.category || ''}
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Fintech">Fintech</option>
                        <option value="Sustainability">Sustainability</option>
                        <option value="E-Commerce">E-Commerce</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                          Founded Year
                        </label>
                        <input
                          type="number"
                          id="foundedYear"
                          min="2000"
                          max="2030"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          defaultValue={currentStartup?.foundedYear || ''}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
                          Stage
                        </label>
                        <select
                          id="stage"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          defaultValue={currentStartup?.stage || ''}
                          required
                        >
                          <option value="">Select stage</option>
                          <option value="Idea">Idea</option>
                          <option value="Pre-seed">Pre-seed</option>
                          <option value="Seed">Seed</option>
                          <option value="Series A">Series A</option>
                          <option value="Series B+">Series B+</option>
                          <option value="Acquired">Acquired</option>
                          <option value="Bootstrapped">Bootstrapped</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          defaultValue={currentStartup?.status || 'Active'}
                          required
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="featured" className="block text-sm font-medium text-gray-700">
                          Featured
                        </label>
                        <select
                          id="featured"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          defaultValue={currentStartup?.featured ? 'true' : 'false'}
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <ImageUploader
                        onImageChange={handleImageChange}
                        currentImage={currentStartup?.image}
                        label="Startup Logo/Image"
                        helpText="Upload a logo or image for the startup (JPG, PNG, GIF up to 5MB)"
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
                        defaultValue={currentStartup?.description || ''}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {currentStartup ? 'Update Startup' : 'Add Startup'}
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

      {/* Details Modal */}
      {showDetailsModal && currentStartup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {currentStartup.name}
                    </h3>
                    
                    {currentStartup.image && (
                      <div className="mb-4">
                        <img 
                          src={currentStartup.image} 
                          alt={currentStartup.name}
                          className="h-40 w-auto object-contain mx-auto rounded-md"
                          onError={(e) => {
                            e.target.src = '/images/startups/default.jpg';
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="mt-4 space-y-4">
                      <div className="border-t border-gray-200 pt-4">
                        <dl className="divide-y divide-gray-200">
                          <div className="py-3 flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Category</dt>
                            <dd className="text-sm text-gray-900">{currentStartup.category}</dd>
                          </div>
                          <div className="py-3 flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Founded</dt>
                            <dd className="text-sm text-gray-900">{currentStartup.foundedYear}</dd>
                          </div>
                          <div className="py-3 flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Stage</dt>
                            <dd className="text-sm text-gray-900">{currentStartup.stage}</dd>
                          </div>
                          <div className="py-3 flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="text-sm text-gray-900">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                currentStartup.status === 'Active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : currentStartup.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {currentStartup.status}
                              </span>
                            </dd>
                          </div>
                          <div className="py-3 flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Featured</dt>
                            <dd className="text-sm text-gray-900">
                              <span className={`px-2 py-1 text-xs rounded ${
                                currentStartup.featured
                                  ? 'bg-primary-100 text-primary-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {currentStartup.featured ? 'Featured' : 'Not Featured'}
                              </span>
                            </dd>
                          </div>
                          {currentStartup.description && (
                            <div className="py-3">
                              <dt className="text-sm font-medium text-gray-500 mb-2">Description</dt>
                              <dd className="text-sm text-gray-900 mt-1">{currentStartup.description || 'No description available.'}</dd>
                            </div>
                          )}
                          {!currentStartup.description && (
                            <div className="py-3">
                              <dt className="text-sm font-medium text-gray-500 mb-2">Description</dt>
                              <dd className="text-sm text-gray-500 italic mt-1">No description available.</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Startups