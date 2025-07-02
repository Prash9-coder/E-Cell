import { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree
 * and display a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // In production, you could send this to a monitoring service
    if (import.meta.env.MODE === 'production' && typeof window.reportError === 'function') {
      window.reportError({
        error,
        errorInfo,
        location: window.location.href,
        timestamp: new Date().toISOString()
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
              <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-gray-600 mb-6">
                We're sorry, but an error occurred while rendering this page.
              </p>
              
              {/* Show error details in development mode */}
              {import.meta.env.MODE !== 'production' && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-left overflow-auto max-h-40">
                  <p className="text-sm font-medium text-red-800 mb-2">Error details:</p>
                  <pre className="text-xs text-red-700 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={this.handleReload}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FaRedo className="mr-2" /> Reload Page
                </button>
                <Link
                  to="/"
                  onClick={this.handleReset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FaHome className="mr-2" /> Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;