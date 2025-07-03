// Test file for image URL construction
import { getContentImageUrl } from './imageUtils';

// Test different image path formats
const testCases = [
  // Upload paths
  { input: '/uploads/events/event-123.jpg', expected: 'https://e-cell-backend1.onrender.com/uploads/events/event-123.jpg' },
  { input: 'uploads/events/event-456.jpg', expected: 'https://e-cell-backend1.onrender.com/uploads/events/event-456.jpg' },
  
  // Static paths
  { input: '/images/events/default.svg', expected: '/images/events/default.svg' },
  
  // Full URLs
  { input: 'https://example.com/image.jpg', expected: 'https://example.com/image.jpg' },
  
  // Filenames only
  { input: 'event-789.jpg', expected: 'https://e-cell-backend1.onrender.com/uploads/events/event-789.jpg' },
  
  // Empty/null values
  { input: null, expected: '/images/events/default.svg' },
  { input: '', expected: '/images/events/default.svg' },
];

export const runImageUrlTests = () => {
  console.log('🧪 Running image URL construction tests...');
  
  testCases.forEach((testCase, index) => {
    const result = getContentImageUrl(testCase.input, 'events');
    const passed = result === testCase.expected;
    
    console.log(`Test ${index + 1}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Input: ${testCase.input}`);
    console.log(`  Expected: ${testCase.expected}`);
    console.log(`  Got: ${result}`);
    console.log('');
  });
};

// Auto-run tests in development mode
if (import.meta.env.MODE === 'development') {
  runImageUrlTests();
}