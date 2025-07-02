import { Link } from 'react-router-dom'
import { FaArrowRight, FaCalendarAlt, FaLightbulb, FaUsers, FaChalkboardTeacher } from 'react-icons/fa'
import PlaceholderImage from '../components/ui/PlaceholderImage'
import ImageWithFallback from '../components/ui/ImageWithFallback'

// Import images - using direct paths instead of imports
const eSummitImage = '/assets/E-Summit.jpg'
const startupPitchImage = '/assets/Startup-Pitch-Competition.jpg'
const techHackathonImage = '/assets/Tech-Hackathon.jpg'
const techInnovateImage = '/assets/TechInnovate.jpg'
const learnHubImage = '/assets/LearnHub.jpg'
const healthTrackImage = '/assets/HealthTrack.jpg'
const eTeamImage = '/assets/E-Cell-team.jpg'

const HomePage = () => {
  // Sample upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: 'E-Summit 2024',
      date: 'June 15-17, 2024',
      description: 'Our annual flagship event featuring keynote speakers, panel discussions, and networking opportunities.',
      image: eSummitImage
    },
    {
      id: 2,
      title: 'Startup Pitch Competition',
      date: 'July 5, 2024',
      description: 'Pitch your startup idea to a panel of judges and investors to win funding and mentorship.',
      image: startupPitchImage
    },
    {
      id: 3,
      title: 'Tech Hackathon',
      date: 'July 20-21, 2024',
      description: 'Build innovative solutions to real-world problems in this 24-hour coding marathon.',
      image: techHackathonImage
    }
  ]

  // Sample success stories
  const successStories = [
    {
      id: 1,
      name: 'TechInnovate',
      founder: 'Priya Sharma',
      description: 'Developed an AI-powered productivity platform that secured $2M in seed funding.',
      year: '2022',
      image: techInnovateImage
    },
    {
      id: 2,
      name: 'LearnHub',
      founder: 'Rahul Verma',
      description: 'EdTech platform connecting students with tutors that now has 50,000+ active users.',
      year: '2021',
      image: learnHubImage
    },
    {
      id: 3,
      name: 'HealthTrack',
      founder: 'Ananya Patel',
      description: 'AI-powered health monitoring app acquired by a leading healthcare provider.',
      year: '2023',
      image: healthTrackImage
    }
  ]

  // Stats
  const stats = [
    { label: 'Startups Launched', value: '50+', icon: <FaLightbulb /> },
    { label: 'Events Hosted', value: '200+', icon: <FaCalendarAlt /> },
    { label: 'Student Members', value: '1,500+', icon: <FaUsers /> },
    { label: 'Mentors', value: '75+', icon: <FaChalkboardTeacher /> }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src={eTeamImage}
            alt="E-Cell Team"
            height="100%"
            placeholderText="Hero Image - E-Cell"
            placeholderBgColor="#1e40af"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/70"></div>
        </div>
        
        <div className="container relative z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Transforming Ideas Into Successful Ventures
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Join the entrepreneurial revolution at our campus. Learn, build, and grow with E-Cell.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/get-involved" 
                className="btn btn-secondary"
              >
                Get Involved
              </Link>
              <Link 
                to="/events" 
                className="btn btn-outline border-white text-white hover:bg-white/10"
              >
                Upcoming Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Fostering Innovation & Entrepreneurship
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                E-Cell is a student-run organization dedicated to promoting the spirit of entrepreneurship among students. We provide a platform for aspiring entrepreneurs to learn, network, and transform their ideas into reality.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Through workshops, speaker sessions, competitions, and mentorship programs, we equip students with the knowledge and skills needed to navigate the startup ecosystem.
              </p>
              <Link 
                to="/about" 
                className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
              >
                Learn more about us
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="relative">
              <ImageWithFallback 
                src={eTeamImage}
                alt="E-Cell Team" 
                height="300px"
                className="rounded-lg shadow-xl"
                placeholderText="E-Cell Team"
                placeholderBgColor="#475569"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-lg shadow-lg">
                <p className="text-2xl font-bold">Since 2015</p>
                <p>Empowering student entrepreneurs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-100">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-primary-600 text-white rounded-full text-2xl">
                  {stat.icon}
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us for exciting events designed to inspire, educate, and connect aspiring entrepreneurs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="card group">
                <div className="relative overflow-hidden">
                  <ImageWithFallback 
                    src={event.image}
                    alt={event.title}
                    height="192px"
                    className="w-full transition-transform duration-500 group-hover:scale-110"
                    placeholderText={event.title}
                    placeholderBgColor="#3b82f6"
                  />
                  <div className="absolute bottom-0 left-0 bg-primary-600 text-white py-1 px-3">
                    <p className="text-sm font-medium">{event.date}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <Link 
                    to={`/events/${event.id}`}
                    className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                  >
                    Learn more
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/events" className="btn btn-primary">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover how E-Cell has helped transform student ideas into successful ventures.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="relative h-56">
                  <ImageWithFallback 
                    src={story.image}
                    alt={story.name}
                    height="224px"
                    className="w-full"
                    placeholderText={story.name}
                    placeholderBgColor="#0f172a"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-6">
                      <h3 className="text-xl font-bold">{story.name}</h3>
                      <p className="text-primary-300">Founded by {story.founder}, {story.year}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-3">
                  <p className="text-gray-300 mb-4">{story.description}</p>
                  <Link 
                    to={`/startups#${story.id}`}
                    className="inline-flex items-center text-primary-300 font-medium hover:text-primary-200"
                  >
                    Read full story
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/startups" className="btn btn-outline border-white text-white hover:bg-white/10">
              Explore All Startups
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Entrepreneurial Journey?</h2>
            <p className="text-xl mb-8">
              Whether you have a business idea or just want to learn more about entrepreneurship, E-Cell is here to support you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/get-involved" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Join E-Cell
              </Link>
              <Link to="/contact" className="btn btn-outline border-white text-white hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage