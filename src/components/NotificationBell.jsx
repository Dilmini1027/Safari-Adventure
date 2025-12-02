import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';
import { useMessages } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const NotificationBell = () => {
  const { user } = useAuth();
  const { notifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const { unreadCount: messageUnreadCount, conversations } = useMessages();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const notificationUnreadCount = getUnreadCount();
  const totalUnreadCount = notificationUnreadCount + messageUnreadCount;
  
  // Create message notifications from unread conversations
  const messageNotifications = conversations
    .filter(msg => !msg.isRead && msg.recipientId === user?.id)
    .slice(0, 5)
    .map(msg => ({
      id: `msg-${msg.id}`,
      title: msg.subject || 'New Message',
      message: msg.message.substring(0, 50) + (msg.message.length > 50 ? '...' : ''),
      type: 'message',
      createdAt: msg.createdAt,
      isRead: msg.isRead,
      actionUrl: '/dashboard/book-safari', // Navigate to dashboard where messages can be accessed
      isMessage: true
    }));
  
  const userNotifications = notifications.filter(notif => {
    // Show notifications based on user role and targeting
    if (user?.role === 'admin') {
      return notif.targetRole === 'admin' || notif.userId === user.id || !notif.targetRole;
    } else {
      return notif.userId === user?.id && notif.targetRole !== 'admin';
    }
  }).slice(0, 10);
  
  // Combine and sort all notifications
  const allNotifications = [...messageNotifications, ...userNotifications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return '🎯';
      case 'approval':
        return '✅';
      case 'rejection':
        return '❌';
      case 'message':
        return '💬';
      default:
        return '📢';
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg transition-colors"
      >
        <BellIcon className="h-6 w-6" />
        {totalUnreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {totalUnreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-green-600 hover:text-green-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {totalUnreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {totalUnreadCount} unread notification{totalUnreadCount !== 1 ? 's' : ''}
                  {messageUnreadCount > 0 && ` (${messageUnreadCount} message${messageUnreadCount !== 1 ? 's' : ''})`}
                </p>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {allNotifications.length === 0 ? (
                <div className="p-6 text-center">
                  <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {allNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                        !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl flex-shrink-0">
                          {notification.isMessage ? (
                            <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-500" />
                          ) : (
                            <span>{getNotificationIcon(notification.type)}</span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="p-1 text-blue-500 hover:text-blue-700"
                                  title="Mark as read"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="p-1 text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {allNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to notifications page if you have one
                    // window.location.href = '/notifications';
                  }}
                  className="w-full text-center text-sm text-green-600 hover:text-green-800 font-medium py-1"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;