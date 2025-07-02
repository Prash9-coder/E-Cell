import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaCalendarAlt, FaClock, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaArrowLeft } from 'react-icons/fa'
import { useBlog } from '../context/BlogContext'

const BlogPostPage = () => {
  const { slug } = useParams()
  const { posts, loading: contextLoading, refreshPosts } = useBlog()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock blog posts data (same as in BlogPage)
  const mockPosts = [
    {
      id: 1,
      title: '10 Essential Skills Every Entrepreneur Needs in 2024',
      slug: '10-essential-skills-every-entrepreneur-needs',
      excerpt: 'From adaptability to digital literacy, discover the key skills that will help entrepreneurs thrive in today\'s rapidly evolving business landscape.',
      content: `
        <p>The entrepreneurial landscape is constantly evolving, and staying ahead requires a diverse set of skills. Here are the 10 essential skills every entrepreneur needs to thrive in 2024 and beyond:</p>
        
        <h2>1. Adaptability</h2>
        <p>In a world of rapid technological advancement and market shifts, the ability to pivot quickly and adapt to changing circumstances is perhaps the most crucial skill for entrepreneurs. Those who can embrace change rather than resist it will find opportunities where others see obstacles.</p>
        
        <h2>2. Digital Literacy</h2>
        <p>Beyond basic tech skills, entrepreneurs need to understand emerging technologies like AI, blockchain, and automation. You don't need to be a programmer, but you should comprehend how these technologies can be leveraged in your business.</p>
        
        <h2>3. Data Analysis</h2>
        <p>The ability to collect, interpret, and make decisions based on data is invaluable. Data-driven decision making reduces risk and increases the likelihood of success in product development, marketing, and business strategy.</p>
        
        <h2>4. Financial Management</h2>
        <p>Understanding cash flow, budgeting, and financial forecasting is essential for business survival. Even with a dedicated finance team, entrepreneurs should maintain a solid grasp of their company's financial health.</p>
        
        <h2>5. Emotional Intelligence</h2>
        <p>The ability to understand and manage your emotions, as well as recognize and influence the emotions of others, is crucial for effective leadership, team building, and customer relations.</p>
        
        <h2>6. Strategic Thinking</h2>
        <p>Looking beyond day-to-day operations to envision the bigger picture helps entrepreneurs identify opportunities, anticipate challenges, and develop long-term plans for growth and sustainability.</p>
        
        <h2>7. Communication</h2>
        <p>Clear, persuasive communication—whether pitching to investors, marketing to customers, or leading team members—remains a cornerstone of entrepreneurial success.</p>
        
        <h2>8. Networking</h2>
        <p>Building and maintaining a strong professional network provides access to resources, partnerships, mentorship, and potential customers. In 2024, this includes both in-person and digital networking skills.</p>
        
        <h2>9. Time Management</h2>
        <p>With countless demands on their attention, entrepreneurs must master prioritization, delegation, and efficient work practices to maximize productivity without burning out.</p>
        
        <h2>10. Continuous Learning</h2>
        <p>Perhaps most importantly, successful entrepreneurs cultivate a growth mindset and commit to lifelong learning. The willingness to acquire new knowledge and skills as needed will ensure you remain competitive in an ever-changing business environment.</p>
        
        <p>While no entrepreneur excels in all these areas initially, recognizing which skills you need to develop and actively working to strengthen them will significantly increase your chances of success. Consider which of these skills you need to focus on in the coming year, and create a personal development plan to address any gaps.</p>
      `,
      image: '/images/blog/entrepreneur-skills.jpg',
      category: 'entrepreneurship',
      author: {
        name: 'Priya Sharma',
        avatar: '/images/team/priya-sharma.jpg',
        role: 'E-Cell President',
        bio: 'Priya is a final-year MBA student and the current President of E-Cell. She has founded two startups and is passionate about fostering entrepreneurship among students.'
      },
      date: '2024-01-15',
      readTime: '8 min read',
      featured: true
    },
    {
      id: 2,
      title: 'How to Validate Your Startup Idea on a Budget',
      slug: 'validate-startup-idea-on-budget',
      excerpt: 'Learn cost-effective strategies to test your business concept and gather valuable market feedback before investing significant resources.',
      content: `
        <p>One of the biggest mistakes new entrepreneurs make is investing too much time and money into an idea before validating whether there's a market for it. Here's how to validate your startup idea effectively without breaking the bank:</p>
        
        <h2>Start with Problem Validation</h2>
        <p>Before thinking about your solution, confirm that the problem you're trying to solve actually exists and is significant enough that people would pay for a solution.</p>
        
        <ul>
          <li><strong>Conduct informal interviews</strong> - Talk to at least 20-30 people in your target market about the problem. Listen more than you speak.</li>
          <li><strong>Join relevant online communities</strong> - Forums, Facebook groups, Reddit, and Discord servers where your potential customers gather can provide invaluable insights.</li>
          <li><strong>Analyze search trends</strong> - Use free tools like Google Trends to see if people are searching for solutions to the problem you're addressing.</li>
        </ul>
        
        <h2>Create a Minimum Viable Product (MVP)</h2>
        <p>Build the simplest version of your product that delivers core value:</p>
        
        <ul>
          <li><strong>Paper prototypes</strong> - For apps or websites, start with simple sketches to test user flows.</li>
          <li><strong>Landing page test</strong> - Create a simple landing page describing your solution and collect email signups to gauge interest.</li>
          <li><strong>"Wizard of Oz" testing</strong> - Manually deliver your service behind an automated-looking interface to test demand before building the actual technology.</li>
          <li><strong>Pre-sales campaign</strong> - If applicable, try selling your product before it's built to validate willingness to pay.</li>
        </ul>
        
        <h2>Leverage No-Code/Low-Code Tools</h2>
        <p>Build functional prototypes without coding skills:</p>
        
        <ul>
          <li><strong>Website builders</strong> - Wix, Squarespace, or WordPress for landing pages</li>
          <li><strong>Form builders</strong> - Google Forms, Typeform, or JotForm for collecting data</li>
          <li><strong>Automation tools</strong> - Zapier or Make (formerly Integromat) to connect different services</li>
          <li><strong>App builders</strong> - Bubble, Glide, or Adalo for creating functional apps without coding</li>
        </ul>
        
        <h2>Test Marketing Channels Cheaply</h2>
        <p>Validate marketing approaches before scaling:</p>
        
        <ul>
          <li><strong>Micro-testing ads</strong> - Run small-budget ad campaigns ($50-100) to test messaging and audience targeting</li>
          <li><strong>Content marketing</strong> - Write guest posts for established blogs in your industry</li>
          <li><strong>Community engagement</strong> - Provide value in online communities where your potential customers gather</li>
        </ul>
        
        <h2>Analyze and Iterate</h2>
        <p>The validation process is iterative:</p>
        
        <ul>
          <li>Set clear metrics for what constitutes validation (e.g., 40% of interviewees confirm the problem exists, 10% conversion rate on landing page, etc.)</li>
          <li>Be ready to pivot if your initial assumptions prove incorrect</li>
          <li>Document everything you learn for future reference</li>
        </ul>
        
        <p>Remember that validation isn't about proving your idea is right—it's about finding out if it's right before you invest significant resources. Be open to feedback and willing to change direction based on what you learn. The most successful entrepreneurs aren't those with the best initial ideas, but those who effectively validate and refine their ideas based on market feedback.</p>
      `,
      image: '/images/blog/idea-validation.jpg',
      category: 'startup',
      author: {
        name: 'Rahul Verma',
        avatar: '/images/team/rahul-verma.jpg',
        role: 'Startup Mentor',
        bio: 'Rahul is a serial entrepreneur and startup mentor with over 10 years of experience in the tech industry. He has helped dozens of student startups move from idea to execution.'
      },
      date: '2023-12-28',
      readTime: '6 min read',
      featured: true
    },
    {
      id: 3,
      title: 'The Rise of AI in Entrepreneurship: Opportunities and Challenges',
      slug: 'ai-in-entrepreneurship',
      excerpt: 'Explore how artificial intelligence is transforming the startup ecosystem and what founders need to know to leverage this technology effectively.',
      content: `
        <p>Artificial Intelligence (AI) is no longer just a buzzword or a technology of the future—it's here now and rapidly transforming the entrepreneurial landscape. For founders and startup teams, understanding AI's potential and challenges is becoming essential knowledge. Let's explore how AI is reshaping entrepreneurship and what it means for your venture.</p>
        
        <h2>Transformative Opportunities</h2>
        
        <h3>1. Enhanced Efficiency and Automation</h3>
        <p>AI tools can automate repetitive tasks across virtually every business function:</p>
        <ul>
          <li><strong>Customer service</strong> - AI chatbots can handle routine inquiries 24/7</li>
          <li><strong>Marketing</strong> - AI can generate content, optimize ad targeting, and personalize customer experiences</li>
          <li><strong>Operations</strong> - Predictive analytics can optimize inventory, supply chains, and resource allocation</li>
          <li><strong>Product development</strong> - AI can analyze user data to identify improvement opportunities</li>
        </ul>
        
        <h3>2. Cost Reduction</h3>
        <p>For cash-strapped startups, AI offers ways to accomplish more with less:</p>
        <ul>
          <li>Reducing the need for large customer service teams</li>
          <li>Minimizing errors and waste in operations</li>
          <li>Enabling sophisticated data analysis without a team of data scientists</li>
          <li>Accelerating development cycles</li>
        </ul>
        
        <h3>3. New Product Possibilities</h3>
        <p>AI enables entirely new categories of products and services:</p>
        <ul>
          <li>Personalized recommendations at scale</li>
          <li>Predictive healthcare solutions</li>
          <li>Smart home and IoT innovations</li>
          <li>Computer vision applications across industries</li>
          <li>Natural language processing tools for content creation and analysis</li>
        </ul>
        
        <h3>4. Competitive Intelligence</h3>
        <p>AI tools can continuously monitor competitors, market trends, and consumer sentiment, providing startups with actionable insights that were previously available only to enterprises with substantial research budgets.</p>
        
        <h2>Significant Challenges</h2>
        
        <h3>1. Technical Complexity</h3>
        <p>Implementing AI solutions often requires specialized knowledge:</p>
        <ul>
          <li>Finding AI talent remains difficult and expensive</li>
          <li>The technology landscape is evolving rapidly</li>
          <li>Integration with existing systems can be complex</li>
        </ul>
        
        <h3>2. Data Requirements</h3>
        <p>Most AI systems need substantial data to function effectively:</p>
        <ul>
          <li>Early-stage startups may lack sufficient data</li>
          <li>Data quality issues can undermine AI performance</li>
          <li>Privacy regulations complicate data collection and usage</li>
        </ul>
        
        <h3>3. Ethical Considerations</h3>
        <p>AI brings significant ethical responsibilities:</p>
        <ul>
          <li>Algorithmic bias can perpetuate or amplify discrimination</li>
          <li>Transparency in AI decision-making is increasingly expected</li>
          <li>Privacy concerns must be addressed proactively</li>
        </ul>
        
        <h3>4. Rapid Obsolescence</h3>
        <p>The pace of AI advancement means today's cutting-edge solution may be outdated within months, requiring continuous learning and adaptation.</p>
        
        <h2>Strategic Approaches for Entrepreneurs</h2>
        
        <h3>Start Small and Focused</h3>
        <p>Rather than attempting to transform your entire business with AI, identify specific high-value use cases where AI can deliver immediate benefits.</p>
        
        <h3>Leverage Existing AI Tools</h3>
        <p>Many AI capabilities are now available as APIs or SaaS products, allowing startups to implement AI without building systems from scratch.</p>
        
        <h3>Build an AI-Ready Culture</h3>
        <p>Foster data literacy across your team and create processes for continuous learning about AI developments in your industry.</p>
        
        <h3>Consider Ethical Implications Early</h3>
        <p>Build ethical considerations into your AI strategy from the beginning, including mechanisms for detecting and addressing bias.</p>
        
        <h3>Develop a Data Strategy</h3>
        <p>Even before implementing AI, ensure you're collecting and organizing data in ways that will support future AI initiatives.</p>
        
        <p>The AI revolution in entrepreneurship is just beginning. Founders who thoughtfully incorporate AI into their strategy—understanding both its potential and limitations—will be best positioned to thrive in this new landscape. The key is to approach AI not as a silver bullet, but as a powerful tool that, when applied strategically, can create significant competitive advantages.</p>
      `,
      image: '/images/blog/ai-entrepreneurship.jpg',
      category: 'technology',
      author: {
        name: 'Vikram Reddy',
        avatar: '/images/team/vikram-reddy.jpg',
        role: 'Tech Lead',
        bio: 'Vikram specializes in emerging technologies and their business applications. He has worked with several AI startups and advises E-Cell on technology trends.'
      },
      date: '2023-12-10',
      readTime: '10 min read',
      featured: true
    },
    {
      id: 4,
      title: 'Highlights from E-Summit 2023: Innovate, Inspire, Impact',
      slug: 'e-summit-2023-highlights',
      excerpt: 'A recap of our flagship annual entrepreneurship summit featuring keynote speeches, startup competitions, and networking opportunities.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.',
      image: '/images/blog/e-summit-2023.jpg',
      category: 'events',
      author: {
        name: 'Ananya Patel',
        avatar: '/images/team/ananya-patel.jpg',
        role: 'Events Coordinator',
        bio: 'Ananya leads the events team at E-Cell and has organized over 20 entrepreneurship events. She is passionate about creating meaningful networking opportunities for students.'
      },
      date: '2023-11-22',
      readTime: '7 min read',
      featured: false
    },
    {
      id: 5,
      title: 'Sustainable Business Models: Profitability with Purpose',
      slug: 'sustainable-business-models',
      excerpt: 'Discover how entrepreneurs are creating businesses that generate profits while addressing environmental and social challenges.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.',
      image: '/images/blog/sustainable-business.jpg',
      category: 'innovation',
      author: {
        name: 'Arjun Singh',
        avatar: '/images/team/arjun-singh.jpg',
        role: 'Sustainability Lead',
        bio: 'Arjun focuses on sustainable entrepreneurship and has helped several eco-friendly startups develop their business models. He is an advocate for responsible business practices.'
      },
      date: '2023-11-05',
      readTime: '9 min read',
      featured: false
    },
    {
      id: 6,
      title: 'From Campus to Company: Student Startup Success Stories',
      slug: 'campus-to-company-success-stories',
      excerpt: 'Inspiring journeys of student entrepreneurs who transformed their college projects into thriving businesses.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.',
      image: '/images/blog/student-startups.jpg',
      category: 'startup',
      author: {
        name: 'Zara Khan',
        avatar: '/images/team/zara-khan.jpg',
        role: 'Alumni Relations',
        bio: 'Zara manages alumni relations for E-Cell and documents success stories of student entrepreneurs. She has interviewed over 50 founders about their entrepreneurial journeys.'
      },
      date: '2023-10-18',
      readTime: '8 min read',
      featured: false
    },
    {
      id: 7,
      title: 'Funding 101: A Guide to Financing Options for Early-Stage Startups',
      slug: 'funding-guide-early-stage-startups',
      excerpt: 'Navigate the complex world of startup funding with this comprehensive overview of bootstrapping, angel investment, venture capital, and more.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.',
      image: '/images/blog/startup-funding.jpg',
      category: 'startup',
      author: {
        name: 'Rahul Verma',
        avatar: '/images/team/rahul-verma.jpg',
        role: 'Startup Mentor',
        bio: 'Rahul is a serial entrepreneur and startup mentor with over 10 years of experience in the tech industry. He has helped dozens of student startups move from idea to execution.'
      },
      date: '2023-10-02',
      readTime: '11 min read',
      featured: false
    },
    {
      id: 8,
      title: 'The Power of Design Thinking in Problem Solving',
      slug: 'design-thinking-problem-solving',
      excerpt: 'Learn how the design thinking methodology can help entrepreneurs develop innovative solutions to complex challenges.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.',
      image: '/images/blog/design-thinking.jpg',
      category: 'innovation',
      author: {
        name: 'Ananya Patel',
        avatar: '/images/team/ananya-patel.jpg',
        role: 'Events Coordinator',
        bio: 'Ananya leads the events team at E-Cell and has organized over 20 entrepreneurship events. She is passionate about creating meaningful networking opportunities for students.'
      },
      date: '2023-09-15',
      readTime: '7 min read',
      featured: false
    }
  ]

  // Update loading state when context loading changes
  useEffect(() => {
    setIsLoading(contextLoading)
  }, [contextLoading])
  
  // Refresh posts when component mounts
  useEffect(() => {
    console.log('BlogPostPage mounted, refreshing posts...');
    refreshPosts().catch(error => {
      console.error('Error refreshing posts on BlogPostPage mount:', error);
    });
  }, [])

  // Fetch blog post from context
  useEffect(() => {
    const fetchPost = () => {
      if (posts.length > 0) {
        // Find the post with matching slug
        const foundPost = posts.find(post => post.slug === slug)
        setPost(foundPost || null)
        
        // Get related posts (same category, excluding current post)
        if (foundPost) {
          const related = posts
            .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
            .slice(0, 3)
          setRelatedPosts(related)
        }
        
        setIsLoading(false)
      }
    }
    
    fetchPost()
  }, [slug, posts])

  // Handle 404 - post not found
  if (!isLoading && !post) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="btn btn-primary">
          Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <>
      {isLoading ? (
        <div className="container py-20">
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative py-20 bg-primary-800 text-white">
            <div className="absolute inset-0 z-0 opacity-30">
              <img 
                src={post.image || '/images/blog/default.jpg'} 
                alt={post.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/images/blog/default.jpg';
                  e.target.onerror = null; // Prevent infinite loop
                }}
              />
            </div>
            <div className="container relative z-10">
              <div className="max-w-3xl">
                <Link to="/blog" className="inline-flex items-center text-primary-100 hover:text-white mb-6 transition-colors">
                  <FaArrowLeft className="mr-2" /> Back to Blog
                </Link>
                <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
                <div className="flex items-center">
                  {typeof post.author === 'object' ? (
                    <img 
                      src={post.author.avatar || '/images/team/default-avatar.jpg'} 
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full mr-4"
                      onError={(e) => {
                        e.target.src = '/images/team/default-avatar.jpg';
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                      <FaCalendarAlt className="text-primary-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {typeof post.author === 'object' ? post.author.name : post.author}
                    </p>
                    <div className="flex items-center text-sm text-primary-100">
                      <span className="flex items-center mr-4">
                        <FaCalendarAlt className="mr-1" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        {post.readTime || '5 min read'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Blog Content */}
          <section className="py-12">
            <div className="container">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <div className="lg:w-2/3">
                  <article className="prose prose-lg max-w-none">
                    {post.content && post.content.startsWith('<') ? (
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                      <p>{post.content}</p>
                    )}
                  </article>

                  {/* Share Section */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Share this article</h3>
                    <div className="flex space-x-3">
                      <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                      >
                        <FaFacebookF />
                      </a>

                      <a 
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${post.title}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition-colors"
                      >
                        <FaLinkedinIn />
                      </a>
                      <a 
                        href={`https://api.whatsapp.com/send?text=${post.title} ${window.location.href}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
                      >
                        <FaWhatsapp />
                      </a>
                    </div>
                  </div>

                  {/* Author Bio */}
                  {typeof post.author === 'object' && post.author.bio && (
                    <div className="mt-12 bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-start">
                        <img 
                          src={post.author.avatar || '/images/team/default-avatar.jpg'} 
                          alt={post.author.name}
                          className="w-16 h-16 rounded-full mr-4"
                          onError={(e) => {
                            e.target.src = '/images/team/default-avatar.jpg';
                            e.target.onerror = null;
                          }}
                        />
                        <div>
                          <h3 className="font-bold text-lg">{post.author.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{post.author.role}</p>
                          <p className="text-gray-700">{post.author.bio}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:w-1/3">
                  {/* Related Posts */}
                  <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                    {relatedPosts.length > 0 ? (
                      <div className="space-y-6">
                        {relatedPosts.map(relatedPost => (
                          <Link 
                            key={relatedPost.id} 
                            to={`/blog/${relatedPost.slug}`}
                            className="flex items-start group"
                          >
                            <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden mr-4">
                              <img 
                                src={relatedPost.image || '/images/blog/default.jpg'} 
                                alt={relatedPost.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                onError={(e) => {
                                  e.target.src = '/images/blog/default.jpg';
                                  e.target.onerror = null;
                                }}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                                {relatedPost.title}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">{relatedPost.readTime}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No related articles found.</p>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Categories</h3>
                    <div className="space-y-2">
                      <Link to="/blog?category=startup" className="block py-2 px-4 bg-white rounded hover:bg-gray-100 transition-colors">
                        Startup
                      </Link>
                      <Link to="/blog?category=technology" className="block py-2 px-4 bg-white rounded hover:bg-gray-100 transition-colors">
                        Technology
                      </Link>
                      <Link to="/blog?category=entrepreneurship" className="block py-2 px-4 bg-white rounded hover:bg-gray-100 transition-colors">
                        Entrepreneurship
                      </Link>
                      <Link to="/blog?category=innovation" className="block py-2 px-4 bg-white rounded hover:bg-gray-100 transition-colors">
                        Innovation
                      </Link>
                      <Link to="/blog?category=events" className="block py-2 px-4 bg-white rounded hover:bg-gray-100 transition-colors">
                        Events
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default BlogPostPage