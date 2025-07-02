import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const galleryDir = path.join(uploadsDir, 'gallery');

// Ensure both directories exist
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(galleryDir)) {
  console.log('Creating gallery uploads directory:', galleryDir);
  fs.mkdirSync(galleryDir, { recursive: true });
}

console.log('Gallery uploads directory:', galleryDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Multer destination:', galleryDir);
    cb(null, galleryDir);
  },
  filename: function (req, file, cb) {
    console.log('Multer filename:', file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    console.log('Multer fileFilter:', file.mimetype, file.originalname);
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      console.log('File rejected: not an image');
      return cb(new Error('Only image files are allowed!'), false);
    }
    console.log('File accepted');
    cb(null, true);
  }
});

// In-memory gallery items storage (replace with database in production)
let galleryItems = [
  {
    id: 1,
    title: 'Annual E-Summit 2023',
    description: 'Highlights from our flagship entrepreneurship summit',
    image: '/images/gallery/e-summit-2023.jpg',
    category: 'events',
    date: '2023-03-15'
  },
  {
    id: 2,
    title: 'Startup Pitch Competition',
    description: 'Students presenting their innovative business ideas',
    image: '/images/gallery/pitch-competition.jpg',
    category: 'competitions',
    date: '2023-02-28'
  },
  {
    id: 3,
    title: 'Design Thinking Workshop',
    description: 'Interactive session on applying design thinking to business problems',
    image: '/images/gallery/design-workshop.jpg',
    category: 'workshops',
    date: '2023-01-20'
  },
  {
    id: 4,
    title: 'E-Cell Team Retreat',
    description: 'Team building and planning session for the new academic year',
    image: '/images/gallery/team-retreat.jpg',
    category: 'team',
    date: '2022-12-10'
  },
  {
    id: 5,
    title: 'Entrepreneurship Bootcamp',
    description: 'Intensive 3-day bootcamp for aspiring entrepreneurs',
    image: '/images/gallery/bootcamp.jpg',
    category: 'workshops',
    date: '2022-11-05'
  },
  {
    id: 6,
    title: 'Industry Visit to Tech Park',
    description: 'Students exploring startup ecosystem at the technology park',
    image: '/images/gallery/industry-visit.jpg',
    category: 'events',
    date: '2022-10-15'
  }
];

// Get all gallery items
router.get('/', (req, res) => {
  res.json(galleryItems);
});

// Get a single gallery item by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = galleryItems.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ message: 'Gallery item not found' });
  }
  
  res.json(item);
});

// Add a new gallery item (admin only)
router.post('/', (req, res) => {
  // Use multer middleware with error handling
  upload.single('image')(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: `File upload error: ${err.message}` });
      }
      
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      const { title, description, category, date } = req.body;
      
      // Validate required fields
      if (!title || !description || !category || !date) {
        return res.status(400).json({ 
          message: 'All fields are required',
          missing: {
            title: !title,
            description: !description,
            category: !category,
            date: !date
          }
        });
      }
      
      // Create image path
      let imagePath;
      if (req.file) {
        // If a file was uploaded, use its path with the full server URL
        // This ensures the image URL is absolute and can be accessed from the frontend
        const baseUrl = req.protocol + '://' + req.get('host');
        imagePath = `${baseUrl}/uploads/gallery/${req.file.filename}`;
        console.log('Image path from file (absolute):', imagePath);
      } else if (req.body.imageUrl) {
        // If an image URL was provided, use it
        imagePath = req.body.imageUrl;
        console.log('Image path from URL:', imagePath);
      } else {
        return res.status(400).json({ message: 'Image is required' });
      }
      
      // Create new gallery item
      const newItem = {
        id: Date.now(), // Simple ID generation
        title,
        description,
        image: imagePath,
        category,
        date
      };
      
      // Add to collection
      galleryItems.push(newItem);
      
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error adding gallery item:', error);
      res.status(500).json({ message: `Server error: ${error.message}` });
    }
  });
});

// Update a gallery item (admin only)
router.put('/:id', (req, res) => {
  // Use multer middleware with error handling
  upload.single('image')(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: `File upload error: ${err.message}` });
      }
      
      console.log('Update request body:', req.body);
      console.log('Update request file:', req.file);
      
      const id = parseInt(req.params.id);
      const itemIndex = galleryItems.findIndex(item => item.id === id);
      
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Gallery item not found' });
      }
      
      const { title, description, category, date } = req.body;
      const existingItem = galleryItems[itemIndex];
      
      // Create updated item
      const updatedItem = {
        ...existingItem,
        title: title || existingItem.title,
        description: description || existingItem.description,
        category: category || existingItem.category,
        date: date || existingItem.date
      };
      
      // Update image if a new one was uploaded
      if (req.file) {
        // Use absolute URL for the image path
        const baseUrl = req.protocol + '://' + req.get('host');
        updatedItem.image = `${baseUrl}/uploads/gallery/${req.file.filename}`;
        console.log('Updated image path from file (absolute):', updatedItem.image);
      } else if (req.body.imageUrl) {
        updatedItem.image = req.body.imageUrl;
        console.log('Updated image path from URL:', updatedItem.image);
      }
      
      // Update the item
      galleryItems[itemIndex] = updatedItem;
      
      res.json(updatedItem);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      res.status(500).json({ message: `Server error: ${error.message}` });
    }
  });
});

// Delete a gallery item (admin only)
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const itemIndex = galleryItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    // Remove the item
    galleryItems.splice(itemIndex, 1);
    
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;