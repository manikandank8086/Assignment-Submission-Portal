import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute: Redirects to login if the user is not authenticated
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('UserToken');

  // If token doesn't exist, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child component (protected content)
  return children;
};

export default ProtectedRoute;
