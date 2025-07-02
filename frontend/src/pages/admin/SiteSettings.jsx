import { useState, useEffect, useRef } from 'react';
import { FaSave, FaUndo, FaExclamationTriangle, FaUpload, FaImage } from 'react-icons/fa';
import ImageUploader from '../../components/admin/ImageUploader';

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'E-Cell',
      siteDescription: 'Entrepreneurship Cell',
      contactEmail: 'contact@gmail.com',
      contactPhone: '+91 6300472707',
      address: 'E-Cell Office, Main Building, College Campus',
      logo: '/images/logo.png',
      favicon: '/images/favicon.ico'
    },
    social: {
      facebook: 'https://facebook.com/your_ecell',
      instagram: 'https://instagram.com/your_ecell',
      twitter: 'https://twitter.com/your_ecell',
      linkedin: 'https://linkedin.com/company/your_ecell',
      youtube: 'https://youtube.com/channel/your_ecell'
    },
    homepage: {
      heroTitle: 'Welcome to E-Cell',
      heroSubtitle: 'Fostering Innovation and Entrepreneurship',
      featuredEventsCount: 3,
      featuredStartupsCount: 4,
      showTestimonials: true
    },
    footer: {
      copyrightText: '© 2024 E-Cell. All rights reserved.',
      showSocialLinks: true,
      showQuickLinks: true,
      showContactInfo: true
    },
    seo: {
      metaTitle: 'E-Cell - Entrepreneurship Cell',
      metaDescription: 'Fostering innovation and entrepreneurship among students',
      ogImage: '/images/og-image.jpg',
      googleAnalyticsId: ''
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [originalSettings, setOriginalSettings] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  // Tabs configuration
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'social', label: 'Social Media' },
    { id: 'homepage', label: 'Homepage' },
    { id: 'footer', label: 'Footer' },
    { id: 'seo', label: 'SEO & Analytics' }
  ];

  // Load settings on component mount
  useEffect(() => {
    // In a real app, you would fetch settings from an API
    // For now, we'll just use the default settings
    setOriginalSettings(settings);
  }, []);

  // Handle input change
  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setSaved(false);
  };
  
  // Handle logo image change
  const handleLogoChange = (file) => {
    setLogoFile(file);
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      handleChange('general', 'logo', logoUrl);
    }
  };
  
  // Handle favicon image change
  const handleFaviconChange = (file) => {
    setFaviconFile(file);
    if (file) {
      const faviconUrl = URL.createObjectURL(file);
      handleChange('general', 'favicon', faviconUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real app, you would save settings to an API with FormData for file uploads
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create FormData for file uploads in a real implementation
      const formData = new FormData();
      
      // Add all settings as JSON
      formData.append('settings', JSON.stringify(settings));
      
      // Add logo and favicon files if they exist
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      if (faviconFile) {
        formData.append('favicon', faviconFile);
      }
      
      console.log('Settings saved:', settings);
      console.log('Logo file:', logoFile ? 'Uploaded' : 'Not changed');
      console.log('Favicon file:', faviconFile ? 'Uploaded' : 'Not changed');
      
      // In a real app, you would send formData to your API
      // const response = await api.settings.update(formData);
      
      setOriginalSettings(settings);
      setSaved(true);
      
      // Reset file states after successful save
      setLogoFile(null);
      setFaviconFile(null);
      
      // Reset saved status after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset settings to original values
  const handleReset = () => {
    setSettings(originalSettings);
    setSaved(false);
  };

  // Check if settings have been modified
  const isModified = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  // Render form fields based on active tab
  const renderFields = () => {
    const sectionData = settings[activeTab];
    
    if (!sectionData) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No settings found for this section.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {Object.entries(sectionData).map(([field, value]) => {
          const fieldId = `${activeTab}-${field}`;
          const fieldLabel = field
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
          
          // Determine field type based on value
          const fieldType = typeof value === 'boolean' ? 'checkbox' : 'text';
          
          // Special handling for logo and favicon fields
          if (field === 'logo' && activeTab === 'general') {
            return (
              <div key={fieldId} className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                <ImageUploader
                  onImageChange={handleLogoChange}
                  currentImage={value}
                  label="Site Logo"
                  helpText="Upload a logo (PNG, SVG recommended, max 2MB)"
                />
              </div>
            );
          } else if (field === 'favicon' && activeTab === 'general') {
            return (
              <div key={fieldId} className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Favicon
                </label>
                <ImageUploader
                  onImageChange={handleFaviconChange}
                  currentImage={value}
                  label="Site Favicon"
                  helpText="Upload a favicon (ICO, PNG, max 1MB)"
                />
              </div>
            );
          }
          
          // Default field rendering
          return (
            <div key={fieldId} className="col-span-1">
              <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
                {fieldLabel}
              </label>
              
              {fieldType === 'checkbox' ? (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={fieldId}
                    checked={value}
                    onChange={(e) => handleChange(activeTab, field, e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={fieldId} className="ml-2 block text-sm text-gray-900">
                    {value ? 'Enabled' : 'Disabled'}
                  </label>
                </div>
              ) : (
                <input
                  type={typeof value === 'number' ? 'number' : 'text'}
                  id={fieldId}
                  value={value}
                  onChange={(e) => {
                    const newValue = typeof value === 'number' 
                      ? parseInt(e.target.value, 10) 
                      : e.target.value;
                    handleChange(activeTab, field, newValue);
                  }}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <div className="flex space-x-2">
          {isModified && (
            <button
              type="button"
              onClick={handleReset}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center"
              disabled={loading}
            >
              <FaUndo className="mr-2" /> Reset
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
            disabled={loading || !isModified}
          >
            <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      
      {saved && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">Settings saved successfully!</p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {isModified && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have unsaved changes. Make sure to save before leaving this page.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {renderFields()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;