import React, { useState, useEffect } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate(); // Hook for redirecting after logout


  const authenticatedLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Features', href: '/#features' },
    { name: 'Profile', href: '/profile' },
    { name: 'Dashboard', href: '/dashboard' },
    // Add any other user-only links here
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

  useEffect(() => {
    // Auth checking... (This is fine)
    const checkAuth = () => {
      // **CRITICAL:** Use a token check that actually works, e.g., 'access_token'
      // The double-negation (!!) ensures the state is a boolean
      setIsAuthenticated(!!localStorage.getItem('access_token')); 
    };
    checkAuth();

    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    // Optionally remove refresh_token and user data too
    
    // Manually trigger the state update
    setIsAuthenticated(false); 
    
    // Redirect to home or login page
    navigate('/'); 
    
    // Close the mobile menu if open
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            * DESKTOP NAVIGATION (The Fix)     *
            ************************************
          */}
          <div className="hidden md:flex items-center space-x-8">
            {/* PUBLIC LINKS (Always Show) */}
            {/* {publicLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-800 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))} */}

            {isAuthenticated ? (
              <>
                {/* AUTHENTICATED LINKS */}
                {authenticatedLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-800 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))}
                {/* LOGOUT BUTTON */}
                <button
                  onClick={handleLogout}
                  className="btn-accent text-sm py-2 px-4 rounded-full"
                >
                  Logout
                </button>
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
              {/* PUBLIC LINKS */}
              {/* {publicLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-md font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))} */}
              
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
                /* AUTH BUTTONS */
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
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;