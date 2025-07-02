import mongoose from 'mongoose';
import slugify from 'slugify';

const StartupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a startup name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  tagline: {
    type: String,
    required: [true, 'Please provide a tagline'],
    maxlength: [200, 'Tagline cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  logo: {
    type: String,
    default: 'default-startup-logo.png'
  },
  coverImage: {
    type: String,
    default: 'default-startup-cover.jpg'
  },
  website: {
    type: String,
    match: [
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
      'Please provide a valid URL'
    ]
  },
  foundedYear: {
    type: Number,
    min: [1900, 'Founded year must be after 1900'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  stage: {
    type: String,
    enum: ['Idea', 'Prototype', 'Early Stage', 'Growth', 'Established'],
    default: 'Idea'
  },
  industry: {
    type: String,
    required: [true, 'Please provide an industry'],
    enum: [
      'Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce', 
      'Food & Beverage', 'Transportation', 'Real Estate', 'Entertainment',
      'Energy', 'Manufacturing', 'Agriculture', 'Other'
    ]
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  teamSize: {
    type: Number,
    min: [1, 'Team size must be at least 1'],
    default: 1
  },
  founders: [{
    name: {
      type: String,
      required: true
    },
    role: String,
    linkedIn: String,
    image: String
  }],
  socialMedia: {
    linkedIn: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  pitchDeck: String,
  funding: {
    raised: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    stage: {
      type: String,
      enum: ['Bootstrapped', 'Pre-seed', 'Seed', 'Series A', 'Series B+', 'Not Disclosed'],
      default: 'Bootstrapped'
    },
    investors: [String]
  },
  achievements: [String],
  isIncubated: {
    type: Boolean,
    default: false
  },
  incubationDetails: {
    incubator: String,
    joinedDate: Date,
    graduationDate: Date
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create startup slug from the name
StartupSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

export default mongoose.model('Startup', StartupSchema);