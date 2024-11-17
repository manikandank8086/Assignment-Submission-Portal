import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute: Redirects to a dashboard if the user is already authenticated
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('UserToken');

  // If token exists, redirect to dashboard (already logged in)
  if (token) {
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, allow access to the component (login/signup page)
  return children;
};

export default PrivateRoute;
