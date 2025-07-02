import { useState } from 'react'
import { FaSave, FaGlobe, FaEnvelope, FaKey, FaDatabase, FaCloudUploadAlt, FaTrash, FaPalette, FaDesktop } from 'react-icons/fa'
import SiteSettings from './SiteSettings'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Mock settings data
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'E-Cell',
    siteDescription: 'Entrepreneurship Cell - Fostering innovation and entrepreneurship',
    contactEmail: 'contact@gmail.com',
    phoneNumber: '+91 1234567890',
    address: 'University Campus, New Delhi, India',
    socialLinks: {
      facebook: 'https://facebook.com/ecell',
      instagram: 'https://instagram.com/ecell',
      linkedin: 'https://linkedin.com/company/ecell'
    }
  })

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would call an API to save the settings
    
    // Show success message
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
    }, 3000)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Settings saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
                activeTab === 'general'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('general')}
            >
              <FaGlobe className="inline mr-2" />
              General
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
                activeTab === 'email'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('email')}
            >
              <FaEnvelope className="inline mr-2" />
              Email
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('security')}
            >
              <FaKey className="inline mr-2" />
              Security
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
                activeTab === 'database'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('database')}
            >
              <FaDatabase className="inline mr-2" />
              Database
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
                activeTab === 'site-content'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('site-content')}
            >
              <FaDesktop className="inline mr-2" />
              Site Content
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Site Content Settings */}
          {activeTab === 'site-content' && (
            <SiteSettings />
          )}
          
          {/* General Settings */}
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                        Site Name
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={generalSettings.siteName}
                        onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                        Site Description
                      </label>
                      <input
                        type="text"
                        id="siteDescription"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={generalSettings.siteDescription}
                        onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={generalSettings.contactEmail}
                        onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phoneNumber"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={generalSettings.phoneNumber}
                        onChange={(e) => setGeneralSettings({...generalSettings, phoneNumber: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                  ></textarea>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Social Media Links</h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                        Facebook
                      </label>
                      <input
                        type="url"
                        id="facebook"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={generalSettings.socialLinks.facebook}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings, 
                          socialLinks: {...generalSettings.socialLinks, facebook: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                        Twitter
                      </label>
                      <input
                        type="url"
                        id="twitter"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={generalSettings.socialLinks.twitter}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings, 
                          socialLinks: {...generalSettings.socialLinks, twitter: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                        Instagram
                      </label>
                      <input
                        type="url"
                        id="instagram"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={generalSettings.socialLinks.instagram}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings, 
                          socialLinks: {...generalSettings.socialLinks, instagram: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        id="linkedin"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={generalSettings.socialLinks.linkedin}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings, 
                          socialLinks: {...generalSettings.socialLinks, linkedin: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Logo & Favicon</h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Site Logo
                      </label>
                      <div className="mt-2 flex items-center">
                        <span className="inline-block h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                          <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain" />
                        </span>
                        <button
                          type="button"
                          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Favicon
                      </label>
                      <div className="mt-2 flex items-center">
                        <span className="inline-block h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                          <img src="/favicon.ico" alt="Favicon" className="h-full w-full object-contain" />
                        </span>
                        <button
                          type="button"
                          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaSave className="mr-2" /> Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700">
                        SMTP Server
                      </label>
                      <input
                        type="text"
                        id="smtpServer"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="smtp.example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        id="smtpPort"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="587"
                      />
                    </div>
                    <div>
                      <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        id="smtpUsername"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="user@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                        SMTP Password
                      </label>
                      <input
                        type="password"
                        id="smtpPassword"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="password"
                      />
                    </div>
                    <div>
                      <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700">
                        From Email
                      </label>
                      <input
                        type="email"
                        id="fromEmail"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="noreply@gmail.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="fromName" className="block text-sm font-medium text-gray-700">
                        From Name
                      </label>
                      <input
                        type="text"
                        id="fromName"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="E-Cell Team"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="useSMTP"
                        name="useSMTP"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="useSMTP" className="font-medium text-gray-700">Use SMTP for sending emails</label>
                      <p className="text-gray-500">If unchecked, the system will use the default mail function.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Email Templates</h4>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-md p-4">
                      <h5 className="font-medium text-gray-700 mb-2">Welcome Email</h5>
                      <p className="text-sm text-gray-500 mb-2">Sent to new users when they register.</p>
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        Edit Template
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4">
                      <h5 className="font-medium text-gray-700 mb-2">Password Reset</h5>
                      <p className="text-sm text-gray-500 mb-2">Sent when users request a password reset.</p>
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        Edit Template
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4">
                      <h5 className="font-medium text-gray-700 mb-2">Event Registration</h5>
                      <p className="text-sm text-gray-500 mb-2">Sent to confirm event registrations.</p>
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        Edit Template
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Test Email
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaSave className="mr-2" /> Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="twoFactorAuth"
                            name="twoFactorAuth"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="twoFactorAuth" className="font-medium text-gray-700">Enable Two-Factor Authentication</label>
                          <p className="text-gray-500">Require admins to use 2FA when logging in.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="loginAttempts"
                            name="loginAttempts"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="loginAttempts" className="font-medium text-gray-700">Limit Login Attempts</label>
                          <p className="text-gray-500">Lock accounts after multiple failed login attempts.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        id="maxLoginAttempts"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="5"
                        min="1"
                        max="10"
                      />
                    </div>
                    <div>
                      <label htmlFor="lockoutTime" className="block text-sm font-medium text-gray-700">
                        Account Lockout Time (minutes)
                      </label>
                      <input
                        type="number"
                        id="lockoutTime"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="30"
                        min="5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Password Policy</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="strongPasswords"
                            name="strongPasswords"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="strongPasswords" className="font-medium text-gray-700">Require Strong Passwords</label>
                          <p className="text-gray-500">Passwords must include uppercase, lowercase, numbers, and special characters.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="minPasswordLength" className="block text-sm font-medium text-gray-700">
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        id="minPasswordLength"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="8"
                        min="6"
                        max="20"
                      />
                    </div>
                    <div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="passwordExpiry"
                            name="passwordExpiry"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="passwordExpiry" className="font-medium text-gray-700">Password Expiry</label>
                          <p className="text-gray-500">Force users to change passwords periodically.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="passwordExpiryDays" className="block text-sm font-medium text-gray-700">
                        Password Expiry Days
                      </label>
                      <input
                        type="number"
                        id="passwordExpiryDays"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="90"
                        min="30"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">API Security</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="enableAPI"
                            name="enableAPI"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="enableAPI" className="font-medium text-gray-700">Enable API Access</label>
                          <p className="text-gray-500">Allow external applications to access the API.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                        API Key
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          id="apiKey"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                          defaultValue="sk_test_51HZ3jKLkjhgfdsa987654321qwerty"
                          readOnly
                        />
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100"
                        >
                          Regenerate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaSave className="mr-2" /> Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Database Settings */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Database Settings</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Warning:</strong> Changing database settings may cause the application to stop working. Proceed with caution.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="dbHost" className="block text-sm font-medium text-gray-700">
                      Database Host
                    </label>
                    <input
                      type="text"
                      id="dbHost"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      defaultValue="localhost"
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="dbPort" className="block text-sm font-medium text-gray-700">
                      Database Port
                    </label>
                    <input
                      type="text"
                      id="dbPort"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      defaultValue="27017"
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="dbName" className="block text-sm font-medium text-gray-700">
                      Database Name
                    </label>
                    <input
                      type="text"
                      id="dbName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      defaultValue="ecell"
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="dbUser" className="block text-sm font-medium text-gray-700">
                      Database User
                    </label>
                    <input
                      type="text"
                      id="dbUser"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      defaultValue="ecell_user"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Database Maintenance</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div>
                      <h5 className="font-medium text-gray-700">Backup Database</h5>
                      <p className="text-sm text-gray-500">Create a backup of the current database.</p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <FaCloudUploadAlt className="mr-2" /> Backup Now
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div>
                      <h5 className="font-medium text-gray-700">Restore Database</h5>
                      <p className="text-sm text-gray-500">Restore from a previous backup.</p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Restore
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div>
                      <h5 className="font-medium text-gray-700">Optimize Database</h5>
                      <p className="text-sm text-gray-500">Optimize database performance and clean up unused data.</p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Optimize
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Recent Backups</h4>
                <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Filename
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ecell_backup_20240315.gz
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          March 15, 2024
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          24.5 MB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">Download</button>
                          <button className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ecell_backup_20240301.gz
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          March 1, 2024
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          23.8 MB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">Download</button>
                          <button className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ecell_backup_20240215.gz
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          February 15, 2024
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          22.1 MB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">Download</button>
                          <button className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings