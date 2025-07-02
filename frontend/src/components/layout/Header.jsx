import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
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
          className="menu-button md:hidden text-2xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? (
            <FaTimes className={isScrolled ? 'text-gray-800' : 'text-white'} />
          ) : (
            <FaBars className={isScrolled ? 'text-gray-800' : 'text-white'} />
          )}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-menu absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
            <nav className="container py-4">
              <ul className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => 
                        `block px-4 py-2 text-base font-medium transition-colors ${
                          isActive 
                            ? 'text-primary-600 bg-primary-50' 
                            : 'text-gray-800 hover:text-primary-500'
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header