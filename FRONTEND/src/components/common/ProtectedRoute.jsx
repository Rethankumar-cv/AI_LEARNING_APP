import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Helper to safely parse JSON-stringified localStorage values
 */
const parseLocalStorageValue = (key) => {
    try {
        const value = localStorage.getItem(key);
        if (!value) return null;

        // If value is JSON-stringified (starts and ends with quotes), parse it
        if (value.startsWith('"') && value.endsWith('"')) {
            return JSON.parse(value);
        }
        return value;
    } catch (e) {
        return null;
    }
};

/**
 * Protected Route wrapper component
 * Redirects to login if user is not authenticated
 * Checks both context state and localStorage to handle race conditions
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Fallback check: also check localStorage directly
    // This handles the race condition where navigation happens before context state updates
    const tokenInStorage = parseLocalStorageValue('token');
    const userInStorage = parseLocalStorageValue('user');
    const isAuthenticatedViaStorage = !!(tokenInStorage && userInStorage);

    if (!isAuthenticated && !isAuthenticatedViaStorage) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
