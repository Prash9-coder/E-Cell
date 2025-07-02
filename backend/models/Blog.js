import mongoose from 'mongoose';
import slugify from 'slugify';

// Schema for blog categories
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters'],
    unique: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  color: {
    type: String,
    default: '#3498db'
  },
  icon: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for blog comments
const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  authorName: String,
  authorEmail: String,
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  replies: [{
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Reply cannot be more than 1000 characters']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    authorName: String,
    authorEmail: String,
    isApproved: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Schema for blog posts
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  featuredImage: {
    type: String,
    default: 'default-blog-image.jpg'
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [CommentSchema],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  readTime: {
    type: Number,
    default: 5 // in minutes
  },
  publishedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create slugs
CategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

PostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  // Set publishedAt date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  // Calculate read time based on content length (average reading speed: 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

// Update comment's updatedAt field on save
CommentSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

export const Category = mongoose.model('Category', CategorySchema);
export const Post = mongoose.model('Post', PostSchema);