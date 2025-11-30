import React, { createContext, useState, useContext, useEffect } from 'react';

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

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('safariBookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (error) {
        console.error('Error loading bookings:', error);
      }
    } else {
      // Add sample bookings for testing - Updated format for notification system
      const sampleBookings = [
        {
          id: 1,
          userId: 'visitor1',
          userName: 'John Smith',
          userEmail: 'john.smith@example.com',
          destinationId: 1,
          destinationName: 'African Safari Adventure',
          destinationLocation: 'Kenya & Tanzania',
          startDate: '2024-02-15',
          endDate: '2024-02-25',
          adults: 2,
          children: 0,
          guests: 2,
          roomType: 'deluxe',
          specialRequests: 'Vegetarian meals required',
          phone: '+1 (555) 123-4567',
          country: 'United States',
          totalPrice: 5000,
          status: 'approved',
          createdAt: new Date('2024-01-10').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString(),
          // Backward compatibility fields
          destination: {
            id: 1,
            name: 'African Safari Adventure',
            location: 'Kenya & Tanzania'
          },
          customerInfo: {
            fullName: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+1 (555) 123-4567',
            dietaryRequirements: 'Vegetarian meals required'
          },
          travelDate: '2024-02-15'
        },
        {
          id: 2,
          userId: 'visitor2',
          userName: 'Sarah Johnson',
          userEmail: 'sarah.j@example.com',
          destinationId: 2,
          destinationName: 'Mountain Expedition',
          destinationLocation: 'Nepal & Tibet',
          startDate: '2024-03-20',
          endDate: '2024-03-30',
          adults: 3,
          children: 1,
          guests: 4,
          roomType: 'suite',
          specialRequests: 'Need connecting rooms for family',
          phone: '+1 (555) 234-5678',
          country: 'Canada',
          totalPrice: 8000,
          status: 'approved',
          createdAt: new Date('2024-01-05').toISOString(),
          updatedAt: new Date('2024-01-08').toISOString(),
          adminNote: 'Approved - Premium mountain view rooms reserved',
          // Backward compatibility fields
          destination: {
            id: 2,
            name: 'Mountain Expedition',
            location: 'Nepal & Tibet'
          },
          customerInfo: {
            fullName: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            phone: '+1 (555) 234-5678',
            dietaryRequirements: 'Need connecting rooms for family'
          },
          travelDate: '2024-03-20'
        },
        {
          id: 3,
          userId: 'visitor3',
          userName: 'Mike Brown',
          userEmail: 'mike.brown@example.com',
          destinationId: 3,
          destinationName: 'Rainforest Discovery',
          destinationLocation: 'Costa Rica',
          startDate: '2024-04-10',
          endDate: '2024-04-17',
          adults: 1,
          children: 0,
          guests: 1,
          roomType: 'standard',
          specialRequests: 'Gluten-free meals, early morning tours preferred',
          phone: '+1 (555) 345-6789',
          country: 'United Kingdom',
          totalPrice: 2500,
          status: 'pending',
          createdAt: new Date('2024-01-12').toISOString(),
          updatedAt: new Date('2024-01-12').toISOString(),
          // Backward compatibility fields
          destination: {
            id: 3,
            name: 'Rainforest Discovery',
            location: 'Costa Rica'
          },
          customerInfo: {
            fullName: 'Mike Brown',
            email: 'mike.brown@example.com',
            phone: '+1 (555) 345-6789',
            dietaryRequirements: 'Gluten-free meals, early morning tours preferred'
          },
          travelDate: '2024-04-10'
        }
      ];
      setBookings(sampleBookings);
    }
  }, []);

  useEffect(() => {
    // Save bookings to localStorage whenever it changes
    localStorage.setItem('safariBookings', JSON.stringify(bookings));
  }, [bookings]);

  const createBooking = async (bookingData, notificationCallback = null) => {
    try {
      const newBooking = {
        id: Date.now(),
        ...bookingData,
        status: 'pending', // pending, approved, rejected
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setBookings(prev => [...prev, newBooking]);

      // Create notification for admin about new booking
      if (notificationCallback) {
        notificationCallback({
          type: 'booking',
          title: 'New Booking Request',
          message: `${bookingData.userName} requested booking for ${bookingData.destinationName}`,
          bookingId: newBooking.id,
          fromUserId: bookingData.userId,
          targetRole: 'admin', // Only visible to admins
          actionUrl: '/admin/dashboard'
        });
      }

      return { success: true, booking: newBooking };
    } catch (error) {
      return { success: false, error: 'Failed to create booking' };
    }
  };

  const updateBookingStatus = (bookingId, status, note = '', callbacks = {}) => {
    const { notificationCallback, messageCallback } = callbacks;
    
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        const updatedBooking = { 
          ...booking, 
          status, 
          adminNote: note,
          updatedAt: new Date().toISOString() 
        };

        // Create notification for customer
        if (notificationCallback) {
          const notificationTitle = status === 'approved' ? 'Booking Approved!' : 'Booking Update';
          const notificationMessage = status === 'approved' 
            ? `Great news! Your booking for ${booking.destinationName} has been approved. You can now proceed to payment in your dashboard.`
            : status === 'rejected'
            ? `Your booking for ${booking.destinationName} was declined`
            : `Your booking status has been updated to ${status}`;

          notificationCallback({
            type: status === 'approved' ? 'approval' : 'rejection',
            title: notificationTitle,
            message: notificationMessage,
            bookingId: bookingId,
            userId: booking.userId,
            actionUrl: status === 'approved' ? '/dashboard/book-safari' : null
          });
        }

        // Send message if note is provided
        if (note && messageCallback) {
          messageCallback({
            senderId: 'admin', // Admin ID
            recipientId: booking.userId,
            bookingId: bookingId,
            subject: `Booking ${status}: ${booking.destinationName}`,
            message: note,
            type: 'booking_update'
          });
        }

        return updatedBooking;
      }
      return booking;
    }));
  };

  const getUserBookings = (userId) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const getPendingBookings = () => {
    return bookings.filter(booking => booking.status === 'pending');
  };

  const getBookingStats = () => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      approved: bookings.filter(b => b.status === 'approved').length,
      paid: bookings.filter(b => b.status === 'paid').length,
      rejected: bookings.filter(b => b.status === 'rejected').length
    };
  };

  const value = {
    bookings,
    createBooking,
    updateBookingStatus,
    getUserBookings,
    getPendingBookings,
    getBookingStats
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};