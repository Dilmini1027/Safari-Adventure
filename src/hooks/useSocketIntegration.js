import { useEffect } from 'react';
import socketService from '../services/socketService';
import { useNotifications } from '../contexts/NotificationContext';
import { useMessages } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';

export const useSocketIntegration = () => {
  const { refreshNotifications } = useNotifications();
  const { refreshConversations } = useMessages();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Listen for new notifications
    socketService.onNotification((notification) => {
      console.log('Received new notification:', notification);
      // Show a toast notification or update UI
      if (window.showToast) {
        window.showToast(notification.message, 'info');
      }
      // Refresh notifications list
      refreshNotifications();
    });

    // Listen for new messages
    socketService.onMessage((message) => {
      console.log('Received new message:', message);
      // Show a toast notification
      if (window.showToast) {
        window.showToast(`New message from ${message.sender}`, 'info');
      }
      // Refresh conversations
      refreshConversations();
    });

    // Listen for booking status updates
    socketService.onBookingUpdate((booking) => {
      console.log('Booking status updated:', booking);
      // Show a toast notification
      if (window.showToast) {
        const statusMessage = {
          'approved': 'Your booking has been approved!',
          'rejected': 'Your booking has been rejected.',
          'pending': 'Your booking is now pending review.',
          'cancelled': 'Your booking has been cancelled.'
        };
        window.showToast(statusMessage[booking.status] || 'Booking status updated', 'info');
      }
      // Refresh notifications to show booking update
      refreshNotifications();
    });

    // Cleanup function
    return () => {
      socketService.off('newNotification');
      socketService.off('newMessage');
      socketService.off('bookingStatusUpdate');
    };
  }, [user, refreshNotifications, refreshConversations]);

  return {
    sendMessage: socketService.sendMessage.bind(socketService),
    updateBookingStatus: socketService.updateBookingStatus.bind(socketService)
  };
};

export default useSocketIntegration;