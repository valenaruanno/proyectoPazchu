import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from './modals/LoginModal.jsx';

const Login = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-6">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Panel de Administración
          </h1>
          <p className="text-gray-600 mb-8">
            Acceso exclusivo para administradores del sistema
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Acceder al Panel
          </button>

          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>

      <LoginModal
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Login;
