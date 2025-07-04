/**
 * Test script to verify event creation works correctly
 * Run this in the browser console to test the fix
 */

export const testEventCreation = () => {
  console.log('🧪 Testing event creation...');
  
  // Test data that should work
  const testEventData = {
    title: 'Test Event',
    description: 'This is a test event',
    longDescription: 'This is a detailed description of the test event',
    date: '2024-12-31',
    time: '10:00 AM - 2:00 PM',
    location: 'Test Location',
    category: 'workshop',
    image: '/images/events/default.svg',
    status: 'Upcoming',
    isPast: false,
    registrations: [], // This should be an array
    isFeatured: false,
    slug: 'test-event'
  };
  
  console.log('Test event data:', testEventData);
  console.log('Registrations field type:', typeof testEventData.registrations);
  console.log('Is registrations an array?', Array.isArray(testEventData.registrations));
  
  // Test with mock API
  import('../services/mockApi.js').then(({ default: mockEventApi }) => {
    mockEventApi.create(testEventData)
      .then(result => {
        console.log('✅ Event creation successful:', result);
        console.log('Created event registrations:', result.registrations);
        console.log('Created event registrations type:', typeof result.registrations);
        console.log('Is created registrations an array?', Array.isArray(result.registrations));
      })
      .catch(error => {
        console.error('❌ Event creation failed:', error);
      });
  });
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  window.testEventCreation = testEventCreation;
}