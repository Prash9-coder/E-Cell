import { useState, useEffect } from 'react'
import { FaUsers, FaCalendarAlt, FaNewspaper, FaChartLine, FaBullhorn, FaExclamationTriangle, FaSync } from 'react-icons/fa'
import { useUsers } from '../../context/UserContext'
import { useStartups } from '../../context/StartupContext'

const Dashboard = () => {
  const { users, getRecentUsers } = useUsers();
  const { startups, getRecentStartups, refreshStartups } = useStartups();
  
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    startups: 0,
    posts: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Get recent users from the UserContext
  const recentUsers = getRecentUsers(4)

  const [upcomingEvents, setUpcomingEvents] = useState([])

  // Get recent startups from the StartupContext
  const [recentStartups, setRecentStartups] = useState([])

  // Function to fetch dashboard data
  const fetchDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      setError(null);
      
      // Get API URL from environment variables
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Create headers with authentication token
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      }
      
      try {
        console.log('Fetching dashboard data from:', `${apiUrl}/admin/dashboard`);
        
        // Make API call to fetch dashboard data
        const response = await fetch(`${apiUrl}/admin/dashboard`, { headers });
        
        // Check if response is ok
        if (!response.ok) {
          // If unauthorized, redirect to login
          if (response.status === 401) {
            console.error('Authentication error: Token is not valid');
            // Redirect to login page
            window.location.href = '/admin/login';
            return;
          }
          
          // Try to parse error response
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || `API error: ${response.status}`
          );
        }
        
        // Parse response data
        const data = await response.json();
        console.log('Dashboard data received:', data);
        
        // Update state with real data
        setStats(data.stats);
        
        // If we have upcoming events data, update it
        if (data.upcomingEvents && data.upcomingEvents.length > 0) {
          console.log('Setting upcoming events:', data.upcomingEvents);
          setUpcomingEvents(data.upcomingEvents);
        } else {
          console.warn('No upcoming events data received from API');
          // Fetch events directly from events API as fallback
          await fetchEventsAsFallback();
        }
        
        // If we have recent startups data, update it
        if (data.recentStartups && data.recentStartups.length > 0) {
          console.log('Setting recent startups:', data.recentStartups);
          setRecentStartups(data.recentStartups);
        } else {
          console.warn('No recent startups data received from API');
          // Fetch startups directly as fallback
          await fetchStartupsAsFallback();
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        // Try fallback to events and startups API
        await Promise.all([
          fetchEventsAsFallback(),
          fetchStartupsAsFallback()
        ]);
        throw apiError;
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
      
      // Always use the current user count from context
      setStats({
        users: users.length,
        events: 12,
        startups: 24,
        posts: 38
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  // Fallback function to fetch events directly from events API
  const fetchEventsAsFallback = async () => {
    try {
      console.log('Attempting to fetch events directly as fallback');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Fetch upcoming events
      const response = await fetch(`${apiUrl}/events?isPast=false&limit=3`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      console.log('Fallback events data:', data);
      
      if (data.events && data.events.length > 0) {
        // Format events to match dashboard format
        const formattedEvents = data.events.map(event => ({
          id: event._id || event.id,
          title: event.title,
          date: event.date,
          registrations: event.registrations?.length || 0
        }));
        
        console.log('Setting events from fallback:', formattedEvents);
        setUpcomingEvents(formattedEvents);
      } else {
        console.warn('No events found in fallback');
      }
    } catch (error) {
      console.error('Error in events fallback:', error);
    }
  };
  
  // Fallback function to fetch startups directly from context
  const fetchStartupsAsFallback = async () => {
    try {
      console.log('Attempting to fetch startups from context as fallback');
      
      // Try to refresh startups first
      try {
        await refreshStartups();
      } catch (refreshError) {
        console.warn('Could not refresh startups:', refreshError);
      }
      
      // Get recent startups from context
      const recentStartupsList = getRecentStartups(3);
      
      if (recentStartupsList && recentStartupsList.length > 0) {
        // Format startups to match dashboard format
        const formattedStartups = recentStartupsList.map(startup => ({
          id: startup._id || startup.id,
          name: startup.name,
          category: startup.industry || startup.category,
          status: startup.status || 'Active'
        }));
        
        console.log('Setting startups from context fallback:', formattedStartups);
        setRecentStartups(formattedStartups);
        
        // Update stats with actual startup count
        setStats(prevStats => ({
          ...prevStats,
          startups: startups.length
        }));
      } else {
        console.warn('No startups found in context fallback');
        
        // Try API fallback as last resort
        try {
          console.log('Attempting to fetch startups directly from API as last resort');
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          
          // Fetch startups
          const response = await fetch(`${apiUrl}/startups?limit=3`, {
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch startups from API');
          }
          
          const data = await response.json();
          console.log('API fallback startups data:', data);
          
          if (data.startups && data.startups.length > 0) {
            // Format startups to match dashboard format
            const formattedStartups = data.startups.map(startup => ({
              id: startup._id || startup.id,
              name: startup.name,
              category: startup.industry || startup.category,
              status: startup.status || 'Active'
            }));
            
            console.log('Setting startups from API fallback:', formattedStartups);
            setRecentStartups(formattedStartups);
          }
        } catch (apiError) {
          console.error('Error in API startups fallback:', apiError);
        }
      }
    } catch (error) {
      console.error('Error in startups fallback:', error);
    }
  };
  
  // Fetch dashboard data on component mount and when users or startups change
  useEffect(() => {
    fetchDashboardData();
    
    // If no events or startups are loaded after 2 seconds, try the fallback
    const fallbackTimer = setTimeout(() => {
      if (upcomingEvents.length === 0) {
        console.log('No events loaded after timeout, trying fallback');
        fetchEventsAsFallback();
      }
      
      if (recentStartups.length === 0) {
        console.log('No startups loaded after timeout, trying fallback');
        fetchStartupsAsFallback();
      }
    }, 2000);
    
    return () => clearTimeout(fallbackTimer);
  }, [users, startups])
  
  // Effect to log when events change
  useEffect(() => {
    console.log('Current upcoming events:', upcomingEvents);
  }, [upcomingEvents])
  
  // Effect to log when startups change
  useEffect(() => {
    console.log('Current recent startups:', recentStartups);
  }, [recentStartups])
  
  // Effect to update stats when startups change
  useEffect(() => {
    if (startups.length > 0) {
      setStats(prevStats => ({
        ...prevStats,
        startups: startups.length
      }));
      
      // If we don't have recent startups yet, get them from the context
      if (recentStartups.length === 0) {
        const contextStartups = getRecentStartups(3);
        if (contextStartups.length > 0) {
          const formattedStartups = contextStartups.map(startup => ({
            id: startup._id || startup.id,
            name: startup.name,
            category: startup.industry || startup.category,
            status: startup.status || 'Active'
          }));
          setRecentStartups(formattedStartups);
        }
      }
    }
  }, [startups, getRecentStartups])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button 
          onClick={() => fetchDashboardData(true)} 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <FaSync className="animate-spin mr-2" />
              Refreshing...
            </>
          ) : (
            <>
              <FaSync className="mr-2" />
              Refresh Data
            </>
          )}
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {error}
              </p>
              <button 
                onClick={() => fetchDashboardData()} 
                className="mt-2 text-sm text-red-700 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FaUsers className="text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <h3 className="text-2xl font-bold">{stats.users}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FaCalendarAlt className="text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Events</p>
                <h3 className="text-2xl font-bold">{stats.events}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FaChartLine className="text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Registered Startups</p>
                <h3 className="text-2xl font-bold">{stats.startups}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                <FaNewspaper className="text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Blog Posts</p>
                <h3 className="text-2xl font-bold">{stats.posts}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Alerts */}
      <div className="mb-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Attention:</strong> 5 new startup applications are pending review.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaBullhorn className="text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Reminder:</strong> E-Summit planning meeting scheduled for tomorrow at 3 PM.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Recent Users</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(user.joinedAt).toLocaleDateString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Upcoming Events</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <tr key={event.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{event.registrations}</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                        No upcoming events found. <button onClick={fetchEventsAsFallback} className="text-blue-500 underline">Refresh</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Startups */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Recent Startups</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentStartups.length > 0 ? (
                  recentStartups.map((startup) => (
                    <tr key={startup.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{startup.name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{startup.category}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        startup.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {startup.status}
                      </span>
                    </td>
                  </tr>
                ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                      No startups found. <button onClick={fetchStartupsAsFallback} className="text-blue-500 underline">Refresh</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard