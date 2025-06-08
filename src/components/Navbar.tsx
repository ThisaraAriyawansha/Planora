import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolledHalf, setScrolledHalf] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const screenHeight = window.innerHeight;
      setScrolledHalf(scrollY > screenHeight / 2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'Admin':
        return '/admin';
      case 'Organizer':
        return '/organizer';
      default:
        return '/dashboard';
    }
  };

  

  return (
    <nav className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${scrolledHalf ? 'bg-white' : 'bg-transparent'}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-gray-900" />
              <span className="text-2xl font-bold text-gray-900">Planora</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-8 md:flex">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md "
            >
              Home
            </Link>
            <Link
              to="/events"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md "
            >
              Events
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md "
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md "
            >
              Contact Us
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center px-3 py-2 space-x-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:text-blue-600"
                >
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                    <Link
                      to={getDashboardPath()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="inline w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md "
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-600 rounded-md "
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="bg-transparent md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/events"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>

              {user ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 text-base font-medium text-left text-gray-700 rounded-md hover:text-blue-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-white bg-gray-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
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