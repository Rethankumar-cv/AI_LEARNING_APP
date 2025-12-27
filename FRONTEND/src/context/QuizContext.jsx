import React, { createContext, useContext, useState } from 'react';
import mockApi from '../services/mockApi';

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

    const loadQuiz = async (documentId) => {
        try {
            setLoading(true);
            setError(null);
            const quiz = await mockApi.getQuiz(documentId);
            setCurrentQuiz(quiz);
            setAnswers({});
            setResults(null);
            return quiz;
        } catch (err) {
            setError(err.message);
            throw err;
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

    const submitQuiz = () => {
        if (!currentQuiz) return null;

        let correct = 0;
        const questionResults = currentQuiz.questions.map(question => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            if (isCorrect) correct++;

            return {
                questionId: question.id,
                question: question.question,
                userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation,
                options: question.options,
            };
        });

        const score = Math.round((correct / currentQuiz.questions.length) * 100);

        const quizResults = {
            score,
            correct,
            total: currentQuiz.questions.length,
            questionResults,
            completedAt: new Date(),
        };

        setResults(quizResults);
        return quizResults;
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
