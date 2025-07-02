import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  // Define default settings since settings object is not available
  const settings = {
    social: {
      facebook: 'https://facebook.com/ecell',
      instagram: 'https://instagram.com/ecell',
      linkedin: 'https://linkedin.com/company/ecell',
      youtube: 'https://youtube.com/ecell'
    },
    footer: {
      copyrightText: `© ${currentYear} E-Cell. All rights reserved.`
    }
  }
  
  // Footer navigation sections
  const footerSections = [
    {
      title: 'About',
      links: [
        { name: 'Our Mission', path: '/about#mission' },
        { name: 'Team', path: '/about#team' },
        { name: 'Achievements', path: '/about#achievements' },
        { name: 'Partners', path: '/about#partners' },
      ]
    },
    {
      title: 'Programs',
      links: [
        { name: 'Events', path: '/events' },
        { name: 'Startups', path: '/startups' },
        { name: 'Incubation', path: '/startups#incubation' },
        { name: 'Mentorship', path: '/get-involved#mentorship' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Startup Guide', path: '/resources#guides' },
        { name: 'Funding Options', path: '/resources#funding' },
        { name: 'Templates', path: '/resources#templates' },
        { name: 'Blog', path: '/blog' },
      ]
    },
    {
      title: 'Connect',
      links: [
        { name: 'Contact Us', path: '/contact' },
        { name: 'Get Involved', path: '/get-involved' },
        { name: 'Newsletter', path: '/contact#newsletter' },
        { name: 'FAQ', path: '/contact#faq' },
      ]
    }
  ]
  
  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: <FaFacebook />, url: settings.social.facebook },
    { name: 'Instagram', icon: <FaInstagram />, url: settings.social.instagram },
    { name: 'LinkedIn', icon: <FaLinkedin />, url: settings.social.linkedin },
    { name: 'YouTube', icon: <FaYoutube />, url: settings.social.youtube },
  ]

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img src="logo-white.svg" alt="E-Cell Logo" className="h-12 w-auto" />
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Fostering entrepreneurship and innovation among students. We help transform ideas into successful ventures through mentorship, resources, and networking opportunities.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-xl"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Navigation */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Divider */}
        <div className="h-px bg-gray-800 my-8"></div>
        
        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            {settings.footer.copyrightText}
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-500 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="text-gray-500 hover:text-white text-sm">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer