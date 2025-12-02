import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // Load notifications from localStorage
    if (user) {
      const savedNotifications = localStorage.getItem(`safariNotifications_${user.id}`);
      if (savedNotifications) {
        try {
          const notifications = JSON.parse(savedNotifications);
          setNotifications(notifications);
          setUnreadCount(notifications.filter(n => !n.isRead).length);
        } catch (error) {
          setNotifications([]);
          setUnreadCount(0);
        }
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
    setLoading(false);
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      const updatedNotifications = notifications.map(notification => 
        notification._id === notificationId || notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );
      
      setNotifications(updatedNotifications);
      localStorage.setItem(`safariNotifications_${user.id}`, JSON.stringify(updatedNotifications));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  };

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map(notification => ({ 
        ...notification, 
        isRead: true 
      }));
      
      setNotifications(updatedNotifications);
      localStorage.setItem(`safariNotifications_${user.id}`, JSON.stringify(updatedNotifications));
      setUnreadCount(0);
      
      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const updatedNotifications = notifications.filter(notification => 
        notification._id !== notificationId && notification.id !== notificationId
      );
      
      setNotifications(updatedNotifications);
      localStorage.setItem(`safariNotifications_${user.id}`, JSON.stringify(updatedNotifications));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshNotifications = async () => {
    if (!user) return;
    
    try {
      const savedNotifications = localStorage.getItem(`safariNotifications_${user.id}`);
      if (savedNotifications) {
        const notifications = JSON.parse(savedNotifications);
        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    }
  };

  const addNotification = async (notificationData) => {
    try {
      const notification = {
        id: Date.now(),
        ...notificationData,
        createdAt: new Date().toISOString(),
        isRead: false
      };

      const savedNotifications = localStorage.getItem(`safariNotifications_${user.id}`);
      const allNotifications = savedNotifications ? JSON.parse(savedNotifications) : [];
      const updatedNotifications = [notification, ...allNotifications];
      
      localStorage.setItem(`safariNotifications_${user.id}`, JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.isRead).length);
      
      return { success: true, notification };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to add notification' };
    }
  };

  const getUnreadCount = () => {
    return unreadCount;
  };

  const value = {
    notifications,
    loading,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    getUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};