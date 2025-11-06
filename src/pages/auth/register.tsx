import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import AuthForm from '../../components/AuthForm';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: any) => {
    try {
      setIsLoading(true);
      setFieldErrors({});
      await register(data.username, data.email, data.password, data.confirmPassword);
      
      // ✅ Notify user to verify email
      showNotification({
        type: 'success',
        title: 'Registration Successful',
        message: 'Your account has been created! Please check your email and verify your account before logging in.',
        duration: 5000
      });

      // ✅ Redirect to login (not verify-email page)
      navigate('/auth/login');
    } catch (error: any) {
      console.error('Registration failed:', error.message);

      const errorMessage = error.message || 'Registration failed. Please try again.';

      if (
        errorMessage.includes('Username:') ||
        errorMessage.includes('Email:') ||
        errorMessage.includes('Password:') ||
        errorMessage.includes('Confirm Password:')
      ) {
        const errors: { [key: string]: string } = {};

        if (errorMessage.includes('Username:')) {
          errors.username = errorMessage.split('Username:')[1].split('.')[0].trim();
        }
        if (errorMessage.includes('Email:')) {
          errors.email = errorMessage.split('Email:')[1].split('.')[0].trim();
        }
        if (errorMessage.includes('Password:')) {
          errors.password = errorMessage.split('Password:')[1].split('.')[0].trim();
        }
        if (errorMessage.includes('Confirm Password:')) {
          errors.confirmPassword = errorMessage.split('Confirm Password:')[1].split('.')[0].trim();
        }

        setFieldErrors(errors);
      } else {
        showNotification({
          type: 'error',
          title: 'Registration Failed',
          message: errorMessage,
          duration: 5000
        });
      }
    } finally {
      setIsLoading(false);
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

        <AuthForm
          type="register"
          onSubmit={handleRegister}
          errors={fieldErrors}
          isLoading={isLoading}
        />

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <Link
            to="/auth/login"
            className="text-sm text-gray-500 hover:text-green-600 transition-colors duration-200"
          >
            Already have an account? Log in
          </Link>

          <div className="mt-2">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-green-600 transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
