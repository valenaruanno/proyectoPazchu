import React from 'react';

const ActivityCard = ({ activity }) => {
  return (
    <div className="activity-card">
      <div className="activity-card-content">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-900">{activity.title}</h4>
          {activity.type && (
            <span className="activity-badge self-start">
              {activity.type}
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-4" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>{activity.description}</p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {activity.resourceUrl && (
            <a
              href={activity.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto justify-center"
            >
              <svg className="w-4 h-4" style={{ marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver recurso
            </a>
          )}

          {activity.createdAt && (
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center'
            }}>
              <svg className="w-4 h-4" style={{ marginRight: '0.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(activity.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
