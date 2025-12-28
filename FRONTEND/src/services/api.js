/**
 * API Service Layer
 * Centralized service for all backend API calls with axios
 */

import axios from 'axios';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');

        // Handle JSON-stringified token from useLocalStorage hook
        // The hook wraps primitives in JSON.stringify, so we need to parse
        if (token) {
            try {
                // If token is JSON-stringified (starts and ends with quotes), parse it
                if (token.startsWith('"') && token.endsWith('"')) {
                    token = JSON.parse(token);
                }
            } catch (e) {
                // If parsing fails, use token as-is
                console.warn('Failed to parse token from localStorage:', e);
            }
            config.headers.Authorization = `Bearer ${token}`;
        }

        // For FormData, don't set Content-Type - let browser handle it with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear auth and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============================================================
// AUTHENTICATION API
// ============================================================

export const authAPI = {
    /**
     * Register a new user
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Login user
     */
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    /**
     * Get current user profile
     */
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    /**
     * Update user profile
     */
    updateProfile: async (updates) => {
        const response = await api.put('/auth/profile', updates);
        return response.data;
    },
};

// ============================================================
// DOCUMENTS API
// ============================================================

export const documentsAPI = {
    /**
     * Upload a document (PDF or TXT)
     */
    upload: async (file, title) => {
        const formData = new FormData();
        formData.append('file', file);
        if (title) formData.append('title', title);

        // Don't set Content-Type - let axios set it automatically with the boundary
        const response = await api.post('/documents/upload', formData);
        return response.data;
    },

    /**
     * Get all user documents
     */
    getAll: async () => {
        const response = await api.get('/documents');
        return response.data;
    },

    /**
     * Get document by ID
     */
    getById: async (id) => {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    },

    /**
     * Delete document
     */
    delete: async (id) => {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    },

    /**
     * Explain selected text from document
     */
    explainText: async (documentId, text) => {
        const response = await api.post(`/documents/${documentId}/explain`, { text });
        return response.data;
    },
};

// ============================================================
// FLASHCARDS API
// ============================================================

export const flashcardsAPI = {
    /**
     * Generate flashcards from a document
     */
    generate: async (documentId, count = 10) => {
        const response = await api.post('/flashcards/generate', {
            documentId,
            count,
        });
        return response.data;
    },

    /**
     * Get all flashcards
     */
    getAll: async (params = {}) => {
        const response = await api.get('/flashcards', { params });
        return response.data;
    },

    /**
     * Get favorited flashcards
     */
    getFavorites: async () => {
        const response = await api.get('/flashcards/favorites');
        return response.data;
    },

    /**
     * Toggle favorite status
     */
    toggleFavorite: async (id) => {
        const response = await api.put(`/flashcards/${id}/favorite`);
        return response.data;
    },

    /**
     * Record study session
     */
    recordStudy: async (id) => {
        const response = await api.put(`/flashcards/${id}/study`);
        return response.data;
    },
};

// ============================================================
// QUIZZES API
// ============================================================

export const quizzesAPI = {
    /**
     * Generate a quiz from a document
     */
    generate: async (documentId, questionCount = 10) => {
        const response = await api.post('/quizzes/generate', {
            documentId,
            questionCount,
        });
        return response.data;
    },

    /**
     * Get all quizzes
     */
    getAll: async () => {
        const response = await api.get('/quizzes');
        return response.data;
    },

    /**
     * Get quiz by ID
     */
    getById: async (id) => {
        const response = await api.get(`/quizzes/${id}`);
        return response.data;
    },

    /**
     * Submit quiz answers
     */
    submit: async (quizId, answers, timeTaken) => {
        const response = await api.post(`/quizzes/${quizId}/submit`, {
            answers,
            timeTaken,
        });
        return response.data;
    },

    /**
     * Get quiz results history
     */
    getHistory: async () => {
        const response = await api.get('/quizzes/results/history');
        return response.data;
    },

    /**
     * Delete a quiz
     */
    delete: async (quizId) => {
        const response = await api.delete(`/quizzes/${quizId}`);
        return response.data;
    },
};

// ============================================================
// ACHIEVEMENTS API
// ============================================================

export const achievementsAPI = {
    /**
     * Get all achievements
     */
    getAll: async () => {
        const response = await api.get('/achievements');
        return response.data;
    },

    /**
     * Get unlocked achievements
     */
    getUnlocked: async () => {
        const response = await api.get('/achievements/unlocked');
        return response.data;
    },

    /**
     * Check and unlock achievements
     */
    checkAchievements: async () => {
        const response = await api.post('/achievements/check');
        return response.data;
    },
};

// ============================================================
// ANALYTICS API
// ============================================================

export const analyticsAPI = {
    getStats: async () => {
        const response = await api.get('/analytics/stats');
        return response.data;
    },
    getProgress: async () => {
        const response = await api.get('/analytics/progress');
        return response.data;
    },
    getPerformance: async () => {
        const response = await api.get('/analytics/performance');
        return response.data;
    },
    getActivity: async (limit = 20) => {
        const response = await api.get(`/analytics/activity?limit=${limit}`);
        return response.data;
    },
    getAchievements: async () => {
        const response = await api.get('/analytics/achievements');
        return response.data;
    },
};

// Profile API
export const profileAPI = {
    // Update profile info (name, email)
    updateProfile: async (data) => {
        const response = await api.put('/profile/update', data);
        return response.data;
    },

    // Change password
    changePassword: async (data) => {
        const response = await api.put('/profile/password', data);
        return response.data;
    },

    // Update notification preferences
    updatePreferences: async (preferences) => {
        const response = await api.put('/profile/preferences', preferences);
        return response.data;
    },

    // Delete account
    deleteAccount: async (data) => {
        const response = await api.delete('/profile/delete', { data });
        return response.data;
    },
};

// Export axios instance for custom calls if needed
export default api;
