import mongoose from 'mongoose';
import slugify from 'slugify';

// Schema for individual images
const ImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an image title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  filename: {
    type: String,
    required: [true, 'Image filename is required']
  },
  path: {
    type: String,
    required: [true, 'Image path is required']
  },
  size: {
    type: Number,
    required: [true, 'Image size is required']
  },
  mimetype: {
    type: String,
    required: [true, 'Image mimetype is required']
  },
  width: Number,
  height: Number,
  altText: String,
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for albums/collections of images
const AlbumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an album title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  coverImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }],
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
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

// Create album slug from the title
AlbumSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

export const Image = mongoose.model('Image', ImageSchema);
export const Album = mongoose.model('Album', AlbumSchema);