import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaTicketAlt, 
  FaShare, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaWhatsapp,
  FaArrowLeft
} from 'react-icons/fa'
import { useEvents } from '../context/EventsContext'
import api from '../services/api'

const EventDetailPage = () => {
  const { id } = useParams()
  const { registerForEvent } = useEvents()
  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    expectations: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Mock event data - in a real app, this would come from an API
  const mockEvent = {
    id: '6830b6bf39d800601996da48', // Use the real ID from our database
    title: 'Startup Weekend',
    date: '2024-06-15',
    endDate: '2024-06-17',
    time: '09:00 AM - 06:00 PM',
    location: 'Main Auditorium',
    locationLink: 'https://maps.google.com/?q=Main+Auditorium',
    category: 'competition',
    image: '/images/events/startup-weekend.jpg',
    description: 'A 54-hour event where entrepreneurs pitch ideas, form teams, and launch startups.',
    longDescription: `
      <p>Startup Weekend is an intensive 54-hour event where aspiring entrepreneurs, developers, designers, and business enthusiasts come together to share ideas, form teams, build products, and launch startups.</p>
      
      <p>Starting on Friday, participants will pitch their startup ideas and receive feedback from peers. Teams will form around the top ideas (as determined by popular vote) and embark on a three-day journey of business model creation, coding, designing, and market validation.</p>
      
      <p>The weekend culminates with presentations in front of local entrepreneurial leaders with another opportunity for critical feedback. Whether you're looking for feedback on an idea, seeking a co-founder, or wanting to learn a new skill, Startup Weekend is the perfect environment to test your entrepreneurial spirit.</p>
    `,
    agenda: [
      { day: 'Day 1 (Friday)', items: [
        { time: '5:00 PM', activity: 'Registration & Networking' },
        { time: '6:00 PM', activity: 'Welcome & Keynote Speaker' },
        { time: '7:00 PM', activity: 'Pitch Fire (60-second pitches from attendees)' },
        { time: '8:30 PM', activity: 'Voting & Team Formation' },
        { time: '9:30 PM', activity: 'Initial Team Meetings' },
        { time: '10:30 PM', activity: 'Venue Closes' }
      ]},
      { day: 'Day 2 (Saturday)', items: [
        { time: '9:00 AM', activity: 'Breakfast & Team Work Begins' },
        { time: '12:00 PM', activity: 'Lunch & Mentor Sessions' },
        { time: '2:00 PM', activity: 'Workshop: Business Model Canvas' },
        { time: '3:00 PM', activity: 'Continued Team Work & Mentor Meetings' },
        { time: '6:00 PM', activity: 'Dinner' },
        { time: '7:00 PM', activity: 'Mid-weekend Check-in' },
        { time: '10:00 PM', activity: 'Venue Closes' }
      ]},
      { day: 'Day 3 (Sunday)', items: [
        { time: '9:00 AM', activity: 'Breakfast & Final Day of Work' },
        { time: '12:00 PM', activity: 'Lunch' },
        { time: '2:00 PM', activity: 'Presentation Prep & Tech Check' },
        { time: '4:00 PM', activity: 'Final Presentations' },
        { time: '6:00 PM', activity: 'Judging & Awards' },
        { time: '7:00 PM', activity: 'Networking & Celebration' },
        { time: '8:00 PM', activity: 'Event Concludes' }
      ]}
    ],
    speakers: [
      {
        name: 'Rajiv Mehta',
        title: 'Founder & CEO, TechVentures',
        image: '/images/speakers/rajiv-mehta.jpg',
        bio: 'Serial entrepreneur with 3 successful exits and angel investor in over 20 startups.'
      },
      {
        name: 'Priya Sharma',
        title: 'Partner, Venture Capital Firm',
        image: '/images/speakers/priya-sharma.jpg',
        bio: 'Experienced VC with a portfolio of early-stage startups across fintech and healthtech.'
      },
      {
        name: 'Arjun Kapoor',
        title: 'CTO, InnovateNow',
        image: '/images/speakers/arjun-kapoor.jpg',
        bio: 'Technical leader with expertise in scaling startups from prototype to millions of users.'
      }
    ],
    registrationFee: 'Rs. 1000 for students, Rs. 2000 for professionals',
    registrationDeadline: 'June 10, 2024',
    maxParticipants: 100,
    currentParticipants: 65,
    prerequisites: [
      'Laptop with necessary software installed',
      'Basic understanding of business concepts',
      'Enthusiasm and willingness to collaborate',
      'Ideas to pitch (optional)'
    ],
    faqs: [
      {
        question: 'Do I need to have a startup idea to participate?',
        answer: 'No, you can join a team even if you don\'t have an idea to pitch. Your skills and enthusiasm are valuable to teams that form around selected ideas.'
      },
      {
        question: 'What should I bring to the event?',
        answer: 'Bring your laptop, charger, any design or development tools you use, a notepad, and your enthusiasm! Food and beverages will be provided.'
      },
      {
        question: 'Is there a dress code?',
        answer: 'Casual attire is recommended. Wear what makes you comfortable for a weekend of innovation and collaboration.'
      },
      {
        question: 'Will there be prizes for the winning teams?',
        answer: 'Yes! The top three teams will receive cash prizes, mentorship opportunities, and incubation support to continue developing their startups.'
      },
      {
        question: 'Can I participate remotely?',
        answer: 'This Startup Weekend is designed as an in-person event to maximize collaboration and networking. We don\'t offer remote participation options.'
      }
    ],
    organizers: [
      { name: 'E-Cell', logo: '/logo.svg' },
      { name: 'TechHub Incubator', logo: '/images/partners/tech-incubator.png' },
      { name: 'Startup Foundation', logo: '/images/partners/startup-foundation.png' }
    ],
    sponsors: [
      { name: 'TechCorp', logo: '/images/sponsors/techcorp.png', tier: 'platinum' },
      { name: 'InnovateBank', logo: '/images/sponsors/innovatebank.png', tier: 'gold' },
      { name: 'DevTools', logo: '/images/sponsors/devtools.png', tier: 'silver' },
      { name: 'CloudServices', logo: '/images/sponsors/cloudservices.png', tier: 'silver' }
    ],
    relatedEvents: [3, 4, 6]
  }

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true)
        
        // Use the API service to fetch the event
        const eventData = await api.events.getById(id)
        
        // If no data is returned, fall back to mock data
        if (!eventData) {
          console.log('No event data returned from API, using mock data')
          setEvent(mockEvent)
        } else {
          setEvent(eventData)
        }
      } catch (error) {
        console.error('Error fetching event:', error)
        // Fall back to mock data on error
        console.log('Error fetching event, using mock data')
        setEvent(mockEvent)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchEvent()
  }, [id])

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log('Form submitted with data:', registrationForm)
    
    // Validate form data
    if (!registrationForm.name || !registrationForm.email) {
      console.error('Name and email are required')
      setSubmitStatus('error')
      setIsSubmitting(false)
      return
    }
    
    try {
      // Always use the API directly for event registration
      // We've modified the backend to accept registrations without authentication
      console.log('Using api.events.register directly')
      try {
        const result = await api.events.register(id, registrationForm)
        console.log('Registration result:', result)
        
        // Update the event in the local state to reflect the new registration
        if (event) {
          const updatedEvent = { ...event }
          if (!updatedEvent.registrations) {
            updatedEvent.registrations = []
          }
          updatedEvent.registrations.push({
            ...registrationForm,
            registeredAt: new Date().toISOString()
          })
          setEvent(updatedEvent)
        }
        
        console.log('Registration successful')
        setSubmitStatus('success')
        // Reset form
        setRegistrationForm({
          name: '',
          email: '',
          phone: '',
          college: '',
          year: '',
          expectations: ''
        })
      } catch (apiError) {
        console.error('API registration error details:', apiError)
        throw apiError
      }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    }
  }

  // Share event functions
  const shareUrl = window.location.href
  const shareTitle = event ? `Join me at ${event.title}` : 'Check out this event'
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/events" className="btn btn-primary">
          Back to Events
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-primary-800 text-white">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <Link to="/events" className="inline-flex items-center text-primary-200 hover:text-white mb-6">
            <FaArrowLeft className="mr-2" />
            Back to Events
          </Link>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-primary-300" />
                <span>{formatDate(event.date, event.endDate)}</span>
              </div>
              
              <div className="flex items-center">
                <FaClock className="mr-2 text-primary-300" />
                <span>{event.time}</span>
              </div>
              
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary-300" />
                <a 
                  href={event.locationLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {event.location}
                </a>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="#register" 
                className="btn btn-secondary"
              >
                Register Now
              </a>
              
              <div className="relative">
                <button 
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="btn btn-outline border-white text-white hover:bg-white/10"
                >
                  <FaShare className="mr-2" />
                  Share
                </button>
                
                {showShareOptions && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-lg p-3 z-10">
                    <div className="flex space-x-4">
                      <a 
                        href={shareLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xl"
                        aria-label="Share on Facebook"
                      >
                        <FaFacebook />
                      </a>

                      <a 
                        href={shareLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 text-xl"
                        aria-label="Share on LinkedIn"
                      >
                        <FaLinkedin />
                      </a>
                      <a 
                        href={shareLinks.whatsapp} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-700 text-xl"
                        aria-label="Share on WhatsApp"
                      >
                        <FaWhatsapp />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="prose prose-lg max-w-none mb-12">
                <div dangerouslySetInnerHTML={{ __html: event.longDescription }} />
              </div>
              
              {/* Agenda */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Event Agenda</h2>
                
                <div className="space-y-8">
                  {event.agenda.map((day, index) => (
                    <div key={index}>
                      <h3 className="text-xl font-semibold mb-4 bg-gray-100 p-3 rounded-md">
                        {day.day}
                      </h3>
                      <div className="space-y-3">
                        {day.items.map((item, idx) => (
                          <div key={idx} className="flex">
                            <div className="w-24 font-medium text-gray-700">{item.time}</div>
                            <div>{item.activity}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Speakers */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Speakers & Mentors</h2>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <img 
                          src={speaker.image} 
                          alt={speaker.name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-bold">{speaker.name}</h3>
                          <p className="text-sm text-gray-600">{speaker.title}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{speaker.bio}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* FAQs */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  {event.faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                      <details className="group">
                        <summary className="flex justify-between items-center font-medium cursor-pointer p-4 bg-gray-50">
                          <span>{faq.question}</span>
                          <span className="transition group-open:rotate-180">
                            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                              <path d="M6 9l6 6 6-6"></path>
                            </svg>
                          </span>
                        </summary>
                        <p className="p-4 text-gray-700">{faq.answer}</p>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Organizers & Sponsors */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Organizers & Sponsors</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Organized by</h3>
                  <div className="flex flex-wrap gap-6 items-center">
                    {event.organizers.map((org, index) => (
                      <div key={index} className="flex items-center">
                        <img 
                          src={org.logo} 
                          alt={org.name}
                          className="h-12 w-auto"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sponsored by</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
                    {event.sponsors.map((sponsor, index) => (
                      <div key={index} className="flex items-center justify-center">
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name}
                          className="max-h-10 w-auto"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Registration Info Card */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm mb-8 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Registration Details</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-gray-600 mb-1">Registration Fee</p>
                    <p className="font-medium">{event.registrationFee}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-1">Registration Deadline</p>
                    <p className="font-medium">{event.registrationDeadline}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-1">Participants</p>
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-primary-600" />
                      <span>{event.currentParticipants}/{event.maxParticipants} registered</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <a 
                  href="#register" 
                  className="block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium text-center rounded-md transition-colors"
                >
                  <FaTicketAlt className="inline-block mr-2" />
                  Register Now
                </a>
              </div>
              
              {/* Prerequisites */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-xl font-bold mb-4">What to Bring</h3>
                
                <ul className="space-y-2">
                  {event.prerequisites.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" className="py-16 bg-gray-100">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Register for {event.title}</h2>
            <p className="text-gray-600 mb-8 text-center">
              Fill out the form below to secure your spot at the event.
            </p>
            
            {submitStatus === 'success' ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                <p className="font-bold">Registration Successful!</p>
                <p>Thank you for registering. You will receive a confirmation email shortly with all the details.</p>
              </div>
            ) : submitStatus === 'error' ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p className="font-bold">Registration Failed</p>
                <p>Please make sure all required fields are filled correctly. If the problem persists, please contact us for assistance.</p>
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={registrationForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={registrationForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={registrationForm.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="college" className="block text-gray-700 font-medium mb-2">College/Organization *</label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    value={registrationForm.college}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="year" className="block text-gray-700 font-medium mb-2">Year of Study</label>
                  <select
                    id="year"
                    name="year"
                    value={registrationForm.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                    <option value="graduate">Graduate</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="expectations" className="block text-gray-700 font-medium mb-2">What do you hope to gain from this event?</label>
                  <textarea
                    id="expectations"
                    name="expectations"
                    value={registrationForm.expectations}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-primary-600 hover:underline">terms and conditions</a> and <a href="#" className="text-primary-600 hover:underline">privacy policy</a>.
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Processing...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default EventDetailPage