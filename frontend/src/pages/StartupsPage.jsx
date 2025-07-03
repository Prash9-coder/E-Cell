import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaFilter, FaExternalLinkAlt, FaLinkedin, FaGlobe, FaArrowRight } from 'react-icons/fa'
import axios from 'axios'
import { getContentImageUrl, getFallbackImage } from '../utils/imageUtils'

const StartupsPage = () => {
  // State for startups and filtering
  const [startups, setStartups] = useState([])
  const [filteredStartups, setFilteredStartups] = useState([])
  const [activeTab, setActiveTab] = useState('showcase')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({})
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null })

  // Mock startup categories
  const categories = [
    { id: 'all', name: 'All Startups' },
    { id: 'tech', name: 'Technology' },
    { id: 'health', name: 'Healthcare' },
    { id: 'edu', name: 'Education' },
    { id: 'fin', name: 'Fintech' },
    { id: 'sustain', name: 'Sustainability' },
    { id: 'ecom', name: 'E-Commerce' }
  ]

  // Mock startups data
  const mockStartups = [
    {
      id: 1,
      name: 'EcoSolutions',
      tagline: 'Sustainable packaging for a greener future',
      logo: '/images/startups/ecosolutions-logo.png',
      image: '/images/startups/ecosolutions.jpg',
      founders: [
        { name: 'Priya Sharma', role: 'CEO', image: '/images/team/priya-sharma.jpg' },
        { name: 'Rahul Verma', role: 'CTO', image: '/images/team/rahul-verma.jpg' }
      ],
      description: 'Developing biodegradable packaging alternatives that secured $2M in seed funding.',
      longDescription: 'EcoSolutions is revolutionizing the packaging industry with innovative biodegradable materials made from agricultural waste. Our products decompose naturally within 180 days, leaving no harmful residues.',
      category: 'sustain',
      foundedYear: 2022,
      stage: 'Seed',
      funding: '$2M',
      website: 'https://ecosolutions.com',
      linkedin: 'https://linkedin.com/company/ecosolutions',
      achievements: [
        'Winner of National Sustainability Challenge 2022',
        'Featured in Forbes 30 Under 30 Asia',
        'Partnership with 3 major retail chains'
      ],
      featured: true
    },
    {
      id: 2,
      name: 'LearnHub',
      tagline: 'Personalized learning for everyone',
      logo: '/images/startups/learnhub-logo.png',
      image: '/images/startups/learnhub.jpg',
      founders: [
        { name: 'Rahul Verma', role: 'CEO', image: '/images/team/rahul-verma.jpg' },
        { name: 'Ananya Patel', role: 'COO', image: '/images/team/ananya-patel.jpg' }
      ],
      description: 'EdTech platform connecting students with tutors that now has 50,000+ active users.',
      longDescription: 'LearnHub is an AI-powered educational platform that matches students with the perfect tutors based on learning style, subject needs, and scheduling preferences. Our adaptive learning system creates personalized study plans for each student.',
      category: 'edu',
      foundedYear: 2021,
      stage: 'Series A',
      funding: '$4.5M',
      website: 'https://learnhub.edu',
      linkedin: 'https://linkedin.com/company/learnhub',
      achievements: [
        '50,000+ active users across 12 countries',
        'Average improvement of 23% in student test scores',
        'Google for Startups Accelerator alumni'
      ],
      featured: true
    },
    {
      id: 3,
      name: 'HealthTrack',
      tagline: 'AI-powered health monitoring',
      logo: '/images/startups/healthtrack-logo.png',
      image: '/images/startups/healthtrack.jpg',
      founders: [
        { name: 'Ananya Patel', role: 'CEO', image: '/images/team/ananya-patel.jpg' },
        { name: 'Vikram Reddy', role: 'CTO', image: '/images/team/vikram-reddy.jpg' }
      ],
      description: 'AI-powered health monitoring app acquired by a leading healthcare provider.',
      longDescription: 'HealthTrack uses machine learning algorithms to analyze user health data from wearable devices, providing early warning signs of potential health issues and personalized wellness recommendations.',
      category: 'health',
      foundedYear: 2020,
      stage: 'Acquired',
      funding: '$8M (Total raised before acquisition)',
      website: 'https://healthtrack.ai',
      linkedin: 'https://linkedin.com/company/healthtrack',
      achievements: [
        'Acquired by MediCorp for $30M in 2023',
        'FDA approval for early diabetes risk detection',
        'Over 200,000 downloads with 78% retention rate'
      ],
      featured: true
    },
    {
      id: 4,
      name: 'FinEase',
      tagline: 'Simplifying personal finance',
      logo: '/images/startups/finease-logo.png',
      image: '/images/startups/finease.jpg',
      founders: [
        { name: 'Arjun Singh', role: 'CEO', image: '/images/team/arjun-singh.jpg' }
      ],
      description: 'Personal finance management app helping young professionals build wealth through automated savings and investments.',
      longDescription: 'FinEase makes personal finance management simple and accessible for young professionals. Our app automates savings, provides investment guidance, and offers financial education tailored to each user\'s goals and risk tolerance.',
      category: 'fin',
      foundedYear: 2022,
      stage: 'Pre-seed',
      funding: '$750K',
      website: 'https://finease.app',
      linkedin: 'https://linkedin.com/company/finease',
      achievements: [
        '25,000+ active users',
        'Average user savings increase of 32%',
        'Featured in Economic Times Startup Spotlight'
      ],
      featured: false
    },
    {
      id: 5,
      name: 'DroneDelivery',
      tagline: 'Last-mile delivery solutions',
      logo: '/images/startups/dronedelivery-logo.png',
      image: '/images/startups/dronedelivery.jpg',
      founders: [
        { name: 'Vikram Reddy', role: 'CEO', image: '/images/team/vikram-reddy.jpg' },
        { name: 'Zara Khan', role: 'COO', image: '/images/team/zara-khan.jpg' }
      ],
      description: 'Autonomous drone delivery service for urban areas, reducing delivery times and carbon emissions.',
      longDescription: 'DroneDelivery is revolutionizing last-mile logistics with our fleet of autonomous delivery drones. We help businesses deliver packages faster, cheaper, and with a significantly reduced carbon footprint compared to traditional delivery methods.',
      category: 'tech',
      foundedYear: 2021,
      stage: 'Seed',
      funding: '$3.2M',
      website: 'https://dronedelivery.tech',
      linkedin: 'https://linkedin.com/company/dronedelivery',
      achievements: [
        'Successfully completed 10,000+ deliveries',
        'Reduced delivery times by 65% in pilot areas',
        'Partnership with two major e-commerce platforms'
      ],
      featured: false
    },
    {
      id: 6,
      name: 'FashionForward',
      tagline: 'Sustainable fashion marketplace',
      logo: '/images/startups/fashionforward-logo.png',
      image: '/images/startups/fashionforward.jpg',
      founders: [
        { name: 'Zara Khan', role: 'CEO', image: '/images/team/zara-khan.jpg' }
      ],
      description: 'Online marketplace connecting conscious consumers with sustainable and ethical fashion brands.',
      longDescription: 'FashionForward is a curated marketplace that connects environmentally conscious consumers with verified sustainable and ethical fashion brands. We provide transparency about each product\'s environmental impact, ethical labor practices, and material sourcing.',
      category: 'ecom',
      foundedYear: 2022,
      stage: 'Bootstrapped',
      funding: 'Self-funded',
      website: 'https://fashionforward.store',
      linkedin: 'https://linkedin.com/company/fashionforward',
      achievements: [
        'Onboarded 50+ sustainable fashion brands',
        '15,000+ registered customers',
        'Featured in Vogue Sustainability Issue'
      ],
      featured: false
    },
    {
      id: 7,
      name: 'SmartFarm',
      tagline: 'IoT solutions for agriculture',
      logo: '/images/startups/smartfarm-logo.png',
      image: '/images/startups/smartfarm.jpg',
      founders: [
        { name: 'Aditya Sharma', role: 'CEO', image: '/images/team/aditya-sharma.jpg' },
        { name: 'Neha Gupta', role: 'CTO', image: '/images/team/neha-gupta.jpg' }
      ],
      description: 'IoT-based precision agriculture solutions helping farmers increase yields while reducing water and fertilizer usage.',
      longDescription: 'SmartFarm develops affordable IoT sensors and analytics software that help farmers implement precision agriculture techniques. Our solutions provide real-time soil, crop, and weather data, enabling data-driven decisions that increase yields while reducing resource usage.',
      category: 'tech',
      foundedYear: 2021,
      stage: 'Seed',
      funding: '$1.8M',
      website: 'https://smartfarm.ag',
      linkedin: 'https://linkedin.com/company/smartfarm',
      achievements: [
        'Deployed on 200+ farms across 3 states',
        'Average 28% reduction in water usage',
        'Winner of AgriTech Innovation Award 2022'
      ],
      featured: false
    },
    {
      id: 8,
      name: 'MindfulMe',
      tagline: 'Mental wellness for students',
      logo: '/images/startups/mindfullme-logo.png',
      image: '/images/startups/mindfullme.jpg',
      founders: [
        { name: 'Neha Gupta', role: 'CEO', image: '/images/team/neha-gupta.jpg' }
      ],
      description: 'Mental wellness app designed specifically for students, offering guided meditation, stress management, and academic-life balance tools.',
      longDescription: 'MindfulMe is addressing the growing mental health challenges faced by students with our specialized wellness app. We offer guided meditations, stress management techniques, and tools for maintaining academic-life balance, all designed specifically for the unique challenges students face.',
      category: 'health',
      foundedYear: 2022,
      stage: 'Pre-seed',
      funding: '$500K',
      website: 'https://mindfullme.app',
      linkedin: 'https://linkedin.com/company/mindfullme',
      achievements: [
        'Adopted by 15 universities for student wellness programs',
        '30,000+ student users',
        'Demonstrated 42% reduction in reported stress levels'
      ],
      featured: false
    }
  ]

  // Incubation program details
  const incubationProgram = {
    title: 'E-Cell Incubation Program',
    description: 'Our incubation program provides early-stage startups with the resources, mentorship, and support needed to transform innovative ideas into successful ventures.',
    benefits: [
      {
        title: 'Workspace & Infrastructure',
        description: 'Access to fully-equipped co-working space, meeting rooms, and lab facilities.',
        icon: '🏢'
      },
      {
        title: 'Funding Opportunities',
        description: 'Seed funding, connections to angel investors, and assistance with grant applications.',
        icon: '💰'
      },
      {
        title: 'Mentorship',
        description: 'Guidance from experienced entrepreneurs, industry experts, and faculty advisors.',
        icon: '👥'
      },
      {
        title: 'Networking',
        description: 'Access to our extensive network of alumni, industry partners, and investor connections.',
        icon: '🔗'
      },
      {
        title: 'Business Support',
        description: 'Legal, accounting, marketing, and technical assistance to help you grow.',
        icon: '📈'
      },
      {
        title: 'Learning Resources',
        description: 'Workshops, masterclasses, and personalized training programs.',
        icon: '📚'
      }
    ],
    eligibility: [
      'At least one founder must be a current student or recent graduate (within 2 years)',
      'Innovative business idea with market potential',
      'Commitment to work full-time on the startup during the incubation period',
      'Completed minimum viable product (MVP) or prototype'
    ],
    process: [
      {
        stage: 'Application',
        description: 'Submit your business plan, team details, and pitch deck through our online portal.'
      },
      {
        stage: 'Screening',
        description: 'Selected applications will be invited for an initial screening interview.'
      },
      {
        stage: 'Pitch Day',
        description: 'Shortlisted teams will present their ideas to our selection committee.'
      },
      {
        stage: 'Selection',
        description: 'Final teams will be selected based on innovation, feasibility, and team capability.'
      },
      {
        stage: 'Onboarding',
        description: 'Selected startups join the 6-month incubation program with possible extension.'
      }
    ],
    timeline: {
      applications: 'Open year-round with quarterly selection cycles',
      nextDeadline: 'June 30, 2024',
      programStart: 'August 1, 2024'
    },
    testimonials: [
      {
        quote: "The E-Cell incubation program was instrumental in helping us refine our business model and connect with our first major clients.",
        author: "Priya Sharma, EcoSolutions",
        image: "/images/team/priya-sharma.jpg"
      },
      {
        quote: "The mentorship and networking opportunities we received through the program accelerated our growth beyond what we could have achieved on our own.",
        author: "Rahul Verma, LearnHub",
        image: "/images/team/rahul-verma.jpg"
      }
    ]
  }

  // Fetch startups from localStorage or use mock data as fallback
  useEffect(() => {
    const fetchStartups = async () => {
      // In a real app, this would be an API call
      // const response = await fetch('/api/startups')
      // const data = await response.json()
      
      // Simulate loading delay
      setTimeout(() => {
        // Try to get startups from localStorage (where admin panel stores them)
        const savedStartups = localStorage.getItem('startups');
        
        if (savedStartups) {
          // Parse the saved startups
          const adminStartups = JSON.parse(savedStartups);
          
          // Map admin startups to client format if needed
          // This is necessary because the admin panel and client use different data structures
          const mappedStartups = adminStartups.map(startup => {
            // Find matching startup in mock data to get additional fields
            const mockStartup = mockStartups.find(mock => mock.id === startup.id);
            
            // If found in mock data, merge with admin data, otherwise create basic entry
            if (mockStartup) {
              return {
                ...mockStartup,
                name: startup.name,
                category: startup.category === 'Technology' ? 'tech' : 
                          startup.category === 'Healthcare' ? 'health' :
                          startup.category === 'Education' ? 'edu' :
                          startup.category === 'Fintech' ? 'fin' :
                          startup.category === 'Sustainability' ? 'sustain' :
                          startup.category === 'E-Commerce' ? 'ecom' : 'tech',
                foundedYear: startup.foundedYear,
                stage: startup.stage,
                featured: startup.featured
              };
            } else {
              // Create basic entry for new startups added in admin panel
              return {
                id: startup.id,
                name: startup.name,
                tagline: startup.description || 'Innovative startup',
                logo: '/images/startups/default-logo.png',
                image: '/images/startups/default.jpg',
                founders: [],
                description: startup.description || 'New startup added from admin panel',
                longDescription: startup.description || 'New startup added from admin panel',
                category: startup.category === 'Technology' ? 'tech' : 
                          startup.category === 'Healthcare' ? 'health' :
                          startup.category === 'Education' ? 'edu' :
                          startup.category === 'Fintech' ? 'fin' :
                          startup.category === 'Sustainability' ? 'sustain' :
                          startup.category === 'E-Commerce' ? 'ecom' : 'tech',
                foundedYear: startup.foundedYear,
                stage: startup.stage,
                funding: 'Undisclosed',
                website: '#',
                linkedin: '#',
                achievements: [],
                featured: startup.featured
              };
            }
          });
          
          setStartups(mappedStartups);
        } else {
          // Fallback to mock data if nothing in localStorage
          setStartups(mockStartups);
        }
        
        setIsLoading(false);
      }, 800);
    };
    
    fetchStartups();
  }, [])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Add onChange handlers to all form inputs when component mounts
  useEffect(() => {
    // Get all form inputs in the apply tab
    const formInputs = document.querySelectorAll('#apply-form input, #apply-form select, #apply-form textarea');
    
    // Add onChange handler to each input
    formInputs.forEach(input => {
      input.addEventListener('change', handleInputChange);
    });
    
    // Cleanup event listeners when component unmounts
    return () => {
      formInputs.forEach(input => {
        input.removeEventListener('change', handleInputChange);
      });
    };
  }, [activeTab]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading state
    setFormStatus({ loading: true, success: false, error: null });
    
    // Log form data for debugging
    console.log('Submitting form data:', formData);
    
    try {
      // Create FormData object for file uploads
      const formDataToSend = new FormData();
      
      // Get all form inputs
      const form = document.getElementById('apply-form');
      const formElements = form.elements;
      
      // Manually collect all form data
      for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        
        // Skip buttons and submit elements
        if (element.type === 'submit' || element.type === 'button') {
          continue;
        }
        
        // Handle different input types
        if (element.type === 'checkbox') {
          formDataToSend.append(element.name, element.checked);
        } else if (element.type === 'file' && element.files.length > 0) {
          formDataToSend.append(element.name, element.files[0]);
        } else if (element.name && element.value) {
          formDataToSend.append(element.name, element.value);
        }
      }
      
      // Log the form data being sent
      console.log('Form data being sent:');
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      // Send the data to the backend
      console.log('Sending request to:', '/api/incubation');
      
      // Use the full URL for development
      const baseUrl = 'http://localhost:5000'; // Adjust if your backend runs on a different port
      
      // Create a simple object with the essential fields for testing
      const simpleData = {
        teamName: document.getElementById('teamName')?.value || '',
        website: document.getElementById('website')?.value || '',
        teamSize: document.getElementById('teamSize')?.value || '',
        leadName: document.getElementById('leadName')?.value || '',
        leadEmail: document.getElementById('leadEmail')?.value || '',
        leadPhone: document.getElementById('leadPhone')?.value || '',
        leadRole: document.getElementById('leadRole')?.value || '',
        industry: document.querySelector('select[name="industry"]')?.value || '',
        stage: document.getElementById('stage')?.value || '',
        description: document.getElementById('description')?.value || '',
        problem: document.getElementById('problem')?.value || '',
        solution: document.getElementById('solution')?.value || '',
        traction: document.getElementById('traction')?.value || '',
        expectations: document.getElementById('expectations')?.value || '',
        referral: document.getElementById('referral')?.value || ''
      };
      
      console.log('Sending simplified data:', simpleData);
      
      // Check if there's a file to upload
      const pitchDeckInput = document.getElementById('pitchDeck');
      const hasFile = pitchDeckInput && pitchDeckInput.files && pitchDeckInput.files.length > 0;
      
      let response;
      
      if (hasFile) {
        // Use FormData to send the file
        console.log('File detected, using FormData to upload');
        response = await axios.post(`${baseUrl}/api/incubation`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // No file, use simple JSON
        console.log('No file detected, using JSON');
        response = await axios.post(`${baseUrl}/api/incubation`, simpleData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      console.log('Response received:', response.data);
      
      // Handle success
      setFormStatus({ loading: false, success: true, error: null });
      
      // Reset form data
      setFormData({});
      
      // Reset form fields
      e.target.reset();
      
      // Show success message
      setTimeout(() => {
        setActiveTab('incubation');
      }, 3000);
      
    } catch (error) {
      // Handle error
      console.error('Error submitting incubation application:', error);
      
      // Get detailed error message
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        console.error('Server response:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your internet connection.';
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || errorMessage;
      }
      
      setFormStatus({ 
        loading: false, 
        success: false, 
        error: errorMessage
      });
    }
  };

  // Filter startups based on search term and category
  useEffect(() => {
    if (startups.length > 0) {
      let filtered = [...startups]
      
      // Filter by category
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(startup => startup.category === categoryFilter)
      }
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(startup => 
          startup.name.toLowerCase().includes(term) || 
          startup.description.toLowerCase().includes(term) ||
          startup.tagline.toLowerCase().includes(term)
        )
      }
      
      setFilteredStartups(filtered)
    }
  }, [startups, searchTerm, categoryFilter])

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary-800 text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="/images/startups/startups-hero-bg.jpg" 
            alt="E-Cell Startups" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Startups & Incubation</h1>
            <p className="text-xl text-primary-100 mb-4">
              Discover innovative student ventures and learn how our incubation program can help transform your idea into a successful business.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-white border-b">
        <div className="container">
          <div className="flex overflow-x-auto">
            <button
              className={`py-4 px-6 font-medium text-lg whitespace-nowrap ${
                activeTab === 'showcase'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('showcase')}
            >
              Startup Showcase
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg whitespace-nowrap ${
                activeTab === 'incubation'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('incubation')}
            >
              Incubation Program
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg whitespace-nowrap ${
                activeTab === 'apply'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('apply')}
            >
              Apply for Incubation
            </button>
          </div>
        </div>
      </section>

      {/* Startup Showcase */}
      {activeTab === 'showcase' && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            {/* Featured Startups */}
            {filteredStartups.some(startup => startup.featured) && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">Featured Startups</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {filteredStartups
                    .filter(startup => startup.featured)
                    .map(startup => (
                      <div key={startup.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:transform hover:scale-105">
                        <div className="relative h-48">
                          <img 
                            src={getContentImageUrl(startup.image, 'startups')} 
                            alt={startup.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                            <div className="p-4">
                              <h3 className="text-xl font-bold text-white">{startup.name}</h3>
                              <p className="text-primary-200">{startup.tagline}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                              <img 
                                src={startup.logo} 
                                alt={`${startup.name} logo`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Founded: {startup.foundedYear}</p>
                              <p className="text-sm text-gray-600">Stage: {startup.stage}</p>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{startup.description}</p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-3">
                              {startup.website && (
                                <a 
                                  href={startup.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-primary-600 transition-colors"
                                  aria-label={`${startup.name} website`}
                                >
                                  <FaGlobe className="text-lg" />
                                </a>
                              )}
                              {startup.linkedin && (
                                <a 
                                  href={startup.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-primary-600 transition-colors"
                                  aria-label={`${startup.name} LinkedIn`}
                                >
                                  <FaLinkedin className="text-lg" />
                                </a>
                              )}
                            </div>
                            
                            <a 
                              href={`#${startup.id}`} 
                              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                            >
                              Learn more
                              <FaArrowRight className="ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search startups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* All Startups */}
            <h2 className="text-2xl font-bold mb-8">All Startups</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
            ) : filteredStartups.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStartups.map(startup => (
                  <div 
                    key={startup.id} 
                    id={startup.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                          <img 
                            src={startup.logo} 
                            alt={`${startup.name} logo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{startup.name}</h3>
                          <p className="text-sm text-gray-600">{startup.tagline}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Founded: {startup.foundedYear}</span>
                          <span className="text-sm text-gray-600">Stage: {startup.stage}</span>
                        </div>
                        <p className="text-gray-700">{startup.description}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Founders</h4>
                        <div className="flex space-x-3">
                          {startup.founders.map((founder, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden mb-1">
                                <img 
                                  src={getContentImageUrl(founder.image, 'team')} 
                                  alt={founder.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-xs text-gray-600">{founder.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-3">
                          {startup.website && (
                            <a 
                              href={startup.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-primary-600 transition-colors"
                              aria-label={`${startup.name} website`}
                            >
                              <FaGlobe className="text-lg" />
                            </a>
                          )}
                          {startup.linkedin && (
                            <a 
                              href={startup.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-primary-600 transition-colors"
                              aria-label={`${startup.name} LinkedIn`}
                            >
                              <FaLinkedin className="text-lg" />
                            </a>
                          )}
                        </div>
                        
                        <button 
                          className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                          onClick={() => {
                            // In a real app, this would open a modal or navigate to a detail page
                            alert(`View details for ${startup.name}`)
                          }}
                        >
                          View details
                          <FaExternalLinkAlt className="ml-1 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-600 mb-2">No startups found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Incubation Program */}
      {activeTab === 'incubation' && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-center">{incubationProgram.title}</h2>
              <p className="text-lg text-gray-700 mb-12 text-center">
                {incubationProgram.description}
              </p>
              
              {/* Benefits */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold mb-8 text-center">What We Offer</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {incubationProgram.benefits.map((benefit, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-3xl mb-4">{benefit.icon}</div>
                      <h4 className="text-xl font-bold mb-2">{benefit.title}</h4>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Eligibility */}
              <div className="mb-16 bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-6">Eligibility Criteria</h3>
                <ul className="space-y-3">
                  {incubationProgram.eligibility.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Application Process */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold mb-8 text-center">Application Process</h3>
                <div className="relative">
                  {/* Process timeline line */}
                  <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-primary-200 transform md:translate-x-0 translate-x-4"></div>
                  
                  <div className="space-y-12">
                    {incubationProgram.process.map((step, index) => (
                      <div key={index} className="relative flex flex-col md:flex-row items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-bold z-10 absolute left-0 md:left-1/2 transform md:-translate-x-1/2 translate-x-0">
                          {index + 1}
                        </div>
                        
                        <div className={`md:w-5/12 bg-white p-6 rounded-lg shadow-md ml-12 md:ml-0 ${
                          index % 2 === 0 ? 'md:mr-auto md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'
                        }`}>
                          <h4 className="text-xl font-bold mb-2">{step.stage}</h4>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Timeline */}
              <div className="mb-16 bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-6">Program Timeline</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Applications:</p>
                    <p className="text-gray-600">{incubationProgram.timeline.applications}</p>
                  </div>
                  <div>
                    <p className="font-medium">Next Application Deadline:</p>
                    <p className="text-gray-600">{incubationProgram.timeline.nextDeadline}</p>
                  </div>
                  <div>
                    <p className="font-medium">Next Program Start Date:</p>
                    <p className="text-gray-600">{incubationProgram.timeline.programStart}</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonials */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-8 text-center">Success Stories</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {incubationProgram.testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex items-center mb-4">
                        <img 
                          src={getContentImageUrl(testimonial.image, 'team')} 
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <p className="font-medium">{testimonial.author}</p>
                      </div>
                      <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTA */}
              <div className="text-center">
                <button
                  onClick={() => setActiveTab('apply')}
                  className="btn btn-primary"
                >
                  Apply for Incubation
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Apply for Incubation */}
      {activeTab === 'apply' && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-center">Apply for Incubation</h2>
              <p className="text-lg text-gray-700 mb-12 text-center">
                Fill out the form below to apply for our incubation program. Make sure to provide detailed information about your startup idea and team.
              </p>
              
              {/* Status Messages */}
              {formStatus.success && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  <p className="font-medium">Application Submitted Successfully!</p>
                  <p>Thank you for your application. We will review it and get back to you soon.</p>
                </div>
              )}
              
              {formStatus.error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  <p className="font-medium">Error Submitting Application</p>
                  <p>{formStatus.error}</p>
                  <div className="mt-2">
                    <p className="text-sm">Please try the following:</p>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      <li>Check that all required fields are filled out correctly</li>
                      <li>Make sure the backend server is running at http://localhost:5000</li>
                      <li>Check your browser console for more detailed error information</li>
                      <li>Try refreshing the page and submitting again</li>
                    </ul>
                  </div>
                </div>
              )}
              
              <form id="apply-form" className="bg-white rounded-lg shadow-md p-8" onSubmit={handleSubmit}>
                {/* Team Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 pb-2 border-b">Team Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="teamName" className="block text-gray-700 font-medium mb-2">Team/Startup Name *</label>
                      <input
                        type="text"
                        id="teamName"
                        name="teamName"
                        required
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="website" className="block text-gray-700 font-medium mb-2">Website/Social Media (if any)</label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        placeholder="https://"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="teamSize" className="block text-gray-700 font-medium mb-2">Team Size *</label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select team size</option>
                      <option value="1">Solo founder</option>
                      <option value="2">2 members</option>
                      <option value="3-5">3-5 members</option>
                      <option value="6+">6+ members</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Team Members</label>
                    <p className="text-sm text-gray-500 mb-4">Please provide details for all core team members</p>
                    
                    <div className="space-y-4">
                      {/* Primary Contact */}
                      <div className="p-4 border border-gray-200 rounded-md">
                        <p className="font-medium mb-3">Primary Contact (Team Lead)</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="leadName" className="block text-gray-700 text-sm mb-1">Full Name *</label>
                            <input
                              type="text"
                              id="leadName"
                              name="leadName"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="leadEmail" className="block text-gray-700 text-sm mb-1">Email *</label>
                            <input
                              type="email"
                              id="leadEmail"
                              name="leadEmail"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="leadPhone" className="block text-gray-700 text-sm mb-1">Phone *</label>
                            <input
                              type="tel"
                              id="leadPhone"
                              name="leadPhone"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="leadRole" className="block text-gray-700 text-sm mb-1">Role in Team *</label>
                            <input
                              type="text"
                              id="leadRole"
                              name="leadRole"
                              placeholder="e.g., CEO, CTO, etc."
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional Team Member */}
                      <div className="p-4 border border-gray-200 rounded-md">
                        <p className="font-medium mb-3">Team Member 2</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="member2Name" className="block text-gray-700 text-sm mb-1">Full Name</label>
                            <input
                              type="text"
                              id="member2Name"
                              name="member2Name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="member2Email" className="block text-gray-700 text-sm mb-1">Email</label>
                            <input
                              type="email"
                              id="member2Email"
                              name="member2Email"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="member2Role" className="block text-gray-700 text-sm mb-1">Role in Team</label>
                            <input
                              type="text"
                              id="member2Role"
                              name="member2Role"
                              placeholder="e.g., CTO, CMO, etc."
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                      >
                        + Add another team member
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Startup Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 pb-2 border-b">Startup Information</h3>
                  
                  <div className="mb-6">
                    <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Startup Category *</label>
                    <select
                      id="category"
                      name="industry" // Changed to match backend model
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select category</option>
                      <option value="tech">Technology</option>
                      <option value="health">Healthcare</option>
                      <option value="edu">Education</option>
                      <option value="fin">Fintech</option>
                      <option value="sustain">Sustainability</option>
                      <option value="ecom">E-Commerce</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="stage" className="block text-gray-700 font-medium mb-2">Current Stage *</label>
                    <select
                      id="stage"
                      name="stage"
                      required
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select current stage</option>
                      <option value="idea">Idea Stage</option>
                      <option value="prototype">Prototype/MVP</option>
                      <option value="validation">Market Validation</option>
                      <option value="early-revenue">Early Revenue</option>
                      <option value="growth">Growth Stage</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Startup Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      required
                      placeholder="Describe your startup idea, product/service, and target market"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="problem" className="block text-gray-700 font-medium mb-2">Problem Statement *</label>
                    <textarea
                      id="problem"
                      name="problem"
                      rows="3"
                      required
                      placeholder="What problem are you solving? Why is it important?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="solution" className="block text-gray-700 font-medium mb-2">Solution *</label>
                    <textarea
                      id="solution"
                      name="solution"
                      rows="3"
                      required
                      placeholder="How does your product/service solve this problem?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="traction" className="block text-gray-700 font-medium mb-2">Traction & Achievements</label>
                    <textarea
                      id="traction"
                      name="traction"
                      rows="3"
                      placeholder="Any traction metrics, achievements, or milestones reached so far"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 pb-2 border-b">Additional Information</h3>
                  
                  <div className="mb-6">
                    <label htmlFor="expectations" className="block text-gray-700 font-medium mb-2">Expectations from Incubation *</label>
                    <textarea
                      id="expectations"
                      name="expectations"
                      rows="3"
                      required
                      placeholder="What do you hope to achieve through our incubation program?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="pitchDeck" className="block text-gray-700 font-medium mb-2">Pitch Deck/Business Plan</label>
                    <input
                      type="file"
                      id="pitchDeck"
                      name="pitchDeck"
                      accept=".pdf,.ppt,.pptx,.doc,.docx"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">Upload your pitch deck or business plan (PDF, PPT, or DOC format, max 10MB)</p>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="referral" className="block text-gray-700 font-medium mb-2">How did you hear about us?</label>
                    <select
                      id="referral"
                      name="referral"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select an option</option>
                      <option value="website">E-Cell Website</option>
                      <option value="event">E-Cell Event</option>
                      <option value="social">Social Media</option>
                      <option value="friend">Friend/Colleague</option>
                      <option value="faculty">Faculty Member</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                {/* Terms and Submit */}
                <div>
                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      required
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the <a href="#" className="text-primary-600 hover:underline">terms and conditions</a> and confirm that all information provided is accurate.
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formStatus.loading}
                    className={`w-full py-3 px-4 ${formStatus.loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'} text-white font-medium rounded-md transition-colors flex justify-center items-center`}
                  >
                    {formStatus.loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Turn Your Idea Into Reality?</h2>
            <p className="text-xl mb-8">
              Whether you're just starting out or looking to scale, E-Cell is here to support your entrepreneurial journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/resources" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Explore Resources
              </Link>
              <Link to="/contact" className="btn btn-outline border-white text-white hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default StartupsPage