import { Link } from 'react-router-dom'
import { FaArrowRight, FaCalendarAlt, FaLightbulb, FaUsers, FaChalkboardTeacher } from 'react-icons/fa'
import PlaceholderImage from '../components/ui/PlaceholderImage'
import ImageWithFallback from '../components/ui/ImageWithFallback'
import VideoCarousel from '../components/ui/VideoCarousel'

// Import images - using direct paths instead of imports
const eSummitImage = '/assets/E-Summit.jpg'
const startupPitchImage = '/assets/Startup-Pitch-Competition.jpg'
const techHackathonImage = '/assets/Tech-Hackathon.jpg'
const techInnovateImage = '/assets/TechInnovate.jpg'
const learnHubImage = '/assets/LearnHub.jpg'
const healthTrackImage = '/assets/HealthTrack.jpg'
const eTeamImage = '/assets/E-Cell-team.jpg'

const HomePage = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'E-Summit 2025',
      date: 'June 15-17, 2025',
      description: 'Our annual flagship event featuring keynote speakers, panel discussions, and networking opportunities.',
      image: eSummitImage
    },
    {
      id: 2,
      title: 'Startup Pitch Competition',
      date: 'July 5, 2025',
      description: 'Pitch your startup idea to a panel of judges and investors to win funding and mentorship.',
      image: startupPitchImage
    },
    {
      id: 3,
      title: 'Tech Hackathon',
      date: 'July 20-21, 2025',
      description: 'Build innovative solutions to real-world problems in this 24-hour coding marathon.',
      image: techHackathonImage
    }
  ]

  const successStories = [
    {
      id: 1,
      name: 'TechInnovate',
      founder: 'founderNameHere',
      description: 'Developed an AI-powered productivity platform that secured $2M in seed funding.',
      year: '2025',
      image: techInnovateImage
    },
    {
      id: 2,
      name: 'LearnHub',
      founder: 'founderNameHere',
      description: 'EdTech platform connecting students with tutors that now has 50,000+ active users.',
      year: '2025',
      image: learnHubImage
    },
    {
      id: 3,
      name: 'HealthTrack',
      founder: 'founderNameHere',
      description: 'AI-powered health monitoring app acquired by a leading healthcare provider.',
      year: '2025',
      image: healthTrackImage
    }
  ]

  const stats = [
    { label: 'Startups Launched', value: '50+', icon: <FaLightbulb /> },
    { label: 'Events Hosted', value: '200+', icon: <FaCalendarAlt /> },
    { label: 'Student Members', value: '1,500+', icon: <FaUsers /> },
    { label: 'Mentors', value: '75+', icon: <FaChalkboardTeacher /> }
  ]

  const startupVideos = [
    {
      id: 1,
      title: "From Class 7 Drone Enthusiast to CEO of Enord",
      speaker: "Campus to CEO - Drone Startup Story",
      description: "Incredible journey of a young entrepreneur who started building drones in Class 7 and went on to supply drones for Operation Sindoor. Discover how passion for technology and innovation led to founding Enord, a successful drone company making impact in defense and commercial sectors.",
      url: "https://youtu.be/G79641HhbP8?si=yhxB3ggtOl6RMovS"
    },
    {
      id: 2,
      title: "16-Year-Old's Startup Success with SattuFusion",
      speaker: "Campus to CEO - Student Entrepreneur Story",
      description: "Meet Vivaan Vasudeva, who built a real startup while still in high school. Learn how he turned traditional Indian superfood 'sattu' into a modern protein supplement brand, got listed on Amazon, and represented India at international startup competitions - all before turning 17!",
      url: "https://youtu.be/cIjs5bPz3Eo?si=e4kvO4DgAf687zZE"
    },
    {
      id: 3,
      title: "Building Metvy at 18 - No MBA, No IIT Required",
      speaker: "Campus to CEO - Shawrya Mehrotra Story",
      description: "Inspiring story of Shawrya Mehrotra who started his entrepreneurial journey at 18 and built 3 successful ventures including Metvy, VC Fellowship, and MuzoClass. Discover how he managed 8000+ users organically, built a 200+ member team, and proves you don't need fancy degrees to succeed.",
      url: "https://youtu.be/RLnyODRt0ho?si=-tyRNNLsxutdQSKA"
    },
    {
      id: 4,
      title: "150+ Keynotes at 25 - Young Speaker & Entrepreneur",
      speaker: "Campus to CEO - TEDx Speaker Story",
      description: "Meet the inspiring founder of Metvy who has delivered 150+ keynotes and graced TEDx stages by age 25. Learn how student entrepreneurs can build their personal brand, become thought leaders, and inspire others while building successful startups during college years.",
      url: "https://youtu.be/UryFh2P1stw?si=lPSBz5rqdgu1U8Wg"
    },
    {
      id: 5,
      title: "BITS Pilani Students Get Funded by Naukri.com",
      speaker: "Campus to CEO - College Startup Success",
      description: "Amazing startup success story of BITS Pilani students who got funded by Naukri.com. Discover how college students can validate their ideas, build products that solve real problems, and attract investment from established companies while still pursuing their degrees.",
      url: "https://youtu.be/WgxyTDnu27k?si=3SSEISpyWMy78Hvd"
    },
    {
      id: 6,
      title: "₹15K to Celebrity Fashion Brand - ISHKAARA Story",
      speaker: "Campus to CEO - Fashion Startup Journey",
      description: "Incredible journey of Vidhi who started ISHKAARA fashion brand with just ₹15,000 and now has celebrities like Kareena Kapoor and Big Boss contestants wearing her designs. Learn how to build a fashion startup, scale manufacturing, and get celebrity endorsements on a shoestring budget.",
      url: "https://youtu.be/DslNrHzLz2c?si=jUdD0SSWdj6tOhXm"
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
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
            <div className="mb-4">
              <span className="inline-block bg-secondary-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🎓 Chaitanya University collaborated with Sunstone
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Transforming Ideas Into Successful Ventures
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Join the entrepreneurial revolution at <span className="text-secondary-300 font-semibold">Chaitanya University</span>. Learn, build, and grow with E-Cell.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/get-involved" className="btn btn-secondary">Get Involved</Link>
              <Link to="/events" className="btn btn-outline border-white text-white hover:bg-white/10">Upcoming Events</Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Fostering Innovation & Entrepreneurship</h2>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg mb-6">
                <p className="text-lg font-semibold text-primary-700">
                  🏛️ <span className="text-primary-800">Chaitanya University</span> collaborated with <span className="text-secondary-700">Sunstone</span>
                </p>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                E-Cell at <strong>Chaitanya University</strong> is a dynamic student-run organization that bridges the gap between academic learning and real-world entrepreneurship. Through our collaboration with <strong>Sunstone</strong>, we create an ecosystem where innovative ideas flourish through collaboration with industry leaders, successful entrepreneurs, and educational institutions.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Our comprehensive approach includes expert-led workshops, industry insights from business leaders, startup competitions, and mentorship programs that prepare students for the evolving landscape of modern entrepreneurship and business innovation.
              </p>
              <Link to="/about" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
                Learn more about us <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-lg shadow-xl overflow-hidden bg-gray-100">
                <iframe 
                  className="w-full h-80"
                  src="https://www.youtube.com/embed/pQWeffeJA_s"
                  title="Education Innovation & Entrepreneurship Insights"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-lg shadow-lg">
                <p className="text-2xl font-bold">Since 2020</p>
                <p>Empowering entrepreneurs at</p>
                <p className="text-secondary-300 font-semibold">Chaitanya University</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Startup Videos */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Real Student Startup Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get inspired by real Indian student entrepreneurs who built successful startups while still in school and college.
            </p>
          </div>
          <VideoCarousel videos={startupVideos} />
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Ready to dive deeper into entrepreneurship? Explore our comprehensive resource library.
            </p>
            <Link to="https://www.youtube.com/@Campus2CEO" className="btn btn-primary">Explore More Resources</Link>
          </div>
        </div>
      </section>

      {/* Campus Life Videos */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Experience Life at Chaitanya University</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how we're building the next generation of entrepreneurs at <span className="text-primary-600 font-semibold">Chaitanya University</span> through innovation, collaboration, and hands-on learning experiences powered by our partnership with <span className="text-secondary-600 font-semibold">Sunstone</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video 1 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <iframe className="w-full h-full" src="https://www.youtube.com/embed/Oi4SsSuPOEM?si=k0QtylVYwzU-irqp" title="Innovation Lab Tour" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Innovation Lab & Maker Space</h3>
                <p className="text-gray-600">Step inside our state-of-the-art innovation lab equipped with 3D printers, prototyping tools, and collaborative workspaces where student entrepreneurs transform breakthrough ideas into tangible products and solutions.</p>
              </div>
            </div>

            {/* Video 2 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <iframe className="w-full h-full" src="https://www.youtube.com/embed/0TL99HK8SsA?si=fpZrTOKSorfFbeoY" title="Startup Events & Competitions" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Pitch Competitions & Demo Days</h3>
                <p className="text-gray-600">Experience the energy of our flagship startup competitions where students pitch innovative solutions to industry experts, investors, and successful entrepreneurs. Witness the birth of tomorrow's unicorns!</p>
              </div>
            </div>

            {/* Video 3 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <iframe className="w-full h-full" src="https://www.youtube.com/embed/_PCbuInstNU?si=qKTdaVqvpqqB7Xpo" title="Campus Overview" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Entrepreneurial Ecosystem</h3>
                <p className="text-gray-600">Explore our thriving entrepreneurial community where students collaborate on groundbreaking projects, attend inspiring speaker sessions, and build networks that last a lifetime. See how we're creating India's next generation of business leaders.</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to Start Your Entrepreneurial Journey?</h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Join our vibrant community of innovators, creators, and future business leaders. From ideation to execution, we provide the resources, mentorship, and network you need to turn your vision into reality.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/get-involved" className="btn btn-primary">Join E-Cell Today</Link>
                <Link to="/events" className="btn btn-outline">Upcoming Events</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Our Impact in Numbers</h2>
            <p className="text-lg text-primary-100 max-w-3xl mx-auto">
              See how we're making a difference in the entrepreneurial ecosystem and empowering the next generation of innovators.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl text-secondary-400 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the inspiring entrepreneurs who started their journey with E-Cell and are now making waves in the startup ecosystem.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map(story => (
              <div key={story.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-video relative">
                  <ImageWithFallback 
                    src={story.image}
                    alt={story.name}
                    height="100%"
                    placeholderText={story.name}
                    placeholderBgColor="#f3f4f6"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                    <span className="text-sm text-primary-600 font-medium">{story.year}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Founded by {story.founder}</p>
                  <p className="text-gray-600">{story.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/startups" className="btn btn-primary">
              View All Success Stories
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
