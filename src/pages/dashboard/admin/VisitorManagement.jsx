import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../../../contexts/BookingContext';
import NavBar from '../../../components/MobileNavBar';
import Breadcrumb from '../../../components/Breadcrumb';
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarDaysIcon,
  MapPinIcon,
  HomeIcon,
  UsersIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const VisitorManagement = () => {
  const { bookings, updateBookingStatus, getBookingStats } = useBooking();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0
  });

  // Update stats when bookings change
  React.useEffect(() => {
    const updateStats = async () => {
      const bookingStats = await getBookingStats();
      setStats(bookingStats);
    };
    updateStats();
  }, [bookings, getBookingStats]);

  // Filter bookings based on selected filter and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = !searchTerm || 
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destinationName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
    setAdminNote(booking.adminNote || '');
  };

  const handleStatusUpdate = (bookingId, status) => {
    updateBookingStatus(bookingId, status, adminNote);
    setShowModal(false);
    setSelectedBooking(null);
    setAdminNote('');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const icons = {
      pending: <ClockIcon className="w-4 h-4" />,
      approved: <CheckCircleIcon className="w-4 h-4" />,
      rejected: <XCircleIcon className="w-4 h-4" />
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status]}`}>
        {icons[status]}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb */}
          <Breadcrumb />
          
          {/* Header */}
          <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Visitor Management</h1>
          <p className="mt-2 text-gray-600">Manage visitor bookings, payments, and approval status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.approvedBookings || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.rejectedBookings || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name, email, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <UsersIcon className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No bookings found</p>
                        <p className="text-sm">No bookings match your current filter criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                            <div className="text-sm text-gray-500">{booking.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.destinationName}</div>
                        <div className="text-sm text-gray-500">{booking.guests} guests</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{formatDate(booking.startDate)}</div>
                        <div className="text-xs text-gray-500">to {formatDate(booking.endDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Rs {(booking.totalPrice || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.status === 'paid' ? 'Paid in full' : 
                           booking.status === 'approved' ? 'Payment pending' : 'Awaiting approval'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedBooking.userName}</p>
                    <p className="flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      {selectedBooking.userEmail}
                    </p>
                    <p className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      {selectedBooking.phone || 'Not provided'}
                    </p>
                    <p><span className="font-medium">Country:</span> {selectedBooking.country || 'Not specified'}</p>
                    <p><span className="font-medium">Special Requests:</span> {selectedBooking.specialRequests || 'None'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5" />
                    Booking Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Destination:</span> {selectedBooking.destinationName}</p>
                    <p><span className="font-medium">Location:</span> {selectedBooking.destinationLocation}</p>
                    <p className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-4 w-4" />
                      {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}
                    </p>
                    <p className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4" />
                      {selectedBooking.adults} adults, {selectedBooking.children} children
                    </p>
                    <p className="flex items-center gap-2">
                      <HomeIcon className="h-4 w-4" />
                      {selectedBooking.roomType?.replace('-', ' ') || 'Standard'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <CurrencyDollarIcon className="h-5 w-5" />
                  Payment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">Rs {(selectedBooking.totalPrice || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Payment Status</p>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedBooking.status === 'paid' ? 'bg-green-100 text-green-800' :
                        selectedBooking.status === 'approved' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedBooking.status === 'paid' ? 'Paid in Full' :
                         selectedBooking.status === 'approved' ? 'Payment Pending' :
                         'Awaiting Approval'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Current Status</p>
                    <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Created: {formatDate(selectedBooking.createdAt)}</p>
                    {selectedBooking.updatedAt && selectedBooking.updatedAt !== selectedBooking.createdAt && (
                      <p>Updated: {formatDate(selectedBooking.updatedAt)}</p>
                    )}
                  </div>
                </div>

                {/* Admin Note */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Note</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Add a note about this booking..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'approved')}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'rejected')}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircleIcon className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
};

export default VisitorManagement;
