import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (!authToken || user?.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }
  
  return children;
};


export default AdminRoute;
