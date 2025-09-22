import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { Heart } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="w-full py-8 flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-2 group">
          <Heart className="h-10 w-10 text-blue-800 group-hover:text-yellow-500 transition-colors duration-300" />
          <div className="font-secondary font-bold text-3xl">
            <span className="text-blue-800">Daylight</span>
            <span className="text-yellow-500">25</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Daylight25!</h1>
        <p className="text-gray-600 text-center max-w-xl">
          Empowering students and donors with transparency, faith, and trust.<br />
          Where would you like to go next?
        </p>
      </header>

      {/* Main Navigation */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Link
            to="/dashboard"
            className="bg-blue-800 text-white px-8 py-6 rounded-lg shadow hover:bg-blue-900 transition-colors text-center font-semibold text-lg"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/profile"
            className="bg-yellow-500 text-blue-900 px-8 py-6 rounded-lg shadow hover:bg-yellow-400 transition-colors text-center font-semibold text-lg"
          >
            View Profile
          </Link>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="text-blue-800 hover:underline"
          >
            Learn more about Daylight25
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;