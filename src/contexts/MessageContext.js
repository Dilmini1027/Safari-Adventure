import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MessageContext = createContext();

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Update unread count whenever conversations change
  useEffect(() => {
    if (user && conversations) {
      const count = conversations.filter(c => !c.isRead && c.recipientId === user.id).length;
      setUnreadCount(count);
    }
  }, [conversations, user]);

  // Mock message data generator
  const generateMockMessages = (userId, userRole) => {
    const mockMessages = [];
    const now = new Date();
    
    if (userRole === 'visitor') {
      // Mock conversations for visitors
      mockMessages.push(
        // Booking confirmation conversation
        {
          id: 1,
          senderId: 'admin',
          recipientId: userId,
          bookingId: 'BK001',
          subject: 'Booking Confirmation - Yala National Park',
          message: 'Your booking for Yala National Park has been confirmed! We are excited to have you join us for this amazing safari experience.',
          createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'booking_confirmation'
        },
        {
          id: 2,
          senderId: userId,
          recipientId: 'admin',
          bookingId: 'BK001',
          subject: 'Booking Confirmation - Yala National Park',
          message: 'Thank you for the confirmation! I have a few questions about the pickup time. What time should we be ready?',
          createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'reply'
        },
        {
          id: 3,
          senderId: 'admin',
          recipientId: userId,
          bookingId: 'BK001',
          subject: 'Booking Confirmation - Yala National Park',
          message: 'Great question! Our safari vehicle will pick you up at 5:30 AM from your hotel. Please be ready 10 minutes earlier. We\'ll also provide breakfast boxes for the early start.',
          createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'reply'
        },
        
        // Payment reminder conversation
        {
          id: 4,
          senderId: 'admin',
          recipientId: userId,
          bookingId: 'BK002',
          subject: 'Payment Reminder - Wilpattu Safari',
          message: 'Hi! This is a friendly reminder that your payment for the Wilpattu National Park safari is due in 3 days. You can make the payment through our secure portal.',
          createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          type: 'payment_reminder'
        },
        
        // Special offers conversation
        {
          id: 5,
          senderId: 'admin',
          recipientId: userId,
          subject: 'Special Offer - Elephant Gathering Season',
          message: '🐘 Special Announcement! The famous Elephant Gathering at Minneriya National Park is happening next month. We\'re offering 20% discount for early bookings. Would you be interested?',
          createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          type: 'promotion'
        },
        
        // Welcome message
        {
          id: 6,
          senderId: 'admin',
          recipientId: userId,
          subject: 'Welcome to Safari Adventures!',
          message: 'Welcome to Sri Lanka\'s premier safari booking platform! We\'re here to help you create unforgettable wildlife experiences. Feel free to reach out if you have any questions.',
          createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'welcome'
        }
      );
    } else if (userRole === 'admin') {
      // Mock conversations for admin
      mockMessages.push(
        // Customer inquiry
        {
          id: 7,
          senderId: 'user_101',
          recipientId: userId,
          bookingId: 'BK003',
          subject: 'Question about Group Booking',
          message: 'Hi, I\'m planning a safari for 12 people. Do you offer group discounts? Also, what\'s the best time of year to visit Yala?',
          createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          type: 'inquiry',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah.j@email.com'
        },
        
        // Complaint/issue
        {
          id: 8,
          senderId: 'user_102',
          recipientId: userId,
          bookingId: 'BK004',
          subject: 'Issue with Recent Booking',
          message: 'I had an issue with my recent safari booking. The pickup was delayed by 2 hours and we missed the morning game drive. I would like to discuss compensation.',
          createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          type: 'complaint',
          customerName: 'David Wilson',
          customerEmail: 'david.w@email.com'
        },
        {
          id: 9,
          senderId: userId,
          recipientId: 'user_102',
          bookingId: 'BK004',
          subject: 'Issue with Recent Booking',
          message: 'I sincerely apologize for the inconvenience caused. We take this matter very seriously. I\'ll arrange for a full refund of the affected day and offer you a complimentary half-day safari. Let me know your availability.',
          createdAt: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'reply'
        },
        
        // Booking modification request
        {
          id: 10,
          senderId: 'user_103',
          recipientId: userId,
          bookingId: 'BK005',
          subject: 'Date Change Request',
          message: 'Hi! Due to a family emergency, I need to postpone my Udawalawe safari from next week to the following month. Is this possible? Booking reference: BK005',
          createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'modification',
          customerName: 'Emma Thompson',
          customerEmail: 'emma.t@email.com'
        },
        {
          id: 11,
          senderId: userId,
          recipientId: 'user_103',
          bookingId: 'BK005',
          subject: 'Date Change Request',
          message: 'Of course! I understand that emergencies happen. I\'ve checked our availability and can reschedule your booking to any date in the following month. Please let me know your preferred dates and I\'ll confirm immediately.',
          createdAt: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'reply'
        },
        
        // Positive feedback
        {
          id: 12,
          senderId: 'user_104',
          recipientId: userId,
          bookingId: 'BK006',
          subject: 'Amazing Experience - Thank You!',
          message: '🙏 I just wanted to say THANK YOU for organizing the most incredible safari experience at Gal Oya! Seeing elephants swimming was magical. Your team was professional and the guide was knowledgeable. Will definitely book again!',
          createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          type: 'feedback',
          customerName: 'Michael Chen',
          customerEmail: 'michael.c@email.com'
        },
        
        // Special request
        {
          id: 13,
          senderId: 'user_105',
          recipientId: userId,
          subject: 'Wedding Anniversary Safari',
          message: 'Hi! My husband and I are celebrating our 25th wedding anniversary next month. We\'d love to book a romantic safari experience. Do you have any special packages or can you recommend the best destination for a couple?',
          createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          type: 'special_request',
          customerName: 'Lisa Rodriguez',
          customerEmail: 'lisa.r@email.com'
        }
      );
    }
    
    return mockMessages;
  };

  useEffect(() => {
    // Load conversations from localStorage
    if (user) {
      const savedConversations = localStorage.getItem(`safariMessages_${user.id}`);
      if (savedConversations) {
        try {
          const conversations = JSON.parse(savedConversations);
          setConversations(conversations);
          setUnreadCount(conversations.filter(c => !c.isRead).length);
        } catch (error) {
          setConversations([]);
          setUnreadCount(0);
        }
      } else {
        // Generate mock messages for new users
        const mockMessages = generateMockMessages(user.id, user.role);
        setConversations(mockMessages);
        setUnreadCount(mockMessages.filter(c => !c.isRead && c.recipientId === user.id).length);
        // Save to localStorage
        localStorage.setItem(`safariMessages_${user.id}`, JSON.stringify(mockMessages));
      }
    } else {
      setConversations([]);
      setUnreadCount(0);
    }
    setLoading(false);
  }, [user]);

  const sendMessage = async (messageData) => {
    try {
      const message = {
        id: Date.now(),
        senderId: user.id,
        ...messageData,
        createdAt: new Date().toISOString(),
        isRead: false
      };

      const savedMessages = localStorage.getItem(`safariMessages_${user.id}`);
      const allMessages = savedMessages ? JSON.parse(savedMessages) : [];
      const updatedMessages = [...allMessages, message];
      
      localStorage.setItem(`safariMessages_${user.id}`, JSON.stringify(updatedMessages));
      setConversations(updatedMessages);
      setUnreadCount(updatedMessages.filter(c => !c.isRead && c.recipientId === user.id).length);
      
      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to send message' };
    }
  };

  const getConversation = async (userId) => {
    try {
      const userMessages = conversations.filter(msg => 
        (msg.sender?.id === userId || msg.recipient?.id === userId) ||
        (msg.sender?.id === user?.id && msg.recipient?.id === userId) ||
        (msg.sender?.id === userId && msg.recipient?.id === user?.id)
      );
      
      setCurrentConversation(userMessages);
      return { success: true, messages: userMessages };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to load conversation' };
    }
  };

  const markConversationAsRead = async (conversationKey) => {
    try {
      const updatedConversations = conversations.map(msg => 
        (msg.bookingId === conversationKey || msg.subject === conversationKey) && !msg.isRead && msg.recipientId === user.id
          ? { ...msg, isRead: true }
          : msg
      );
      
      setConversations(updatedConversations);
      localStorage.setItem(`safariMessages_${user.id}`, JSON.stringify(updatedConversations));
      setUnreadCount(updatedConversations.filter(c => !c.isRead && c.recipientId === user.id).length);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to mark as read' };
    }
  };

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const savedConversations = localStorage.getItem(`safariMessages_${user.id}`);
      if (savedConversations) {
        const conversations = JSON.parse(savedConversations);
        setConversations(conversations);
        setUnreadCount(conversations.filter(c => !c.isRead).length);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  // Legacy methods for backward compatibility
  const getMessagesByUser = (userId) => {
    return conversations.filter(conv => 
      conv.participant && (conv.participant.id === userId || conv.participant._id === userId)
    );
  };

  const getUnreadMessagesCount = () => {
    return unreadCount;
  };

  const refreshConversations = loadConversations;

  const value = {
    conversations,
    currentConversation,
    loading,
    unreadCount,
    sendMessage,
    getConversation,
    markConversationAsRead,
    loadConversations,
    refreshConversations,
    // Legacy methods for backward compatibility
    getMessagesByUser,
    getUnreadMessagesCount
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};