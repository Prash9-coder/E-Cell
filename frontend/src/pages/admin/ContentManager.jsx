import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContentType } from '../../context/ContentContext';
import ContentManagerComponent from '../../components/admin/ContentManager';
import ContentForm from '../../components/admin/ContentForm';

// Content type configurations
const contentTypeConfig = {
  events: {
    title: 'Events',
    addButtonText: 'Add Event',
    searchPlaceholder: 'Search events...',
    columns: [
      { key: 'title', label: 'Event Title' },
      { key: 'date', label: 'Date', render: (item) => (
        <div className="text-sm text-gray-500">
          {new Date(item.date).toLocaleDateString()}
        </div>
      )},
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status', render: (item) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          item.status === 'Upcoming' 
            ? 'bg-green-100 text-green-800' 
            : item.status === 'Ongoing'
            ? 'bg-blue-100 text-blue-800'
            : item.status === 'Completed'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {item.status}
        </span>
      )},
      { key: 'registrations', label: 'Registrations' }
    ],
    fields: [
      { name: 'title', label: 'Event Title', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [
        { value: 'Upcoming', label: 'Upcoming' },
        { value: 'Ongoing', label: 'Ongoing' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Cancelled', label: 'Cancelled' }
      ]},
      { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 3 },
      { name: 'longDescription', label: 'Long Description', type: 'textarea', required: true, rows: 5 },
      { name: 'time', label: 'Time', type: 'text', defaultValue: '09:00 AM - 05:00 PM' },
      { name: 'category', label: 'Category', type: 'select', defaultValue: 'workshop', options: [
        { value: 'workshop', label: 'Workshop' },
        { value: 'competition', label: 'Competition' },
        { value: 'speaker', label: 'Speaker Session' },
        { value: 'networking', label: 'Networking' },
        { value: 'hackathon', label: 'Hackathon' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'isFeatured', label: 'Featured Event', type: 'checkbox' }
    ]
  },
  blog: {
    title: 'Blog Posts',
    addButtonText: 'Add Post',
    searchPlaceholder: 'Search blog posts...',
    columns: [
      { key: 'title', label: 'Post Title' },
      { key: 'author', label: 'Author' },
      { key: 'category', label: 'Category' },
      { key: 'publishDate', label: 'Published', render: (item) => (
        <div className="text-sm text-gray-500">
          {new Date(item.publishDate).toLocaleDateString()}
        </div>
      )},
      { key: 'status', label: 'Status', render: (item) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          item.status === 'Published' 
            ? 'bg-green-100 text-green-800' 
            : item.status === 'Draft'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {item.status}
        </span>
      )}
    ],
    fields: [
      { name: 'title', label: 'Post Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'author', label: 'Author', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'startup', label: 'Startup' },
        { value: 'technology', label: 'Technology' },
        { value: 'entrepreneurship', label: 'Entrepreneurship' },
        { value: 'innovation', label: 'Innovation' },
        { value: 'events', label: 'Events' }
      ]},
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true, rows: 2 },
      { name: 'content', label: 'Content', type: 'textarea', required: true, rows: 10 },
      { name: 'publishDate', label: 'Publish Date', type: 'date', required: true },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [
        { value: 'Published', label: 'Published' },
        { value: 'Draft', label: 'Draft' },
        { value: 'Archived', label: 'Archived' }
      ]},
      { name: 'featured', label: 'Featured Post', type: 'checkbox' }
    ]
  },
  startups: {
    title: 'Startups',
    addButtonText: 'Add Startup',
    searchPlaceholder: 'Search startups...',
    columns: [
      { key: 'name', label: 'Startup Name' },
      { key: 'founder', label: 'Founder' },
      { key: 'category', label: 'Category' },
      { key: 'foundedYear', label: 'Founded' },
      { key: 'status', label: 'Status', render: (item) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          item.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : item.status === 'Incubating'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {item.status}
        </span>
      )}
    ],
    fields: [
      { name: 'name', label: 'Startup Name', type: 'text', required: true },
      { name: 'founder', label: 'Founder', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'tech', label: 'Technology' },
        { value: 'health', label: 'Healthcare' },
        { value: 'education', label: 'Education' },
        { value: 'finance', label: 'Finance' },
        { value: 'ecommerce', label: 'E-Commerce' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 3 },
      { name: 'foundedYear', label: 'Founded Year', type: 'number', required: true },
      { name: 'website', label: 'Website', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [
        { value: 'Active', label: 'Active' },
        { value: 'Incubating', label: 'Incubating' },
        { value: 'Graduated', label: 'Graduated' },
        { value: 'Inactive', label: 'Inactive' }
      ]},
      { name: 'featured', label: 'Featured Startup', type: 'checkbox' }
    ]
  },
  gallery: {
    title: 'Gallery',
    addButtonText: 'Add Image',
    searchPlaceholder: 'Search gallery...',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'event', label: 'Event' },
      { key: 'date', label: 'Date', render: (item) => (
        <div className="text-sm text-gray-500">
          {new Date(item.date).toLocaleDateString()}
        </div>
      )},
      { key: 'category', label: 'Category' }
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'event', label: 'Event', type: 'text' },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'events', label: 'Events' },
        { value: 'workshops', label: 'Workshops' },
        { value: 'competitions', label: 'Competitions' },
        { value: 'team', label: 'Team' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
      { name: 'featured', label: 'Featured Image', type: 'checkbox' }
    ]
  },
  team: {
    title: 'Team Members',
    addButtonText: 'Add Member',
    searchPlaceholder: 'Search team members...',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'position', label: 'Position' },
      { key: 'department', label: 'Department' },
      { key: 'year', label: 'Year' },
      { key: 'status', label: 'Status', render: (item) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          item.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {item.status}
        </span>
      )}
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'position', label: 'Position', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'select', required: true, options: [
        { value: 'core', label: 'Core Team' },
        { value: 'technical', label: 'Technical' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'events', label: 'Events' },
        { value: 'content', label: 'Content' },
        { value: 'design', label: 'Design' },
        { value: 'operations', label: 'Operations' }
      ]},
      { name: 'year', label: 'Year', type: 'select', required: true, options: [
        { value: '1', label: '1st Year' },
        { value: '2', label: '2nd Year' },
        { value: '3', label: '3rd Year' },
        { value: '4', label: '4th Year' },
        { value: 'alumni', label: 'Alumni' }
      ]},
      { name: 'bio', label: 'Bio', type: 'textarea', rows: 2 },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'linkedin', label: 'LinkedIn', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [
        { value: 'Active', label: 'Active' },
        { value: 'Alumni', label: 'Alumni' },
        { value: 'Inactive', label: 'Inactive' }
      ]}
    ]
  }
};

