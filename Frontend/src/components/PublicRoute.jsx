import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../utils/authService';

const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUserFromStorage();

  if (isAuthenticated) {
    // Redirect based on user role
    if (user?.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/customer-dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
