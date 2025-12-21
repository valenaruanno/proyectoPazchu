import React from 'react';
import { Navigate } from 'react-router-dom';
import { authUtils } from '../utils/api';

const ProtectedRoute = ({ children }) => {
  const isSessionValid = authUtils.isSessionValid();

  if (!isSessionValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
