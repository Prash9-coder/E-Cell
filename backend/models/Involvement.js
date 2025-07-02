import mongoose from 'mongoose';

const InvolvementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  college: {
    type: String,
    required: [true, 'Please provide your college/university name'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Please provide your year of study'],
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate', 'Other']
  },
  department: {
    type: String,
    required: [true, 'Please provide your department/major'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please select the role you are interested in'],
    enum: ['Technical Team', 'Marketing Team', 'Content Team', 'Design Team', 'Events Team', 'PR Team', 'Other']
  },
  otherRole: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'Please describe your relevant experience'],
    maxlength: [1000, 'Experience description cannot be more than 1000 characters']
  },
  skills: {
    type: String,
    required: [true, 'Please list your relevant skills'],
    maxlength: [500, 'Skills cannot be more than 500 characters']
  },
  whyJoin: {
    type: String,
    required: [true, 'Please tell us why you want to join E-Cell'],
    maxlength: [1000, 'Your answer cannot be more than 1000 characters']
  },
  linkedinProfile: {
    type: String,
    match: [
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
      'Please provide a valid LinkedIn profile URL'
    ]
  },
  resumeUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'contacted', 'accepted', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
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

// Update the updatedAt field on save
InvolvementSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

export default mongoose.model('Involvement', InvolvementSchema);