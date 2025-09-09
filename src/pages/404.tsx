import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Heart } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="glass-card p-12 slide-up">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8 group">
            <Heart className="h-10 w-10 text-blue-800 group-hover:text-yellow-500 transition-colors duration-300" />
            <div className="font-secondary font-bold text-2xl">
              <span className="text-blue-800">Daylight</span>
              <span className="text-yellow-500">25</span>
            </div>
          </Link>

          {/* 404 Content */}
          <div className="mb-8">
            <h1 className="font-secondary font-bold text-8xl text-blue-800 mb-4">
              404
            </h1>
            <h2 className="font-secondary font-bold text-3xl text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off. 
              Don't worry, even the best paths sometimes take unexpected turns.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 btn-primary"
            >
              <Home className="h-5 w-5" />
              <span>Go Home</span>
            </Link>
            
            <div className="pt-4">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-800 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </button>
            </div>
          </div>

          {/* Decorative Quote */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">
              "Even when we lose our way, the Light guides us home." ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;