import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('sv_admin_token');
  
  if (!token) {
    // Redirect to login if no token is present
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
