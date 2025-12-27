import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);
    const [token, setToken] = useLocalStorage('token', null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Auto-fetch user profile on mount if token exists
    useEffect(() => {
        const fetchProfile = async () => {
            if (token && !user) {
                try {
                    const response = await authAPI.getProfile();
                    setUser(response.user);
                } catch (err) {
                    // Token invalid, clear auth
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }
        };
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.login({ email, password });
            setUser(response.user);
            setToken(response.token);
            return response;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name, email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.register({ name, email, password });
            setUser(response.user);
            setToken(response.token);
            return response;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setError(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const updateUserProfile = async (updates) => {
        try {
            const response = await authAPI.updateProfile(updates);
            setUser(response.user);
            return response;
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Failed to update profile');
        }
    };

    const isAuthenticated = !!token && !!user;

    const value = {
        user,
        token,
        loading,
        error,
        login,
        signup,
        logout,
        updateUserProfile,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

