import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Hero from '../components/Hero';
import ImageCarousel from '../components/ImageCarousel';
import Features from '../components/Features';
import NavBar from '../components/MobileNavBar';

const HomePage = () => {
  const location = useLocation();
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('logout') === 'success') {
      setShowLogoutMessage(true);
      // Remove the parameter from URL without page refresh
      window.history.replaceState({}, document.title, '/');
      // Auto-dismiss message after 5 seconds
      const timer = setTimeout(() => {
        setShowLogoutMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Logout Success Message */}
      {showLogoutMessage && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 text-sm font-medium">
                  You have been successfully logged out!
                </span>
              </div>
              <button
                onClick={() => setShowLogoutMessage(false)}
                className="text-green-600 hover:text-green-800"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <Hero />
      <ImageCarousel />
      <Features />
    </div>
  );
};

export default HomePage;