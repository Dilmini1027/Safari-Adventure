import React, { createContext, useState, useContext, useEffect } from 'react';

const MessageContext = createContext();

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem('safariMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    } else {
      // Add sample messages for testing
      const sampleMessages = [
        {
          id: 2001,
          senderId: 'admin',
          recipientId: 'visitor2',
          bookingId: 2,
          subject: 'Booking approved: Mountain Expedition',
          message: 'Great news! Your Mountain Expedition booking has been approved. We have reserved premium mountain view rooms for your family. Looking forward to hosting you!',
          type: 'booking_update',
          isRead: false,
          createdAt: new Date('2024-01-08T16:45:00').toISOString()
        },
        {
          id: 2002,
          senderId: 'visitor2',
          recipientId: 'admin',
          bookingId: 2,
          subject: 'Booking approved: Mountain Expedition',
          message: 'Thank you so much! We are very excited about this trip. Can you please confirm the pickup time from the hotel?',
          type: 'reply',
          isRead: true,
          createdAt: new Date('2024-01-08T18:20:00').toISOString()
        },
        {
          id: 2003,
          senderId: 'admin',
          recipientId: 'visitor2',
          bookingId: 2,
          subject: 'Booking approved: Mountain Expedition',
          message: 'Pickup will be at 6:00 AM from your hotel lobby. Our guide will be carrying a Safari Adventure sign. Safe travels!',
          type: 'booking_update',
          isRead: false,
          createdAt: new Date('2024-01-09T09:15:00').toISOString()
        }
      ];
      setMessages(sampleMessages);
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever it changes
    localStorage.setItem('safariMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (messageData) => {
    const newMessage = {
      id: Date.now(),
      ...messageData,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const markMessageAsRead = (messageId) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId 
          ? { ...message, isRead: true }
          : message
      )
    );
  };

  const getMessagesByUser = (userId) => {
    return messages.filter(message => 
      message.recipientId === userId || message.senderId === userId
    );
  };

  const getConversation = (userId1, userId2) => {
    return messages.filter(message => 
      (message.senderId === userId1 && message.recipientId === userId2) ||
      (message.senderId === userId2 && message.recipientId === userId1)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const getUnreadMessagesCount = (userId) => {
    return messages.filter(message => 
      message.recipientId === userId && !message.isRead
    ).length;
  };

  const deleteMessage = (messageId) => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
  };

  const value = {
    messages,
    sendMessage,
    markMessageAsRead,
    getMessagesByUser,
    getConversation,
    getUnreadMessagesCount,
    deleteMessage
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};