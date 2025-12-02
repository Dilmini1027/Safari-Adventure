import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { DestinationProvider } from './contexts/DestinationContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MessageProvider } from './contexts/MessageContext';
import { ToastProvider } from './components/ToastNotification';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import './App.css';
import HomePage from './pages/HomePage';
import Destinations from './pages/Destinations';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import BookSafari from './pages/dashboard/visitor/BookSafari';
import RealtimeDashboard from './pages/dashboard/admin/RealtimeDashboard';
import DestinationManagement from './pages/dashboard/admin/DestinationManagement';
import VisitorManagement from './pages/dashboard/admin/VisitorManagement';




function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <MessageProvider>
            <BookingProvider>
              <DestinationProvider>

                <Router>
                  <ScrollToTop />
                  <div className="App">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/book-safari" element={
              <ProtectedRoute requiredRole="visitor">
                <BookSafari />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <RealtimeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/destinations" element={
              <ProtectedRoute requiredRole="admin">
                <DestinationManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/visitors" element={
              <ProtectedRoute requiredRole="admin">
                <VisitorManagement />
              </ProtectedRoute>
            } />

          </Routes>
                  </div>
                </Router>
              </DestinationProvider>
            </BookingProvider>
          </MessageProvider>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
