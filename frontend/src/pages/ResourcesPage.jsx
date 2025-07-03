import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaDownload, FaExternalLinkAlt, FaSearch, FaBookOpen, FaMoneyBillWave, FaFileAlt, FaVideo, FaTools, FaChalkboardTeacher } from 'react-icons/fa'
import { useResources } from '../context/ResourceContext'
import StableImage from '../components/StableImage'
import { getContentImageUrl, getFallbackImage } from '../utils/imageUtils'

const ResourcesPage = () => {
  const { resources, getFeaturedResources } = useResources();
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Resource categories
  const categories = [
    { id: 'all', name: 'All Resources', icon: <FaBookOpen /> },
    { id: 'guides', name: 'Startup Guides', icon: <FaBookOpen /> },
    { id: 'funding', name: 'Funding Resources', icon: <FaMoneyBillWave /> },
    { id: 'templates', name: 'Templates & Tools', icon: <FaFileAlt /> },
    { id: 'videos', name: 'Videos & Webinars', icon: <FaVideo /> },
    { id: 'tools', name: 'Software Tools', icon: <FaTools /> },
    { id: 'courses', name: 'Courses & Workshops', icon: <FaChalkboardTeacher /> }
  ]

  // Additional mock resources data for demonstration
  const additionalResources = [
    {
      id: 101,
      title: 'Startup Idea Validation Guide',
      description: 'Learn how to validate your startup idea before investing time and resources.',
      category: 'guides',
      type: 'PDF',
      thumbnail: '/images/resources/idea-validation.jpg',
      downloadLink: '/resources/startup-idea-validation-guide.pdf',
      featured: true
    },
    {
      id: 102,
      title: 'Business Model Canvas Template',
      description: 'A template to help you visualize and develop your business model.',
      category: 'templates',
      type: 'DOCX',
      thumbnail: '/images/resources/business-model-canvas.jpg',
      downloadLink: '/resources/business-model-canvas.docx',
      featured: true
    },
    {
      id: 103,
      title: 'Funding Options for Early-Stage Startups',
      description: 'Comprehensive guide to various funding options available for early-stage startups.',
      category: 'funding',
      type: 'PDF',
      thumbnail: '/images/resources/funding-guide.jpg',
      downloadLink: '/resources/funding-options-guide.pdf',
      featured: true
    },
    {
      id: 104,
      title: 'Pitch Deck Template',
      description: 'A professionally designed pitch deck template with guidance for each slide.',
      category: 'templates',
      type: 'PPTX',
      thumbnail: '/images/resources/pitch-deck.jpg',
      downloadLink: '/resources/pitch-deck-template.pptx',
      featured: false
    },
    {
      id: 105,
      title: 'Financial Projections Spreadsheet',
      description: 'Excel template for creating 3-year financial projections for your startup.',
      category: 'templates',
      type: 'XLSX',
      thumbnail: '/images/resources/financial-projections.jpg',
      downloadLink: '/resources/financial-projections.xlsx',
      featured: false
    },
    {
      id: 106,
      title: 'How to Approach Investors',
      description: 'Video workshop on how to effectively approach and pitch to investors.',
      category: 'videos',
      type: 'Video',
      thumbnail: '/images/resources/investor-approach.jpg',
      externalLink: 'https://www.youtube.com/watch?v=example',
      duration: '45 minutes',
      featured: false
    },
    {
      id: 107,
      title: 'Legal Essentials for Startups',
      description: 'Guide covering the essential legal aspects every founder should know.',
      category: 'guides',
      type: 'PDF',
      thumbnail: '/images/resources/legal-guide.jpg',
      downloadLink: '/resources/legal-essentials.pdf',
      featured: false
    },
    {
      id: 108,
      title: 'Marketing Strategy Framework',
      description: 'Framework to help you develop a comprehensive marketing strategy for your startup.',
      category: 'templates',
      type: 'PDF',
      thumbnail: '/images/resources/marketing-framework.jpg',
      downloadLink: '/resources/marketing-strategy-framework.pdf',
      featured: false
    },
    {
      id: 109,
      title: 'Product Development Roadmap',
      description: 'Template for planning and tracking your product development journey.',
      category: 'templates',
      type: 'XLSX',
      thumbnail: '/images/resources/product-roadmap.jpg',
      downloadLink: '/resources/product-roadmap.xlsx',
      featured: false
    },
    {
      id: 110,
      title: 'Government Grants for Startups',
      description: 'Comprehensive list of government grants and programs available for startups.',
      category: 'funding',
      type: 'PDF',
      thumbnail: '/images/resources/government-grants.jpg',
      downloadLink: '/resources/government-grants.pdf',
      featured: false
    },
    {
      id: 111,
      title: 'Startup Valuation Methods',
      description: 'Guide explaining different methods to value your startup at various stages.',
      category: 'guides',
      type: 'PDF',
      thumbnail: '/images/resources/valuation-methods.jpg',
      downloadLink: '/resources/startup-valuation.pdf',
      featured: false
    },
    {
      id: 112,
      title: 'Customer Discovery Interview Template',
      description: 'Template with questions and framework for conducting effective customer discovery interviews.',
      category: 'templates',
      type: 'DOCX',
      thumbnail: '/images/resources/customer-discovery.jpg',
      downloadLink: '/resources/customer-interview-template.docx',
      featured: false
    },
    {
      id: 113,
      title: 'Introduction to Lean Startup Methodology',
      description: 'Recorded webinar explaining the principles of the Lean Startup methodology.',
      category: 'videos',
      type: 'Video',
      thumbnail: '/images/resources/lean-startup.jpg',
      externalLink: 'https://www.youtube.com/watch?v=example2',
      duration: '60 minutes',
      featured: false
    },
    {
      id: 114,
      title: 'Essential Software Tools for Startups',
      description: 'Curated list of software tools and resources for early-stage startups with special discounts.',
      category: 'tools',
      type: 'PDF',
      thumbnail: '/images/resources/software-tools.jpg',
      downloadLink: '/resources/startup-tools.pdf',
      featured: false
    },
    {
      id: 115,
      title: 'Online Course: Fundamentals of Entrepreneurship',
      description: 'Comprehensive online course covering all aspects of starting and growing a business.',
      category: 'courses',
      type: 'Course',
      thumbnail: '/images/resources/entrepreneurship-course.jpg',
      externalLink: 'https://www.ecell.org/courses/entrepreneurship',
      duration: '8 weeks',
      featured: false
    }
  ]

  // Combine context resources with additional mock resources
  const allResources = [...resources, ...additionalResources];

  // Filter resources based on active category and search term
  const filteredResources = allResources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  // Get featured resources
  const featuredResources = [...getFeaturedResources(), ...additionalResources.filter(resource => resource.featured)]

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary-800 text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <StableImage 
            src="/images/resources/resources-hero-bg.jpg" 
            alt="E-Cell Resources" 
            className="w-full h-full"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Entrepreneurship Resources</h1>
            <p className="text-xl text-primary-100 mb-4">
              Access guides, templates, and tools to help you at every stage of your entrepreneurial journey.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-6 bg-gray-50 sticky top-0 z-20 border-b">
        <div className="container">
          <div className="flex overflow-x-auto pb-2 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`flex items-center px-4 py-2 mr-3 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {activeCategory === 'all' && searchTerm === '' && (
        <section className="py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Featured Resources</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featuredResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:transform hover:scale-105">
                  <div className="relative h-48">
                    <StableImage 
                      src={getContentImageUrl(resource.thumbnail, 'resources')} 
                      alt={resource.title}
                      className="w-full h-full"
                      fallbackSrc={getFallbackImage('resources')}
                      placeholderContent={
                        <div className="text-gray-400 text-center">
                          <div className="text-sm">{resource.type || 'Resource'}</div>
                        </div>
                      }
                    />
                    <div className="absolute top-0 right-0 bg-primary-600 text-white py-1 px-3 text-sm font-medium">
                      {resource.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    
                    {resource.downloadLink || resource.url ? (
                      <a 
                        href={resource.downloadLink || resource.url} 
                        className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                        download
                      >
                        <FaDownload className="mr-2" />
                        Download
                      </a>
                    ) : resource.externalLink ? (
                      <a 
                        href={resource.externalLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                      >
                        <FaExternalLinkAlt className="mr-2" />
                        Access Resource
                        {resource.duration && <span className="ml-2 text-sm text-gray-500">({resource.duration})</span>}
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Resources */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">
            {activeCategory === 'all' ? 'All Resources' : categories.find(c => c.id === activeCategory)?.name}
          </h2>
          
          {filteredResources.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative h-40">
                    <StableImage 
                      src={getContentImageUrl(resource.thumbnail, 'resources')} 
                      alt={resource.title}
                      className="w-full h-full"
                      fallbackSrc={getFallbackImage('resources')}
                      placeholderContent={
                        <div className="text-gray-400 text-center">
                          <div className="text-sm">{resource.type || 'Resource'}</div>
                        </div>
                      }
                    />
                    <div className="absolute top-0 right-0 bg-gray-800 text-white py-1 px-3 text-sm font-medium">
                      {resource.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {categories.find(c => c.id === resource.category)?.name}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>
                    
                    {resource.downloadLink || resource.url ? (
                      <a 
                        href={resource.downloadLink || resource.url} 
                        className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 text-sm"
                        download
                      >
                        <FaDownload className="mr-2" />
                        Download {resource.type}
                      </a>
                    ) : resource.externalLink ? (
                      <a 
                        href={resource.externalLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 text-sm"
                      >
                        <FaExternalLinkAlt className="mr-2" />
                        Access Resource
                        {resource.duration && <span className="ml-2 text-xs text-gray-500">({resource.duration})</span>}
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Resource Sections */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Resource Categories</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(1).map((category) => (
              <div key={category.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold ml-4">{category.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  {category.id === 'guides' && 'Comprehensive guides to help you navigate different aspects of entrepreneurship.'}
                  {category.id === 'funding' && 'Resources to help you understand and access various funding options for your startup.'}
                  {category.id === 'templates' && 'Ready-to-use templates for business plans, pitch decks, financial projections, and more.'}
                  {category.id === 'videos' && 'Video tutorials, webinars, and recorded workshops on various entrepreneurship topics.'}
                  {category.id === 'tools' && 'Curated list of software tools and resources to help you build and grow your startup.'}
                  {category.id === 'courses' && 'Online courses and workshop materials to develop your entrepreneurial skills.'}
                </p>
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className="text-primary-600 font-medium hover:text-primary-700"
                >
                  Browse {category.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Resources */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Can't Find What You're Looking For?</h2>
            <p className="text-xl mb-8 text-gray-300">
              If you need specific resources or have suggestions for new materials, let us know and we'll do our best to help.
            </p>
            <Link 
              to="/contact#resource-request" 
              className="btn bg-white text-primary-600 hover:bg-gray-100"
            >
              Request Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Mentorship CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Need Personalized Guidance?</h2>
              <p className="text-xl mb-6">
                Connect with experienced mentors who can provide personalized advice and guidance for your specific challenges.
              </p>
              <Link 
                to="/get-involved#mentorship" 
                className="btn bg-white text-primary-600 hover:bg-gray-100"
              >
                Find a Mentor
              </Link>
            </div>
            <div className="relative">
              <img 
                src="/images/resources/mentorship.jpg" 
                alt="Mentorship" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ResourcesPage