import React, { createContext, useContext, useState } from 'react';
import { quizzesAPI } from '../services/api';

const QuizContext = createContext();

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within QuizProvider');
    }
    return context;
};

export const QuizProvider = ({ children }) => {
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadQuiz = async (quizId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await quizzesAPI.getById(quizId);
            setCurrentQuiz(response.quiz);
            setAnswers({});
            setResults(null);
            return response.quiz;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to load quiz';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = (questionId, answerIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex,
        }));
    };

    const submitQuiz = async (timeTaken = 0) => {
        if (!currentQuiz) return null;

        try {
            setLoading(true);
            // Submit to backend for server-side scoring
            const response = await quizzesAPI.submit(currentQuiz._id, answers, timeTaken);

            const quizResults = {
                score: response.result.score,
                correct: response.result.correctCount,
                total: response.result.totalQuestions,
                questionResults: response.result.results,
                completedAt: new Date(),
            };

            setResults(quizResults);
            return quizResults;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to submit quiz';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetQuiz = () => {
        setCurrentQuiz(null);
        setAnswers({});
        setResults(null);
        setError(null);
    };

    const retryQuiz = () => {
        setAnswers({});
        setResults(null);
    };

    const value = {
        currentQuiz,
        answers,
        results,
        loading,
        error,
        loadQuiz,
        submitAnswer,
        submitQuiz,
        resetQuiz,
        retryQuiz,
    };

    return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export default QuizContext;
