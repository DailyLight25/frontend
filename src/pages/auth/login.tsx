import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import AuthForm from '../../components/AuthForm';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: any) => {
    try {
      setIsLoading(true);
      setFieldErrors({});
      // The username field can contain either username or email
      await login(data.username, data.password);
      
      showNotification({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back! You have been logged in successfully.',
        duration: 3000
      });
      
      navigate('/home');
    } catch (error: any) {
      console.error("Login failed:", error);
      
      showNotification({
        type: 'error',
        title: 'Login Failed',
        message: error.message || 'Invalid credentials or account not active.',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
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

        <AuthForm type="login" onSubmit={handleLogin} errors={fieldErrors} isLoading={isLoading} />

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