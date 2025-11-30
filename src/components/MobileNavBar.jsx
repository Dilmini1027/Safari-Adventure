import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import { 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon, 
  MapPinIcon, 
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const NavBar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setIsOpen(false); // Close mobile menu if open
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Define navigation items based on authentication status
  const getNavItems = () => {
    if (user && user.role === 'visitor') {
      // Visitor dashboard navigation - only Profile and Destinations (Book button is in the main nav)
      return [
        {
          name: 'Destinations',
          icon: <MapPinIcon className="w-6 h-6" />,
          href: '/destinations'
        },
        {
          name: 'Contact Us',
          icon: <EnvelopeIcon className="w-6 h-6" />,
          href: '/contact'
        }
      ];
    } else if (user && user.role === 'admin') {
      // Admin navigation
      return [
        {
          name: 'Manage Destinations',
          icon: <MapPinIcon className="w-6 h-6" />,
          href: '/admin/destinations'
        },
        {
          name: 'Visitors',
          icon: <UserCircleIcon className="w-6 h-6" />,
          href: '/admin/visitors'
        },
        {
          name: 'Contact Us',
          icon: <EnvelopeIcon className="w-6 h-6" />,
          href: '/contact'
        }
      ];
    } else {
      // Default navigation for non-authenticated users
      return [
        {
          name: 'Home',
          icon: <HomeIcon className="w-6 h-6" />,
          href: '/'
        },
        {
          name: 'Destinations',
          icon: <MapPinIcon className="w-6 h-6" />,
          href: '/destinations'
        },
        {
          name: 'Contact Us',
          icon: <EnvelopeIcon className="w-6 h-6" />,
          href: '/contact'
        }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Desktop Navigation Bar - Hidden on mobile */}
      <nav className="hidden lg:flex fixed top-0 right-0 left-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-100 hover:text-green-400 transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {user.role === 'visitor' && (
                    <Link to="/dashboard/book-safari" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm rounded-lg font-medium transition-all duration-200 hover:scale-105">
                      Book Safari
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm rounded-lg font-medium transition-all duration-200 hover:scale-105">
                      Dashboard
                    </Link>
                  )}
                  <NotificationBell />
                  <div className="flex items-center space-x-2 text-gray-100 cursor-pointer group" title="Profile">
                    <UserCircleIcon className="w-6 h-6" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-red-400 transition-colors duration-200"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-100 hover:text-green-400 transition-colors duration-200 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-100 hover:text-green-400 transition-colors duration-200 font-medium">
                    Sign Up
                  </Link>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Book
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Button - Shows on tablet and mobile */}
      <motion.button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-[120] bg-gray-900/90 backdrop-blur-md rounded-full p-3 shadow-lg border border-gray-600/50 lg:hidden"
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-white" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-white" />
          )}
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* Navigation Menu - Slides from right (All Screens) */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="fixed top-0 right-0 h-full w-80 sm:w-96 md:w-80 lg:w-96 bg-white shadow-2xl z-[110] border-l border-gray-200"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          >
            {/* Header */}
            <div className="pt-20 pb-8 px-6 border-b border-gray-200 bg-green-50">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Safari Adventures</h2>
              <p className="text-sm md:text-base text-green-700 mt-1 font-medium">Explore the wild</p>
            </div>

            {/* Navigation Items */}
            <div className="py-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1 
                  }}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    className="flex items-center gap-4 px-6 py-4 text-gray-800 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg mx-2 font-medium"
                    onClick={toggleMenu}
                  >
                    <div className="text-green-600">
                      {item.icon}
                    </div>
                    <span className="text-lg md:text-xl font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
              {user ? (
                <div className="space-y-3">
                  {/* Profile Section */}
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-green-100 rounded-lg">
                    <UserCircleIcon className="w-8 h-8 text-green-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-green-600 capitalize">Profile • {user.role}</p>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  {user.role === 'admin' ? (
                    <Link 
                      to="/admin/dashboard" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 block text-center"
                      onClick={toggleMenu}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link 
                      to="/dashboard/book-safari" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 block text-center"
                      onClick={toggleMenu}
                    >
                      Book Safari
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-red-100 text-red-600 hover:bg-red-200 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={() => { window.location.href = '/login'; toggleMenu(); }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 block text-center"
                  >
                    Book Safari
                  </button>
                  <Link to="/login" className="w-full bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-2 rounded-lg font-medium transition-all duration-200 block text-center" onClick={toggleMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200 py-2 rounded-lg font-medium transition-colors duration-200 block text-center" onClick={toggleMenu}>
                    Sign Up
                  </Link>
                  
                </div>
              )}
              
              {/* Social Links */}
              <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-gray-300">
                <button className="text-gray-500 hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                  <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Logout
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to logout from your account?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelLogout}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;