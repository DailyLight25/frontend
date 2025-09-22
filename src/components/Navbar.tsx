import React, { useState, useEffect } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Features', href: '/#features' },
    { name: 'Profile', href: '/#profile' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'navbar-blur shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Heart className="h-8 w-8 text-blue-800 group-hover:text-yellow-500 transition-colors duration-300" />
              <div className="absolute inset-0 h-8 w-8 bg-yellow-400 opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
            </div>
            <div className="font-secondary font-bold text-xl">
              <span className="text-blue-800">Daylight</span>
              <span className="text-yellow-500">25</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-800 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/auth/login"
              className="text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="btn-accent text-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-gray-100">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-md font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="px-3 py-2 space-y-2">
                <Link
                  to="/auth/login"
                  className="block w-full text-center py-2 text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="block w-full text-center btn-accent text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;