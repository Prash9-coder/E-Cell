import { useEffect } from 'react';
import { useNotification, NotificationType } from '../../context/NotificationContext';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

/**
 * Notification component that displays toast-style notifications
 */
const Notifications = () => {
  const { notifications, removeNotification } = useNotification();
  
  // Listen for ESC key to dismiss all notifications
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && notifications.length > 0) {
        notifications.forEach(notification => removeNotification(notification.id));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notifications, removeNotification]);
  
  // If no notifications, don't render anything
  if (notifications.length === 0) {
    return null;
  }
  
  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return <FaCheckCircle className="text-white text-xl" />;
      case NotificationType.ERROR:
        return <FaExclamationCircle className="text-white text-xl" />;
      case NotificationType.WARNING:
        return <FaExclamationTriangle className="text-white text-xl" />;
      case NotificationType.INFO:
      default:
        return <FaInfoCircle className="text-white text-xl" />;
    }
  };
  
  // Get background color based on notification type
  const getBackgroundColor = (type) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'bg-green-600';
      case NotificationType.ERROR:
        return 'bg-red-600';
      case NotificationType.WARNING:
        return 'bg-yellow-600';
      case NotificationType.INFO:
      default:
        return 'bg-blue-600';
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} text-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform translate-x-0 opacity-100`}
          style={{ maxWidth: '24rem' }}
          role="alert"
        >
          <div className="flex items-start p-4">
            <div className="flex-shrink-0 mr-3">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              {notification.title && (
                <h3 className="font-bold mb-1">{notification.title}</h3>
              )}
              <p className="text-sm">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close notification"
            >
              <FaTimes />
            </button>
          </div>
          <div className="h-1 bg-white bg-opacity-30">
            <div
              className="h-full bg-white bg-opacity-50"
              style={{
                width: '100%',
                animation: 'notification-timer 5s linear forwards'
              }}
            />
          </div>
        </div>
      ))}
      
      {/* Add animation keyframes */}
      <style jsx="true">{`
        @keyframes notification-timer {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Notifications;