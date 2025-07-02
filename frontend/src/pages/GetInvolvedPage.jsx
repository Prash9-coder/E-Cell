import { useState } from 'react'
import { FaUsers, FaLightbulb, FaHandshake, FaChalkboardTeacher, FaMoneyBillWave, FaCheck } from 'react-icons/fa'

const GetInvolvedPage = () => {
  const [activeTab, setActiveTab] = useState('join')
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would submit the form data to an API
    // For now, just simulate a successful submission
    setTimeout(() => {
      setFormSubmitted(true)
    }, 1000)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary-800 text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="/images/get-involved/get-involved-hero.jpg" 
            alt="Get Involved with E-Cell" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Get Involved with E-Cell</h1>
            <p className="text-xl text-primary-100 mb-4">
              Join our vibrant community of entrepreneurs, innovators, and change-makers. There are many ways to be part of the E-Cell ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-white border-b">
        <div className="container">
          <div className="flex overflow-x-auto">
            <button
              className={`py-4 px-6 font-medium text-lg whitespace-nowrap ${
                activeTab === 'join'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('join')}
            >
              Join the Team
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg whitespace-nowrap ${
                activeTab === 'mentor'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('mentor')}
            >
              Become a Mentor
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg whitespace-nowrap ${
                activeTab === 'partner'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('partner')}
            >
              Partner with Us
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg whitespace-nowrap ${
                activeTab === 'sponsor'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('sponsor')}
            >
              Sponsor Events
            </button>
          </div>
        </div>
      </section>

      {/* Join the Team */}
      {activeTab === 'join' && (
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block p-3 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <FaUsers className="text-3xl" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Join the E-Cell Team</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Become part of our dynamic team and help build the entrepreneurial ecosystem on campus while developing valuable skills and connections.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Why Join E-Cell?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Develop leadership and organizational skills</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Build a network with entrepreneurs and industry professionals</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Get hands-on experience in event management and marketing</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Learn about startups and entrepreneurship from the inside</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Add valuable experience to your resume</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Available Roles</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Events Team:</strong> Plan and execute workshops, competitions, and summits</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Marketing Team:</strong> Manage social media, design, and promotional campaigns</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Startup Support Team:</strong> Help student entrepreneurs develop their ideas</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Content Team:</strong> Create blogs, newsletters, and educational resources</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Technical Team:</strong> Develop and maintain E-Cell's digital platforms</span>
                    </li>
                  </ul>
                </div>
              </div>

              {formSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
                  <FaCheck className="text-green-500 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
                  <p>Thank you for your interest in joining E-Cell. We'll review your application and get back to you within 5-7 days.</p>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Apply to Join E-Cell</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Course & Year</label>
                        <input
                          type="text"
                          id="course"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">Preferred Team</label>
                        <select
                          id="team"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="">Select a team</option>
                          <option value="events">Events Team</option>
                          <option value="marketing">Marketing Team</option>
                          <option value="startup">Startup Support Team</option>
                          <option value="content">Content Team</option>
                          <option value="technical">Technical Team</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Relevant Experience</label>
                        <select
                          id="experience"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="">Select experience level</option>
                          <option value="none">No prior experience</option>
                          <option value="beginner">Beginner (0-1 years)</option>
                          <option value="intermediate">Intermediate (1-2 years)</option>
                          <option value="advanced">Advanced (2+ years)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">Why do you want to join E-Cell? (100-200 words)</label>
                      <textarea
                        id="motivation"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        required
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">What skills can you contribute to the team? (100-200 words)</label>
                      <textarea
                        id="skills"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        required
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          required
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I understand that joining E-Cell requires a commitment of 5-8 hours per week, and I am willing to dedicate this time.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
                    >
                      Submit Application
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Become a Mentor */}
      {activeTab === 'mentor' && (
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block p-3 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <FaChalkboardTeacher className="text-3xl" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Become a Mentor</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Share your expertise and experience with the next generation of entrepreneurs. Help guide student startups through their entrepreneurial journey.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Why Mentor?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Give back to the entrepreneurial community</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Connect with innovative ideas and fresh perspectives</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Expand your professional network</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Stay connected with emerging trends and technologies</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Potential investment or partnership opportunities</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Mentorship Areas</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Business Strategy:</strong> Help startups refine their business models and go-to-market strategies</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Technical Expertise:</strong> Provide guidance on product development and technology choices</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Marketing & Sales:</strong> Advise on customer acquisition and growth strategies</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Fundraising:</strong> Guide startups through the investment process</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Industry-Specific:</strong> Share insights from your particular industry or sector</span>
                    </li>
                  </ul>
                </div>
              </div>

              {formSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
                  <FaCheck className="text-green-500 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Mentor Application Submitted!</h3>
                  <p>Thank you for your interest in becoming a mentor. Our team will review your application and contact you within 7 days to discuss next steps.</p>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Apply to Become a Mentor</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="mentor-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="mentor-name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="mentor-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="mentor-email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="mentor-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="mentor-phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="mentor-linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                        <input
                          type="url"
                          id="mentor-linkedin"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://linkedin.com/in/yourprofile"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="mentor-company" className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
                        <input
                          type="text"
                          id="mentor-company"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="mentor-role" className="block text-sm font-medium text-gray-700 mb-1">Current Role</label>
                        <input
                          type="text"
                          id="mentor-role"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="mentor-expertise" className="block text-sm font-medium text-gray-700 mb-1">Areas of Expertise (select all that apply)</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                          <span className="ml-2 text-sm">Business Strategy</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                          <span className="ml-2 text-sm">Product Development</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                          <span className="ml-2 text-sm">Marketing & Sales</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                          <span className="ml-2 text-sm">Fundraising</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                          <span className="ml-2 text-sm">Technology</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                          <span className="ml-2 text-sm">Operations</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                          <span className="ml-2 text-sm">Finance</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                          <span className="ml-2 text-sm">Legal</span>
                        </label>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="mentor-experience" className="block text-sm font-medium text-gray-700 mb-1">Relevant Experience (200-300 words)</label>
                      <textarea
                        id="mentor-experience"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        required
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="mentor-motivation" className="block text-sm font-medium text-gray-700 mb-1">Why do you want to mentor student entrepreneurs? (100-200 words)</label>
                      <textarea
                        id="mentor-motivation"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        required
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="mentor-commitment" className="block text-sm font-medium text-gray-700 mb-1">Time Commitment</label>
                      <select
                        id="mentor-commitment"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Select time commitment</option>
                        <option value="1-2">1-2 hours per month</option>
                        <option value="3-5">3-5 hours per month</option>
                        <option value="6-10">6-10 hours per month</option>
                        <option value="10+">10+ hours per month</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
                    >
                      Submit Mentor Application
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Partner with Us */}
      {activeTab === 'partner' && (
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block p-3 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <FaHandshake className="text-3xl" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Partner with E-Cell</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Collaborate with us to create meaningful opportunities for student entrepreneurs and strengthen the startup ecosystem.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Partnership Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Access to a pool of talented student entrepreneurs</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Opportunity to showcase your brand to a young, innovative audience</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Co-create events, workshops, and programs</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Early access to innovative student startups</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Contribute to the development of future entrepreneurs</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Partnership Opportunities</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Knowledge Partner:</strong> Conduct workshops, training sessions, and masterclasses</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Technology Partner:</strong> Provide tools, platforms, or services to student startups</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Incubation Partner:</strong> Offer resources or space for startup development</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Industry Partner:</strong> Provide industry insights and potential pilot opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Recruitment Partner:</strong> Connect with entrepreneurial talent for internships or jobs</span>
                    </li>
                  </ul>
                </div>
              </div>

              {formSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
                  <FaCheck className="text-green-500 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Partnership Inquiry Submitted!</h3>
                  <p>Thank you for your interest in partnering with E-Cell. Our partnerships team will review your inquiry and contact you within 3-5 business days to discuss potential collaboration opportunities.</p>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Partner with E-Cell</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="partner-name" className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
                        <input
                          type="text"
                          id="partner-name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="partner-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="partner-email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="partner-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="partner-phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="partner-organization" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                        <input
                          type="text"
                          id="partner-organization"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="partner-website" className="block text-sm font-medium text-gray-700 mb-1">Organization Website</label>
                        <input
                          type="url"
                          id="partner-website"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://example.com"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="partner-type" className="block text-sm font-medium text-gray-700 mb-1">Partnership Type</label>
                        <select
                          id="partner-type"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="">Select partnership type</option>
                          <option value="knowledge">Knowledge Partner</option>
                          <option value="technology">Technology Partner</option>
                          <option value="incubation">Incubation Partner</option>
                          <option value="industry">Industry Partner</option>
                          <option value="recruitment">Recruitment Partner</option>
                          <option value="other">Other (please specify)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="partner-proposal" className="block text-sm font-medium text-gray-700 mb-1">Partnership Proposal (200-300 words)</label>
                      <textarea
                        id="partner-proposal"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Please describe how you envision partnering with E-Cell and what you hope to achieve through this collaboration."
                        required
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="partner-benefits" className="block text-sm font-medium text-gray-700 mb-1">What can you offer to student entrepreneurs? (100-200 words)</label>
                      <textarea
                        id="partner-benefits"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        required
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="partner-timeline" className="block text-sm font-medium text-gray-700 mb-1">Proposed Timeline</label>
                      <select
                        id="partner-timeline"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Select timeline</option>
                        <option value="one-time">One-time event/collaboration</option>
                        <option value="semester">Semester-long partnership</option>
                        <option value="annual">Annual partnership</option>
                        <option value="ongoing">Ongoing/long-term partnership</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
                    >
                      Submit Partnership Inquiry
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Sponsor Events */}
      {activeTab === 'sponsor' && (
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block p-3 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <FaMoneyBillWave className="text-3xl" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Sponsor E-Cell Events</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Support entrepreneurship on campus by sponsoring our events and programs while gaining visibility for your brand among future innovators and leaders.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Sponsorship Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Brand visibility among students and the startup community</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Access to talented students for recruitment</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Networking opportunities with other sponsors and partners</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Opportunity to judge competitions and mentor participants</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span>Demonstrate corporate social responsibility</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Sponsorship Opportunities</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>E-Summit:</strong> Our flagship annual entrepreneurship summit</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Startup Competitions:</strong> Pitch competitions and hackathons</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Workshop Series:</strong> Skill-building workshops throughout the year</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Speaker Sessions:</strong> Talks by successful entrepreneurs and industry leaders</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span><strong>Incubation Program:</strong> Support for our startup incubation initiatives</span>
                    </li>
                  </ul>
                </div>
              </div>

              {formSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
                  <FaCheck className="text-green-500 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Sponsorship Inquiry Submitted!</h3>
                  <p>Thank you for your interest in sponsoring E-Cell events. Our sponsorship team will review your inquiry and contact you within 3-5 business days to discuss sponsorship packages and opportunities.</p>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Sponsor E-Cell Events</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="sponsor-name" className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
                        <input
                          type="text"
                          id="sponsor-name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="sponsor-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="sponsor-email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="sponsor-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="sponsor-phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="sponsor-organization" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                        <input
                          type="text"
                          id="sponsor-organization"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="sponsor-website" className="block text-sm font-medium text-gray-700 mb-1">Organization Website</label>
                        <input
                          type="url"
                          id="sponsor-website"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="https://example.com"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="sponsor-event" className="block text-sm font-medium text-gray-700 mb-1">Event Interest</label>
                        <select
                          id="sponsor-event"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="">Select event</option>
                          <option value="e-summit">E-Summit</option>
                          <option value="startup-competition">Startup Competition</option>
                          <option value="workshop-series">Workshop Series</option>
                          <option value="speaker-sessions">Speaker Sessions</option>
                          <option value="incubation-program">Incubation Program</option>
                          <option value="multiple">Multiple Events</option>
                          <option value="other">Other (please specify)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="sponsor-budget" className="block text-sm font-medium text-gray-700 mb-1">Sponsorship Budget Range</label>
                      <select
                        id="sponsor-budget"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Select budget range</option>
                        <option value="under-50k">Under ₹50,000</option>
                        <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                        <option value="1l-3l">₹1,00,000 - ₹3,00,000</option>
                        <option value="3l-5l">₹3,00,000 - ₹5,00,000</option>
                        <option value="above-5l">Above ₹5,00,000</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="sponsor-goals" className="block text-sm font-medium text-gray-700 mb-1">Sponsorship Goals (100-200 words)</label>
                      <textarea
                        id="sponsor-goals"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="What do you hope to achieve through sponsoring E-Cell events? (e.g., brand visibility, talent recruitment, CSR, etc.)"
                        required
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="sponsor-requirements" className="block text-sm font-medium text-gray-700 mb-1">Special Requirements or Requests</label>
                      <textarea
                        id="sponsor-requirements"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Any specific requirements or requests for your sponsorship (e.g., booth space, speaking opportunity, etc.)"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
                    >
                      Submit Sponsorship Inquiry
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What People Say About E-Cell</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from students, mentors, partners, and sponsors who have been part of our entrepreneurial journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/team/rahul-verma.jpg" 
                  alt="Rahul Verma" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold">Rahul Verma</h4>
                  <p className="text-sm text-gray-600">Mentor & Startup Founder</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Mentoring at E-Cell has been incredibly rewarding. The students are passionate, innovative, and eager to learn. I've been impressed by the quality of startups coming out of the program."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/team/ananya-patel.jpg" 
                  alt="Ananya Patel" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold">Ananya Patel</h4>
                  <p className="text-sm text-gray-600">Former E-Cell Member</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Being part of E-Cell was the highlight of my college experience. The skills I developed, the network I built, and the exposure to entrepreneurship have been invaluable in my career."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/team/vikram-reddy.jpg" 
                  alt="Vikram Reddy" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold">Vikram Reddy</h4>
                  <p className="text-sm text-gray-600">Corporate Partner</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Our partnership with E-Cell has helped us connect with talented students and innovative ideas. The events are well-organized, and the team is professional and dedicated."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about getting involved with E-Cell.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Who can join the E-Cell team?</h3>
                <p className="text-gray-700">
                  Any current student from any department or year can apply to join the E-Cell team. We look for passionate, committed individuals who are interested in entrepreneurship and willing to learn and contribute.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">What is the time commitment for E-Cell members?</h3>
                <p className="text-gray-700">
                  E-Cell members typically commit 5-8 hours per week, with increased hours during major events. We understand academic priorities and work to create flexible schedules.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Do I need entrepreneurial experience to become a mentor?</h3>
                <p className="text-gray-700">
                  While entrepreneurial experience is valuable, we welcome mentors with industry expertise, technical knowledge, or specific skills that can benefit student entrepreneurs. The most important qualities are a willingness to share knowledge and a commitment to supporting students.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">What are the sponsorship packages available?</h3>
                <p className="text-gray-700">
                  We offer various sponsorship packages ranging from title sponsorship to supporting sponsorship, with benefits tailored to your organization's goals. After submitting your inquiry, our team will share detailed sponsorship packages with you.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">How can alumni get involved with E-Cell?</h3>
                <p className="text-gray-700">
                  Alumni can get involved as mentors, speakers, judges for competitions, or partners. We value the experience and insights of our alumni and welcome their continued involvement in building the entrepreneurial ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default GetInvolvedPage