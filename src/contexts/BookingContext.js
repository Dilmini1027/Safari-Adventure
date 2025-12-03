import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Force clear old bookings and regenerate with Sri Lankan destinations
    localStorage.removeItem('safariBookings');
    
    // Always generate fresh sample data for testing
    if (user) {
      const samplePaidBookings = [
        {
          id: 1001,
          destinationId: 1,
          destinationName: 'Yala National Park',
          destinationLocation: 'Southern Province, Sri Lanka',
          startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
          endDate: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(), // 38 days ago
          guests: 2,
          roomType: 'luxury-suite',
          totalPrice: 35000,
          specialRequests: 'Wildlife photography tour, early morning safari preferred',
          status: 'paid',
          user: { id: user.id, firstName: user.firstName, lastName: user.lastName },
          userId: user.id,
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
          adminNote: 'Payment completed. Spotted leopards and elephants during safari.'
        },
        {
          id: 1004,
          destinationId: 4,
          destinationName: 'Wilpattu National Park',
          destinationLocation: 'Northwest Sri Lanka',
          startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
          endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days from now
          guests: 3,
          roomType: 'deluxe',
          totalPrice: 42000,
          specialRequests: 'Looking for leopard sightings, prefer early morning game drives',
          status: 'pending',
          userName: user.role === 'admin' ? 'Emma Wilson' : `${user.firstName} ${user.lastName}`,
          userEmail: user.role === 'admin' ? 'emma.w@email.com' : user.email,
          user: { id: user.role === 'admin' ? 104 : user.id, firstName: user.role === 'admin' ? 'Emma' : user.firstName, lastName: user.role === 'admin' ? 'Wilson' : user.lastName },
          userId: user.role === 'admin' ? 104 : user.id,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          adminNote: ''
        },
        {
          id: 1005,
          destinationId: 7,
          destinationName: 'Gal Oya National Park',
          destinationLocation: 'Uva Province, Sri Lanka',
          startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
          endDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(), // 27 days from now
          guests: 2,
          roomType: 'suite',
          totalPrice: 48000,
          specialRequests: 'Interested in boat safari and swimming elephants experience',
          status: 'approved',
          userName: user.role === 'admin' ? 'David Rodriguez' : `${user.firstName} ${user.lastName}`,
          userEmail: user.role === 'admin' ? 'david.r@email.com' : user.email,
          user: { id: user.role === 'admin' ? 105 : user.id, firstName: user.role === 'admin' ? 'David' : user.firstName, lastName: user.role === 'admin' ? 'Rodriguez' : user.lastName },
          userId: user.role === 'admin' ? 105 : user.id,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          adminNote: 'Approved. Boat safari arranged for elephant watching experience.'
        }
      ];
        
      setBookings(samplePaidBookings);
      // Also save to localStorage so it persists
      localStorage.setItem('safariBookings', JSON.stringify(samplePaidBookings));
      
      // Clear any existing ratings for fresh start - force clear
      localStorage.removeItem('safariDestinationRatings');
      
      // Also clear and reset destinations to remove any cached ratings
      localStorage.removeItem('safariDestinations');
    } else {
      setBookings([]);
    }
    setLoading(false);
  }, [user]);

  const createBooking = async (bookingData) => {
    try {
      const booking = {
        id: Date.now(),
        ...bookingData,
        user: user || { id: user?.id, firstName: user?.firstName, lastName: user?.lastName },
        userId: user?.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Get all bookings from localStorage to update
      const savedBookings = localStorage.getItem('safariBookings');
      const allBookings = savedBookings ? JSON.parse(savedBookings) : [];
      const updatedBookings = [...allBookings, booking];
      
      localStorage.setItem('safariBookings', JSON.stringify(updatedBookings));
      
      // Update local state based on user role
      if (user?.role === 'admin') {
        setBookings(updatedBookings);
      } else {
        setBookings(prev => [...prev, booking]);
      }
      
      return { success: true, booking };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to create booking' };
    }
  };

  const updateBookingStatus = async (bookingId, status, note = '', callbacks = {}) => {
    try {
      // Get all bookings from localStorage
      const savedBookings = localStorage.getItem('safariBookings');
      const allBookings = savedBookings ? JSON.parse(savedBookings) : [];
      
      // Find the booking to get user info
      const booking = allBookings.find(b => b._id === bookingId || b.id === bookingId);
      
      // Update the booking
      const updatedBookings = allBookings.map(booking => 
        booking._id === bookingId || booking.id === bookingId
          ? { ...booking, status, adminNote: note, updatedAt: new Date().toISOString() }
          : booking
      );
      
      localStorage.setItem('safariBookings', JSON.stringify(updatedBookings));
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId || booking.id === bookingId
          ? { ...booking, status, adminNote: note, updatedAt: new Date().toISOString() }
          : booking
      ));
      
      const updatedBooking = updatedBookings.find(booking => 
        booking._id === bookingId || booking.id === bookingId
      );
      
      // Send admin note as message if note exists and messageCallback is provided
      if (note && note.trim() && callbacks.messageCallback && booking) {
        const statusMessages = {
          approved: 'Your booking has been approved!',
          rejected: 'Your booking has been rejected.',
          paid: 'Payment confirmed for your booking.'
        };
        
        const messageSubject = `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - ${booking.destinationName}`;
        const messageBody = `${statusMessages[status] || `Your booking status has been updated to ${status}.`}\n\nAdmin Note: ${note}`;
        
        await callbacks.messageCallback({
          recipientId: booking.userId || booking.user?._id || `user_${booking.userEmail}`,
          bookingId: bookingId,
          subject: messageSubject,
          message: messageBody,
          type: 'booking_update'
        });
      }
      
      // Send notification if callback is provided
      if (callbacks.notificationCallback && booking) {
        callbacks.notificationCallback({
          title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          message: `Booking #${bookingId} for ${booking.destinationName} has been ${status}.`,
          type: 'booking_update',
          userId: booking.userId || booking.user?._id
        });
      }
      
      return { success: true, booking: updatedBooking };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update booking status' };
    }
  };

  const getUserBookings = (userId) => {
    return bookings.filter(booking => 
      booking.user?._id === userId || 
      booking.userId === userId ||
      booking.user === userId
    );
  };

  const getPendingBookings = () => {
    return bookings.filter(booking => booking.status === 'pending');
  };

  const getBookingStats = async () => {
    // Calculate stats from all bookings in localStorage for admin
    const savedBookings = localStorage.getItem('safariBookings');
    const allBookings = savedBookings ? JSON.parse(savedBookings) : [];
    const statsBookings = user?.role === 'admin' ? allBookings : bookings;
    
    return {
      totalBookings: statsBookings.length,
      pendingBookings: statsBookings.filter(b => b.status === 'pending').length,
      approvedBookings: statsBookings.filter(b => b.status === 'approved').length,
      completedBookings: statsBookings.filter(b => b.status === 'completed').length,
      rejectedBookings: statsBookings.filter(b => b.status === 'rejected').length,
      paidBookings: statsBookings.filter(b => b.status === 'paid').length,
      totalRevenue: statsBookings
        .filter(b => ['paid', 'completed'].includes(b.status))
        .reduce((sum, b) => sum + (b.pricing?.totalPrice || b.totalPrice || 0), 0)
    };
  };

  const processPayment = async (bookingId, paymentData) => {
    try {
      // Simulate payment processing
      const savedBookings = localStorage.getItem('safariBookings');
      const allBookings = savedBookings ? JSON.parse(savedBookings) : [];
      
      // Update the booking status to paid
      const updatedBookings = allBookings.map(booking => 
        booking._id === bookingId || booking.id === bookingId
          ? { 
              ...booking, 
              status: 'paid', 
              payment: paymentData,
              paidAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : booking
      );
      
      localStorage.setItem('safariBookings', JSON.stringify(updatedBookings));
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId || booking.id === bookingId
          ? { 
              ...booking, 
              status: 'paid', 
              payment: paymentData,
              paidAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : booking
      ));
      
      const updatedBooking = updatedBookings.find(booking => 
        booking._id === bookingId || booking.id === bookingId
      );
      
      return { success: true, booking: updatedBooking };
    } catch (error) {
      return { success: false, error: error.message || 'Payment processing failed' };
    }
  };

  const value = {
    bookings,
    loading,
    createBooking,
    updateBookingStatus,
    getUserBookings,
    getPendingBookings,
    getBookingStats,
    processPayment
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};