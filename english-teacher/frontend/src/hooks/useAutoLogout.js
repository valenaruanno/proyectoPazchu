import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../utils/api';

/**
 * Hook para manejar el logout automático
 * @param {Object} options - Configuración del hook
 * @param {number} options.warningTime - Tiempo en minutos antes del logout para mostrar aviso (default: 5)
 * @param {number} options.checkInterval - Intervalo de verificación en milisegundos (default: 30000)
 * @param {Function} options.onWarning - Callback cuando queda poco tiempo
 * @param {Function} options.onLogout - Callback cuando se hace logout automático
 */
export const useAutoLogout = (options = {}) => {
  const {
    warningTime = 5, // 5 minutos antes del logout
    checkInterval = 30000, // Verificar cada 30 segundos
    onWarning = null,
    onLogout = null
  } = options;

  const navigate = useNavigate();
  const warningShown = useRef(false);
  const logoutTimer = useRef(null);
  const sessionCheckTimer = useRef(null);

  const handleAutoLogout = useCallback(() => {
    console.log('🔐 Sesión expirada - Logout automático');
    
    // Limpiar timers
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (sessionCheckTimer.current) clearInterval(sessionCheckTimer.current);
    
    // Ejecutar logout
    authUtils.logout();
    
    // Callback personalizado
    if (onLogout) onLogout();
    
    // Redirigir al login
    navigate('/', { 
      replace: true,
      state: { message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' }
    });
  }, [navigate, onLogout]);

  const showWarning = useCallback(() => {
    if (!warningShown.current) {
      warningShown.current = true;
      console.warn(`⚠️ Tu sesión expirará en ${warningTime} minutos`);
      
      if (onWarning) {
        onWarning(warningTime);
      } else {
        // Notificación por defecto
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Sesión por expirar', {
            body: `Tu sesión expirará en ${warningTime} minutos`,
            icon: '/favicon.ico'
          });
        }
      }
    }
  }, [warningTime, onWarning]);

  const checkSession = useCallback(() => {
    const timeRemaining = authUtils.getSessionTimeRemaining();
    
    if (timeRemaining <= 0) {
      handleAutoLogout();
      return;
    }
    
    // Mostrar aviso si queda poco tiempo
    if (timeRemaining <= warningTime && !warningShown.current) {
      showWarning();
      
      // Programar logout automático para el tiempo exacto
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      logoutTimer.current = setTimeout(handleAutoLogout, timeRemaining * 60 * 1000);
    }
  }, [warningTime, showWarning, handleAutoLogout]);

  const resetWarning = useCallback(() => {
    warningShown.current = false;
  }, []);

  const extendSession = useCallback((additionalMinutes = 30) => {
    const currentTime = new Date().getTime();
    const newExpirationTime = currentTime + (additionalMinutes * 60 * 1000);
    
    localStorage.setItem('sessionExpiration', newExpirationTime.toString());
    resetWarning();
    
    console.log(`🔄 Sesión extendida por ${additionalMinutes} minutos`);
  }, [resetWarning]);

  useEffect(() => {
    // Solo ejecutar si hay una sesión válida
    if (!authUtils.isSessionValid()) {
      return;
    }

    // Solicitar permisos para notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Verificación inicial
    checkSession();

    // Configurar verificación periódica
    sessionCheckTimer.current = setInterval(checkSession, checkInterval);

    // Evento para extender sesión con actividad del usuario
    const resetSessionOnActivity = () => {
      // Solo resetear warning, no extender automáticamente la sesión
      resetWarning();
    };

    // Escuchar eventos de actividad del usuario
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetSessionOnActivity, true);
    });

    return () => {
      // Limpiar timers
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      if (sessionCheckTimer.current) clearInterval(sessionCheckTimer.current);
      
      // Remover event listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetSessionOnActivity, true);
      });
    };
  }, [checkSession, checkInterval, resetWarning]);

  return {
    extendSession,
    timeRemaining: authUtils.getSessionTimeRemaining(),
    isSessionValid: authUtils.isSessionValid()
  };
};

export default useAutoLogout;