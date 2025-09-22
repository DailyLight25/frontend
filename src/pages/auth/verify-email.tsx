import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';

const VerifyEmailPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-4">
    <div className="w-full max-w-md text-center bg-white p-8 rounded shadow">
      <MailCheck className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
      <p className="mb-6 text-gray-600">
        We’ve sent a verification link to your email address.<br />
        Please check your inbox and follow the instructions to activate your account.
      </p>
      <Link
        to="/auth/login"
        className="btn-primary"
      >
        Go to Login
      </Link>
    </div>
  </div>
);

export default VerifyEmailPage;