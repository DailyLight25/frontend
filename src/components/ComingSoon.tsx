import React from 'react';
import { Construction, ArrowLeft, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
  title?: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title = "Coming Soon", 
  description = "We're working hard to bring you this feature. Stay tuned for updates!"
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="glass-card p-12 slide-up">
          {/* Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-800 to-yellow-500 flex items-center justify-center mb-4">
              <Construction className="h-12 w-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-yellow-400 opacity-20 animate-pulse"></div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h1 className="font-secondary font-bold text-4xl md:text-5xl text-gray-900 mb-4">
              🚧 {title} 🚧
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto">
              {description}
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                <Clock className="h-6 w-6 text-blue-800 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Coming Soon</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Premium Features</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                <Construction className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">In Development</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4 pt-6">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 btn-primary"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              
              <p className="text-sm text-gray-500">
                Want to be notified when this feature launches?{' '}
                <Link to="/auth/register" className="text-blue-800 hover:text-yellow-500 font-medium transition-colors duration-200">
                  Join our community
                </Link>
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-800 rounded-full animate-pulse"></div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Built with Love & Light ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;