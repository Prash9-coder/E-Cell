import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Mobile menu toggle handler
  const handleMenuToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Add a small delay to prevent immediate closing
      setTimeout(() => {
        if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
          setIsMenuOpen(false)
        }
      }, 10)
    }

    const handleTouchOutside = (event) => {
      setTimeout(() => {
        if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
          setIsMenuOpen(false)
        }
      }, 10)
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      // Add a small delay before enabling click-outside detection
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
        document.addEventListener('touchstart', handleTouchOutside)
      }, 100)
      document.addEventListener('keydown', handleEscapeKey)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('touchstart', handleTouchOutside)
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Startups', path: '/startups' },
    { name: 'Resources', path: '/resources' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    { name: 'Get Involved', path: '/get-involved' },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="logo.svg" 
            alt="E-Cell Logo" 
            className="h-14 w-auto" 
          />
          <span className={`ml-2 text-xl font-bold ${isScrolled ? 'text-primary-800' : 'text-white'}`}>
            E-Cell
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors hover:text-primary-500 ${
                      isActive 
                        ? 'text-primary-600' 
                        : isScrolled ? 'text-gray-800' : 'text-white'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="menu-button md:hidden text-2xl focus:outline-none p-2 -mr-2 touch-manipulation"
          onClick={handleMenuToggle}
          onTouchStart={() => {}} // Enable touch events
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
        >
          {isMenuOpen ? (
            <FaTimes className={isScrolled ? 'text-gray-800' : 'text-white'} />
          ) : (
            <FaBars className={isScrolled ? 'text-gray-800' : 'text-white'} />
          )}
        </button>

      </div>



      {/* Mobile Navigation - Fixed version */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsMenuOpen(false)}
            onTouchStart={() => {}}
            style={{ 
              touchAction: 'manipulation',
              zIndex: 40
            }}
          />
          
          {/* Menu */}
          <div 
            className="mobile-menu fixed top-16 left-0 right-0 bg-white shadow-lg md:hidden z-50 border-t border-gray-200 max-h-screen overflow-y-auto"
            style={{ 
              position: 'fixed',
              top: '64px', // Header height
              left: 0,
              right: 0,
              zIndex: 50,
              maxHeight: 'calc(100vh - 64px)'
            }}
          >
            <nav className="px-4 py-4">
              <ul className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => 
                        `block px-4 py-3 text-base font-medium transition-colors rounded-md touch-manipulation ${
                          isActive 
                            ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600' 
                            : 'text-gray-800 hover:text-primary-500 hover:bg-gray-50'
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                      onTouchStart={() => {}}
                      style={{ 
                        WebkitTapHighlightColor: 'rgba(59, 130, 246, 0.1)',
                        touchAction: 'manipulation'
                      }}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}

export default Header