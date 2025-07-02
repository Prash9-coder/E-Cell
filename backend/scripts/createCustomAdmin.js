const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

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

// Custom admin details - change these to your preferred values
const ADMIN_NAME = 'Prashanth Nimmala';
const ADMIN_EMAIL = 'prashanth@gmail.com';
const ADMIN_PASSWORD = 'prashanth123';

const createCustomAdmin = async () => {
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
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log(`Admin user with email ${ADMIN_EMAIL} already exists`);
      
      // Update the password to ensure it's correct
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
      
      existingAdmin.password = hashedPassword;
      existingAdmin.name = ADMIN_NAME; // Update name if needed
      await existingAdmin.save();
      
      console.log(`✅ Admin user updated successfully`);
    } else {
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
      
      const adminUser = new User({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Custom admin user created successfully');
    }
    
    console.log('\nAdmin User Details:');
    console.log(`Name: ${ADMIN_NAME}`);
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
    
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

createCustomAdmin();