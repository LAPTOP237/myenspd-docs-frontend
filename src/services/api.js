// services/api.js - Version mise à jour

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Création de l'instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ============== REQUEST INTERCEPTOR ==============
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============== RESPONSE INTERCEPTOR ==============
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et pas déjà en train de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Tentative de refresh du token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,  // ⬅️ simplejwt utilise 'refresh' pas 'refresh_token'
        });

        const { access } = response.data;

        // Sauvegarde du nouveau token
        localStorage.setItem('access_token', access);

        // Retry de la requête originale
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Échec du refresh - déconnexion
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Redirection vers login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Gestion des erreurs globales
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.detail 
      || 'Une erreur est survenue';
    
    // Dispatch d'un événement custom pour les toasts
    window.dispatchEvent(new CustomEvent('api-error', { 
      detail: { message: errorMessage, status: error.response?.status } 
    }));

    return Promise.reject(error);
  }
);

// ============== AUTH SERVICE ==============
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    const { access_token, refresh_token, user } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await api.post('/auth/logout/', { refresh_token: refreshToken });
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password/', { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password/', data);
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

// ============== DOCUMENT SERVICE ==============
// Documents générés (DocumentInstance)
export const documentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/documents/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/documents/${id}/`);
    return response.data;
  },

  download: async (id) => {
    const response = await api.get(`/documents/${id}/download/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Types de documents disponibles (templates)
  getTypes: async () => {
    const response = await api.get('/templates/types/');
    return response.data;
  },

  // Liste des templates
  getTemplates: async () => {
    const response = await api.get('/templates/');
    return response.data;
  },
};

// ============== REQUEST SERVICE ==============
// Demandes de documents (DocumentRequest)
export const requestService = {
  getAll: async (params = {}) => {
    const response = await api.get('/requests/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/requests/${id}/`);
    return response.data;
  },

  create: async (data) => {
    // Adapter les données du frontend au backend
    const payload = {
      template_id: data.type || data.template_id,  // Le frontend envoie 'type'
      motif: data.motif || '',
      details: data.details || '',
      urgency: data.urgence ? 'urgent' : 'normal',
    };
    const response = await api.post('/requests/', payload);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.delete(`/requests/${id}/`);
    return response.data;
  },
};

// ============== PROFILE SERVICE ==============
export const profileService = {
  get: async () => {
    const response = await api.get('/profile/');
    return response.data;
  },

  update: async (data) => {
    const response = await api.put('/profile/', data);
    // Mise à jour du localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  changePassword: async (data) => {
    const payload = {
      current_password: data.currentPassword,
      new_password: data.newPassword,
    };
    const response = await api.post('/profile/change-password/', payload);
    return response.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/profile/avatar/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// ============== TEMPLATE SERVICE ==============
export const templateService = {
  getAll: async ({ page = 1, page_size = 10, is_active } = {}) => {
    const params = { page, page_size };

    if (is_active !== undefined) {
      params.is_active = is_active; // true / false
    }

    const response = await api.get('/admin/templates/', { params });
    return response.data; // DRF renvoie {count, next, previous, results}
  },

  getById: async (id) => {
    const response = await api.get(`/admin/templates/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const payload = {
      title: data.title,
      description: data.description || '',
      content: data.content,
      fields: data.fields || [],
      is_active: data.is_active ?? true,
      processing_time_days: data.processing_time_days || 3,
    };
    const response = await api.post('/admin/templates/', payload);
    return response.data;
  },

  update: async (id, data) => {
    const payload = {
      title: data.title,
      description: data.description || '',
      content: data.content,
      fields: data.fields || [],
      is_active: data.is_active ?? true,
      processing_time_days: data.processing_time_days || 3,
    };
    const response = await api.put(`/admin/templates/${id}/`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/templates/${id}/`);
    return response.data;
  },
};


// ============== USER SERVICE ==============
export const userService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/users/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/users/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      matricule: data.matricule || null,
      role: data.role, // 'STUDENT' ou 'STAFF'
      password: data.password || 'defaultPassword123', // tu peux générer un mot de passe temporaire
    };
    const response = await api.post('/admin/users/', payload);
    return response.data;
  },

  update: async (id, data) => {
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      matricule: data.matricule || null,
      role: data.role,
    };
    const response = await api.put(`/admin/users/${id}/`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/users/${id}/`);
    return response.data;
  },
};

// ============== NOTIFICATION SERVICE ==============
export const notificationService = {
  getAll: async () => {
    const response = await api.get('/notifications/');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read/`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all/');
    return response.data;
  },
};

export default api;