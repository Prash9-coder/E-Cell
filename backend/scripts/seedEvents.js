import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import config from '../config/index.js';

// Load environment variables
dotenv.config();

// Sample events data
const eventsData = [
  {
    title: 'Startup Weekend',
    slug: 'startup-weekend',
    description: 'A 54-hour event where entrepreneurs pitch ideas, form teams, and launch startups.',
    longDescription: `
      <p>Startup Weekend is an intensive 54-hour event where aspiring entrepreneurs, developers, designers, and business enthusiasts come together to share ideas, form teams, build products, and launch startups.</p>
      
      <p>Starting on Friday, participants will pitch their startup ideas and receive feedback from peers. Teams will form around the top ideas (as determined by popular vote) and embark on a three-day journey of business model creation, coding, designing, and market validation.</p>
      
      <p>The weekend culminates with presentations in front of local entrepreneurial leaders with another opportunity for critical feedback. Whether you're looking for feedback on an idea, seeking a co-founder, or wanting to learn a new skill, Startup Weekend is the perfect environment to test your entrepreneurial spirit.</p>
    `,
    date: new Date('2024-06-15'),
    endDate: new Date('2024-06-17'),
    time: '09:00 AM - 06:00 PM',
    location: 'Main Auditorium',
    category: 'competition',
    isFeatured: true,
    createdBy: '000000000000000000000000', // Dummy ObjectId
  },
  {
    title: 'Venture Capital Panel',
    slug: 'venture-capital-panel',
    description: 'Learn from top VCs about what they look for in startups and how to secure funding.',
    longDescription: `
      <p>Join us for an insightful panel discussion with leading venture capitalists who will share their perspectives on the current investment landscape, what they look for in startups, and how to successfully secure funding.</p>
      
      <p>Our distinguished panelists have collectively invested in over 100 startups across various sectors including technology, healthcare, and sustainable energy. They will discuss current trends in venture capital, common pitfalls entrepreneurs should avoid, and strategies for building relationships with potential investors.</p>
      
      <p>This event is perfect for founders at any stage of their entrepreneurial journey, from those with just an idea to those preparing for their Series A. Don't miss this opportunity to gain valuable insights directly from those who make investment decisions.</p>
    `,
    date: new Date('2024-07-05'),
    time: '02:00 PM - 04:00 PM',
    location: 'Business School, Room 302',
    category: 'speaker',
    isFeatured: true,
    createdBy: '000000000000000000000000', // Dummy ObjectId
  },
  {
    title: 'Tech Hackathon',
    slug: 'tech-hackathon',
    description: 'Build innovative solutions to real-world problems in this 24-hour coding marathon.',
    longDescription: `
      <p>Our annual Tech Hackathon brings together programmers, designers, and problem solvers for 24 hours of collaborative innovation. Participants will work in teams to develop solutions to real-world challenges provided by our industry partners.</p>
      
      <p>This year's themes include sustainable technology, healthcare innovation, and financial inclusion. Teams will have access to mentors from leading tech companies who will provide guidance throughout the event.</p>
      
      <p>Whether you're a seasoned developer or just starting your coding journey, the Tech Hackathon offers a supportive environment to learn new skills, build your network, and potentially win exciting prizes including cash awards, internship opportunities, and tech gadgets.</p>
    `,
    date: new Date('2024-07-20'),
    endDate: new Date('2024-07-21'),
    time: '10:00 AM - 10:00 AM (24 hours)',
    location: 'Engineering Building',
    category: 'hackathon',
    isFeatured: true,
    createdBy: '000000000000000000000000', // Dummy ObjectId
  }
];

// Connect to MongoDB
const seedEvents = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.db.uri, config.db.options);
    console.log('Connected to MongoDB');

    // Clear existing events
    console.log('Clearing existing events...');
    await Event.deleteMany({});
    console.log('Existing events cleared');

    // Insert new events
    console.log('Inserting new events...');
    const createdEvents = await Event.insertMany(eventsData);
    console.log(`${createdEvents.length} events created successfully`);

    // Log the created events
    createdEvents.forEach((event, index) => {
      console.log(`Event ${index + 1}: ${event.title} (ID: ${event._id})`);
    });

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the seed function
seedEvents();