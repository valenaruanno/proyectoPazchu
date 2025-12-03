// Configuración base de la API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Función helper para hacer peticiones API
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Making API call to:', url);

  const config = {
    ...apiConfig,
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Verificar si la respuesta tiene contenido antes de parsear JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      console.log('Response text:', text);
      return text ? JSON.parse(text) : null;
    } else {
      // Si no es JSON, devolver null o el texto
      return response.status === 204 ? null : await response.text();
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Funciones específicas para cada endpoint
export const authAPI = {
  // Login de administrador
  login: async (email, password) => {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // Verificar si el email existe
  checkEmail: async (email) => {
    return await apiCall('/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

export const teacherAPI = {
  getTeacherById: (id = 1) => apiCall(`/teachers/${id}`),

  // Niveles
  getAllLevels: () => apiCall('/levels'),
  getLevelByName: (name) => apiCall(`/levels/by-name/${name}`),
  createLevel: (levelData) => apiCall('/levels', {
    method: 'POST',
    body: JSON.stringify(levelData)
  }),
  updateLevel: (id, levelData) => apiCall(`/levels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(levelData)
  }),
  deleteLevel: (id) => apiCall(`/levels/${id}`, {
    method: 'DELETE'
  }),

  // Actividades
  getAllActivities: () => apiCall('/activities'),
  getActivitiesByLevel: (levelId) => apiCall(`/activities/level/${levelId}`),
  createActivity: (activityData) => apiCall('/activities', {
    method: 'POST',
    body: JSON.stringify(activityData)
  }),
  updateActivity: (id, activityData) => apiCall(`/activities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(activityData)
  }),
  deleteActivity: (id) => apiCall(`/activities/${id}`, {
    method: 'DELETE'
  })
};
