import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super-admin'],
    default: 'user'
  },
  profileImage: {
    type: String,
    default: 'default-avatar.jpg'
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  college: String,
  year: String,
  department: String,
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  skills: [String],
  interests: [String],
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String,
    website: String
  },
  eventsRegistered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  eventsAttended: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  newsletterSubscribed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  lastActive: Date
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  // Default expiration to 30 days if not set in environment
  const expiresIn = process.env.JWT_EXPIRE || '30d';
  
  return jwt.sign(
    { 
      id: this._id, 
      role: this.role,
      email: this.email,
      name: this.name,
      // Add timestamp to ensure unique tokens
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET || 'your-secret-key-for-development',
    { expiresIn }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

export default mongoose.model('User', UserSchema);