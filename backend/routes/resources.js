import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const resourcesDir = path.join(uploadsDir, 'resources');

// Ensure both directories exist
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(resourcesDir)) {
  console.log('Creating resources uploads directory:', resourcesDir);
  fs.mkdirSync(resourcesDir, { recursive: true });
}

console.log('Resources uploads directory:', resourcesDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resourcesDir);
  },
  filename: function (req, file, cb) {
    // Keep the original filename but ensure it's unique by adding a timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExt);
    cb(null, `${fileName}-${uniqueSuffix}${fileExt}`);
  }
});

// File filter to only allow certain file types
const fileFilter = (req, file, cb) => {
  // Accept PDF, DOCX, XLSX, etc.
  const allowedFileTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.ms-excel'
  ];
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, and XLSX files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// @route   POST /api/resources/upload
// @desc    Upload a resource file
// @access  Private (should be protected in production)
router.post('/upload', (req, res) => {
  // Use multer middleware with error handling
  upload.single('file')(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: `File upload error: ${err.message}` });
      }
      
      // Check if file was provided
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Construct the file URL
      const baseUrl = req.protocol + '://' + req.get('host');
      const fileUrl = `${baseUrl}/uploads/resources/${req.file.filename}`;
      
      // Return success response with file details
      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          url: fileUrl,
          path: `/uploads/resources/${req.file.filename}`
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Server error during file upload' });
    }
  });
});

export default router;