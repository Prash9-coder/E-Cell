import mongoose from 'mongoose';

// Schema for newsletter subscribers
const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  name: {
    type: String,
    trim: true
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  interests: [String],
  source: {
    type: String,
    enum: ['website', 'event', 'referral', 'social', 'other'],
    default: 'website'
  },
  unsubscribeToken: {
    type: String,
    unique: true
  },
  lastEmailSent: Date
});

// Schema for newsletter campaigns
const NewsletterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Please provide an email subject'],
    trim: true,
    maxlength: [150, 'Subject cannot be more than 150 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide newsletter content']
  },
  htmlContent: {
    type: String
  },
  previewText: {
    type: String,
    maxlength: [150, 'Preview text cannot be more than 150 characters']
  },
  featuredImage: String,
  tags: [String],
  targetGroups: [String],
  scheduledFor: Date,
  sentAt: Date,
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'cancelled'],
    default: 'draft'
  },
  stats: {
    totalRecipients: {
      type: Number,
      default: 0
    },
    opens: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    bounces: {
      type: Number,
      default: 0
    },
    unsubscribes: {
      type: Number,
      default: 0
    }
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

// Update the updatedAt field on save
NewsletterSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Generate unsubscribe token for new subscribers
SubscriberSchema.pre('save', function(next) {
  if (this.isNew && !this.unsubscribeToken) {
    this.unsubscribeToken = require('crypto').randomBytes(32).toString('hex');
  }
  next();
});

export const Subscriber = mongoose.model('Subscriber', SubscriberSchema);
export const Newsletter = mongoose.model('Newsletter', NewsletterSchema);