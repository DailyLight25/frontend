import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, User, Bell, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const navigate = useNavigate();


  const authenticatedLinks = [
    { name: 'Feed', href: '/home' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' },
    { name: 'Features', href: '/features' },
    // Add any other user-only links here
  ];

  const unauthenticatedLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Features', href: '/features' },
  ];
  // -------------------

  useEffect(() => {
    // Scroll handling... (This is fine)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileModalOpen) {
        const target = event.target as Element;
        if (!target.closest('.profile-modal-container')) {
          setIsProfileModalOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileModalOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileModalOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsProfileModalOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'navbar-blur shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (No Change) */}
          <Link to="/" className="flex items-center space-x-2 group">
             {/* ... your logo JSX ... */}
             <div className="relative">
                <Heart className="h-8 w-8 text-blue-800 group-hover:text-yellow-500 transition-colors duration-300" />
                <div className="absolute inset-0 h-8 w-8 bg-yellow-400 opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
              </div>
              <div className="font-secondary font-bold text-xl">
                <span className="text-blue-800">Daylight</span>
                <span className="text-yellow-500">25</span>
              </div>
          </Link>

          {/* ************************************
            * DESKTOP NAVIGATION (Centered)     *
            ************************************
          */}
          <div className="hidden md:flex items-center justify-center flex-1">
            {/* CENTERED NAVIGATION LINKS */}
            <div className="flex items-center space-x-8">
              {isAuthenticated ? (
                authenticatedLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-800 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))
              ) : (
                unauthenticatedLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-800 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* ************************************
            * RIGHT SIDE ICONS & AUTH            *
            ************************************
          */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* NOTIFICATION ICON */}
                <button className="p-2 rounded-lg text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200 relative">
                  <Bell className="h-5 w-5" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    0
                  </span>
                </button>

                {/* SETTINGS ICON */}
                <button className="p-2 rounded-lg text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200">
                  <Settings className="h-5 w-5" />
                </button>

                {/* PROFILE ICON WITH MODAL */}
                <div className="relative profile-modal-container">
                  <button
                    onClick={toggleProfileModal}
                    className="p-2 rounded-lg text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <User className="h-5 w-5" />
                  </button>

                  {/* PROFILE MODAL */}
                  {isProfileModalOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleProfileClick}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* AUTH BUTTONS */
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="btn-accent text-sm py-2 px-4 rounded-full"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button (No Change) */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation (FIXED) */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-gray-100">
              {/* NAVIGATION LINKS */}
              {isAuthenticated ? (
                <>
                  {/* AUTHENTICATED LINKS */}
                  {authenticatedLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="block px-3 py-2 text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-md font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                    
                    {/* MOBILE ICONS */}
                    <div className="flex items-center justify-center space-x-4 px-3 py-2 border-t border-gray-200">
                      <button className="p-2 rounded-lg text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200">
                        <Bell className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-lg text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200">
                        <Settings className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleProfileClick}
                        className="p-2 rounded-lg text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <User className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {/* LOGOUT BUTTON */}
                    <div className="px-3 py-2">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-center btn-accent text-sm"
                        >
                          Logout
                        </button>
                    </div>
                  </>
              ) : (
                <>
                  {/* UNAUTHENTICATED LINKS */}
                  {unauthenticatedLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="block px-3 py-2 text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-md font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  {/* AUTH BUTTONS */}
                  <div className="px-3 py-2 space-y-2 border-t border-gray-200">
                    <Link
                      to="/auth/login"
                      className="block w-full text-center py-2 text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <button
                      disabled
                      className="block w-full text-center btn-accent text-sm opacity-50 cursor-not-allowed"
                      title="Registration coming soon"
                    >
                      Get Started
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;