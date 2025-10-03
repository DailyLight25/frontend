import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import AuthForm from '../../components/AuthForm';
import apiService from '../../services/apiService.js';


const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = async (data: any) => {
    try {
    await apiService.post('users/register', data);
      // console.log('Registration successful:', response);
      navigate('/auth/verify-email');
      // Optionally redirect or show success message
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      // Optionally show error message to user
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 light-rays">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8 group">
          <Heart className="h-10 w-10 text-green-600 group-hover:text-yellow-500 transition-colors duration-300" />
          <div className="font-secondary font-bold text-2xl">
            <span className="text-green-600">Daylight</span>
            <span className="text-yellow-500">25</span>
          </div>
        </Link>

        <AuthForm type="register" onSubmit={handleRegister} />

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-green-600 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;