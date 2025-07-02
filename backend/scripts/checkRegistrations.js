import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import config from '../config/index.js';

// Load environment variables
dotenv.config();

async function checkRegistrations() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.db.uri, config.db.options);
    console.log('Connected to MongoDB');
    
    const events = await Event.find({});
    console.log(`Found ${events.length} events in the database`);
    
    for (const event of events) {
      console.log(`\nEvent: ${event.title} (ID: ${event._id})`);
      console.log(`Registrations: ${event.registrations.length}`);
      
      if (event.registrations.length > 0) {
        console.log('Registration details:');
        event.registrations.forEach((reg, index) => {
          console.log(`  ${index + 1}. ${reg.name} (${reg.email})`);
          console.log(`     Phone: ${reg.phone}`);
          console.log(`     College: ${reg.college}`);
          console.log(`     Year: ${reg.year}`);
          console.log(`     Registered at: ${new Date(reg.registeredAt).toLocaleString()}`);
        });
      } else {
        console.log('No registrations for this event');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

checkRegistrations();