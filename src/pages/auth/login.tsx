import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import AuthForm from '../../components/AuthForm';

const LoginPage: React.FC = () => {
  const handleLogin = (data: any) => {
    console.log('Login data:', data);
    // Handle login logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 light-rays">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8 group">
          <Heart className="h-10 w-10 text-blue-800 group-hover:text-yellow-500 transition-colors duration-300" />
          <div className="font-secondary font-bold text-2xl">
            <span className="text-blue-800">Daylight</span>
            <span className="text-yellow-500">25</span>
          </div>
        </Link>

        <AuthForm type="login" onSubmit={handleLogin} />

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-blue-800 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;