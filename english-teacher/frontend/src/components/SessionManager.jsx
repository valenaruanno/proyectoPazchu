import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../utils/api';

const SessionManager = ({ children }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let warningTimer;
    let logoutTimer;
    let checkInterval;

    const checkSession = () => {
      if (!authUtils.isSessionValid()) {
        // Sesión expirada, logout automático
        handleAutoLogout();
        return;
      }

      const remainingMinutes = authUtils.getSessionTimeRemaining();
      setTimeRemaining(remainingMinutes);

      // Mostrar warning cuando quedan 5 minutos o menos
      if (remainingMinutes <= 5 && remainingMinutes > 0 && !showWarning) {
        setShowWarning(true);
        
        // Timer para logout automático cuando expire
        logoutTimer = setTimeout(() => {
          handleAutoLogout();
        }, remainingMinutes * 60 * 1000);
      }
    };

    const handleAutoLogout = () => {
      console.log('Sesión expirada - Logout automático');
      authUtils.logout();
      setShowWarning(false);
      
      // Mostrar notificación de sesión expirada
      if (window.location.pathname !== '/') {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/', { replace: true });
      }
    };

    // Verificar sesión inmediatamente
    checkSession();

    // Verificar cada 30 segundos
    checkInterval = setInterval(checkSession, 30000);

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (logoutTimer) clearTimeout(logoutTimer);
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [navigate, showWarning]);

  const handleExtendSession = () => {
    // Extender sesión por 30 minutos más
    const newExpirationTime = new Date().getTime() + (30 * 60 * 1000);
    localStorage.setItem('sessionExpiration', newExpirationTime.toString());
    setShowWarning(false);
    setTimeRemaining(30);
  };

  const handleLogoutNow = () => {
    authUtils.logout();
    setShowWarning(false);
    navigate('/', { replace: true });
  };

  return (
    <>
      {children}
      
      {/* Modal de advertencia de sesión */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center justify-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Sesión por expirar</h2>
                  <p className="text-sm text-gray-500">Tu sesión expirará pronto</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 text-center">
              <p className="text-gray-700 mb-4">
                Tu sesión expirará en <strong className="text-red-600">{timeRemaining} minutos</strong>.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                ¿Deseas extender tu sesión por 30 minutos más?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleLogoutNow}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar Sesión
                </button>
                <button
                  onClick={handleExtendSession}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Extender Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionManager;