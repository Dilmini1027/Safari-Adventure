import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useMessages } from '../contexts/MessageContext';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const MessageInbox = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { messages, sendMessage, markMessageAsRead, getMessagesByUser } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (user) {
      const userMessages = getMessagesByUser(user.id);
      
      // Group messages by booking or conversation
      const groupedConversations = {};
      
      userMessages.forEach(message => {
        const key = message.bookingId || 'general';
        if (!groupedConversations[key]) {
          groupedConversations[key] = {
            id: key,
            title: message.subject || 'General Message',
            messages: [],
            unread: 0
          };
        }
        groupedConversations[key].messages.push(message);
        if (!message.isRead && message.recipientId === user.id) {
          groupedConversations[key].unread++;
        }
      });

      // Sort messages within each conversation
      Object.values(groupedConversations).forEach(conv => {
        conv.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        conv.lastMessage = conv.messages[conv.messages.length - 1];
      });

      setConversations(Object.values(groupedConversations));
    }
  }, [user, messages, getMessagesByUser]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    
    // Mark messages as read
    conversation.messages.forEach(message => {
      if (!message.isRead && message.recipientId === user.id) {
        markMessageAsRead(message.id);
      }
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      sendMessage({
        senderId: user.id,
        recipientId: 'admin',
        bookingId: selectedConversation.id !== 'general' ? selectedConversation.id : null,
        subject: selectedConversation.title,
        message: newMessage.trim(),
        type: 'reply'
      });
      setNewMessage('');
    }
  };

  const getSenderName = (senderId) => {
    if (senderId === user?.id) return user.name;
    if (senderId === 'admin') return 'Admin';
    return 'Unknown';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Conversation List */}
          <div className="w-1/3 border-r border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto h-full">
              {conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No messages yet</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <motion.button
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation)}
                    className={`w-full p-4 text-left hover:bg-white transition-colors border-b border-gray-100 ${
                      selectedConversation?.id === conversation.id ? 'bg-white border-l-4 border-l-green-500' : ''
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {conversation.title}
                          </h3>
                          {conversation.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {conversation.lastMessage.message}
                          </p>
                        )}
                        {conversation.lastMessage && (
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedConversation.title}
                  </h3>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user.id
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium">
                            {getSenderName(message.senderId)}
                          </span>
                          <span className="text-xs opacity-75">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MessageInbox;