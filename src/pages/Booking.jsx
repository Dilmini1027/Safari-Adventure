import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { useDestinations } from '../contexts/DestinationContext';
import { useNotifications } from '../contexts/NotificationContext';
import Breadcrumb from '../components/Breadcrumb';
import { 
  CalendarDaysIcon,
  UserGroupIcon,
  MapPinIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import NavBar from '../components/MobileNavBar';

const Booking = () => {
  const { destinations, loading: destinationsLoading } = useDestinations();
  const { user } = useAuth();
  const { createBooking } = useBooking();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const destinationId = queryParams.get('destination');

  // Scroll to top on component mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedDestination, setSelectedDestination] = useState(null);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    adults: 2,
    children: 0,
    vehicles: 1,
    roomType: 'standard',
    specialRequests: '',
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    // Payment will be handled after admin approval
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const roomTypes = [
    { value: 'standard', label: 'Standard Room', price: 0 },
    { value: 'deluxe', label: 'Deluxe Room', price: 15000 },
    { value: 'suite', label: 'Suite', price: 25000 },
    { value: 'villa', label: 'Private Villa', price: 40000 }
  ];

  useEffect(() => {
    if (destinationId) {
      const destination = destinations.find(d => d.id === parseInt(destinationId));
      if (destination) {
        setSelectedDestination(destination);
      } else {
        console.error('Destination not found:', destinationId);
      }
    }
  }, [destinations, destinationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateTripDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 1;
    
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Include both start and end days
    
    return daysDiff > 0 ? daysDiff : 1;
  };

  const getRecommendedDays = () => {
    if (!selectedDestination) return 1;
    return parseInt(selectedDestination.duration.split(' ')[0]) || 1;
  };

  const calculateTotalPrice = () => {
    if (!selectedDestination) return 0;
    
    const basePrice = selectedDestination.price;
    const vehicles = parseInt(bookingData.vehicles) || 1;
    const adults = parseInt(bookingData.adults) || 0;
    const roomUpgrade = roomTypes.find(r => r.value === bookingData.roomType)?.price || 0;
    
    // Calculate trip duration
    const tripDays = calculateTripDays();
    const recommendedDays = getRecommendedDays();
    const extraDays = tripDays > recommendedDays ? tripDays - recommendedDays : 0;
    
    // Base price multiplied by number of vehicles
    const vehicleCost = basePrice * vehicles;
    
    // Extra day charges (Rs 3,000 per extra day per vehicle)
    const extraDayCharge = extraDays * 3000 * vehicles;
    
    // Only charge Rs 1,000 per extra adult if more than 5 adults
    const extraAdultCharge = adults > 5 ? (adults - 5) * 1000 : 0;
    
    return vehicleCost + extraDayCharge + extraAdultCharge + roomUpgrade;
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!bookingData.startDate) newErrors.startDate = 'Start date is required';
      if (!bookingData.endDate) newErrors.endDate = 'End date is required';
      if (bookingData.startDate && bookingData.endDate) {
        const startDate = new Date(bookingData.startDate);
        const endDate = new Date(bookingData.endDate);
        if (endDate < startDate) {
          newErrors.endDate = 'End date must be after start date';
        }
      }
      if (bookingData.adults < 1) newErrors.adults = 'At least 1 adult is required';
    }

    if (step === 2) {
      if (!bookingData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!bookingData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!bookingData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(bookingData.email)) newErrors.email = 'Email is invalid';
      if (!bookingData.phone) newErrors.phone = 'Phone is required';
      if (!bookingData.country) newErrors.country = 'Country is required';
    }

    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepErrors = validateStep(2);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Create booking data
      const totalPrice = calculateTotalPrice();
      const bookingInfo = {
        userId: user.id,
        userName: `${bookingData.firstName} ${bookingData.lastName}`,
        userEmail: bookingData.email,
        destinationId: selectedDestination.id,
        destinationName: selectedDestination.name,
        destinationLocation: selectedDestination.location,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        adults: parseInt(bookingData.adults),
        children: parseInt(bookingData.children),
        guests: parseInt(bookingData.adults) + parseInt(bookingData.children),
        roomType: bookingData.roomType,
        specialRequests: bookingData.specialRequests,
        phone: bookingData.phone,
        country: bookingData.country,
        totalPrice: totalPrice,
        status: 'pending',
        paymentRequired: true,
        paymentCompleted: false
      };

      const result = await createBooking(bookingInfo, addNotification);
      
      if (result.success) {
        alert(`🎉 Trip Request Submitted Successfully!\n\n✅ Your safari adventure request has been sent to our team\n💰 Total Cost: Rs ${calculateTotalPrice().toLocaleString()}\n\n📋 Next Steps:\n1. Our admin will review your request\n2. You'll receive a notification with approval/rejection\n3. If approved, you can proceed to payment\n4. If rejected, we'll explain the reason\n\n⏰ We typically respond within 24 hours.\nThank you for choosing Safari Adventures!`);
        navigate('/dashboard/book-safari');
      } else {
        setErrors({ submit: result.error || 'Booking failed. Please try again.' });
      }
      
    } catch (error) {
      setErrors({ submit: 'Booking failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedDestination) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No destination selected</h2>
            <Link to="/destinations" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
              Browse Destinations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (destinationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading destinations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <Breadcrumb />
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < 2 && (
                  <div className={`w-32 h-1 mx-4 ${
                    currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-40 mt-3">
            <span className="text-sm font-medium text-gray-600">Trip Details</span>
            <span className="text-sm font-medium text-gray-600">Personal Info & Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleSubmit}>
                {/* Step 1: Trip Details */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h3>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <div className="relative">
                          <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            name="startDate"
                            value={bookingData.startDate}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                              errors.startDate ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.startDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <div className="relative">
                          <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            name="endDate"
                            value={bookingData.endDate}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                              errors.endDate ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.endDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adults
                        </label>
                        <div className="relative">
                          <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            name="adults"
                            value={bookingData.adults}
                            onChange={handleChange}
                            min="1"
                            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                              errors.adults ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Number of adults"
                          />
                        </div>
                        {errors.adults && (
                          <p className="mt-1 text-sm text-red-600">{errors.adults}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Children
                        </label>
                        <input
                          type="number"
                          name="children"
                          value={bookingData.children}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="Number of children"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Safari Vehicles
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="vehicles"
                          value={bookingData.vehicles}
                          onChange={handleChange}
                          min="1"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="Number of vehicles needed"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Recommended: {selectedDestination?.groupSize} per vehicle
                      </p>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Type
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {roomTypes.map(room => (
                          <label key={room.value} className="relative cursor-pointer">
                            <input
                              type="radio"
                              name="roomType"
                              value={room.value}
                              checked={bookingData.roomType === room.value}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <div className={`p-4 border-2 rounded-lg ${
                              bookingData.roomType === room.value
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200'
                            }`}>
                              <div className="font-medium">{room.label}</div>
                              <div className="text-sm text-gray-600">
                                {room.price > 0 ? `+Rs ${room.price.toLocaleString()}` : 'Included'}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Any special requirements or requests..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={bookingData.firstName}
                          onChange={handleChange}
                          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                            errors.firstName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={bookingData.lastName}
                          onChange={handleChange}
                          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                            errors.lastName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="john.doe@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={bookingData.phone}
                          onChange={handleChange}
                          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="+1 (555) 123-4567"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          name="country"
                          value={bookingData.country}
                          onChange={handleChange}
                          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                            errors.country ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Country</option>
                          <option value="SL">Sri Lanka</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                        </select>
                        {errors.country && (
                          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h3>
                    
                    {errors.submit && (
                      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
                          <span className="text-sm text-red-600">{errors.submit}</span>
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="cardNumber"
                          value={bookingData.cardNumber}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                            errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={bookingData.expiryDate}
                          onChange={handleChange}
                          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                            errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="MM/YY"
                        />
                        {errors.expiryDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={bookingData.cvv}
                          onChange={handleChange}
                          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                            errors.cvv ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="123"
                        />
                        {errors.cvv && (
                          <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={bookingData.cardholderName}
                        onChange={handleChange}
                        className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                          errors.cardholderName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.cardholderName && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
                      )}
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h4>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="billingAddress"
                        value={bookingData.billingAddress}
                        onChange={handleChange}
                        className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                          errors.billingAddress ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="123 Main Street"
                      />
                      {errors.billingAddress && (
                        <p className="mt-1 text-sm text-red-600">{errors.billingAddress}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={bookingData.city}
                          onChange={handleChange}
                          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                            errors.city ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="New York"
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={bookingData.postalCode}
                          onChange={handleChange}
                          className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                            errors.postalCode ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="10001"
                        />
                        {errors.postalCode && (
                          <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Show error message if submission fails */}
                {errors.submit && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
                      <span className="text-sm text-red-600">{errors.submit}</span>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>

                  {currentStep < 2 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-8 py-3 rounded-lg font-semibold text-white text-lg ${
                        isLoading
                          ? 'bg-green-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting Request...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircleIcon className="w-5 h-5 mr-2" />
                          Confirm Trip - Rs {calculateTotalPrice().toLocaleString()}
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="mb-6">
                <img
                  src={selectedDestination.image}
                  alt={selectedDestination.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-900">{selectedDestination.name}</h4>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span>{selectedDestination.location}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span>{selectedDestination.duration}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <StarIcon className="w-4 h-4 mr-1" />
                  <span>{selectedDestination.rating} ({selectedDestination.reviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base price per vehicle</span>
                  <span className="font-medium">Rs {selectedDestination.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Safari vehicles ({bookingData.vehicles} × Rs {selectedDestination.price.toLocaleString()})
                  </span>
                  <span className="font-medium">
                    Rs {(selectedDestination.price * parseInt(bookingData.vehicles)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Trip duration ({calculateTripDays()} days, recommended: {getRecommendedDays()} days)
                  </span>
                  <span className="font-medium">
                    {calculateTripDays() > getRecommendedDays() 
                      ? `Rs ${((calculateTripDays() - getRecommendedDays()) * 3000 * parseInt(bookingData.vehicles)).toLocaleString()}`
                      : 'Included'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {parseInt(bookingData.adults) > 5 
                      ? `Extra adults (${parseInt(bookingData.adults) - 5} × Rs 1,000)`
                      : `Total guests (${bookingData.adults} adults, ${bookingData.children} children)`
                    }
                  </span>
                  <span className="font-medium">
                    {parseInt(bookingData.adults) > 5 
                      ? `Rs ${((parseInt(bookingData.adults) - 5) * 1000).toLocaleString()}`
                      : 'Included'
                    }
                  </span>
                </div>
                {bookingData.roomType !== 'standard' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room upgrade</span>
                    <span className="font-medium">
                      +Rs {roomTypes.find(r => r.value === bookingData.roomType)?.price.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">Rs {calculateTotalPrice().toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-4 h-4 mr-2 text-green-600" />
                  <span>Free cancellation up to 24 hours</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                  <span>24/7 customer support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;