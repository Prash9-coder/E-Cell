import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * A reusable content manager component for the admin panel
 * 
 * @param {Object} props
 * @param {Array} props.items - The items to display in the table
 * @param {Array} props.columns - The columns to display in the table
 * @param {Function} props.onAdd - Function to call when adding a new item
 * @param {Function} props.onEdit - Function to call when editing an item
 * @param {Function} props.onDelete - Function to call when deleting an item
 * @param {Function} props.onView - Function to call when viewing an item (optional)
 * @param {boolean} props.loading - Whether the data is loading
 * @param {string} props.error - Error message to display
 * @param {string} props.title - Title of the content manager
 * @param {string} props.addButtonText - Text for the add button
 * @param {string} props.searchPlaceholder - Placeholder for the search input
 * @param {Function} props.renderForm - Function to render the form for adding/editing items
 * @param {Object} props.pagination - Pagination information (optional)
 */
const ContentManager = ({
  items = [],
  columns = [],
  onAdd,
  onEdit,
  onDelete,
  onView,
  loading = false,
  error = null,
  title = 'Content Manager',
  addButtonText = 'Add New',
  searchPlaceholder = 'Search...',
  renderForm,
  pagination = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

  // Filter items based on search term
  const filterItems = useCallback(() => {
    if (!searchTerm.trim()) {
      return items;
    }

    const searchTermLower = searchTerm.toLowerCase();
    return items.filter(item => {
      return columns.some(column => {
        const value = item[column.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTermLower);
      });
    });
  }, [items, searchTerm, columns]);

  // Sort items based on sort configuration
  const sortItems = useCallback((itemsToSort) => {
    if (!sortConfig.key || sortConfig.direction === 'none') {
      return itemsToSort;
    }

    return [...itemsToSort].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [sortConfig]);

  // Update filtered and sorted items when dependencies change
  useEffect(() => {
    const filtered = filterItems();
    const sorted = sortItems(filtered);
    setFilteredItems(sorted);
  }, [items, searchTerm, sortConfig, filterItems, sortItems]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = 'none';
      }
    }
    setSortConfig({ key, direction });
  };

  // Handle add new item
  const handleAdd = () => {
    setCurrentItem(null);
    setShowModal(true);
  };

  // Handle edit item
  const handleEdit = (item) => {
    setCurrentItem(item);
    setShowModal(true);
  };

  // Handle delete item
  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
      try {
        await onDelete(item);
      } catch (error) {
        console.error(`Error deleting ${title.toLowerCase()}:`, error);
        alert(`Failed to delete ${title.toLowerCase()}: ${error.message || 'Unknown error'}`);
      }
    }
  };

  // Handle view item
  const handleView = (item) => {
    if (onView) {
      onView(item);
    }
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      if (currentItem) {
        // Update existing item
        await onEdit(currentItem, formData);
      } else {
        // Add new item
        await onAdd(formData);
      }
      setShowModal(false);
    } catch (error) {
      console.error(`Error saving ${title.toLowerCase()}:`, error);
      alert(`Failed to save ${title.toLowerCase()}: ${error.message || 'Unknown error'}`);
    }
  };

  // Get sort icon for column
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-300" />;
    if (sortConfig.direction === 'ascending') return <FaSortUp className="text-primary-500" />;
    if (sortConfig.direction === 'descending') return <FaSortDown className="text-primary-500" />;
    return <FaSort className="text-gray-300" />;
  };

  // Get unique identifier for items
  const getItemId = (item) => item.id || item._id || JSON.stringify(item);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={handleAdd}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
          disabled={loading}
        >
          <FaPlus className="mr-2" /> {addButtonText}
        </button>
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

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => column.sortable !== false && handleSort(column.key)}
                    >
                      <div className="flex items-center">
                        {column.label}
                        {column.sortable !== false && (
                          <span className="ml-1">
                            {getSortIcon(column.key)}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={getItemId(item)}>
                      {columns.map((column) => (
                        <td key={`${getItemId(item)}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                          {column.render ? column.render(item) : (
                            <div className="text-sm text-gray-900 truncate max-w-xs">
                              {item[column.key] !== undefined ? String(item[column.key]) : '—'}
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {onView && (
                          <button
                            onClick={() => handleView(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                            disabled={loading}
                          >
                            <FaEye />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                          disabled={loading}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                      No items found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{pagination.startItem}</span> to <span className="font-medium">{pagination.endItem}</span> of <span className="font-medium">{pagination.totalItems}</span> items
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              onClick={pagination.onPrevPage}
              disabled={pagination.currentPage === 1 || loading}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              // Show limited page numbers with ellipsis for many pages
              let page;
              if (pagination.totalPages <= 5) {
                page = i + 1;
              } else if (pagination.currentPage <= 3) {
                page = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                page = pagination.totalPages - 4 + i;
              } else {
                page = pagination.currentPage - 2 + i;
              }
              return (
                <button 
                  key={page}
                  className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${pagination.currentPage === page ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-gray-50'}`}
                  onClick={() => pagination.onPageChange(page)}
                  disabled={loading}
                >
                  {page}
                </button>
              );
            })}
            {pagination.totalPages > 5 && (
              <span className="px-2 py-1">...</span>
            )}
            <button 
              className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              onClick={pagination.onNextPage}
              disabled={pagination.currentPage === pagination.totalPages || loading}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && renderForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {renderForm({
                currentItem,
                onSubmit: handleSubmit,
                onCancel: () => setShowModal(false)
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ContentManager.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
      sortable: PropTypes.bool
    })
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  title: PropTypes.string,
  addButtonText: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  renderForm: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    startItem: PropTypes.number.isRequired,
    endItem: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onPrevPage: PropTypes.func.isRequired,
    onNextPage: PropTypes.func.isRequired
  })
};

export default ContentManager;