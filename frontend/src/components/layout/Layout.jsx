import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from '../utils/ScrollToTop'
import NewsletterSignup from '../sections/NewsletterSignup'

const Layout = () => {
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Add a debug message to check if Layout is rendering
  useEffect(() => {
    console.log('Layout component rendered')
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <NewsletterSignup />
      <Footer />
    </div>
  )
}

export default Layout