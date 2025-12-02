import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useBooking } from '../../../contexts/BookingContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useMessages } from '../../../contexts/MessageContext';
import Breadcrumb from '../../../components/Breadcrumb';
import MessageInbox from '../../../components/MessageInbox';
import {
  ChartBarIcon,
  UsersIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import NavBar from '../../../components/MobileNavBar';

const RealtimeDashboard = () => {
  const { user } = useAuth();
  const { bookings, updateBookingStatus, getBookingStats, getPendingBookings } = useBooking();
  const { addNotification } = useNotifications();
  const { sendMessage, getUnreadMessagesCount } = useMessages();
  
  const unreadMessagesCount = getUnreadMessagesCount();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMessageInbox, setShowMessageInbox] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    paid: 0,
    rejected: 0
  });
  
  // Generate mock data if no bookings exist
  React.useEffect(() => {
    const generateMockBookings = () => {
      const savedBookings = localStorage.getItem('safariBookings');
      if (!savedBookings || JSON.parse(savedBookings).length === 0) {
        const mockBookings = [
          {
            id: Date.now() + 1,
            destinationName: 'Udawalawe National Park',
            destinationLocation: 'Sabaragamuwa Province, Sri Lanka',
            userName: 'Sarah Johnson',
            userEmail: 'sarah.j@email.com',
            phone: '+1-555-0123',
            country: 'USA',
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            adults: 2,
            children: 1,
            guests: 3,
            roomType: 'luxury-tent',
            totalPrice: 39000,
            status: 'pending',
            specialRequests: 'Vegetarian meals preferred',
            createdAt: new Date().toISOString(),
            user: { id: 2, firstName: 'Sarah', lastName: 'Johnson' },
            userId: 2
          },
          {
            id: Date.now() + 2,
            destinationName: 'Yala National Park',
            destinationLocation: 'Southern Province, Sri Lanka',
            userName: 'Mike Chen',
            userEmail: 'mike.chen@email.com',
            phone: '+1-555-0456',
            country: 'Canada',
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
            adults: 4,
            children: 0,
            guests: 4,
            roomType: 'standard-tent',
            totalPrice: 35000,
            status: 'approved',
            specialRequests: null,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            user: { id: 3, firstName: 'Mike', lastName: 'Chen' },
            userId: 3
          },
          {
            id: Date.now() + 3,
            destinationName: 'Wilpattu National Park',
            destinationLocation: 'Northwest Sri Lanka',
            userName: 'Emma Wilson',
            userEmail: 'emma.w@email.com',
            phone: '+44-20-1234-5678',
            country: 'UK',
            startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            adults: 2,
            children: 2,
            guests: 4,
            roomType: 'family-tent',
            totalPrice: 50000,
            status: 'paid',
            payment: { method: 'credit-card', transactionId: 'TXN12345' },
            paidAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            user: { id: 4, firstName: 'Emma', lastName: 'Wilson' },
            userId: 4
          },
          {
            id: Date.now() + 4,
            destinationName: 'Minneriya National Park',
            destinationLocation: 'North Central Province, Sri Lanka',
            userName: 'David Rodriguez',
            userEmail: 'david.r@email.com',
            phone: '+1-555-0789',
            country: 'Mexico',
            startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            adults: 2,
            children: 0,
            guests: 2,
            roomType: 'luxury-tent',
            totalPrice: 43000,
            status: 'pending',
            specialRequests: 'Anniversary celebration - special dinner setup',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            user: { id: 5, firstName: 'David', lastName: 'Rodriguez' },
            userId: 5
          },
          {
            id: Date.now() + 5,
            destinationName: 'Kumana National Park',
            destinationLocation: 'Eastern Sri Lanka',
            userName: 'Lisa Park',
            userEmail: 'lisa.park@email.com',
            phone: '+82-10-1234-5678',
            country: 'South Korea',
            startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            adults: 1,
            children: 0,
            guests: 1,
            roomType: 'standard-tent',
            totalPrice: 32000,
            status: 'rejected',
            note: 'Dates unavailable - alternative dates suggested',
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            user: { id: 6, firstName: 'Lisa', lastName: 'Park' },
            userId: 6
          }
        ];
        localStorage.setItem('safariBookings', JSON.stringify(mockBookings));
      }
    };
    
    // generateMockBookings(); // Disabled - using BookingContext data instead
  }, []);
  
  // Update stats when bookings change
  React.useEffect(() => {
    const updateStats = async () => {
      const bookingStats = await getBookingStats();
      setStats(bookingStats);
    };
    updateStats();
  }, [bookings, getBookingStats]);
  
  const pendingBookings = getPendingBookings();

  const handleStatusUpdate = (bookingId, status) => {
    const callbacks = {
      notificationCallback: addNotification,
      messageCallback: sendMessage
    };
    updateBookingStatus(bookingId, status, adminNote, callbacks);
    setShowModal(false);
    setSelectedBooking(null);
    setAdminNote('');
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !messageRecipient) return;
    
    const result = await sendMessage({
      recipientId: messageRecipient,
      subject: messageSubject || 'Message from Admin',
      message: messageContent.trim(),
      type: 'admin_message'
    });
    
    if (result.success) {
      setShowMessageModal(false);
      setMessageRecipient('');
      setMessageSubject('');
      setMessageContent('');
      // Show success notification
      addNotification({
        title: 'Message Sent',
        message: 'Your message has been sent successfully.',
        type: 'success',
        targetRole: 'admin'
      });
    }
  };

  const openMessageModal = (booking = null) => {
    if (booking) {
      setMessageRecipient(booking.userId || `user_${booking.userEmail}`);
      setMessageSubject(`Regarding your booking - ${booking.destinationName}`);
    }
    setShowMessageModal(true);
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setAdminNote(booking.adminNote || '');
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-16">
        <Breadcrumb />
        
        {/* Tab Navigation */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span>Send Messages</span>
                </div>
              </button>
              <button
                onClick={() => setShowMessageInbox(true)}
                className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm flex items-center space-x-1"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span>Message Inbox</span>
                {unreadMessagesCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Monitor bookings, manage visitors, and track safari statistics</p>
            </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved (Pending Payment)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedBookings || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">{stats.paidBookings || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejectedBookings || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revenue and Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">Rs {stats.totalRevenue?.toLocaleString() || '0'}</p>
              <p className="text-green-100 text-sm">From {stats.paidBookings || 0} paid bookings</p>
              {stats.pendingBookings > 0 && (
                <p className="text-green-100 text-xs">
                  +Rs {((pendingBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)) || 0).toLocaleString()} potential
                </p>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/admin/visitors"
                className="flex items-center p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              >
                <UsersIcon className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Manage All Bookings</p>
                  <p className="text-xs text-blue-600">View details & payments</p>
                </div>
              </a>
              <a
                href="/admin/destinations"
                className="flex items-center p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
              >
                <MapPinIcon className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-900">Manage Destinations</p>
                  <p className="text-xs text-green-600">Add, edit, remove</p>
                </div>
              </a>
            </div>
          </div>
          
          {/* Activity Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">{stats.approvedBookings || 0} approved</p>
                  <p className="text-xs text-gray-500">This period</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">{stats.pendingBookings || 0} pending</p>
                  <p className="text-xs text-gray-500">Need attention</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">{stats.paidBookings || 0} payments</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pending Bookings Section */}
        <motion.div
          className="bg-white rounded-xl shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Pending Approvals ({pendingBookings.length})</h2>
            <p className="text-gray-600">Bookings awaiting your approval decision</p>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="p-8 text-center">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pending bookings at the moment</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  className="p-6 hover:bg-gray-50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.destinationName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Customer:</span>
                          <div>{booking.userName}</div>
                          <div className="text-xs">{booking.userEmail}</div>
                        </div>
                        <div>
                          <span className="font-medium">Dates:</span>
                          <div>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</div>
                        </div>
                        <div>
                          <span className="font-medium">Guests:</span>
                          <div>{booking.guests} people</div>
                          <div className="text-xs capitalize">{booking.roomType.replace('-', ' ')} room</div>
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>
                          <div className="text-lg font-bold text-gray-900">Rs {booking.totalPrice.toLocaleString()}</div>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium text-blue-900">Special Requests:</span>
                          <div className="text-blue-800 mt-1">{booking.specialRequests}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 ml-6">
                      <button
                        onClick={() => openModal(booking)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => {
                          const callbacks = { notificationCallback: addNotification, messageCallback: sendMessage };
                          updateBookingStatus(booking.id, 'approved', '', callbacks);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Approve
                      </button>
                      
                      <button
                        onClick={() => openModal(booking)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Bookings Overview */}
        <motion.div
          className="bg-white rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings Overview</h2>
              <p className="text-gray-600">Latest booking activities across all statuses</p>
            </div>
            <a
              href="/admin/visitors"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View All Bookings
            </a>
          </div>

          <div className="p-6">
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No bookings found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.slice(0, 6).map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 truncate">{booking.destinationName}</h4>
                        <p className="text-sm text-gray-500">{booking.userName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📅 {formatDate(booking.startDate)}</p>
                      <p>👥 {booking.guests} guests</p>
                      <p className="font-medium text-gray-900">💰 Rs {booking.totalPrice.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => openModal(booking)}
                      className="mt-3 w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
          </div>
        )}

        {/* Messages Tab Content */}
        {activeTab === 'messages' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Message Management</h1>
                <p className="text-gray-600">Send messages to visitors and manage communications</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowMessageInbox(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span>View Inbox</span>
                  {unreadMessagesCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => openMessageModal()}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>Send New Message</span>
                </button>
              </div>
            </div>

            {/* Recent Bookings for Messaging */}
            <motion.div
              className="bg-white rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Send Message to Visitors</h2>
                <p className="text-gray-600">Click on any booking to send a personalized message</p>
              </div>
              <div className="p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No bookings available for messaging</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 10).map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{booking.destinationName}</h4>
                                <p className="text-sm text-gray-600">{booking.userName} - {booking.userEmail}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center space-x-4">
                              <span>📅 {formatDate(booking.startDate)}</span>
                              <span>👥 {booking.guests} guests</span>
                              <span>💰 Rs {booking.totalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => openMessageModal(booking)}
                            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                          >
                            <ChatBubbleLeftRightIcon className="w-4 h-4" />
                            <span>Send Message</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
              <p className="text-gray-600">ID: #{selectedBooking.id}</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Name:</strong> {selectedBooking.userName}</div>
                    <div><strong>Email:</strong> {selectedBooking.userEmail}</div>
                    <div><strong>Phone:</strong> {selectedBooking.phone}</div>
                    <div><strong>Country:</strong> {selectedBooking.country}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Booking Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Destination:</strong> {selectedBooking.destinationName}</div>
                    <div><strong>Location:</strong> {selectedBooking.destinationLocation}</div>
                    <div><strong>Dates:</strong> {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}</div>
                    <div><strong>Guests:</strong> {selectedBooking.adults} adults, {selectedBooking.children} children</div>
                    <div><strong>Room Type:</strong> {selectedBooking.roomType.replace('-', ' ')}</div>
                    <div><strong>Total:</strong> Rs {selectedBooking.totalPrice.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Special Requests</h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    {selectedBooking.specialRequests}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Admin Note</h4>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add a note for the customer..."
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      openMessageModal(selectedBooking);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                  
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedBooking.id, 'rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedBooking.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Approve
                      </button>
                    </>
                  )}
                  
                  {selectedBooking.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, selectedBooking.status)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Update Note
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Send Message</h3>
              <p className="text-gray-600">Send a message to a visitor</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient
                </label>
                <input
                  type="text"
                  value={messageRecipient}
                  onChange={(e) => setMessageRecipient(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter recipient user ID or email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                  placeholder="Type your message here..."
                />
              </div>
            </div>

            <div className="flex justify-between items-center p-6 border-t border-gray-200">
              <button
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!messageContent.trim() || !messageRecipient}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Message Inbox Modal */}
      <MessageInbox 
        isOpen={showMessageInbox}
        onClose={() => setShowMessageInbox(false)}
      />
    </div>
  );
};

export default RealtimeDashboard;