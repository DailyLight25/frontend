import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthFormProps {
  type: 'login' | 'register' | 'reset';
  onSubmit: (data: any) => void;
  errors?: { [key: string]: string };
  isLoading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, errors = {}, isLoading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getTitle = () => {
    switch (type) {
      case 'login':
        return 'Welcome Back';
      case 'register':
        return 'Join the Light';
      case 'reset':
        return 'Reset Password';
      default:
        return '';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'login':
        return 'Sign in to your account and continue your journey';
      case 'register':
        return 'Create your account and be part of the community';
      case 'reset':
        return 'Enter your email to receive reset instructions';
      default:
        return '';
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      switch (type) {
        case 'login':
          return 'Signing you in...';
        case 'register':
          return 'Creating account...';
        case 'reset':
          return 'Sending reset link...';
        default:
          return 'Loading...';
      }
    }
    
    switch (type) {
      case 'login':
        return 'Sign In';
      case 'register':
        return 'Create Account';
      case 'reset':
        return 'Send Reset Link';
      default:
        return '';
    }
  };

  return (
    <div className="auth-card fade-in">
      <div className="text-center mb-8">
        <h2 className="font-secondary font-bold text-3xl text-gray-900 mb-2">
          {getTitle()}
        </h2>
        <p className="text-gray-600 text-sm">
          {getSubtitle()}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'register' && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`input-field pl-10 ${errors.username ? 'border-red-500' : ''}`}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
        )}

        {type === 'login' && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              value={formData.username}
              onChange={handleChange}
              className={`input-field pl-10 ${errors.username ? 'border-red-500' : ''}`}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
        )}

        {type === 'register' && (
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        )}

        {type !== 'reset' && (
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
        )}

        {type === 'register' && (
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        {type === 'login' && (
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-800 focus:border-blue-800 focus:ring-blue-800" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/auth/reset-password" className="text-sm text-blue-800 hover:text-yellow-500 transition-colors duration-200">
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center space-x-2 ${
            type === 'register' ? 'btn-secondary' : 'btn-primary'
          } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowRight className="h-5 w-5" />
          )}
          <span>{getButtonText()}</span>
        </button>
      </form>

      <div className="mt-8 text-center">
        {type === 'login' && (
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-blue-800 hover:text-yellow-500 font-medium transition-colors duration-200">
              Create one here
            </Link>
          </p>
        )}
        {type === 'register' && (
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-blue-800 hover:text-yellow-500 font-medium transition-colors duration-200">
              Sign in
            </Link>
          </p>
        )}
        {type === 'reset' && (
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/auth/login" className="text-blue-800 hover:text-yellow-500 font-medium transition-colors duration-200">
              Back to login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;