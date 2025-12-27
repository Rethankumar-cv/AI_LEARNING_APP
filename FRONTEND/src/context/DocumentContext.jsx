import React, { createContext, useContext, useState, useEffect } from 'react';
import mockApi from '../services/mockApi';

const DocumentContext = createContext();

export const useDocuments = () => {
    const context = useContext(DocumentContext);
    if (!context) {
        throw new Error('useDocuments must be used within DocumentProvider');
    }
    return context;
};

export const DocumentProvider = ({ children }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch documents on mount
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const docs = await mockApi.getDocuments();
            setDocuments(docs);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const uploadDocument = async (file) => {
        try {
            setLoading(true);
            setError(null);
            const newDoc = await mockApi.uploadDocument(file);
            setDocuments(prev => [...prev, newDoc]);
            return newDoc;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (id) => {
        try {
            setLoading(true);
            setError(null);
            await mockApi.deleteDocument(id);
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getDocument = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const doc = await mockApi.getDocument(id);
            return doc;
        } catch (err) {
            setError(err.message);
            throw err;
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
