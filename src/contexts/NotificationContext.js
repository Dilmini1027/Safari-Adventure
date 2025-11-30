import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('safariNotifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    } else {
      // Add sample notifications for testing
      const sampleNotifications = [
        {
          id: 1001,
          type: 'booking',
          title: 'New Booking Request',
          message: 'John Smith requested booking for African Safari Adventure',
          bookingId: 1,
          userId: 'visitor1',
          isRead: false,
          createdAt: new Date('2024-01-10T10:30:00').toISOString()
        },
        {
          id: 1002,
          type: 'booking',
          title: 'New Booking Request',
          message: 'Mike Brown requested booking for Rainforest Discovery',
          bookingId: 3,
          userId: 'visitor3',
          isRead: false,
          createdAt: new Date('2024-01-12T14:15:00').toISOString()
        },
        {
          id: 1003,
          type: 'approval',
          title: 'Booking Approved!',
          message: 'Your booking for Mountain Expedition has been approved!',
          bookingId: 2,
          userId: 'visitor2',
          isRead: false,
          createdAt: new Date('2024-01-08T16:45:00').toISOString()
        }
      ];
      setNotifications(sampleNotifications);
    }
  }, []);

  useEffect(() => {
    // Save notifications to localStorage whenever it changes
    localStorage.setItem('safariNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.isRead).length;
  };

  const getNotificationsByUser = (userId) => {
    return notifications.filter(notification => notification.userId === userId);
  };

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    getNotificationsByUser
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};