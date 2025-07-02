import mongoose from 'mongoose';
import slugify from 'slugify';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  longDescription: {
    type: String,
    required: [true, 'Please add a detailed description']
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  endDate: {
    type: Date
  },
  time: {
    type: String,
    required: [true, 'Please add event time']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  locationLink: String,
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['workshop', 'competition', 'speaker', 'networking', 'hackathon', 'other']
  },
  image: {
    type: String,
    default: 'default-event.jpg'
  },
  gallery: [String],
  registrationFee: {
    type: String,
    default: 'Free'
  },
  registrationDeadline: Date,
  maxParticipants: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  agenda: [{
    day: String,
    items: [{
      time: String,
      activity: String
    }]
  }],
  speakers: [{
    name: String,
    title: String,
    image: String,
    bio: String
  }],
  prerequisites: [String],
  faqs: [{
    question: String,
    answer: String
  }],
  organizers: [{
    name: String,
    logo: String
  }],
  sponsors: [{
    name: String,
    logo: String,
    tier: String
  }],
  registrations: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    phone: String,
    college: String,
    year: String,
    expectations: String,
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    },
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateLink: String
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPast: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Create event slug from the title
EventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  // Automatically set isPast based on event date
  const now = new Date();
  if (this.endDate) {
    this.isPast = this.endDate < now;
  } else {
    this.isPast = this.date < now;
  }
  
  next();
});

// Get registration count
EventSchema.virtual('registrationCount').get(function() {
  return this.registrations.length;
});

// Check if event is full
EventSchema.virtual('isFull').get(function() {
  if (this.maxParticipants === 0) return false;
  return this.registrations.length >= this.maxParticipants;
});

export default mongoose.model('Event', EventSchema);