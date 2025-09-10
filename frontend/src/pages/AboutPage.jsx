import { useState, useEffect } from 'react'
import { FaLinkedin, FaEnvelope } from 'react-icons/fa'
import StableImage from '../components/StableImage'

const AboutPage = () => {
  // Local team members data
  const [teamMembers] = useState([
    {
      id: 1,
      name: 'Mirza Umairulla Baig',
      position: 'Associate Professor, Placements Coordinator,POC for E-Cell',
      image: '/assets/umair.jpg',
      bio: 'Computer Science professor guiding E-Cell initiatives. Connects students with industry opportunities. Mentors aspiring entrepreneurs to achieve their potential.',
      social: {
        linkedin: 'https://linkedin.com/in/umair',
        email: 'umair@gmail.com'
      }
    },
    {
      id: 2,
      name: 'A.Swathi',
      position: 'President',
      image: '/assets/reyanshi.jpg',
      bio: 'Leads E-cell by fostering collaboration, ensuring inclusive decision-making, and maintaining harmony. Oversees entrepreneurship initiatives while connecting management with students.',
      social: {
        linkedin: 'https://www.linkedin.com/in/reyanshi-ankasala',
        email: 'swathi@gmail.com'
      }
    },
    {
      id: 3,
      name: 'D.Harshitha',
      position: 'Vice President',
      image: '/assets/harshitha.jpg',
      bio: 'Business Administration specialist with strong leadership skills. Brings innovative marketing strategies and expands industry networks.',
      social: {
        linkedin: 'https://www.linkedin.com/in/dolakala-harshitha-902833336?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        email: 'harshitha@gmail.com'
      }
    },
    {
      id: 4,
      name: 'Nimmala Prashanth',
      position: 'Technical Lead',
      image: '/assets/Prashanth.jpg',
      bio: 'Innovative full-stack developer with a passion for cutting-edge technologies. Creative problem-solver who enjoys tackling technical challenges. Dedicated to mentoring and empowering student developers.',
      social: {
        linkedin: 'https://www.linkedin.com/in/nimmala-prashanth-9172b42a4/',
        email: 'nimmalaprashanth9@gmail.com'
      }
    },
    {
      id: 5,
      name: 'D.Sandeep',
      position: 'General Secretary',
      image: '/assets/sandeep.jpg',
      bio: 'Ensures seamless coordination across all departments. Combines design expertise with strategic planning. Streamlined operations by 40%.',
      social: {
        linkedin: 'https://linkedin.com/in/sandeep',
        email: 'sandeep@gmail.com'
      }
    },
    {
      id: 6,
      name: 'S.Siddhartha',
      position: 'Events Coordinator',
      image: '/assets/siddhartha.jpg',
      bio: 'Transforms concepts into unforgettable experiences. Expert in event logistics and audience engagement. Coordinated 15+ major events with 500+ attendees.',
      social: {
        linkedin: 'https://www.linkedin.com/in/porandla-siddhartha-38b01b274?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app ',
        email: ' porandlasiddhartha34@gmail.com '
      }
    },
    {
      id: 7,
      name: 'V. Subhaktha Angel',
      position: 'Head of Content and Media',
      image: '/assets/angel.jpg',
      bio: 'Communications specialist crafting E-Cell\'s narrative across platforms. Expert in digital media and content production. Increased social media engagement by 200%.',
      social: {
        linkedin: 'https://linkedin.com/in/angel',
        email: 'angel@ecell.org'
      }
    },
    {
      id: 8,
      name: 'N. Ashrutha',
      position: 'Treasurer',
      image: '/assets/Ashrutha.jpg',
      bio: 'Financial strategist managing resources with precision. Economics expert in budget allocation. Secured grants and sponsorships totaling over ₹10 lakhs.',
      social: {
        linkedin: 'https://www.linkedin.com/in/ashrutha-nimmala-4b02452b8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        email: 'ashruthanimmala6@gmail.com'
      }
    },
    {
      id: 9,
      name: 'M.Sahasra',
      position: 'Head of Outreach',
      image: '/assets/sahasra.jpg',
      bio: 'Expands E-Cell\'s influence through strategic networking. Journalism background with strong interpersonal skills. Established key industry and academic collaborations.',
      social: {
        linkedin: 'https://linkedin.com/in/sahasra',
        email: 'sahasra@ecell.org'
      }
    },
    {
      id: 10,
      name: 'Md.Ibrahim',
      position: 'Content Strategist',
      image: '/assets/ibrahim.jpg',
      bio: 'Transforms entrepreneurial concepts into compelling narratives. Drives content strategy across multiple platforms. Documents student founders\' journeys through engaging content.',
      social: {
        linkedin: 'https://linkedin.com/in/ibrahim',
        email: 'ibrahim@ecell.org'
      }
    }
  ]);

  // Local partners data
  const [partners] = useState([
    { id: 1, name: 'TechIncubator', logo: '/images/partners/tech-incubator.png' },
    { id: 2, name: 'VentureCapital', logo: '/images/partners/venture-capital.png' },
    { id: 3, name: 'InnovationHub', logo: '/images/partners/innovation-hub.png' },
    { id: 4, name: 'StartupAccelerator', logo: '/images/partners/startup-accelerator.png' },
    { id: 5, name: 'TechGiants', logo: '/images/partners/tech-giants.png' },
    { id: 6, name: 'DigitalSolutions', logo: '/images/partners/digital-solutions.png' }
  ]);

  // Milestones data
  const [milestones] = useState([
    { year: 2023, title: 'E-Cell Founded', description: 'Started with just 10 members and a vision to foster entrepreneurship.' },
    { year: 2024, title: 'First Startup Weekend', description: 'Hosted our first major event with 100+ participants.' },
    { year: 2024, title: 'Incubation Center', description: 'Established a dedicated space for student startups.' },
    { year: 2025, title: 'National Recognition', description: 'Recognized as one of the top 10 E-Cells in the country.' },
    { year: 2025, title: 'Virtual Transformation', description: 'Successfully transitioned all programs to virtual format.' },
    { year: 2025, title: 'Global Partnerships', description: 'Formed alliances with international entrepreneurship networks.' },
    { year: 2025, title: 'Startup Fund', description: 'Launched a seed fund to support early-stage student ventures.' }
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary-800 text-white">
        <div className="absolute inset-0 z-0 opacity-30">
          <StableImage 
            src="/assets/about-hero.jpg" 
            alt="About E-Cell" 
            className="w-full h-full"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">About E-Cell</h1>
            <p className="text-xl text-primary-100 mb-4">
              Empowering the next generation of entrepreneurs since 2015.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                E-Cell aims to foster entrepreneurship and innovation among students by providing them with the knowledge, resources, and network needed to transform their ideas into successful ventures.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We believe that entrepreneurship is not just about starting businesses, but about developing a mindset that embraces creativity, problem-solving, and resilience.
              </p>
              <p className="text-lg text-gray-700">
                Through our various initiatives, we strive to create an ecosystem that nurtures entrepreneurial talent and contributes to the growth of the startup community.
              </p>
            </div>
            <div className="relative">
              <StableImage 
                src="/assets/our mission.jpg" 
                alt="E-Cell Mission" 
                className="rounded-lg shadow-lg"
                style={{ height: '300px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <StableImage 
                src="/assets/our vision.jpg" 
                alt="E-Cell Vision" 
                className="rounded-lg shadow-lg"
                style={{ height: '300px' }}
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 mb-6">
                We envision a campus where entrepreneurship is a viable career path for students across all disciplines, and where innovative ideas flourish.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Our goal is to be the bridge that connects students with the entrepreneurial ecosystem, providing them with opportunities to learn, experiment, and grow.
              </p>
              <p className="text-lg text-gray-700">
                By 2025, we aim to have supported the launch of 100+ student startups and established our institution as a hub for entrepreneurial excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section id="achievements" className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white font-bold z-10">
                    {milestone.year}
                  </div>
                  
                  <div 
                    className={`w-5/12 bg-white p-6 rounded-lg shadow-md ${
                      index % 2 === 0 ? 'mr-auto pr-12' : 'ml-auto pl-12'
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-gray-700">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4 text-center">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-12">
            Dedicated individuals working together to foster entrepreneurship and innovation on campus.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:transform hover:scale-105">
                <StableImage 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64"
                  placeholderContent={
                    <div className="text-gray-400 text-center">
                      <div className="text-5xl mb-2">👤</div>
                      <div>Team Member</div>
                    </div>
                  }
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  
                  <div className="flex space-x-4">
                    {member.social?.linkedin && (
                      <a 
                        href={member.social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-primary-600 transition-colors"
                        aria-label={`${member.name}'s LinkedIn`}
                      >
                        <FaLinkedin className="text-xl" />
                      </a>
                    )}

                    {member.social?.email && (
                      <a 
                        href={`mailto:${member.social.email}`} 
                        className="text-gray-500 hover:text-primary-600 transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <FaEnvelope className="text-xl" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Partners</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-12">
            We collaborate with leading organizations to provide the best opportunities for our members.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partners.map((partner) => (
              <div key={partner.id} className="flex items-center justify-center p-4">
                <StableImage 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-h-16 grayscale hover:grayscale-0 transition-all duration-300"
                  style={{ height: '60px', width: 'auto' }}
                  objectFit="contain"
                  placeholderContent={
                    <div className="text-gray-400 text-center text-xs">
                      {partner.name}
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
            <p className="text-xl mb-8">
              Passionate about entrepreneurship? Want to make a difference? Join our team and help build the next generation of entrepreneurs.
            </p>
            <a 
              href="/get-involved#join-team" 
              className="btn bg-white text-primary-600 hover:bg-gray-100"
            >
              Apply Now
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage