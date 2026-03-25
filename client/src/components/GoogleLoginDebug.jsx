import { useState } from 'react';
import { MockGoogleLoginFixed } from './MockGoogleLoginFixed';

export default function GoogleLoginDebug() {
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, status, details) => {
    setTestResults(prev => [...prev, { test, status, details, timestamp: new Date().toLocaleTimeString() }]);
  };

  const handleGoogleSuccess = (userInfo) => {
    addTestResult('Google Login Success', '✅ SUCCESS', `User: ${userInfo.name}, Email: ${userInfo.email}`);
    console.log('Google Login Success:', userInfo);
  };

  const handleGoogleError = (error) => {
    addTestResult('Google Login Error', '❌ FAILED', error.message);
    console.error('Google Login Error:', error);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Google Login Debug Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Test Fixed Mock Google Login:</h3>
        <MockGoogleLoginFixed 
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>

      <button onClick={clearResults} style={{ padding: '10px', marginBottom: '20px' }}>
        Clear Results
      </button>

      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
        <h4>Test Results:</h4>
        {testResults.length === 0 ? (
          <p>No tests run yet. Click the Google login button to test.</p>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {testResults.map((result, index) => (
              <div key={index} style={{ 
                padding: '8px', 
                margin: '5px 0', 
                background: result.status.includes('✅') ? '#e8f5e8' : '#ffeaea',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <div><strong>{result.test}:</strong> {result.status}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{result.details}</div>
                <div style={{ fontSize: '11px', color: '#999' }}>{result.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
        <h4>Fixes Applied:</h4>
        <ul>
          <li>✅ Unique email generation with timestamp</li>
          <li>✅ Rate limit handling with retry logic</li>
          <li>✅ Multiple retry attempts (3 max)</li>
          <li>✅ Fallback authentication for extreme cases</li>
          <li>✅ Better error handling and logging</li>
          <li>✅ Progressive delay between retries</li>
        </ul>
      </div>
    </div>
  );
}
