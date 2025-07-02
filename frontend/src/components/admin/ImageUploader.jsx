import { useState, useRef, useEffect } from 'react';
import { FaUpload, FaImage } from 'react-icons/fa';

/**
 * Reusable image uploader component for admin forms
 * 
 * @param {Object} props
 * @param {Function} props.onImageChange - Callback when image is selected
 * @param {string} props.currentImage - Current image URL (if editing)
 * @param {string} props.label - Label for the image field
 * @param {boolean} props.required - Whether the image is required
 */
const ImageUploader = ({ 
  onImageChange, 
  currentImage = null, 
  label = "Image", 
  required = false,
  helpText = "Upload an image (JPG, PNG, GIF up to 5MB)"
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Set initial preview if currentImage exists
  useEffect(() => {
    if (currentImage) {
      setImagePreview(currentImage);
    }
  }, [currentImage]);
  
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller image.');
      fileInputRef.current.value = '';
      return;
    }
    
    // Create a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // Call the parent component's callback
    onImageChange(file);
  };
  
  // Clear the selected image
  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageChange(null);
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Image preview */}
      {imagePreview && (
        <div className="mt-2 mb-4 relative group">
          <img 
            src={imagePreview} 
            alt="Preview"
            className="h-40 w-auto object-cover rounded-md border border-gray-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={clearImage}
              className="bg-white text-red-600 p-2 rounded-full"
              title="Remove Image"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      
      {/* File input */}
      <div className="mt-1 flex items-center">
        <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <FaUpload className="mr-2" />
          {imagePreview ? 'Change Image' : 'Upload Image'}
          <input
            type="file"
            ref={fileInputRef}
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
            required={required && !imagePreview}
          />
        </label>
        {!imagePreview && (
          <div className="ml-4 flex items-center text-sm text-gray-500">
            <FaImage className="mr-1" />
            {helpText}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;