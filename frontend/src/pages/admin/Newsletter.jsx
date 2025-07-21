import { useState, useEffect } from 'react'
import { FaSearch, FaDownload, FaEye, FaTrash, FaUserCheck, FaUserTimes, FaPlus, FaPaperPlane, FaClock, FaEdit } from 'react-icons/fa'
import api from '../../services/api'
import NewsletterForm from '../../components/admin/NewsletterForm'

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([])
  const [newsletters, setNewsletters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalSubscribers, setTotalSubscribers] = useState(0)
  const [activeTab, setActiveTab] = useState('subscribers') // 'subscribers' or 'newsletters'
  const [showNewsletterModal, setShowNewsletterModal] = useState(false)
  const [selectedNewsletter, setSelectedNewsletter] = useState(null)

  // Fetch subscribers
  const fetchSubscribers = async (page = 1, search = '', active = 'all') => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 20,
        search,
        ...(active !== 'all' && { active: active === 'active' })
      }
      
      const response = await api.newsletter.getSubscribers(params)
      
      if (response.success) {
        setSubscribers(response.data)
        setTotalPages(response.pagination.pages)
        setTotalSubscribers(response.total)
      } else {
        setError('Failed to fetch subscribers')
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      setError('Failed to fetch subscribers')
    } finally {
      setLoading(false)
    }
  }

  // Fetch newsletters
  const fetchNewsletters = async () => {
    try {
      setLoading(true)
      const response = await api.newsletter.getNewsletters()
      
      if (response.success) {
        setNewsletters(response.data)
      } else {
        setError('Failed to fetch newsletters')
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error)
      setError('Failed to fetch newsletters')
    } finally {
      setLoading(false)
    }
  }

  // Send newsletter
  const handleSendNewsletter = async (newsletterId) => {
    if (!confirm('Are you sure you want to send this newsletter to all subscribers?')) {
      return
    }

    try {
      setLoading(true)
      const response = await api.newsletter.sendNewsletter(newsletterId)
      
      if (response.success) {
        alert(`Newsletter sent successfully! ${response.data.totalSent} emails sent.`)
        fetchNewsletters() // Refresh the list
      } else {
        alert('Failed to send newsletter: ' + response.message)
      }
    } catch (error) {
      console.error('Error sending newsletter:', error)
      alert('Failed to send newsletter: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'subscribers') {
      fetchSubscribers(currentPage, searchTerm, activeFilter)
    } else {
      fetchNewsletters()
    }
  }, [currentPage, searchTerm, activeFilter, activeTab])

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  // Export subscribers
  const handleExport = async () => {
    try {
      const response = await api.newsletter.getSubscribers({ 
        active: activeFilter !== 'all' ? activeFilter === 'active' : undefined,
        search: searchTerm,
        limit: 1000 // Get all for export
      })
      
      if (response.success) {
        const csvContent = [
          ['Email', 'Name', 'Subscription Date', 'Status', 'Source'].join(','),
          ...response.data.map(sub => [
            sub.email,
            sub.name || '',
            new Date(sub.subscriptionDate).toLocaleDateString(),
            sub.isActive ? 'Active' : 'Inactive',
            sub.source || 'website'
          ].join(','))
        ].join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting subscribers:', error)
      alert('Failed to export subscribers')
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading && subscribers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Management</h1>
        <p className="text-gray-600">Manage your newsletter subscribers and send newsletters.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscribers'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaUserCheck className="inline mr-2" />
              Subscribers ({totalSubscribers})
            </button>
            <button
              onClick={() => setActiveTab('newsletters')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'newsletters'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaPaperPlane className="inline mr-2" />
              Newsletters ({newsletters.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <FaUserCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{totalSubscribers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaUserCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">
                {subscribers.filter(sub => sub.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FaUserTimes className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Inactive Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">
                {subscribers.filter(sub => !sub.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex space-x-2">
                {['all', 'active', 'inactive'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeFilter === filter
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaDownload className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subscriber.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subscriber.name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(subscriber.subscriptionDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      subscriber.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriber.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {subscriber.source || 'website'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalSubscribers)} of {totalSubscribers} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {!loading && subscribers.length === 0 && (
        <div className="text-center py-12">
          <FaUserCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No subscribers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || activeFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No one has subscribed to the newsletter yet.'
            }
          </p>
        </div>
      )}
        </>
      )}

      {/* Newsletters Tab */}
      {activeTab === 'newsletters' && (
        <div className="space-y-6">
          {/* Create Newsletter Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowNewsletterModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              <FaPlus className="mr-2" />
              Create Newsletter
            </button>
          </div>

          {/* Newsletters List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Newsletter Campaigns</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {newsletters.map((newsletter) => (
                    <tr key={newsletter._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {newsletter.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {newsletter.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          newsletter.status === 'sent'
                            ? 'bg-green-100 text-green-800'
                            : newsletter.status === 'scheduled'
                            ? 'bg-yellow-100 text-yellow-800'
                            : newsletter.status === 'sending'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {newsletter.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {newsletter.stats?.totalRecipients || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(newsletter.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {newsletter.status === 'draft' && (
                            <button
                              onClick={() => handleSendNewsletter(newsletter._id)}
                              className="text-green-600 hover:text-green-900"
                              title="Send Newsletter"
                            >
                              <FaPaperPlane />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedNewsletter(newsletter)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {newsletters.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaPaperPlane className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No newsletters found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create your first newsletter to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-6">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Newsletter Form Modal */}
      <NewsletterForm
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
        onSuccess={() => {
          fetchNewsletters()
          alert('Newsletter created successfully!')
        }}
      />
    </div>
  )
}

export default Newsletter