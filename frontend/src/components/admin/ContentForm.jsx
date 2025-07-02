import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageUploader from './ImageUploader';

/**
 * A reusable form component for adding/editing content
 * 
 * @param {Object} props
 * @param {Object|null} props.currentItem - The current item being edited (null for new items)
 * @param {Function} props.onSubmit - Function to call when the form is submitted
 * @param {Function} props.onCancel - Function to call when the form is cancelled
 * @param {Array} props.fields - The fields to display in the form
 * @param {string} props.title - Title of the form
 * @param {string} props.submitText - Text for the submit button
 */
const ContentForm = ({
  currentItem = null,
  onSubmit,
  onCancel,
  fields = [],
  title = 'Add/Edit Content',
  submitText = 'Save'
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize form data from current item
  useEffect(() => {
    const initialData = {};
    
    fields.forEach(field => {
      if (currentItem) {
        // Use currentItem value if exists, otherwise fallback to defaultValue or empty string
        initialData[field.name] = currentItem[field.name] ?? field.defaultValue ?? '';
      } else {
        // Use defaultValue if specified, otherwise empty string
        initialData[field.name] = field.defaultValue ?? '';
      }
      
      // Handle checkbox specifically since unchecked boxes would be undefined
      if (field.type === 'checkbox') {
        initialData[field.name] = currentItem 
          ? currentItem[field.name] ?? false 
          : field.defaultValue ?? false;
      }
    });
    
    setFormData(initialData);
  }, [currentItem, fields]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    const updatedValue = type === 'checkbox' 
      ? checked 
      : type === 'file' 
        ? files[0] 
        : value;

    setFormData(prev => ({
      ...prev,
      [name]: updatedValue
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    let isValid = true;
    
    fields.forEach(field => {
      if (field.required) {
        const value = formData[field.name];
        if (
          value === undefined || 
          value === null || 
          (typeof value === 'string' && !value.trim()) ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newErrors[field.name] = field.errorMessage || `${field.label} is required`;
          isValid = false;
        }
      }
      
      // Add custom validation if provided
      if (field.validate && !newErrors[field.name]) {
        const validationError = field.validate(formData[field.name], formData);
        if (validationError) {
          newErrors[field.name] = validationError;
          isValid = false;
        }
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    // Submit form if valid
    onSubmit(formData);
  };

  // Render form field based on type
  const renderField = (field) => {
    const { 
      name, 
      label, 
      type = 'text', 
      options = [], 
      placeholder, 
      required = false,
      rows,
      className = ''
    } = field;
    
    const baseClasses = `mt-1 block w-full border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500`;
    const fieldClasses = `${baseClasses} ${className}`;
    
    const commonProps = {
      id: name,
      name,
      onChange: handleChange,
      required,
      'aria-invalid': errors[name] ? 'true' : 'false',
      'aria-describedby': errors[name] ? `${name}-error` : undefined
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows || 3}
            className={fieldClasses}
            value={formData[name] ?? ''}
            placeholder={placeholder}
          />
        );
      
      case 'select':
        return (
          <select
            {...commonProps}
            className={fieldClasses}
            value={formData[name] ?? ''}
          >
            {field.emptyOption && (
              <option value="">{field.emptyOption}</option>
            )}
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        case 'radio':
        return (
          <div className="flex items-center">
            <input
              {...commonProps}
              type={type}
              className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded`}
              checked={!!formData[name]}
            />
            <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
              {label}
            </label>
          </div>
        );
      
      case 'date':
      case 'datetime-local':
      case 'time':
      case 'number':
      case 'email':
      case 'password':
      case 'url':
        return (
          <input
            {...commonProps}
            type={type}
            className={fieldClasses}
            value={formData[name] ?? ''}
            placeholder={placeholder}
          />
        );
      
      case 'file':
        return (
          <input
            {...commonProps}
            type="file"
            className={fieldClasses}
            // Value is read-only for file inputs
          />
        );
        
      case 'image':
        return (
          <ImageUploader
            onImageChange={(file) => {
              setFormData(prev => ({
                ...prev,
                [name]: file
              }));
            }}
            currentImage={field.currentImage || formData[name]}
            label={label}
            helpText={field.helpText || "Upload an image (JPG, PNG, GIF up to 5MB)"}
          />
        );
      
      case 'hidden':
        return (
          <input
            {...commonProps}
            type="hidden"
            value={formData[name] ?? ''}
          />
        );
      
      default: // text and other types
        return (
          <input
            {...commonProps}
            type={type}
            className={fieldClasses}
            value={formData[name] ?? ''}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {currentItem ? `Edit ${title}` : `Add New ${title}`}
        </h3>
        <div className="space-y-4">
          {fields.map(field => (
            field.type !== 'hidden' && (
              <div 
                key={field.name} 
                className={['checkbox', 'radio'].includes(field.type) ? '' : 'flex flex-col'}
              >
                {!['checkbox', 'radio', 'hidden'].includes(field.type) && (
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                )}
                {renderField(field)}
                {errors[field.name] && (
                  <p id={`${field.name}-error`} className="mt-1 text-sm text-red-500">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            )
          ))}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          {submitText}
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

ContentForm.propTypes = {
  currentItem: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf([
        'text', 'textarea', 'select', 'checkbox', 'radio', 
        'date', 'datetime-local', 'time', 'number', 'email', 
        'password', 'url', 'file', 'hidden'
      ]),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.any.isRequired,
          label: PropTypes.string.isRequired
        })
      ),
      placeholder: PropTypes.string,
      required: PropTypes.bool,
      defaultValue: PropTypes.any,
      validate: PropTypes.func,
      errorMessage: PropTypes.string,
      rows: PropTypes.number,
      emptyOption: PropTypes.string,
      className: PropTypes.string
    })
  ).isRequired,
  title: PropTypes.string,
  submitText: PropTypes.string
};

export default ContentForm;