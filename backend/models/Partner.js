import mongoose from 'mongoose';
import slugify from 'slugify';

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  logo: {
    type: String,
    required: [true, 'Logo is required']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please provide a valid URL'
    ]
  },
  description: {
    type: String,
    trim: true
  },
  partnershipType: {
    type: String,
    enum: ['sponsor', 'academic', 'industry', 'incubator', 'investor', 'other'],
    default: 'other'
  },
  order: {
    type: Number,
    default: 999
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
partnerSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;