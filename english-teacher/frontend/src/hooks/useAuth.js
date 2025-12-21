import { useState, useEffect, useCallback } from 'react';
import { authUtils } from '../utils/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar estado de autenticación
  const checkAuthStatus = useCallback(() => {
    const sessionValid = authUtils.isSessionValid();
    setIsAuthenticated(sessionValid);
    
    if (sessionValid) {
      const userData = authUtils.getAuthenticatedUser();
      setUser(userData);
      setSessionTimeRemaining(authUtils.getSessionTimeRemaining());
    } else {
      setUser(null);
      setSessionTimeRemaining(0);
    }
    
    setIsLoading(false);
  }, []);

  // Logout manual
  const logout = useCallback(() => {
    authUtils.logout();
    setIsAuthenticated(false);
    setUser(null);
    setSessionTimeRemaining(0);
  }, []);

  // Extender sesión
  const extendSession = useCallback((additionalMinutes = 30) => {
    if (!isAuthenticated) return false;
    
    const currentTime = new Date().getTime();
    const newExpirationTime = currentTime + (additionalMinutes * 60 * 1000);
    localStorage.setItem('sessionExpiration', newExpirationTime.toString());
    
    setSessionTimeRemaining(additionalMinutes);
    return true;
  }, [isAuthenticated]);

  // Verificar si la sesión está por expirar (menos de 5 minutos)
  const isSessionExpiringSoon = useCallback(() => {
    return sessionTimeRemaining > 0 && sessionTimeRemaining <= 5;
  }, [sessionTimeRemaining]);

  useEffect(() => {
    checkAuthStatus();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkAuthStatus, 30000);
    
    return () => clearInterval(interval);
  }, [checkAuthStatus]);

  return {
    isAuthenticated,
    user,
    sessionTimeRemaining,
    isLoading,
    logout,
    extendSession,
    isSessionExpiringSoon: isSessionExpiringSoon(),
    checkAuthStatus
  };
};