import React, { useState } from 'react';
import apiService from '../services/apiService';

const ApiTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    
    try {
      // Test a simple GET request to the backend - using a valid endpoint
      const response = await apiService.get('users/me/');
      setStatus(`✅ Connection successful! User profile loaded.`);
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testPosts = async () => {
    setLoading(true);
    setStatus('Testing posts endpoint...');
    
    try {
      const response = await apiService.get('posts/posts/');
      setStatus(`✅ Posts endpoint working! Found ${response.length} posts.`);
    } catch (error) {
      setStatus(`❌ Posts endpoint failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testComments = async () => {
    setLoading(true);
    setStatus('Testing comments endpoint...');
    
    try {
      const response = await apiService.get('comments/comments/');
      setStatus(`✅ Comments endpoint working! Found ${response.length} comments.`);
    } catch (error) {
      setStatus(`❌ Comments endpoint failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testPrayerRequests = async () => {
    setLoading(true);
    setStatus('Testing prayer requests endpoint...');
    
    try {
      const response = await apiService.get('prayer_requests/prayer_requests/');
      setStatus(`✅ Prayer requests endpoint working! Found ${response.length} prayer requests.`);
    } catch (error) {
      setStatus(`❌ Prayer requests endpoint failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">API Connection Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? 'Testing...' : 'Test User Profile'}
        </button>
        
        <button
          onClick={testPosts}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? 'Testing...' : 'Test Posts Endpoint'}
        </button>
        
        <button
          onClick={testComments}
          disabled={loading}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? 'Testing...' : 'Test Comments Endpoint'}
        </button>
        
        <button
          onClick={testPrayerRequests}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? 'Testing...' : 'Test Prayer Requests'}
        </button>
        
        {status && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest;
