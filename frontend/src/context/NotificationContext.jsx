import { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create context
const NotificationContext = createContext();

// Notification types
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Add a new notification
  const addNotification = useCallback((message, type = NotificationType.INFO, timeout = 5000, title = '') => {
    const id = uuidv4();
    
    const newNotification = {
      id,
      message,
      type,
      title,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after timeout
    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }
    
    return id;
  }, []);
  
  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Convenience methods for different notification types
  const showSuccess = useCallback((message, timeout = 5000, title = 'Success') => {
    return addNotification(message, NotificationType.SUCCESS, timeout, title);
  }, [addNotification]);
  
  const showError = useCallback((message, timeout = 8000, title = 'Error') => {
    return addNotification(message, NotificationType.ERROR, timeout, title);
  }, [addNotification]);
  
  const showWarning = useCallback((message, timeout = 6000, title = 'Warning') => {
    return addNotification(message, NotificationType.WARNING, timeout, title);
  }, [addNotification]);
  
  const showInfo = useCallback((message, timeout = 5000, title = 'Information') => {
    return addNotification(message, NotificationType.INFO, timeout, title);
  }, [addNotification]);
  
  // Add to window for global access (useful for error handling)
  if (typeof window !== 'undefined') {
    window.showNotification = addNotification;
    window.showSuccess = showSuccess;
    window.showError = showError;
    window.showWarning = showWarning;
    window.showInfo = showInfo;
  }
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        showSuccess,
        showError,
        showWarning,
        showInfo
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;