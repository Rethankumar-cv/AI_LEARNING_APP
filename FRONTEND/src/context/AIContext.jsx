import React, { createContext, useContext, useState } from 'react';
import api, { flashcardsAPI, quizzesAPI } from '../services/api';

const AIContext = createContext();

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) {
        throw new Error('useAI must be used within AIProvider');
    }
    return context;
};

export const AIProvider = ({ children }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [summary, setSummary] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = async (message, documentId) => {
        if (!message.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            message,
            sender: 'user',
            timestamp: new Date(),
        };

        setChatMessages((prev) => [...prev, userMessage]);
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            // Call real backend API
            const response = await api.post(`/documents/${documentId}/chat`, { message });

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                message: response.data.answer,
                sender: 'ai',
                timestamp: new Date(),
            };

            setChatMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            console.error('Chat error:', err);
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                message: "I'm sorry, I couldn't process your request. Please try again.",
                sender: 'ai',
                timestamp: new Date(),
                isError: true,
            };
            setChatMessages((prev) => [...prev, errorMessage]);
            setError(err.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const generateSummary = async (documentId) => {
        try {
            setLoading(true);
            setError(null);

            // TODO: Summary is already generated on upload by backend
            // This function should fetch the existing summary from the document
            // For now, return placeholder with proper structure
            const summaryData = {
                title: 'Document Summary',
                sections: [
                    {
                        heading: 'About Summary Generation',
                        points: [
                            'Summaries are automatically generated when you upload a document',
                            'The summary is created using AI and appears in the document details',
                            'This manual summary generation feature will be enabled once integrated with the backend'
                        ]
                    }
                ],
                keywords: ['Auto-generated', 'AI-powered', 'Coming soon']
            };
            setSummary(summaryData);
            return summaryData;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const generateFlashcards = async (documentId, count = 10) => {
        try {
            setLoading(true);
            setError(null);
            const response = await flashcardsAPI.generate(documentId, count);
            setFlashcards(response.flashcards || []);
            return response.flashcards;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to generate flashcards';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const generateQuiz = async (documentId, questionCount = 10) => {
        try {
            setLoading(true);
            setError(null);
            const response = await quizzesAPI.generate(documentId, questionCount);
            return response.quiz;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to generate quiz';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setChatMessages([]);
    };

    const clearSummary = () => {
        setSummary(null);
    };

    const value = {
        chatMessages,
        summary,
        flashcards,
        loading,
        typing,
        error,
        sendMessage,
        generateSummary,
        generateFlashcards,
        generateQuiz,
        clearChat,
        clearSummary,
    };

    return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export default AIContext;
