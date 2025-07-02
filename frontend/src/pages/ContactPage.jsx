import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

const ContactPage = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(
    location.hash === '#resource-request' ? 'resource' : 
    location.hash === '#event-proposal' ? 'event' : 
    location.hash === '#faq' ? 'faq' : 
    'general'
  )
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const [resourceForm, setResourceForm] = useState({
    name: '',
    email: '',
    resourceType: '',
    resourceTopic: '',
    description: ''
  })
  
  const [eventForm, setEventForm] = useState({
    name: '',
    email: '',
    organization: '',
    eventTitle: '',
    eventType: '',
    proposedDate: '',
    description: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Contact information
  const contactInfo = {
    address: 'E-Cell Office, Student Activity Center, Chaithanya Deemed to be University, Hanamkonda, Warangal - 506009',
    phone: '+91 6300472707',
    email: 'nimmalaprashanth9@gmail.com',
    hours: 'Monday to Friday: 10:00 AM - 2:00 PM'
  }

  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: <FaFacebook />, url: 'https://facebook.com/ecell' },
    { name: 'Instagram', icon: <FaInstagram />, url: 'https://instagram.com/ecell' },
    { name: 'LinkedIn', icon: <FaLinkedin />, url: 'https://linkedin.com/company/ecell' },
    { name: 'YouTube', icon: <FaYoutube />, url: 'https://youtube.com/ecell' }
  ]

  // FAQ data
  const faqs = [
    {
      question: 'How can I join E-Cell?',
      answer: 'You can join E-Cell by filling out the membership form on our "Get Involved" page. We welcome students from all disciplines who are interested in entrepreneurship.'
    },
    {
      question: 'Are E-Cell events open to non-members?',
      answer: 'Yes, most of our events are open to all students and faculty. Some specialized workshops or programs may have limited seats with preference given to members, but we try to make our events as inclusive as possible.'
    },
    {
      question: 'How can I apply for the incubation program?',
      answer: 'You can apply for our incubation program through the application form on the "Startups" page. Applications are accepted year-round with quarterly selection cycles.'
    },
    {
      question: 'Does E-Cell provide funding for startups?',
      answer: 'E-Cell itself doesn\'t directly fund startups, but we connect promising ventures with potential investors, help with grant applications, and provide guidance on various funding options available.'
    },
    {
      question: 'Can alumni participate in E-Cell activities?',
      answer: 'Absolutely! We encourage alumni to participate as mentors, speakers, or partners. Many of our successful initiatives involve alumni who share their experiences and provide guidance to current students.'
    },
    {
      question: 'How can I become a mentor for E-Cell startups?',
      answer: 'If you have expertise in entrepreneurship, industry experience, or specific skills that could benefit student entrepreneurs, you can apply to become a mentor through our "Get Involved" page.'
    },
    {
      question: 'Does E-Cell offer internship opportunities?',
      answer: 'Yes, we offer internship opportunities within our organization as well as connect students with internship positions at startups in our network. Check the "Get Involved" page for current openings.'
    },
    {
      question: 'How can my organization sponsor E-Cell events?',
      answer: 'We welcome sponsorships and partnerships from organizations that align with our mission. Please contact us through the "Event Proposal" form or email us at partnerships@gmail.com for sponsorship opportunities.'
    }
  ]

  // Handle form input changes
  const handleGeneralInputChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleResourceInputChange = (e) => {
    const { name, value } = e.target
    setResourceForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEventInputChange = (e) => {
    const { name, value } = e.target
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submissions
  const handleGeneralSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(contactForm)
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSubmitStatus('success')
      // Reset form
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    }
  }

  const handleResourceSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSubmitStatus('success')
      // Reset form
      setResourceForm({
        name: '',
        email: '',
        resourceType: '',
        resourceTopic: '',
        description: ''
      })
    } catch (error) {
      console.error('Resource request submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    }
  }

  const handleEventSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSubmitStatus('success')
      // Reset form
      setEventForm({
        name: '',
        email: '',
        organization: '',
        eventTitle: '',
        eventType: '',
        proposedDate: '',
        description: ''
      })
    } catch (error) {
      console.error('Event proposal submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary-800 text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="/images/contact/contact-hero-bg.jpg" 
            alt="Contact E-Cell" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-primary-100 mb-4">
              Have questions or want to get involved? We'd love to hear from you.
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
                activeTab === 'general'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('general')}
            >
              General Inquiry
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg whitespace-nowrap ${
                activeTab === 'resource'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('resource')}
            >
              Resource Request
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg whitespace-nowrap ${
                activeTab === 'event'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('event')}
            >
              Event Proposal
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg whitespace-nowrap ${
                activeTab === 'faq'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('faq')}
            >
              FAQ
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      {activeTab === 'general' && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                
                {submitStatus === 'success' ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    <p className="font-bold">Message Sent Successfully!</p>
                    <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
                  </div>
                ) : submitStatus === 'error' ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <p className="font-bold">Message Could Not Be Sent</p>
                    <p>There was an error sending your message. Please try again later or contact us directly via email.</p>
                  </div>
                ) : null}
                
                <form onSubmit={handleGeneralSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleGeneralInputChange}
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
                      value={contactForm.email}
                      onChange={handleGeneralInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleGeneralInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleGeneralInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleGeneralInputChange}
                      rows="5"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
              
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <FaMapMarkerAlt className="text-primary-600 text-xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">Address</h3>
                        <p className="text-gray-600 mt-1">{contactInfo.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <FaPhone className="text-primary-600 text-xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <p className="text-gray-600 mt-1">
                          <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="hover:text-primary-600">
                            {contactInfo.phone}
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <FaEnvelope className="text-primary-600 text-xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p className="text-gray-600 mt-1">
                          <a href={`mailto:${contactInfo.email}`} className="hover:text-primary-600">
                            {contactInfo.email}
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <FaClock className="text-primary-600 text-xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">Office Hours</h3>
                        <p className="text-gray-600 mt-1">{contactInfo.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Social Media */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((social) => (
                      <a 
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-primary-600 hover:text-white transition-colors"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* Map */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Find Us</h3>
                  <div className="rounded-lg overflow-hidden h-64 bg-gray-200">
                    {/* Replace with actual Google Maps embed */}
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2687.2207459363144!2d79.55858660303056!3d18.014090981294437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a334f7bc15a6d79%3A0xd39e93ff6d5f18ab!2sChaitanya%20(Deemed%20to%20be%20University)!5e0!3m2!1sen!2sin!4v1747850096929!5m2!1sen!2sin" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Chaithanya Deemed to be University, Hanamkonda, Warangal"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Resource Request Form */}
      {activeTab === 'resource' && (
        <section id="resource-request" className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Request Resources</h2>
              <p className="text-gray-600 mb-8">
                Can't find what you're looking for? Let us know what resources would be helpful for your entrepreneurial journey, and we'll do our best to provide them.
              </p>
              
              {submitStatus === 'success' ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  <p className="font-bold">Request Submitted Successfully!</p>
                  <p>Thank you for your resource request. We'll review it and get back to you soon.</p>
                </div>
              ) : submitStatus === 'error' ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  <p className="font-bold">Request Could Not Be Submitted</p>
                  <p>There was an error submitting your request. Please try again later or contact us directly via email.</p>
                </div>
              ) : null}
              
              <form onSubmit={handleResourceSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="resource-name" className="block text-gray-700 font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      id="resource-name"
                      name="name"
                      value={resourceForm.name}
                      onChange={handleResourceInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="resource-email" className="block text-gray-700 font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      id="resource-email"
                      name="email"
                      value={resourceForm.email}
                      onChange={handleResourceInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="resourceType" className="block text-gray-700 font-medium mb-2">Resource Type *</label>
                  <select
                    id="resourceType"
                    name="resourceType"
                    value={resourceForm.resourceType}
                    onChange={handleResourceInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select resource type</option>
                    <option value="guide">Guide/Tutorial</option>
                    <option value="template">Template</option>
                    <option value="tool">Software Tool</option>
                    <option value="video">Video/Webinar</option>
                    <option value="course">Course/Workshop</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="resourceTopic" className="block text-gray-700 font-medium mb-2">Topic/Subject *</label>
                  <input
                    type="text"
                    id="resourceTopic"
                    name="resourceTopic"
                    value={resourceForm.resourceTopic}
                    onChange={handleResourceInputChange}
                    required
                    placeholder="e.g., Financial Modeling, Marketing Strategy, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Detailed Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={resourceForm.description}
                    onChange={handleResourceInputChange}
                    rows="5"
                    required
                    placeholder="Please describe in detail what you're looking for and how it would help you."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Event Proposal Form */}
      {activeTab === 'event' && (
        <section id="event-proposal" className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Event Proposal</h2>
              <p className="text-gray-600 mb-8">
                Have an idea for an entrepreneurship-related event? We'd love to collaborate with you. Fill out the form below to submit your proposal.
              </p>
              
              {submitStatus === 'success' ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  <p className="font-bold">Proposal Submitted Successfully!</p>
                  <p>Thank you for your event proposal. Our team will review it and contact you soon to discuss further.</p>
                </div>
              ) : submitStatus === 'error' ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  <p className="font-bold">Proposal Could Not Be Submitted</p>
                  <p>There was an error submitting your proposal. Please try again later or contact us directly via email.</p>
                </div>
              ) : null}
              
              <form onSubmit={handleEventSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="event-name" className="block text-gray-700 font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      id="event-name"
                      name="name"
                      value={eventForm.name}
                      onChange={handleEventInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="event-email" className="block text-gray-700 font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      id="event-email"
                      name="email"
                      value={eventForm.email}
                      onChange={handleEventInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="organization" className="block text-gray-700 font-medium mb-2">Organization/Company</label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={eventForm.organization}
                    onChange={handleEventInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="eventTitle" className="block text-gray-700 font-medium mb-2">Event Title *</label>
                  <input
                    type="text"
                    id="eventTitle"
                    name="eventTitle"
                    value={eventForm.eventTitle}
                    onChange={handleEventInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="eventType" className="block text-gray-700 font-medium mb-2">Event Type *</label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={eventForm.eventType}
                      onChange={handleEventInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select event type</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar/Talk</option>
                      <option value="competition">Competition</option>
                      <option value="networking">Networking Event</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="conference">Conference</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="proposedDate" className="block text-gray-700 font-medium mb-2">Proposed Date</label>
                    <input
                      type="date"
                      id="proposedDate"
                      name="proposedDate"
                      value={eventForm.proposedDate}
                      onChange={handleEventInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="event-description" className="block text-gray-700 font-medium mb-2">Event Description *</label>
                  <textarea
                    id="event-description"
                    name="description"
                    value={eventForm.description}
                    onChange={handleEventInputChange}
                    rows="5"
                    required
                    placeholder="Please provide details about the event, including objectives, target audience, format, and any specific requirements."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {activeTab === 'faq' && (
        <section id="faq" className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer p-4 bg-white">
                        <span className="text-lg">{faq.question}</span>
                        <span className="transition group-open:rotate-180">
                          <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                            <path d="M6 9l6 6 6-6"></path>
                          </svg>
                        </span>
                      </summary>
                      <div className="p-4 pt-0 text-gray-700">
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">Don't see your question here?</p>
                <button
                  onClick={() => setActiveTab('general')}
                  className="btn btn-primary"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section id="newsletter" className="py-16 bg-primary-700 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl mb-8">
              Subscribe to our newsletter to receive updates on events, resources, and entrepreneurial opportunities.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                required
              />
              <button
                type="submit"
                className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
            
            <p className="text-sm mt-4 text-primary-200">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage