import { useState, useEffect } from 'react'
import { FaSearch, FaFilter } from 'react-icons/fa'
import api from '../services/api'
import '../styles/gallery.css'
import StableImage from '../components/StableImage'

const GalleryPage = () => {
  // State for gallery items and filtering
  const [galleryItems, setGalleryItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  // No need for image load status tracking anymore as StableImage handles it

  // Mock gallery categories
  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'events', name: 'Events' },
    { id: 'workshops', name: 'Workshops' },
    { id: 'competitions', name: 'Competitions' },
    { id: 'team', name: 'Team' },
    { id: 'campus', name: 'Campus Life' }
  ]

  // Mock gallery data
  const mockGalleryItems = [
    {
      id: 1,
      title: 'Annual E-Summit 2023',
      description: 'Highlights from our flagship entrepreneurship summit',
      image: '/images/gallery/e-summit-2023.jpg',
      category: 'events',
      date: '2023-03-15'
    },
    {
      id: 2,
      title: 'Startup Pitch Competition',
      description: 'Students presenting their innovative business ideas',
      image: '/images/gallery/pitch-competition.jpg',
      category: 'competitions',
      date: '2023-02-28'
    },
    {
      id: 3,
      title: 'Design Thinking Workshop',
      description: 'Interactive session on applying design thinking to business problems',
      image: '/images/gallery/design-workshop.jpg',
      category: 'workshops',
      date: '2023-01-20'
    },
    {
      id: 4,
      title: 'E-Cell Team Retreat',
      description: 'Team building and planning session for the new academic year',
      image: '/images/gallery/team-retreat.jpg',
      category: 'team',
      date: '2022-12-10'
    },
    {
      id: 5,
      title: 'Entrepreneurship Bootcamp',
      description: 'Intensive 3-day bootcamp for aspiring entrepreneurs',
      image: '/images/gallery/bootcamp.jpg',
      category: 'workshops',
      date: '2022-11-05'
    },
    {
      id: 6,
      title: 'Industry Visit to Tech Park',
      description: 'Students exploring startup ecosystem at the technology park',
      image: '/images/gallery/industry-visit.jpg',
      category: 'events',
      date: '2022-10-15'
    },
    {
      id: 7,
      title: 'Hackathon 2022',
      description: '24-hour coding marathon to solve real-world problems',
      image: '/images/gallery/hackathon.jpg',
      category: 'competitions',
      date: '2022-09-22'
    },
    {
      id: 8,
      title: 'Campus Innovation Fair',
      description: 'Showcasing student innovations and research projects',
      image: '/images/gallery/innovation-fair.jpg',
      category: 'campus',
      date: '2022-08-30'
    },
    {
      id: 9,
      title: 'Founder\'s Talk Series',
      description: 'Interactive session with successful startup founders',
      image: '/images/gallery/founders-talk.jpg',
      category: 'events',
      date: '2022-07-18'
    },
    {
      id: 10,
      title: 'E-Cell Annual Awards',
      description: 'Recognizing outstanding contributions to entrepreneurship',
      image: '/images/gallery/annual-awards.jpg',
      category: 'events',
      date: '2022-06-25'
    },
    {
      id: 11,
      title: 'Product Development Workshop',
      description: 'Hands-on session on building MVPs and prototypes',
      image: '/images/gallery/product-workshop.jpg',
      category: 'workshops',
      date: '2022-05-12'
    },
    {
      id: 12,
      title: 'Team Building Activities',
      description: 'Fun activities to strengthen team collaboration',
      image: '/images/gallery/team-building.jpg',
      category: 'team',
      date: '2022-04-08'
    }
  ]

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setIsLoading(true)
        
        // Fetch gallery items from API
        const data = await api.gallery.getAll()
        
        // If no items returned, use mock data as fallback
        if (data && data.length > 0) {
          setGalleryItems(data)
        } else {
          console.log('No gallery items found, using mock data')
          setGalleryItems(mockGalleryItems)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching gallery items:', error)
        // Fallback to mock data on error
        setGalleryItems(mockGalleryItems)
        setIsLoading(false)
      }
    }
    
    fetchGalleryItems()
  }, [])

  // Filter gallery items based on search term and category
  useEffect(() => {
    if (galleryItems.length > 0) {
      let filtered = [...galleryItems]
      
      // Filter by category
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(item => item.category === categoryFilter)
      }
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(term) || 
          item.description.toLowerCase().includes(term)
        )
      }
      
      setFilteredItems(filtered)
    }
  }, [galleryItems, searchTerm, categoryFilter])

  // Image handling is now managed by the StableImage component

  // Handle image click to open lightbox
  const openLightbox = (item) => {
    setSelectedImage(item)
    document.body.style.overflow = 'hidden'
  }

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary-800 text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <StableImage 
            src="/images/gallery/gallery-hero-bg.jpg" 
            alt="E-Cell Gallery" 
            className="w-full h-full"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">E-Cell Gallery</h1>
            <p className="text-xl text-primary-100 mb-4">
              Explore moments from our events, workshops, and activities that showcase the vibrant entrepreneurial ecosystem at our campus.
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
                placeholder="Search gallery..."
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

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-600">No gallery items found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openLightbox(item)}
                >
                  <StableImage
                    src={item.image}
                    alt={item.title}
                    className="h-48 w-full"
                    placeholderContent={
                      <div className="text-gray-400 text-center">
                        <div className="text-sm">{item.category}</div>
                      </div>
                    }
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-lg text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
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
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-white text-2xl z-10 bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center"
              onClick={closeLightbox}
            >
              &times;
            </button>
            {/* Lightbox image with background placeholder */}
            <div className="lightbox-container">
              <StableImage 
                src={selectedImage.image} 
                alt={selectedImage.title} 
                className="w-full h-auto max-h-[80vh]"
                objectFit="contain"
                placeholderContent={
                  <div className="text-gray-400 text-center">
                    <div className="text-lg">{selectedImage.title}</div>
                    <div className="text-sm">{selectedImage.category}</div>
                  </div>
                }
              />
            </div>
            <div className="bg-white p-4">
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
    </>
  )
}

export default GalleryPage