const ContentManagerPage = () => {
  const { contentType } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  
  // Get content from context
  const { items, loading, error, add, update, remove } = useContentType(contentType);

  // Set config based on content type
  useEffect(() => {
    const typeConfig = contentTypeConfig[contentType];
    if (!typeConfig) {
      navigate('/admin/dashboard');
      return;
    }
    setConfig(typeConfig);
  }, [contentType, navigate]);

  // If no config is available, show loading
  if (!config) {
    return <div className="p-6">Loading...</div>;
  }

  // Handle add item
  const handleAdd = async (formData) => {
    await add(formData);
    return true;
  };

  // Handle edit item
  const handleEdit = async (item, formData) => {
    const id = item._id || item.id;
    await update(id, formData);
    return true;
  };

  // Handle delete item
  const handleDelete = async (item) => {
    const id = item._id || item.id;
    await remove(id);
    return true;
  };

  // Render form for adding/editing items
  const renderForm = ({ currentItem, onSubmit, onCancel }) => {
    return (
      <ContentForm
        currentItem={currentItem}
        onSubmit={onSubmit}
        onCancel={onCancel}
        fields={config.fields}
        title={config.title}
        submitText={currentItem ? 'Update' : 'Add'}
      />
    );
  };

  return (
    <ContentManagerComponent
      items={items}
      columns={config.columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      loading={loading}
      error={error}
      title={config.title}
      addButtonText={config.addButtonText}
      searchPlaceholder={config.searchPlaceholder}
      renderForm={renderForm}
    />
  );
};

export default ContentManagerPage;