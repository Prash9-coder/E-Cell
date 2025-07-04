import { useState } from 'react';
import api from '../services/api';
import mockEventApi from '../services/mockApi';

const TestEventRegistration = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test, result, error = null) => {
    setTestResults(prev => [...prev, { test, result, error, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);

    // Test 1: Check mock events
    try {
      const mockEvents = await mockEventApi.getAll();
      addResult('Mock Events Fetch', `Success: Found ${mockEvents.events.length} events`, null);
      console.log('Mock events:', mockEvents.events);
    } catch (error) {
      addResult('Mock Events Fetch', 'Failed', error.message);
    }

    // Test 2: Check specific event by ID
    const testEventId = '6830b6bf39d800601996da48';
    try {
      const event = await mockEventApi.getById(testEventId);
      addResult('Mock Event by ID', `Success: Found event "${event.title}"`, null);
    } catch (error) {
      addResult('Mock Event by ID', 'Failed', error.message);
    }

    // Test 3: Test registration with mock API
    const testRegistrationData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      college: 'Test College',
      year: '2024',
      expectations: 'Test expectations'
    };

    try {
      const result = await mockEventApi.register(testEventId, testRegistrationData);
      addResult('Mock Registration', `Success: ${result.message}`, null);
    } catch (error) {
      addResult('Mock Registration', 'Failed', error.message);
    }

    // Test 4: Test registration with API service
    try {
      const result = await api.events.register(testEventId, testRegistrationData);
      addResult('API Registration', `Success: ${result.message}`, null);
    } catch (error) {
      addResult('API Registration', 'Failed', error.message);
    }

    setIsLoading(false);
  };

  const clearMockData = () => {
    mockEventApi.clearData();
    addResult('Clear Mock Data', 'Success: Mock data cleared', null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Event Registration Test</h1>
      
      <div className="mb-6">
        <button 
          onClick={runTests}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          {isLoading ? 'Running Tests...' : 'Run Tests'}
        </button>
        
        <button 
          onClick={clearMockData}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear Mock Data
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
        {testResults.length === 0 ? (
          <p>No tests run yet. Click "Run Tests" to start.</p>
        ) : (
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className={`p-2 rounded ${result.error ? 'bg-red-100' : 'bg-green-100'}`}>
                <div className="font-semibold">{result.test}</div>
                <div>{result.result}</div>
                {result.error && (
                  <div className="text-red-600 text-sm mt-1">Error: {result.error}</div>
                )}
                <div className="text-xs text-gray-500">{result.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestEventRegistration;