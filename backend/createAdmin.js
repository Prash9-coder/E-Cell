import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://E-Cell:E-Cell@cluster0.lgsf3pb.mongodb.net/ecell');
    console.log('✅ MongoDB connected successfully');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@ecell.org' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      // Create admin user
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@ecell.org',
        password: 'admin123',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();