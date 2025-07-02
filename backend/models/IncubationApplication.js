import mongoose from 'mongoose';

const IncubationApplicationSchema = new mongoose.Schema({
  // Team Information
  teamName: {
    type: String,
    required: [true, 'Please provide a team/startup name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  website: {
    type: String,
    match: [
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
      'Please provide a valid URL'
    ]
  },
  teamSize: {
    type: String,
    required: [true, 'Please provide team size']
  },
  
  // Team Members
  leadName: {
    type: String,
    required: [true, 'Please provide team lead name'],
    trim: true
  },
  leadEmail: {
    type: String,
    required: [true, 'Please provide team lead email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  leadPhone: {
    type: String,
    required: [true, 'Please provide team lead phone number']
  },
  leadRole: {
    type: String,
    required: false // Make this optional
  },
  
  // Additional team members
  teamMembers: [{
    name: String,
    email: String,
    role: String
  }],
  
  // Startup Information
  industry: {
    type: String,
    required: false // Make this optional for now
  },
  stage: {
    type: String,
    required: false // Make this optional for now
  },
  description: {
    type: String,
    required: [true, 'Please provide startup description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  problem: {
    type: String,
    required: [true, 'Please provide problem statement'],
    maxlength: [1000, 'Problem statement cannot be more than 1000 characters']
  },
  solution: {
    type: String,
    required: [true, 'Please provide solution'],
    maxlength: [1000, 'Solution cannot be more than 1000 characters']
  },
  traction: {
    type: String,
    maxlength: [1000, 'Traction details cannot be more than 1000 characters']
  },
  
  // Additional Information
  expectations: {
    type: String,
    required: [true, 'Please provide expectations from incubation'],
    maxlength: [1000, 'Expectations cannot be more than 1000 characters']
  },
  pitchDeck: {
    type: String // File path
  },
  referral: {
    type: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
IncubationApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('IncubationApplication', IncubationApplicationSchema);