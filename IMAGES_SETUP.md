# Adding Images to E-Cell Website

This guide provides instructions for adding real images to the E-Cell website to replace the placeholder images.

## Option 1: Using the Public Directory (Recommended for Static Assets)

### Step 1: Create the directory structure

```
frontend/public/images/
├── events/
├── team/
├── hero/
├── gallery/
├── startups/
└── blog/
```

### Step 2: Add images to the appropriate directories

Download the images from the URLs provided in the `IMAGE_RESOURCES.md` file and place them in the corresponding directories.

### Step 3: Update the image paths in the components

Replace the `PlaceholderImage` components with actual `<img>` tags pointing to the images in the public directory.

Example:

```jsx
// Before
<PlaceholderImage 
  text="Hero Image - E-Cell" 
  bgColor="#1e40af"
  height="100%"
/>

// After
<img 
  src="/images/hero/main-hero.jpg" 
  alt="E-Cell Hero" 
  className="w-full h-full object-cover"
/>
```

## Option 2: Using the Assets Directory (Recommended for Processed Assets)

### Step 1: Create the directory structure

```
frontend/src/assets/images/
├── events/
├── team/
├── hero/
├── gallery/
├── startups/
└── blog/
```

### Step 2: Add images to the appropriate directories

Download the images from the URLs provided in the `IMAGE_RESOURCES.md` file and place them in the corresponding directories.

### Step 3: Import and use the images in the components

Import the images at the top of your component files and use them in your JSX.

Example:

```jsx
// Import at the top of the file
import heroImage from '../assets/images/hero/main-hero.jpg';

// Use in JSX
<img 
  src={heroImage} 
  alt="E-Cell Hero" 
  className="w-full h-full object-cover"
/>
```

## Image Optimization Tips

1. **Resize images** to appropriate dimensions before adding them to the project:
   - Hero images: 1920x1080px or 1440x810px
   - Event/Blog thumbnails: 800x600px or 600x400px
   - Team photos: 400x400px (square) or 400x600px (portrait)

2. **Compress images** to reduce file size:
   - Use tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
   - Aim for JPEG files under 200KB and PNG files under 500KB

3. **Use modern formats** when possible:
   - Consider WebP format for better compression
   - Provide fallbacks for browsers that don't support WebP

4. **Implement lazy loading** for images below the fold:
   ```jsx
   <img 
     src="/images/events/e-summit.jpg" 
     alt="E-Summit" 
     loading="lazy" 
     className="w-full h-full object-cover"
   />
   ```

## Troubleshooting Image Issues

If images are not displaying correctly:

1. **Check file paths**: Ensure the paths to your images are correct
2. **Verify file existence**: Make sure the image files actually exist in the specified directories
3. **Check file permissions**: Ensure the image files have proper read permissions
4. **Inspect network requests**: Use browser developer tools to see if there are any 404 errors for image requests
5. **Clear cache**: Try clearing your browser cache if you've updated images but still see old ones

## Additional Resources

- [Vite Static Asset Handling](https://vitejs.dev/guide/assets.html)
- [React Image Best Practices](https://web.dev/learn/images/react/)
- [Image Optimization Guide](https://web.dev/fast/#optimize-your-images)