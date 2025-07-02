import { useState, useRef, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaDownload, FaLink, FaFileAlt, FaUpload } from 'react-icons/fa'
import { useResources } from '../../context/ResourceContext'

const Resources = () => {
  const { resources, loading, error, addResource, updateResource, deleteResource } = useResources()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [currentResource, setCurrentResource] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileUploadError, setFileUploadError] = useState('')
  const fileInputRef = useRef(null)
  
  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(resources.map(resource => resource.category))]
  
  // Filter resources based on search term and category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })
  
  // Handle edit resource
  const handleEditResource = (resource) => {
    setCurrentResource(resource)
    setSelectedFile(null)
    setFileUploadError('')
    setShowModal(true)
  }
  
  // Handle delete resource
  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id);
        // Success message could be shown here
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource. Please try again.');
      }
    }
  }
  
  // Handle add new resource
  const handleAddResource = () => {
    setCurrentResource(null)
    setSelectedFile(null)
    setFileUploadError('')
    setShowModal(true)
  }
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      setSelectedFile(null)
      return
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setFileUploadError('File size exceeds 5MB limit')
      setSelectedFile(null)
      return
    }
    
    setFileUploadError('')
    setSelectedFile(file)
    
    // Auto-detect file type
    const fileName = file.name.toLowerCase()
    const fileExtension = fileName.split('.').pop()
    
    // Set the file type in the form based on extension
    const typeSelect = document.getElementById('type')
    if (typeSelect) {
      if (fileExtension === 'pdf') {
        typeSelect.value = 'PDF'
      } else if (['doc', 'docx'].includes(fileExtension)) {
        typeSelect.value = 'DOCX'
      } else if (['xls', 'xlsx', 'csv'].includes(fileExtension)) {
        typeSelect.value = 'XLSX'
      }
    }
  }
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Get form data
    const form = e.target
    const title = form.title.value
    const category = form.category.value
    const type = form.type.value
    const featured = form.featured.checked
    
    // Start with the URL from the form if provided
    let url = form.url?.value || ''
    let downloadLink = url
    
    // If a file was selected, upload it to the server
    if (selectedFile) {
      try {
        // Create a FormData object to send the file
        const formData = new FormData()
        formData.append('file', selectedFile)
        
        // Show loading state or message here if needed
        
        // Upload the file to the server
        const response = await fetch('/api/resources/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to upload file')
        }
        
        const data = await response.json()
        
        // Use the URL returned from the server
        url = data.file.url
        downloadLink = data.file.url
        
        console.log('File uploaded successfully:', data)
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError)
        setFileUploadError(uploadError.message || 'Failed to upload file. Please try again.')
        return
      }
    }
    
    // Validate that we have either a URL or a file
    if (!url && !selectedFile && type !== 'LINK') {
      setFileUploadError('Please either upload a file or provide a URL')
      return
    }
    
    try {
      if (currentResource) {
        // Update existing resource
        await updateResource(currentResource.id, { 
          title, 
          category, 
          type, 
          url: url || currentResource.url, 
          featured,
          // Add downloadLink for client-side component
          downloadLink: downloadLink || currentResource.downloadLink
        });
      } else {
        // Add new resource
        await addResource({
          title,
          category,
          type,
          url,
          featured,
          // Add downloadLink for client-side component
          downloadLink,
          // Add a description for client-side display
          description: `${category} resource for entrepreneurs.`
        });
      }
      
      // Reset state
      setSelectedFile(null)
      setFileUploadError('')
      
      // Close modal
      setShowModal(false);
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Failed to save resource. Please try again.');
    }
  }
  
  // Handle toggle featured
  const handleToggleFeatured = (id) => {
    setResources(resources.map(resource => 
      resource.id === id ? { ...resource, featured: !resource.featured } : resource
    ))
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resources Management</h1>
        <button
          onClick={handleAddResource}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Resource
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
              placeholder="Search resources..."
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
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Resources Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
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
              {filteredResources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded">
                        {resource.type === 'PDF' && <FaFileAlt className="text-red-500" />}
                        {resource.type === 'DOCX' && <FaFileAlt className="text-blue-500" />}
                        {resource.type === 'XLSX' && <FaFileAlt className="text-green-500" />}
                        {!['PDF', 'DOCX', 'XLSX'].includes(resource.type) && <FaLink className="text-gray-500" />}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-900 flex items-center mt-1"
                        >
                          <FaDownload className="mr-1" size={12} /> Download
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{resource.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      resource.type === 'PDF' 
                        ? 'bg-red-100 text-red-800' 
                        : resource.type === 'DOCX'
                        ? 'bg-blue-100 text-blue-800'
                        : resource.type === 'XLSX'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {resource.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(resource.id)}
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        resource.featured ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className="sr-only">Toggle featured</span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          resource.featured ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditResource(resource)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
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
        
        {filteredResources.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No resources found matching your search criteria.</p>
          </div>
        )}
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
                    {currentResource ? 'Edit Resource' : 'Add New Resource'}
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
                        defaultValue={currentResource?.title || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <input
                        type="text"
                        id="category"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentResource?.category || ''}
                        required
                        list="categories"
                      />
                      <datalist id="categories">
                        {categories.filter(cat => cat !== 'all').map((category, index) => (
                          <option key={index} value={category} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <select
                        id="type"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentResource?.type || 'PDF'}
                        required
                      >
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="XLSX">XLSX</option>
                        <option value="LINK">External Link</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload File
                      </label>
                      <div className="mt-1 flex items-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                          <span className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <FaUpload className="mr-2" />
                            {selectedFile ? 'Change File' : 'Select File'}
                          </span>
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                          />
                        </label>
                        {selectedFile && (
                          <span className="ml-3 text-sm text-gray-500">
                            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        )}
                      </div>
                      {fileUploadError && (
                        <p className="mt-1 text-sm text-red-600">{fileUploadError}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Upload a file (PDF, DOCX, XLSX, CSV up to 5MB)
                      </p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or provide a URL</span>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                        External URL (optional)
                      </label>
                      <input
                        type="text"
                        id="url"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentResource?.url || ''}
                        placeholder="https://example.com/resource.pdf"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        For external resources, provide the full URL
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked={currentResource?.featured || false}
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                        Featured Resource
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {currentResource ? 'Update Resource' : 'Add Resource'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowModal(false)
                      setSelectedFile(null)
                      setFileUploadError('')
                    }}
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

export default Resources