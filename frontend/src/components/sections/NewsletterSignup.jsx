import { useState } from 'react'
import api from '../../services/api'

const NewsletterSignup = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      alert('Please enter your email address')
      return
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address')
      return
    }
    
    try {
      setLoading(true)
      setStatus(null)
      setErrorMessage('')
      
      console.log('Attempting to subscribe with email:', email)
      const response = await api.newsletter.subscribe({ email })
      console.log('Newsletter subscription response:', response)
      
      if (response.success) {
        setStatus('success')
        setEmail('')
      } else {
        console.error('Newsletter subscription failed:', response.message)
        setStatus('error')
        setErrorMessage(response.message || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setStatus('error')
      setErrorMessage(error.message || 'Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus(null)
        setErrorMessage('')
      }, 5000)
    }
  }

  return (
    <section className="bg-primary-900 py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with E-Cell
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Subscribe to our newsletter for the latest events, resources, and entrepreneurial insights.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-70"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          {status === 'success' && (
            <p className="mt-4 text-green-300">
              Thank you for subscribing to our newsletter!
            </p>
          )}
          
          {status === 'error' && (
            <p className="mt-4 text-red-300">
              {errorMessage || 'There was an error subscribing. Please try again later.'}
            </p>
          )}
          
          <p className="text-primary-200 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSignup