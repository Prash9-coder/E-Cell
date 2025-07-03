import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaMapMarkerAlt, FaFilter, FaSearch } from 'react-icons/fa'
import { useEvents } from '../context/EventsContext'
import StableImage from '../components/StableImage'
import { getContentImageUrl, getFallbackImage } from '../utils/imageUtils'

const EventsPage = () => {
  // Get events from context
  const { events } = useEvents()
  
  // State for filtering
  const [filteredEvents, setFilteredEvents] = useState([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  // Mock event categories
  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'competition', name: 'Competitions' },
    { id: 'speaker', name: 'Speaker Sessions' },
    { id: 'networking', name: 'Networking' },
    { id: 'hackathon', name: 'Hackathons' }
  ]

  // Mock events data
  const mockEvents = [
    {
      id: 1,
      title: 'Startup Weekend',
      date: '2024-06-15',
      endDate: '2024-06-17',
      time: '09:00 AM - 06:00 PM',
      location: 'Main Auditorium',
      category: 'competition',
      image: '/images/events/e-summit.jpg',
      description: 'A 54-hour event where entrepreneurs pitch ideas, form teams, and launch startups.',
      registrationLink: '/events/1/register',
      isFeatured: true
    },
    {
      id: 2,
      title: 'Venture Capital Panel',
      date: '2024-07-05',
      time: '02:00 PM - 04:00 PM',
      location: 'Business School, Room 302',
      category: 'speaker',
      image: '/images/events/pitch-competition.jpg',
      description: 'Learn from top VCs about what they look for in startups and how to secure funding.',
      registrationLink: '/events/2/register',
      isFeatured: true
    },
    {
      id: 3,
      title: 'Tech Hackathon',
      date: '2024-07-20',
      endDate: '2024-07-21',
      time: '10:00 AM - 10:00 AM (24 hours)',
      location: 'Engineering Building',
      category: 'hackathon',
      image: '/images/events/hackathon.jpg',
      description: 'Build innovative solutions to real-world problems in this 24-hour coding marathon.',
      registrationLink: '/events/3/register',
      isFeatured: true
    },
    {
      id: 4,
      title: 'Design Thinking Workshop',
      date: '2024-06-25',
      time: '03:00 PM - 05:30 PM',
      location: 'Innovation Lab',
      category: 'workshop',
      image: '/images/events/workshop.jpg',
      description: 'Learn the principles of design thinking and how to apply them to solve complex problems.',
      registrationLink: '/events/4/register',
      isFeatured: false
    },
    {
      id: 5,
      title: 'Networking Mixer',
      date: '2024-06-30',
      time: '06:00 PM - 08:00 PM',
      location: 'Student Center',
      category: 'networking',
      image: '/images/events/networking.jpg',
      description: 'Connect with fellow entrepreneurs, mentors, and industry professionals in a casual setting.',
      registrationLink: '/events/5/register',
      isFeatured: false
    },
    {
      id: 6,
      title: 'Pitch Perfect: Presentation Skills',
      date: '2024-07-10',
      time: '01:00 PM - 03:00 PM',
      location: 'Communication Arts Building',
      category: 'workshop',
      image: '/images/events/workshop.jpg',
      description: 'Master the art of pitching your ideas effectively to investors and stakeholders.',
      registrationLink: '/events/6/register',
      isFeatured: false
    },
    {
      id: 7,
      title: 'Founder Fireside Chat',
      date: '2024-07-15',
      time: '05:00 PM - 06:30 PM',
      location: 'Virtual (Zoom)',
      category: 'speaker',
      image: '/images/events/guest-speaker.jpg',
      description: 'An intimate conversation with a successful founder about their entrepreneurial journey.',
      registrationLink: '/events/7/register',
      isFeatured: false
    },
    {
      id: 8,
      title: 'Business Model Canvas Workshop',
      date: '2024-07-25',
      time: '02:00 PM - 04:30 PM',
      location: 'Business School, Room 201',
      category: 'workshop',
      image: '/images/events/business-model.jpg',
      description: 'Learn how to create and refine your business model using the Business Model Canvas.',
      registrationLink: '/events/8/register',
      isFeatured: false
    },
    // Past events
    {
      id: 9,
      title: 'Entrepreneurship Summit 2023',
      date: '2023-11-15',
      endDate: '2023-11-16',
      time: '09:00 AM - 05:00 PM',
      location: 'University Convention Center',
      category: 'networking',
      image: '/images/events/past/summit.jpg',
      description: 'Our annual flagship event featuring keynote speakers, panel discussions, and networking opportunities.',
      isPast: true,
      galleryLink: '/gallery#summit-2023'
    },
    {
      id: 10,
      title: 'Startup Showcase',
      date: '2023-12-10',
      time: '03:00 PM - 06:00 PM',
      location: 'Main Auditorium',
      category: 'competition',
      image: '/images/events/past/showcase.jpg',
      description: 'Student startups presented their products and services to investors and the campus community.',
      isPast: true,
      galleryLink: '/gallery#showcase-2023'
    },
    {
      id: 11,
      title: 'Women in Entrepreneurship Panel',
      date: '2024-01-20',
      time: '02:00 PM - 04:00 PM',
      location: 'Business School Auditorium',
      category: 'speaker',
      image: '/images/events/past/women-panel.jpg',
      description: 'Successful women entrepreneurs shared their experiences and insights.',
      isPast: true,
      galleryLink: '/gallery#women-panel-2024'
    },
    {
      id: 12,
      title: 'Winter Hackathon',
      date: '2024-02-05',
      endDate: '2024-02-06',
      time: '10:00 AM - 10:00 AM (24 hours)',
      category: 'hackathon',
      location: 'Engineering Building',
      image: '/images/events/past/winter-hackathon.jpg',
      description: 'Students built innovative solutions to address sustainability challenges.',
      isPast: true,
      galleryLink: '/gallery#winter-hackathon-2024'
    }
  ]

  // No need to fetch events as we're using the context

  // Filter events based on active tab, search term, and category
  useEffect(() => {
    // If we have events from the context, use those
    if (events.length > 0) {
      let filtered = [...events]
      
      // Filter by past/upcoming
      if (activeTab === 'upcoming') {
        filtered = filtered.filter(event => !event.isPast)
      } else {
        filtered = filtered.filter(event => event.isPast)
      }
      
      // Filter by category
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(event => event.category === categoryFilter)
      }
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(term) || 
          event.description.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term)
        )
      }
      
      setFilteredEvents(filtered)
    } else {
      // If no events from context, use mock events
      console.log('No events from context, using mock events')
      
      // Update mock events with real IDs from the database
      const updatedMockEvents = mockEvents.map((event, index) => {
        // Use the real IDs from our database
        if (index === 0) {
          return { ...event, id: '6830b6bf39d800601996da48' }
        } else if (index === 1) {
          return { ...event, id: '6830b6bf39d800601996da49' }
        } else if (index === 2) {
          return { ...event, id: '6830b6bf39d800601996da4a' }
        }
        return event
      })
      
      let filtered = [...updatedMockEvents]
      
      // Apply the same filters
      if (activeTab === 'upcoming') {
        filtered = filtered.filter(event => !event.isPast)
      } else {
        filtered = filtered.filter(event => event.isPast)
      }
      
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(event => event.category === categoryFilter)
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(term) || 
          event.description.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term)
        )
      }
      
      setFilteredEvents(filtered)
    }
  }, [events, activeTab, searchTerm, categoryFilter])

  // Format date for display
  const formatDate = (dateString, endDateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const date = new Date(dateString)
    
    if (endDateString) {
      const endDate = new Date(endDateString)
      const startDay = date.toLocaleDateString('en-US', { day: 'numeric' })
      const endDay = endDate.toLocaleDateString('en-US', { day: 'numeric' })
      const month = date.toLocaleDateString('en-US', { month: 'long' })
      const year = date.toLocaleDateString('en-US', { year: 'numeric' })
      
      return `${month} ${startDay}-${endDay}, ${year}`
    }
    
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary-800 text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <StableImage 
            src="/images/hero/events-hero.jpg"
            alt="Events Banner" 
            fallbackSrc="/images/events/default.svg"
            className="w-full h-full"
            objectFit="cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Events</h1>
            <p className="text-xl text-primary-100 mb-4">
              Join us for exciting events designed to inspire, educate, and connect aspiring entrepreneurs.
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`py-3 px-6 font-medium text-lg ${
                activeTab === 'upcoming'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Events
            </button>
            <button
              className={`py-3 px-6 font-medium text-lg ${
                activeTab === 'past'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past Events
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Events Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-48">
                    <StableImage 
                      src={getContentImageUrl(event.image, 'events')}
                      alt={event.title}
                      fallbackSrc={getFallbackImage('events')}
                      className="w-full h-full"
                      objectFit="cover"
                      onError={(e) => {
                        console.error('❌ Image failed to load:', e.target.src);
                      }}
                      onLoad={() => {
                        console.log('✅ Image loaded successfully:', getContentImageUrl(event.image, 'events'));
                      }}
                    />
                    {event.isFeatured && (
                      <div className="absolute top-0 right-0 bg-secondary-600 text-white py-1 px-3 text-sm font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaCalendarAlt className="mr-2 text-primary-600" />
                      <span>{formatDate(event.date, event.endDate)} • {event.time}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <FaMapMarkerAlt className="mr-2 text-primary-600" />
                      <span>{event.location}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    
                    <div className="mt-4">
                      {event.isPast ? (
                        <Link 
                          to={event.galleryLink} 
                          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          View Gallery
                        </Link>
                      ) : (
                        <Link 
                          to={`/events/${event.id}`} 
                          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {activeTab === 'upcoming' && (
        <section className="py-16 bg-primary-600 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Want to Host an Event with Us?</h2>
              <p className="text-xl mb-8">
                If you have an idea for an entrepreneurship-related event, we'd love to collaborate with you.
              </p>
              <Link 
                to="/contact#event-proposal" 
                className="btn bg-white text-primary-600 hover:bg-gray-100"
              >
                Submit Event Proposal
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default EventsPage