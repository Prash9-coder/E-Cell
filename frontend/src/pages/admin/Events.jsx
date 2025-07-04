import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { useEvents } from '../../context/EventsContext'
import mockEventApi from '../../services/mockApi'
import ImageUploader from '../../components/admin/ImageUploader'
import { testEventCreation } from '../../utils/testEventCreation'

const Events = () => {
  const { events, setEvents, loading, error, addEvent, updateEvent, deleteEvent } = useEvents()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Debug events state
  console.log('Current events in state:', events);
  
  // Log when events state changes
  useEffect(() => {
    console.log('Events state changed:', events);
  }, [events]);
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle edit event
  const handleEditEvent = (event) => {
    setCurrentEvent(event)
    setSelectedImage(null) // Reset image selection when editing
    setShowModal(true)
  }

  // Handle delete event
  const handleDeleteEvent = async (id) => {
    if (!id) {
      console.error('No event ID provided for deletion');
      alert('Failed to delete event: No event ID provided');
      return;
    }
    
    console.log(`Preparing to delete event with ID: ${id}`);
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        console.log(`Attempting to delete event with ID: ${id}`);
        
        // In development mode, try using mock API directly first
        if (import.meta.env.MODE !== 'production') {
          try {
            console.log('Using mock API for development mode');
            // Find the event in the current events list to confirm it exists
            const eventToDelete = events.find(e => e.id === id || e._id === id);
            if (!eventToDelete) {
              console.error(`Event with ID ${id} not found in current events list`);
              console.log('Current events:', events);
            } else {
              console.log('Found event to delete:', eventToDelete);
            }
            
            await mockEventApi.delete(id);
            console.log('Mock delete successful');
            
            // Refresh the entire events list
            const data = await mockEventApi.getAll();
            console.log('Refreshed events list after delete:', data.events);
            
            // Update the context state with the refreshed list
            setEvents(data.events);
            
            alert('Event deleted successfully (using mock API)!');
            return;
          } catch (mockError) {
            console.error('Mock API error:', mockError);
            // Continue to try the regular API if mock API fails
          }
        }
        
        // If mock API didn't work or we're in production, use the regular API
        await deleteEvent(id);
        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        const errorMessage = error.message || 'Server error';
        alert(`Failed to delete event: ${errorMessage}`);
      }
    }
  }

  // Handle add new event
  const handleAddEvent = () => {
    setCurrentEvent(null)
    setSelectedImage(null)
    setShowModal(true)
  }

  // Handle image selection
  const handleImageChange = (file) => {
    setSelectedImage(file)
  }

  // Upload image to server
  const uploadImage = async (file) => {
    if (!file) return null
    
    setUploading(true)
    try {
      console.log('Uploading image:', file.name, 'Size:', file.size, 'Type:', file.type)
      
      const formData = new FormData()
      formData.append('image', file)
      
      const token = localStorage.getItem('token')
      console.log('Token exists:', !!token)
      console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000')
      
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const uploadUrl = `${apiBaseUrl}/events/upload`
      console.log('Upload URL:', uploadUrl)
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      console.log('Upload response status:', response.status)
      console.log('Upload response ok:', response.ok)
      
      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = 'Failed to upload image'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          console.error('Upload error details:', errorData)
        } catch (jsonError) {
          // If response is not JSON, try to get text
          try {
            const errorText = await response.text()
            console.error('Upload error text:', errorText)
            errorMessage = errorText || errorMessage
          } catch (textError) {
            console.error('Could not parse error response:', textError)
          }
        }
        throw new Error(`Upload failed (${response.status}): ${errorMessage}`)
      }
      
      const data = await response.json()
      console.log('Upload successful:', data)
      return data.imageUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      throw error
    } finally {
      setUploading(false)
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      // Upload image first if a new image is selected
      let imageUrl = currentEvent?.image || '/images/events/default.svg'
      if (selectedImage) {
        console.log('Uploading image...')
        try {
          imageUrl = await uploadImage(selectedImage)
          console.log('Image uploaded:', imageUrl)
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          
          // In development mode, use a fallback image instead of failing
          if (import.meta.env.MODE !== 'production') {
            console.log('Using fallback image in development mode')
            imageUrl = '/images/events/default.svg'
            alert(`Image upload failed: ${uploadError.message}. Using default image instead.`)
          } else {
            // In production, fail the entire operation
            throw new Error(`Image upload failed: ${uploadError.message}`)
          }
        }
      }
      
      // Get status value and convert to isPast
      const statusValue = e.target.status.value;
      const isPast = statusValue === 'Completed' || statusValue === 'Cancelled';
      
      // Get form data
      const formData = {
        title: e.target.title.value.trim(),
        date: e.target.date.value, // HTML date input returns YYYY-MM-DD format
        location: e.target.location.value.trim(),
        description: e.target.description.value.trim(),
        // Add required fields from the Event model
        longDescription: e.target.longDescription.value.trim(),
        time: e.target.time?.value?.trim() || '09:00 AM - 05:00 PM', // Default time if not provided
        category: e.target.category?.value || 'workshop', // Default category if not provided
        image: imageUrl, // Use uploaded image URL or existing image
        // Set status as a custom field for the frontend
        status: statusValue,
        // Convert status to isPast for the backend model
        isPast: isPast,
        // Optional fields with defaults - ensure registrations is always an array
        registrations: Array.isArray(currentEvent?.registrations) ? currentEvent.registrations : [],
        isFeatured: currentEvent?.isFeatured || false,
        // Don't send createdBy - backend will set it automatically from authenticated user
        // Add a slug field based on the title
        slug: currentEvent?.slug || e.target.title.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
      
      // Validate required fields
      const requiredFields = ['title', 'date', 'location', 'description', 'longDescription', 'time', 'category'];
      const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      console.log('Current event being edited:', currentEvent);
      console.log('Current event registrations:', currentEvent?.registrations);
      console.log('Current event registrations type:', typeof currentEvent?.registrations);
      console.log('Is registrations an array?', Array.isArray(currentEvent?.registrations));
      console.log('Submitting event data:', formData);
      console.log('Registrations field type:', typeof formData.registrations);
      console.log('Registrations field value:', formData.registrations);
      
      try {
      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found');
        
        // In development mode, create a valid token
        if (import.meta.env.MODE !== 'production') {
          console.log('Creating valid token for development mode');
          const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjZhYTNkZTViNGFiYmQ4NzdkM2VjYSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibmFtZSI6IkFkbWluIFVzZXIiLCJpYXQiOjE3NTE1NjA0NzAsImV4cCI6MTc1MTY0Njg3MH0.Rh9KIGCgENhfTbKZ_beY3t7y3gYxlWvYhLJYk7mGaRU';
          localStorage.setItem('token', validToken);
          localStorage.setItem('user', JSON.stringify({
            id: '6866aa3de5b4abbd877d3eca',
            name: 'Admin User',
            email: 'admin@gmail.com',
            role: 'admin'
          }));
        } else {
          alert('You are not logged in. Please log in again.');
          return;
        }
      }
      
      // In development mode, try using mock API directly first
      if (import.meta.env.MODE !== 'production') {
        try {
          console.log('Using mock API for development mode');
          if (currentEvent) {
            // Update existing event
            const eventId = currentEvent._id || currentEvent.id;
            console.log(`Updating event with ID: ${eventId} using mock API`);
            const result = await mockEventApi.update(eventId, formData);
            console.log('Mock update successful:', result);
            
            // Refresh the entire events list
            const data = await mockEventApi.getAll();
            console.log('Refreshed events list after update:', data.events);
            
            // Update the context state with the refreshed list
            setEvents(data.events);
            
            alert('Event updated successfully (using mock API)!');
            setShowModal(false);
            return;
          } else {
            // Add new event
            console.log('Creating new event using mock API');
            const result = await mockEventApi.create(formData);
            console.log('Mock create successful:', result);
            
            // Refresh the entire events list
            const data = await mockEventApi.getAll();
            console.log('Refreshed events list after adding new event:', data.events);
            
            // Update the context state with the refreshed list
            setEvents(data.events);
            
            alert('Event added successfully (using mock API)!');
            setShowModal(false);
            return;
          }
        } catch (mockError) {
          console.error('Mock API error:', mockError);
          // Continue to try the regular API if mock API fails
        }
      }
      
      // If mock API didn't work or we're in production, use the regular API
      if (currentEvent) {
        // Update existing event
        const eventId = currentEvent._id || currentEvent.id;
        console.log(`Updating event with ID: ${eventId}`);
        await updateEvent(eventId, formData);
        alert('Event updated successfully!');
      } else {
        // Add new event
        console.log('Creating new event');
        await addEvent(formData);
        alert('Event added successfully!');
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
      console.error('Error object keys:', Object.keys(error));
      console.error('Error data:', error.data);
      
      // Handle specific error cases
      if (error.message && (error.message.includes('Token') || error.message.includes('Authentication'))) {
        // Authentication error
        console.warn('Authentication error detected:', error.message);
        alert(`Authentication error: ${error.message}. Please log in again and retry.`);
      } else {
        // Other errors - try to extract more detailed information
        let errorMessage = error.message || 'Server error';
        
        // If there's additional data, try to extract it
        if (error.data && error.data.details) {
          console.error('Validation details from error.data:', error.data.details);
          if (typeof error.data.details === 'object') {
            const validationErrors = Object.entries(error.data.details).map(([field, err]) => {
              return `${field}: ${err.message || err}`;
            }).join('\n');
            errorMessage += '\n\nValidation errors:\n' + validationErrors;
          }
        }
        
        console.error('Final error message:', errorMessage);
        alert(`Failed to save event: ${errorMessage}`);
      }
    } finally {
      setUploading(false);
    }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert(`Failed to process event: ${error.message || 'Unknown error'}`);
      setUploading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events Management</h1>
        <div className="flex gap-2">
          {import.meta.env.MODE !== 'production' && (
            <>
              <button
                onClick={() => {
                  testEventCreation();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Test Event Creation
              </button>
              <button
                onClick={() => {
                  mockEventApi.clearData();
                  window.location.reload();
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Clear Mock Data
              </button>
            </>
          )}
          <button
            onClick={handleAddEvent}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
            disabled={loading}
          >
            <FaPlus className="mr-2" /> Add Event
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
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="ml-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              defaultValue="all"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrations
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id || event._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{event.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.status === 'Upcoming' 
                        ? 'bg-green-100 text-green-800' 
                        : event.status === 'Ongoing'
                        ? 'bg-blue-100 text-blue-800'
                        : event.status === 'Completed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{event.registrations}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id || event._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No events found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEvents.length}</span> of <span className="font-medium">{events.length}</span> events
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
                    {currentEvent ? 'Edit Event' : 'Add New Event'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Event Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentEvent?.title || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentEvent?.date || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentEvent?.location || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        id="status"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentEvent?.status || 'Upcoming'}
                        required
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentEvent?.description || ''}
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700">
                        Long Description
                      </label>
                      <textarea
                        id="longDescription"
                        rows="5"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentEvent?.longDescription || ''}
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Time
                      </label>
                      <input
                        type="text"
                        id="time"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue={currentEvent?.time || '09:00 AM - 05:00 PM'}
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
                        defaultValue={currentEvent?.category || 'workshop'}
                        required
                      >
                        <option value="workshop">Workshop</option>
                        <option value="competition">Competition</option>
                        <option value="speaker">Speaker Session</option>
                        <option value="networking">Networking</option>
                        <option value="hackathon">Hackathon</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <ImageUploader
                        onImageChange={handleImageChange}
                        currentImage={currentEvent?.image}
                        label="Event Image"
                        helpText="Upload an event banner/poster (JPG, PNG, GIF up to 10MB)"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : currentEvent ? 'Update Event' : 'Add Event'}
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
    </div>
  )
}

export default Events