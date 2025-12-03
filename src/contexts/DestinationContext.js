import React, { createContext, useState, useContext, useEffect } from 'react';
import { destinations as fallbackDestinations } from '../data/destinations';

const DestinationContext = createContext();

export const useDestinations = () => {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error('useDestinations must be used within a DestinationProvider');
  }
  return context;
};

export const DestinationProvider = ({ children }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear any existing user ratings for clean start
    localStorage.removeItem('safariDestinationRatings');
    
    // Always use the latest destinations from the file (force refresh)
    // This ensures newly added destinations in destinations.js are visible
    setDestinations(fallbackDestinations);
    localStorage.setItem('safariDestinations', JSON.stringify(fallbackDestinations));
    
    setLoading(false);
  }, []);

  const addDestination = async (newDestination) => {
    try {
      const destination = {
        id: Date.now(),
        ...newDestination,
        createdAt: new Date().toISOString()
      };
      const updatedDestinations = [...destinations, destination];
      setDestinations(updatedDestinations);
      localStorage.setItem('safariDestinations', JSON.stringify(updatedDestinations));
      return { success: true, destination };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to create destination' };
    }
  };

  const updateDestination = async (id, updates) => {
    try {
      const updatedDestinations = destinations.map(dest => 
        dest._id === id || dest.id === id 
          ? { ...dest, ...updates }
          : dest
      );
      setDestinations(updatedDestinations);
      localStorage.setItem('safariDestinations', JSON.stringify(updatedDestinations));
      const updatedDestination = updatedDestinations.find(dest => dest._id === id || dest.id === id);
      return { success: true, destination: updatedDestination };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update destination' };
    }
  };

  const deleteDestination = async (id) => {
    try {
      const updatedDestinations = destinations.filter(dest => dest._id !== id && dest.id !== id);
      setDestinations(updatedDestinations);
      localStorage.setItem('safariDestinations', JSON.stringify(updatedDestinations));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to delete destination' };
    }
  };

  const getDestinationById = (id) => {
    return destinations.find(dest => 
      dest._id === id || dest.id === parseInt(id) || dest.id === id
    );
  };

  // Rating functionality
  const submitRating = async (destinationId, userId, rating, review = '') => {
    try {
      const ratingsKey = 'safariDestinationRatings';
      const savedRatings = localStorage.getItem(ratingsKey);
      const ratings = savedRatings ? JSON.parse(savedRatings) : [];
      
      // Remove existing rating from same user for same destination
      const filteredRatings = ratings.filter(r => 
        !(r.destinationId === destinationId && r.userId === userId)
      );
      
      // Add new rating
      const newRating = {
        id: Date.now(),
        destinationId,
        userId,
        rating,
        review,
        createdAt: new Date().toISOString()
      };
      
      const updatedRatings = [...filteredRatings, newRating];
      localStorage.setItem(ratingsKey, JSON.stringify(updatedRatings));
      
      // Update destination's rating statistics
      updateDestinationRatingStats(destinationId);
      
      return { success: true, rating: newRating };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to submit rating' };
    }
  };

  const updateDestinationRatingStats = (destinationId) => {
    try {
      const ratingsKey = 'safariDestinationRatings';
      const savedRatings = localStorage.getItem(ratingsKey);
      const ratings = savedRatings ? JSON.parse(savedRatings) : [];
      
      const destinationRatings = ratings.filter(r => r.destinationId === destinationId);
      
      if (destinationRatings.length > 0) {
        const averageRating = destinationRatings.reduce((sum, r) => sum + r.rating, 0) / destinationRatings.length;
        const roundedRating = Math.round(averageRating * 10) / 10;
        
        // Update destination in state and localStorage
        const updatedDestinations = destinations.map(dest => {
          if (dest._id === destinationId || dest.id === destinationId) {
            return {
              ...dest,
              rating: roundedRating,
              reviews: destinationRatings.length
            };
          }
          return dest;
        });
        
        setDestinations(updatedDestinations);
        localStorage.setItem('safariDestinations', JSON.stringify(updatedDestinations));
      }
    } catch (error) {
      console.error('Failed to update rating stats:', error);
    }
  };

  const getUserRating = (destinationId, userId) => {
    try {
      const ratingsKey = 'safariDestinationRatings';
      const savedRatings = localStorage.getItem(ratingsKey);
      const ratings = savedRatings ? JSON.parse(savedRatings) : [];
      
      return ratings.find(r => r.destinationId === destinationId && r.userId === userId);
    } catch (error) {
      return null;
    }
  };

  const getUserRatings = (userId) => {
    try {
      const ratingsKey = 'safariDestinationRatings';
      const savedRatings = localStorage.getItem(ratingsKey);
      const ratings = savedRatings ? JSON.parse(savedRatings) : [];
      
      return ratings.filter(r => r.userId === userId);
    } catch (error) {
      return [];
    }
  };

  const getDestinationRatings = (destinationId) => {
    try {
      const ratingsKey = 'safariDestinationRatings';
      const savedRatings = localStorage.getItem(ratingsKey);
      const ratings = savedRatings ? JSON.parse(savedRatings) : [];
      
      return ratings.filter(r => r.destinationId === destinationId);
    } catch (error) {
      return [];
    }
  };

  const value = {
    destinations,
    loading,
    addDestination,
    updateDestination,
    deleteDestination,
    getDestinationById,
    submitRating,
    getUserRating,
    getUserRatings,
    getDestinationRatings
  };

  return (
    <DestinationContext.Provider value={value}>
      {children}
    </DestinationContext.Provider>
  );
};