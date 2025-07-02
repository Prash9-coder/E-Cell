import { Link } from 'react-router-dom'
import { FaHome, FaSearch, FaEnvelope } from 'react-icons/fa'

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link 
              to="/" 
              className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <FaHome className="mr-2" /> Go Home
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FaEnvelope className="mr-2" /> Contact Us
            </Link>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Looking for something specific?</h3>
            <div className="flex max-w-md mx-auto">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search our website..."
                />
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-lg font-medium mb-4">Popular Pages</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/events" className="text-primary-600 hover:underline">Events</Link>
              <span className="text-gray-300">•</span>
              <Link to="/startups" className="text-primary-600 hover:underline">Startups</Link>
              <span className="text-gray-300">•</span>
              <Link to="/resources" className="text-primary-600 hover:underline">Resources</Link>
              <span className="text-gray-300">•</span>
              <Link to="/about" className="text-primary-600 hover:underline">About Us</Link>
              <span className="text-gray-300">•</span>
              <Link to="/blog" className="text-primary-600 hover:underline">Blog</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage