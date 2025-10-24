import React, { useState } from 'react';
import apiService from '../services/apiService';

const AuthTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testRegistration = async () => {
    setLoading(true);
    setStatus('Testing registration...');
    
    try {
      const testUser = {
        username: `testuser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123',
        confirmPassword: 'testpassword123'
      };
      
      const response = await apiService.post('users/register/', testUser);
      setStatus(`✅ Registration successful! User: ${testUser.username}`);
      
      // Try to login immediately
      setTimeout(async () => {
        try {
          const loginResponse = await apiService.post('users/token/', {
            username: testUser.username,
            password: testUser.password
          });
          setStatus(`✅ Login successful! Access token received.`);
        } catch (loginError: any) {
          setStatus(`❌ Login failed: ${loginError.message}`);
        }
      }, 1000);
      
    } catch (error: any) {
      setStatus(`❌ Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectLogin = async () => {
    setLoading(true);
    setStatus('Testing direct login...');
    
    try {
      const loginResponse = await apiService.post('users/token/', {
        username: 'testuser',
        password: 'testpassword123'
      });
      setStatus(`✅ Direct login successful!`);
    } catch (error: any) {
      setStatus(`❌ Direct login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Authentication Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testRegistration}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? 'Testing...' : 'Test Registration + Login'}
        </button>
        
        <button
          onClick={testDirectLogin}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? 'Testing...' : 'Test Direct Login'}
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

export default AuthTest;
