import { useState, useEffect, useRef } from 'react';
import { FaUpload, FaFolder, FaImage, FaFile, FaTrash, FaCopy, FaSearch, FaFolderPlus } from 'react-icons/fa';

const MediaManager = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState(['images', 'documents', 'videos']);
  const [currentFolder, setCurrentFolder] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  const fileInputRef = useRef(null);

  // Mock data for files
  const mockFiles = [
    { id: 1, name: 'hero-image.jpg', type: 'image/jpeg', size: 1024000, url: '/images/hero-image.jpg', folder: 'images', uploadedAt: '2023-05-15T10:30:00Z' },
    { id: 2, name: 'about-banner.jpg', type: 'image/jpeg', size: 2048000, url: '/images/about-banner.jpg', folder: 'images', uploadedAt: '2023-05-16T14:20:00Z' },
    { id: 3, name: 'team-photo.jpg', type: 'image/jpeg', size: 3072000, url: '/images/team-photo.jpg', folder: 'images', uploadedAt: '2023-05-17T09:15:00Z' },
    { id: 4, name: 'event-flyer.pdf', type: 'application/pdf', size: 512000, url: '/documents/event-flyer.pdf', folder: 'documents', uploadedAt: '2023-05-18T11:45:00Z' },
    { id: 5, name: 'annual-report.pdf', type: 'application/pdf', size: 1536000, url: '/documents/annual-report.pdf', folder: 'documents', uploadedAt: '2023-05-19T16:30:00Z' },
    { id: 6, name: 'promo-video.mp4', type: 'video/mp4', size: 10240000, url: '/videos/promo-video.mp4', folder: 'videos', uploadedAt: '2023-05-20T13:10:00Z' },
  ];

  // Fetch files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        setFiles(mockFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
        setError('Failed to load files. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, []);

  // Filter files based on current folder and search term
  const filteredFiles = files.filter(file => {
    const matchesFolder = !currentFolder || file.folder === currentFolder;
    const matchesSearch = !searchTerm || file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  // Handle file upload
  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (uploadedFiles.length === 0) return;
    
    try {
      setUploading(true);
      setError(null);
      
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFiles = uploadedFiles.map((file, index) => ({
        id: files.length + index + 1,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        folder: currentFolder || 'images',
        uploadedAt: new Date().toISOString()
      }));
      
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId) 
        : [...prev, fileId]
    );
  };

  // Handle file deletion
  const handleDeleteFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) {
      try {
        // Simulate deletion
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setFiles(prevFiles => prevFiles.filter(file => !selectedFiles.includes(file.id)));
        setSelectedFiles([]);
      } catch (error) {
        console.error('Error deleting files:', error);
        setError('Failed to delete files. Please try again.');
      }
    }
  };

  // Handle folder creation
  const handleCreateFolder = () => {
    const trimmedName = newFolderName.trim();
    if (!trimmedName) return;
    
    if (folders.includes(trimmedName)) {
      setError('Folder already exists.');
      return;
    }
    
    setFolders(prev => [...prev, trimmedName]);
    setNewFolderName('');
    setShowNewFolderInput(false);
  };

  // Handle URL copy
  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL:', err);
        setError('Failed to copy URL to clipboard.');
      });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <FaImage className="text-blue-500" />;
    } else if (fileType.startsWith('video/')) {
      return <FaFile className="text-red-500" />;
    } else {
      return <FaFile className="text-gray-500" />;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-medium text-gray-900">Media Library</h3>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowNewFolderInput(true)}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center text-sm"
            disabled={showNewFolderInput}
          >
            <FaFolderPlus className="mr-2" /> New Folder
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
            disabled={uploading}
          >
            <FaUpload className="mr-2" /> {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            multiple
          />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* New Folder Input */}
      {showNewFolderInput && (
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="flex-grow shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateFolder}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewFolderInput(false);
                setNewFolderName('');
                setError(null);
              }}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-md font-medium text-gray-900">Folders</h2>
          </div>
          <nav className="p-2">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setCurrentFolder('')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    currentFolder === ''
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaFolder className="mr-3 text-gray-500" />
                  All Files
                </button>
              </li>
              {folders.map((folder) => (
                <li key={folder}>
                  <button
                    onClick={() => setCurrentFolder(folder)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      currentFolder === folder
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaFolder className="mr-3 text-gray-500" />
                    {folder}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Content */}
        <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-md font-medium text-gray-900">
              {currentFolder ? `${currentFolder} (${filteredFiles.length})` : `All Files (${filteredFiles.length})`}
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {selectedFiles.length > 0 && (
                <button
                  onClick={handleDeleteFiles}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center text-sm w-full sm:w-auto"
                >
                  <FaTrash className="mr-2" /> Delete ({selectedFiles.length})
                </button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No files found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                        onChange={() => {
                          if (selectedFiles.length === filteredFiles.length) {
                            setSelectedFiles([]);
                          } else {
                            setSelectedFiles(filteredFiles.map(file => file.id));
                          }
                        }}
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className={selectedFiles.includes(file.id) ? 'bg-primary-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => handleFileSelect(file.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                            {file.type.startsWith('image/') ? (
                              <img 
                                src={file.url} 
                                alt={file.name} 
                                className="h-8 w-8 object-cover rounded"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUtaW1hZ2UiPjxyZWN0IHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgeD0iMyIgeT0iMyIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiPjwvcG9seWxpbmU+PC9zdmc+';
                                }}
                              />
                            ) : (
                              getFileIcon(file.type)
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</div>
                            <div className="text-sm text-gray-500">{file.folder}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{file.type.split('/')[1].toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatFileSize(file.size)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(file.uploadedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleCopyUrl(file.url)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                          title="Copy URL"
                        >
                          <FaCopy />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFiles([file.id]);
                            setTimeout(handleDeleteFiles, 0);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Copied URL notification */}
      {copiedUrl && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300">
          URL copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default MediaManager;