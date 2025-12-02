import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useBooking } from '../../../contexts/BookingContext';
import { useMessages } from '../../../contexts/MessageContext';
import { useDestinations } from '../../../contexts/DestinationContext';
import Breadcrumb from '../../../components/Breadcrumb';
import MessageInbox from '../../../components/MessageInbox';
import PaymentPage from '../../../components/PaymentPage';
import StarRating from '../../../components/StarRating';
import {
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  StarIcon,
 
} from '@heroicons/react/24/outline';
import NavBar from '../../../components/MobileNavBar';

const BookSafari = () => {
  const { user } = useAuth();
  const { getUserBookings, createBooking, updateBookingStatus } = useBooking();
  const { getUnreadMessagesCount } = useMessages();
  const { submitRating, getUserRating,  getDestinationById } = useDestinations();
  const [activeTab, setActiveTab] = useState('book');
  const [showMessageInbox, setShowMessageInbox] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [ratingReviews, setRatingReviews] = useState({});
  const [submittingRating, setSubmittingRating] = useState({});
  
  const unreadMessagesCount = getUnreadMessagesCount(user?.id);
  
  const userBookings = getUserBookings(user?.id);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePaymentClick = (booking) => {
    setSelectedBookingForPayment(booking);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setSelectedBookingForPayment(null);
    // Refresh booking data
    window.location.reload();
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedBookingForPayment(null);
  };

  const handleRatingSubmit = async (destinationId, rating, review = '') => {
    setSubmittingRating(prev => ({ ...prev, [destinationId]: true }));
    
    try {
      const result = await submitRating(destinationId, user?.id, rating, review);
      if (result.success) {
        // Clear the review text after successful submission
        setRatingReviews(prev => ({ ...prev, [destinationId]: '' }));
        // You could show a success message here
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setSubmittingRating(prev => ({ ...prev, [destinationId]: false }));
    }
  };

  const getRateableDestinations = () => {
    // Get destinations from PAID bookings ONLY
    const paidBookings = userBookings.filter(booking => booking.status === 'paid');
    const rateableDestinations = [];
    
    // Create a Set to avoid duplicates if user has multiple bookings for same destination
    const processedDestinations = new Set();
    
    paidBookings.forEach(booking => {
      if (!processedDestinations.has(booking.destinationId)) {
        const destination = getDestinationById(booking.destinationId);
        if (destination) {
          const existingRating = getUserRating(booking.destinationId, user?.id);
          rateableDestinations.push({
            ...destination,
            booking,
            userRating: existingRating
          });
          processedDestinations.add(booking.destinationId);
        }
      }
    });
    
    return rateableDestinations;
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <Breadcrumb />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Book your next adventure or manage your existing bookings
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('book')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'book'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Book New Safari
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Bookings ({userBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('ratings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ratings'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4" />
                  <span>My Ratings</span>
                </div>
              </button>
              <button
                onClick={() => setShowMessageInbox(true)}
                className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm flex items-center space-x-1"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span>Messages</span>
                {unreadMessagesCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Book New Safari Tab */}
        {activeTab === 'book' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready for Your Next Adventure?</h2>
                <p className="text-gray-600 mb-6">
                  Browse our carefully curated collection of safari destinations and book your perfect adventure.
                </p>
                
                <div className="space-y-4">
                  <Link 
                    to="/destinations"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 block text-center"
                  >
                    Browse All Destinations
                  </Link>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">15+</div>
                      <div className="text-sm text-gray-600">Destinations</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">4.9★</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Tips</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CalendarDaysIcon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Book in Advance</h4>
                      <p className="text-sm text-gray-600">Best availability and prices when you book 2-3 months ahead</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <UserGroupIcon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Group Bookings</h4>
                      <p className="text-sm text-gray-600">Special rates available for groups of 6 or more</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Flexible Cancellation</h4>
                      <p className="text-sm text-gray-600">Free cancellation up to 24 hours before departure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* My Ratings Tab */}
        {activeTab === 'ratings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {getRateableDestinations().length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                  <StarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Paid Bookings to Rate</h3>
                  <p className="text-gray-600 mb-6">
                    You can only rate destinations from completed and paid safari bookings to ensure authentic reviews.
                  </p>
                  
                  <div className="space-y-3">
                    {userBookings.length === 0 ? (
                      <Link 
                        to="/destinations"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold block"
                      >
                        Browse Destinations
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => setActiveTab('history')}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold block w-full"
                        >
                          View My Bookings ({userBookings.length})
                        </button>
                        <Link 
                          to="/destinations"
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium block"
                        >
                          Book Another Adventure
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate Your Safari Experiences</h2>
                  <p className="text-gray-600">
                    Share your experiences to help future travelers discover amazing destinations.
                  </p>
                </div>

                {getRateableDestinations().map((destination, index) => (
                  <motion.div
                    key={`${destination.id}-${destination.booking.id}`}
                    className="bg-white rounded-xl shadow-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {destination.name}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          <span>{destination.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-4">
                          <CalendarDaysIcon className="w-4 h-4 mr-1" />
                          <span>
                            Visited: {formatDate(destination.booking.startDate)} - {formatDate(destination.booking.endDate)}
                          </span>
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Paid Booking
                          </span>
                        </div>

                        {destination.userRating ? (
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 mb-3">Your Rating</h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Rating
                                </label>
                                <StarRating
                                  rating={ratingReviews[destination.id + '_rating'] || destination.userRating.rating}
                                  onRatingChange={(rating) => setRatingReviews(prev => ({
                                    ...prev,
                                    [destination.id + '_rating']: rating
                                  }))}
                                  readOnly={submittingRating[destination.id]}
                                  size="lg"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Review (Optional)
                                </label>
                                <textarea
                                  value={ratingReviews[destination.id] !== undefined ? ratingReviews[destination.id] : (destination.userRating.review || '')}
                                  onChange={(e) => setRatingReviews(prev => ({
                                    ...prev,
                                    [destination.id]: e.target.value
                                  }))}
                                  placeholder="Share your experience with other travelers..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  rows={3}
                                  disabled={submittingRating[destination.id]}
                                />
                              </div>
                              
                              <button
                                onClick={() => {
                                  const newRating = ratingReviews[destination.id + '_rating'] || destination.userRating.rating;
                                  const newReview = ratingReviews[destination.id] !== undefined ? ratingReviews[destination.id] : (destination.userRating.review || '');
                                  handleRatingSubmit(destination.id, newRating, newReview);
                                }}
                                disabled={submittingRating[destination.id]}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                              >
                                {submittingRating[destination.id] ? 'Submitting...' : 'Submit'}
                              </button>
                              
                              <div className="text-xs text-gray-500">
                                Last updated: {formatDate(destination.userRating.createdAt)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Rate This Destination</h4>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Your Rating
                                </label>
                                <StarRating
                                  rating={ratingReviews[destination.id + '_rating'] || 0}
                                  onRatingChange={(rating) => setRatingReviews(prev => ({
                                    ...prev,
                                    [destination.id + '_rating']: rating
                                  }))}
                                  readOnly={submittingRating[destination.id]}
                                  size="lg"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Review (Optional)
                                </label>
                                <textarea
                                  value={ratingReviews[destination.id] || ''}
                                  onChange={(e) => setRatingReviews(prev => ({
                                    ...prev,
                                    [destination.id]: e.target.value
                                  }))}
                                  placeholder="Share your experience with other travelers..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  rows={3}
                                  disabled={submittingRating[destination.id]}
                                />
                              </div>
                              
                              <button
                                onClick={() => {
                                  const rating = ratingReviews[destination.id + '_rating'] || 0;
                                  const review = ratingReviews[destination.id] || '';
                                  if (rating > 0) {
                                    handleRatingSubmit(destination.id, rating, review);
                                  }
                                }}
                                disabled={submittingRating[destination.id] || !ratingReviews[destination.id + '_rating']}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                              >
                                {submittingRating[destination.id] ? 'Submitting...' : 'Submit'}
                              </button>
                            </div>
                            

                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Booking History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {userBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                  <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
                  <p className="text-gray-600 mb-6">You haven't made any safari bookings yet. Start planning your adventure!</p>
                  <Link 
                    to="/destinations"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Browse Destinations
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {userBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    className="bg-white rounded-xl shadow-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {booking.destinationName}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          <span>{booking.destinationLocation}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <CalendarDaysIcon className="w-4 h-4 mr-1" />
                            <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-1" />
                            <span>{booking.guests} guests</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 mt-2">
                          Rs {booking.totalPrice.toLocaleString()}
                        </div>
                        {booking.status === 'approved' && (
                          <div className="mt-3">
                            <div className="text-xs text-green-600 font-medium mb-2">
                              ✅ Approved - Payment Required
                            </div>
                            <button
                              onClick={() => handlePaymentClick(booking)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                              <CreditCardIcon className="w-4 h-4" />
                              <span>Pay Now</span>
                            </button>
                          </div>
                        )}
                        {booking.status === 'paid' && (
                          <div className="mt-3">
                            <div className="text-green-600 text-sm font-medium mb-2">
                              ✓ Payment Completed
                            </div>
                            <button
                              onClick={() => setActiveTab('ratings')}
                              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                            >
                              <StarIcon className="w-4 h-4" />
                              <span>Rate Experience</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">Room Type:</span>
                          <div className="text-gray-600 capitalize">{booking.roomType.replace('-', ' ')}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Booked On:</span>
                          <div className="text-gray-600">{formatDate(booking.createdAt)}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Booking ID:</span>
                          <div className="text-gray-600 font-mono">#{booking.id}</div>
                        </div>
                      </div>

                      {booking.adminNote && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">Admin Note:</span>
                          <div className="text-gray-600 mt-1">{booking.adminNote}</div>
                        </div>
                      )}

                      {booking.specialRequests && (
                        <div className="mt-4">
                          <span className="font-medium text-gray-900">Special Requests:</span>
                          <div className="text-gray-600 mt-1">{booking.specialRequests}</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Message Inbox Modal */}
      <MessageInbox 
        isOpen={showMessageInbox}
        onClose={() => setShowMessageInbox(false)}
      />
      
      {/* Payment Modal */}
      {showPaymentModal && selectedBookingForPayment && (
        <PaymentPage
          booking={selectedBookingForPayment}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
};

export default BookSafari;