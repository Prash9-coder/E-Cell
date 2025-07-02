import mongoose from 'mongoose';
import slugify from 'slugify';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  image: {
    type: String,
    default: '/images/team/default.jpg'
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true
  },
  order: {
    type: Number,
    default: 999
  },
  social: {
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    linkedin: String,
    instagram: String,
    facebook: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create slug from name before saving
teamSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Team = mongoose.model('Team', teamSchema);

export default Team;