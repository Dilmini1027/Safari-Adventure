import React, { createContext, useState, useContext, useEffect } from 'react';
import { destinations as initialDestinations } from '../data/destinations';

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
    // Load destinations from localStorage or use initial data
    const savedDestinations = localStorage.getItem('safariDestinations');
    if (savedDestinations) {
      try {
        setDestinations(JSON.parse(savedDestinations));
      } catch (error) {
        setDestinations(initialDestinations);
      }
    } else {
      setDestinations(initialDestinations);
    }
    setLoading(false);
  }, []);

  // Save destinations to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('safariDestinations', JSON.stringify(destinations));
    }
  }, [destinations, loading]);

  const addDestination = (newDestination) => {
    const destination = {
      ...newDestination,
      id: Date.now(), // Simple ID generation
      rating: 0,
      reviews: 0,
    };
    setDestinations(prev => [...prev, destination]);
    return destination;
  };

  const updateDestination = (id, updates) => {
    setDestinations(prev =>
      prev.map(dest => dest.id === id ? { ...dest, ...updates } : dest)
    );
  };

  const deleteDestination = (id) => {
    setDestinations(prev => prev.filter(dest => dest.id !== id));
  };

  const getDestinationById = (id) => {
    return destinations.find(dest => dest.id === parseInt(id));
  };

  const value = {
    destinations,
    loading,
    addDestination,
    updateDestination,
    deleteDestination,
    getDestinationById
  };

  return (
    <DestinationContext.Provider value={value}>
      {children}
    </DestinationContext.Provider>
  );
};