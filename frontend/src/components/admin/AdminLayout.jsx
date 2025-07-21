import { useState } from 'react'
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { 
  FaHome, 
  FaCalendarAlt, 
  FaLightbulb, 
  FaNewspaper, 
  FaImages, 
  FaUsers, 
  FaCog, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaChevronRight,
  FaChevronDown,
  FaBook,
  FaEnvelope
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navItems] = useState([
    { name: 'Dashboard', path: '/admin', icon: <FaHome /> },
    { 
      name: 'Content', 
      icon: <FaNewspaper />,
      isOpen: false,
      subItems: [
        { name: 'Events', path: '/admin/content/events', icon: <FaCalendarAlt /> },
        { name: 'Blog Posts', path: '/admin/content/blog', icon: <FaNewspaper /> },
        { name: 'Startups', path: '/admin/content/startups', icon: <FaLightbulb /> },
        { name: 'Gallery', path: '/admin/content/gallery', icon: <FaImages /> },
        { name: 'Resources', path: '/admin/content/resources', icon: <FaBook /> },
        { name: 'Team', path: '/admin/content/team', icon: <FaUsers /> },
      ]
    },
    { name: 'Events', path: '/admin/events', icon: <FaCalendarAlt /> },
    { name: 'Startups', path: '/admin/startups', icon: <FaLightbulb /> },
    { name: 'Blog', path: '/admin/blog', icon: <FaNewspaper /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <FaImages /> },
    { name: 'Resources', path: '/admin/resources', icon: <FaBook /> },
    { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Newsletter', path: '/admin/newsletter', icon: <FaEnvelope /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ])
  
  const navigate = useNavigate()
  const { currentUser, logout, loading: authLoading } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // If still loading auth state, show loading spinner
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-700">
          <div className="flex items-center">
            <img src="/logo-white.svg" alt="E-Cell Logo" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-semibold">E-Cell Admin</span>
          </div>
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-5 px-2 space-y-1">
          {navItems.map((item) => (
            item.subItems ? (
              <div key={item.name} className="space-y-1">
                <button
                  className="group flex items-center w-full px-2 py-2 text-base font-medium rounded-md transition-colors text-primary-100 hover:bg-primary-700 hover:text-white"
                  onClick={() => {
                    // Toggle submenu
                    setNavItems(prev => 
                      prev.map(navItem => 
                        navItem.name === item.name 
                          ? { ...navItem, isOpen: !navItem.isOpen } 
                          : navItem
                      )
                    )
                  }}
                >
                  <span className="mr-3 h-5 w-5">{item.icon}</span>
                  {item.name}
                  <span className="ml-auto">
                    {item.isOpen ? <FaChevronDown className="h-4 w-4" /> : <FaChevronRight className="h-4 w-4" />}
                  </span>
                </button>
                
                {item.isOpen && (
                  <div className="pl-4 space-y-1">
                    {item.subItems.map(subItem => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.path}
                        className={({ isActive }) => 
                          `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive 
                              ? 'bg-primary-700 text-white' 
                              : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                          }`
                        }
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="mr-3 h-4 w-4">{subItem.icon}</span>
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary-700 text-white' 
                      : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                  }`
                }
                end={item.path === '/admin'}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3 h-5 w-5">{item.icon}</span>
                {item.name}
              </NavLink>
            )
          ))}
        </nav>
        
        {/* Logout button */}
        <div className="absolute bottom-0 w-full border-t border-primary-700 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-base font-medium text-primary-100 rounded-md hover:bg-primary-700 hover:text-white transition-colors"
          >
            <FaSignOutAlt className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              className="md:hidden text-gray-500 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars className="h-6 w-6" />
            </button>
            
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser.photoURL || '/admin-avatar.jpg'}
                    alt={currentUser.displayName || 'Admin'}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {currentUser.displayName || 'Admin User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout