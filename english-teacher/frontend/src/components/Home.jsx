import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../utils/api';
import Navbar from './Navbar';
import Footer from './Footer';
import ActivityPage from './ActivityPage';

const Home = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [activitiesByLevel, setActivitiesByLevel] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Home component mounted, starting data load...');
    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log('Fetching teacher data and levels...');
        // Cargar datos del profesor y niveles en paralelo
        const [teacher, allLevels] = await Promise.all([
          teacherAPI.getTeacherById(1), // Asumiendo que el ID del profesor es 1
          teacherAPI.getAllLevels()
        ]);

        console.log('Teacher data received:', teacher);
        console.log('Levels data received:', allLevels);

        setTeacherData(teacher);
        setLevels(allLevels);
      } catch (err) {
        console.error('Error cargando datos iniciales:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleLevelSelect = async (level) => {
    setSelectedLevel(level);

    // Si ya tenemos las actividades cargadas para este nivel, no las volvemos a cargar
    if (!activitiesByLevel[level.id]) {
      try {
        const activities = await teacherAPI.getActivitiesByLevel(level.id);
        setActivitiesByLevel(prev => ({
          ...prev,
          [level.id]: activities
        }));
      } catch (err) {
        console.error('Error cargando actividades del nivel:', err);
        setError('Error al cargar actividades del nivel');
      }
    }
  };

  const getActivitiesForSelectedLevel = () => {
    if (!selectedLevel) return [];
    return activitiesByLevel[selectedLevel.id] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #eff6ff, #faf5ff)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 mx-auto" style={{ borderBottom: '2px solid #2563eb' }}></div>
          <p className="mb-4 text-gray-600 text-xl" style={{ marginTop: '1rem' }}>Cargando información del profesor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #fef2f2, #fdf2f8)' }}>
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4" style={{ padding: '2rem' }}>
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #faf5ff)' }}>
      {/* Navbar */}
      <Navbar
        levels={levels}
        selectedLevel={selectedLevel}
        onLevelSelect={handleLevelSelect}
      />

      <div>
        {!selectedLevel && (
          <section className="text-white py-20" style={{ background: 'linear-gradient(to right, #2563eb, #7c3aed)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Bienvenido, {teacherData?.name && teacherData?.lastName ?
                    `${teacherData.name} ${teacherData.lastName}` : 'Profesor'}
                </h1>
                {teacherData?.description && (
                  <p className="text-xl md:text-2xl max-w-4xl mx-auto" style={{
                    color: '#bfdbfe',
                    lineHeight: '1.625'
                  }}>
                    {teacherData.description}
                  </p>
                )}
                <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-lg sm:text-xl" style={{
                  marginTop: '2rem',
                  flexWrap: 'wrap'
                }}>
                  {teacherData?.email && (
                    <div className="flex items-center rounded-full px-3 sm:px-4 py-2 text-sm sm:text-base" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <svg className="w-5 h-5" style={{ marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {teacherData.email}
                    </div>
                  )}
                  {teacherData?.phone && (
                    <div className="flex items-center rounded-full px-4 py-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <svg className="w-5 h-5" style={{ marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {teacherData.phone}
                    </div>
                  )}
                  {teacherData?.yearsOfExperience && (
                    <div className="flex items-center rounded-full px-4 py-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <svg className="w-5 h-5" style={{ marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      {teacherData.yearsOfExperience} años de experiencia
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {levels.length > 0 ? (
            selectedLevel ? (
              <ActivityPage
                selectedLevel={selectedLevel}
                activitiesForLevel={getActivitiesForSelectedLevel()}
              />
            ) : (
              // Welcome message when no level is selected
              <div className="text-center py-16">
                <div className="max-w-3xl mx-auto">
                  <svg className="w-32 h-32 mx-auto mb-8" style={{ color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    ¡Explora las Actividades!
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Selecciona un nivel de inglés desde el menú superior para ver todas las actividades disponibles
                    y recursos de aprendizaje.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-white rounded-lg shadow-lg" style={{ padding: '1.5rem' }}>
                      <div className="rounded-full w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#dbeafe' }}>
                        <svg className="w-6 h-6" style={{ color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversación</h3>
                      <p className="text-gray-600">Practica conversación en inglés con ejercicios interactivos.</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg" style={{ padding: '1.5rem' }}>
                      <div className="rounded-full w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#dcfce7' }}>
                        <svg className="w-6 h-6" style={{ color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Gramática</h3>
                      <p className="text-gray-600">Domina la gramática inglesa con lecciones estructuradas.</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg" style={{ padding: '1.5rem' }}>
                      <div className="rounded-full w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#f3e8ff' }}>
                        <svg className="w-6 h-6" style={{ color: '#9333ea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Preparación de Exámenes</h3>
                      <p className="text-gray-600">Prepárate para exámenes internacionales como IELTS y TOEFL.</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <svg className="w-24 h-24 mx-auto mb-4" style={{ color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No hay niveles disponibles</h3>
              <p className="text-gray-600">No se encontraron niveles de actividades en el sistema.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer teacherData={teacherData} />
    </div>
  );
};

export default Home;
