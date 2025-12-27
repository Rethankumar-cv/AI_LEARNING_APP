import React, { createContext, useContext, useState } from 'react';
import mockApi from '../services/mockApi';

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
        try {
            setTyping(true);
            setError(null);

            // Add user message
            const userMessage = {
                id: Date.now().toString(),
                message,
                sender: 'user',
                timestamp: new Date(),
            };
            setChatMessages(prev => [...prev, userMessage]);

            // Get AI response
            const aiResponse = await mockApi.sendChatMessage(message, documentId);
            setChatMessages(prev => [...prev, aiResponse]);

            return aiResponse;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setTyping(false);
        }
    };

    const generateSummary = async (documentId) => {
        try {
            setLoading(true);
            setError(null);
            const summaryData = await mockApi.generateSummary(documentId);
            setSummary(summaryData);
            return summaryData;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const generateFlashcards = async (documentId) => {
        try {
            setLoading(true);
            setError(null);
            const cards = await mockApi.generateFlashcards(documentId);
            setFlashcards(cards);
            return cards;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const generateQuiz = async (documentId) => {
        try {
            setLoading(true);
            setError(null);
            const quiz = await mockApi.generateQuiz(documentId);
            return quiz;
        } catch (err) {
            setError(err.message);
            throw err;
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
