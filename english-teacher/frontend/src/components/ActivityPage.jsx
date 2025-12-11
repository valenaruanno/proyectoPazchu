import React from 'react';
import ActivityCard from './ActivityCard';
  
const ActivityPage = ({ selectedLevel, activitiesForLevel }) => {    
    return (
        <>
            {/* Selected Level Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Actividades - {selectedLevel.name}
                </h2>
                {selectedLevel.description && (
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {selectedLevel.description}
                    </p>
                )}
            </div>

            {/* Activities Grid */}
            {activitiesForLevel.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activitiesForLevel.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <svg className="w-24 h-24 mx-auto mb-4" style={{ color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">No hay actividades disponibles</h3>
                    <p className="text-gray-600">No se encontraron actividades para este nivel.</p>
                </div>
            )}
        </>
    );
};

export default ActivityPage; 