import { useState } from 'react'
import { FaTimes, FaSave } from 'react-icons/fa'
import api from '../../services/api'

const NewsletterForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    htmlContent: '',
    previewText: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.subject || !formData.content) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const response = await api.newsletter.createNewsletter(formData)
      
      if (response.success) {
        onSuccess()
        onClose()
        // Reset form
        setFormData({
          title: '',
          subject: '',
          content: '',
          htmlContent: '',
          previewText: ''
        })
      } else {
        setError(response.message || 'Failed to create newsletter')
      }
    } catch (error) {
      console.error('Error creating newsletter:', error)
      setError(error.message || 'Failed to create newsletter')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Newsletter</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Newsletter Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter newsletter title"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Email Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter email subject line"
              required
            />
          </div>

          <div>
            <label htmlFor="previewText" className="block text-sm font-medium text-gray-700 mb-2">
              Preview Text
            </label>
            <input
              type="text"
              id="previewText"
              name="previewText"
              value={formData.previewText}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Short preview text (appears in email clients)"
              maxLength={150}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.previewText.length}/150 characters
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Newsletter Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your newsletter content here..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Plain text content (will be converted to HTML automatically)
            </p>
          </div>

          <div>
            <label htmlFor="htmlContent" className="block text-sm font-medium text-gray-700 mb-2">
              HTML Content (Optional)
            </label>
            <textarea
              id="htmlContent"
              name="htmlContent"
              value={formData.htmlContent}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              placeholder="Enter custom HTML content (optional)"
            />
            <p className="text-xs text-gray-500 mt-1">
              If provided, this will be used instead of the plain text content
            </p>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Create Newsletter
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewsletterForm