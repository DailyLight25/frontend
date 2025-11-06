import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, Heart } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import apiService from '../../services/apiService';

const VerifyEmailPage: React.FC = () => {
  const { showNotification } = useNotification();

  // Optional resend email handler
  const handleResendEmail = async () => {
    try {
      await apiService.post('users/resend-verification/', {}); // You'll need to create this endpoint later
      showNotification({
        type: 'success',
        title: 'Email Sent',
        message: 'A new verification link has been sent to your inbox.',
        duration: 4000,
      });
    } catch (error: any) {
      console.error('Resend verification failed:', error.message);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Could not resend verification email. Please try again later.',
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-6 group">
          <Heart className="h-10 w-10 text-green-600 group-hover:text-yellow-500 transition-colors duration-300" />
          <div className="font-secondary font-bold text-2xl">
            <span className="text-green-600">Daylight</span>
            <span className="text-yellow-500">25</span>
          </div>
        </Link>

        {/* Icon + Main text */}
        <MailCheck className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="mb-6 text-gray-600">
          We’ve sent a verification link to your email address.<br />
          Please check your inbox and follow the instructions to activate your account.
        </p>

        {/* Go to Login button */}
        <Link
          to="/auth/login"
          className="inline-block px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-300"
        >
          Go to Login
        </Link>

        {/* Optional resend verification link */}
        <p className="text-sm text-gray-500 mt-4">
          Didn’t get the email?{' '}
          <button
            onClick={handleResendEmail}
            className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
          >
            Resend link
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
