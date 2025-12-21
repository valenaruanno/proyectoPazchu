import React, { useState } from 'react';

const SessionWarningModal = ({ 
  isOpen, 
  timeRemaining, 
  onExtend, 
  onLogout, 
  onClose 
}) => {
  const [extending, setExtending] = useState(false);

  const handleExtend = async () => {
    setExtending(true);
    try {
      onExtend(30); // Extender 30 minutos
      onClose();
    } catch (error) {
      console.error('Error extendiendo sesión:', error);
    } finally {
      setExtending(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.124 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sesión por expirar</h3>
            <p className="text-sm text-gray-600">Tu sesión está a punto de caducar</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-2">
              Tu sesión expirará en aproximadamente
            </p>
            <div className="text-3xl font-bold text-yellow-600">
              {timeRemaining} minuto{timeRemaining !== 1 ? 's' : ''}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              ¿Deseas continuar trabajando?
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExtend}
              disabled={extending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {extending ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Extendiendo...
                </>
              ) : (
                'Extender sesión'
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionWarningModal;