import React, { createContext, useContext, useState, useEffect } from 'react';
import { documentsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const DocumentContext = createContext();

export const useDocuments = () => {
    const context = useContext(DocumentContext);
    if (!context) {
        throw new Error('useDocuments must be used within DocumentProvider');
    }
    return context;
};

export const DocumentProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch documents when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchDocuments();
        }
    }, [isAuthenticated]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await documentsAPI.getAll();
            setDocuments(response.documents || []);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch documents';
            setError(errorMessage);
            console.error('Fetch documents error:', err);
        } finally {
            setLoading(false);
        }
    };

    const uploadDocument = async (file, title) => {
        try {
            setLoading(true);
            setError(null);
            const response = await documentsAPI.upload(file, title);
            // Fetch all documents again to get the complete list
            await fetchDocuments();
            return response.document;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to upload document';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (id) => {
        try {
            setLoading(true);
            setError(null);
            await documentsAPI.delete(id);
            setDocuments(prev => prev.filter(doc => doc._id !== id));
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to delete document';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getDocument = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await documentsAPI.getById(id);
            return response.document;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to get document';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        documents,
        loading,
        error,
        fetchDocuments,
        uploadDocument,
        deleteDocument,
        getDocument,
    };

    return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

export default DocumentContext;

