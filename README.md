# E-Cell Website

A professional, dynamic, and user-friendly website for an Entrepreneurship Cell (E-Cell) that effectively promotes entrepreneurship among students.

## 🚀 Features

### Core Pages
- **Homepage** - Dynamic landing page showcasing E-Cell's mission and activities
- **About Us** - Information about the organization and team members
- **Events** - Upcoming and past events with registration functionality
- **Startups/Incubation** - Showcase of student ventures and application process
- **Resources** - Guides, templates, funding information
- **Gallery** - Photos and videos from events
- **Contact Us** - Contact form, map, and social links
- **Blog** - Startup news and guides
- **Get Involved** - Membership, mentorship, and sponsorship information

### Functional Features
- Event registration system with confirmation emails
- Newsletter subscription
- Social media integration
- SEO optimization
- Mobile-responsive design
- Fast loading speed and performance optimization
- Secure hosting with HTTPS
- Admin Panel for content management
- Integration with analytics tools

## 🛠️ Technology Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecell-website.git
cd ecell-website
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Create environment variables:
```bash
# In the backend directory
cp .env.example .env
```
Edit the `.env` file with your configuration.

## 🚀 Running the Application

### Development Mode

#### Option 1: Run both frontend and backend concurrently
```bash
# From the root directory
npm run dev
```

#### Option 2: Run frontend and backend separately
1. Start the backend server:
```bash
# From the root directory
npm run dev:backend
```

2. Start the frontend development server:
```bash
# From the root directory
npm run dev:frontend
```

3. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Mode

1. Build the frontend:
```bash
# From the root directory
npm run build
```

2. Start the production server:
```bash
# From the root directory
npm start
```

3. Access the application at http://localhost:5000

### Admin Setup

Create an admin user:
```bash
# From the root directory
npm run create-admin
```

### System Health Check

Run a health check to verify all components are working:
```bash
# From the root directory
npm run health
```

## 📁 Project Structure

```
ecell-website/
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── index.html           # HTML template
│   └── vite.config.js       # Vite configuration
│
├── backend/                 # Node.js backend
│   ├── controllers/         # Request handlers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   └── server.js            # Entry point
│
└── package.json             # Root package.json
```

## 🔒 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ecell
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=E-Cell <your_email@gmail.com>
ADMIN_EMAIL=admin@ecell.org
ADMIN_PASSWORD=admin_password
MAX_FILE_SIZE=5000000
FRONTEND_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any questions or suggestions, please reach out to [contact@gmail.com](mailto:contact@gmail.com).

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify the connection string in `.env` file
   - Run `npm run health` to diagnose database issues

2. **API Errors**
   - Check the backend console for error messages
   - Verify that all required environment variables are set
   - Ensure the correct API URL is set in the frontend `.env` file

3. **Authentication Issues**
   - Clear browser localStorage and try logging in again
   - Check if the JWT_SECRET is properly set
   - Verify that the user exists in the database

4. **File Upload Problems**
   - Check if the uploads directory exists and has write permissions
   - Verify that the file size is within the allowed limit
   - Check the file type against allowed types

### Getting Help

If you encounter any issues not covered here, please:
1. Check the console logs for error messages
2. Search for similar issues in the project repository
3. Contact the development team with detailed information about the problem