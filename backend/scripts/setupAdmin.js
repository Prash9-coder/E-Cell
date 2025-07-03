import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://E-Cell:E-Cell@cluster0.lgsf3pb.mongodb.net/ecell';

// Create a simple User schema for this script
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the User model
const User = mongoose.model('User', UserSchema);

const createAdminUser = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log(`URI: ${MONGO_URI}`);
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email: admin@gmail.com');
      console.log('Password: admin123 (or whatever was set previously)');
      
      // Update the password to ensure it's correct
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      
      console.log('✅ Admin password has been reset to: admin123');
    } else {
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log('Email: admin@gmail.com');
      console.log('Password: admin123');
    }
    
    // List all users in the database
    const users = await User.find();
    console.log('\nUsers in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
    
    console.log('\nYou can now log in with:');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.name === 'MongoServerError') {
      console.error('MongoDB connection error details:', error);
    }
  } finally {
    // Ensure the process exits
    process.exit(0);
  }
};

// Create directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, '..'))) {
  fs.mkdirSync(path.join(__dirname, '..'), { recursive: true });
}

createAdminUser();