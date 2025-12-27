import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { CheckCircle, Clock, Zap, TrendingUp, Award } from 'lucide-react';
import clsx from 'clsx';

/**
 * Enhanced Quiz Page with Modern UI and User Controls
 */
const Quiz = () => {
    const navigate = useNavigate();
    const { currentQuiz, answers, loadQuiz, submitAnswer, submitQuiz, loading } = useQuiz();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);

    // Question count control with localStorage
    const [selectedQuestionCount, setSelectedQuestionCount] = useState(() => {
        const saved = localStorage.getItem('quizQuestionCount');
        return saved ? parseInt(saved) : 10;
    });

    useEffect(() => {
        // Load a quiz (using first document)
        loadQuiz('1');
    }, []);

    // Save selected count to localStorage
    useEffect(() => {
        localStorage.setItem('quizQuestionCount', selectedQuestionCount.toString());
    }, [selectedQuestionCount]);

    // Keyboard navigation
    useEffect(() => {
        if (!quizStarted) return;

        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') handlePrevious();
            else if (e.key === 'ArrowRight') handleNext();
            else if (e.key === 'Enter' && selectedAnswer !== undefined) handleNext();
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [quizStarted, currentQuestionIndex]);

    const handleAnswerSelect = (optionIndex) => {
        submitAnswer(activeQuestions[currentQuestionIndex].id, optionIndex);
    };

    const handleNext = () => {
        if (currentQuestionIndex < activeQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (allQuestionsAnswered) {
            setShowCompletion(true);
            setTimeout(() => {
                handleSubmit();
            }, 2000);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        const results = submitQuiz();
        navigate('/quiz/result');
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
    };

    const handleCountChange = (count) => {
        setSelectedQuestionCount(count);
        setCurrentQuestionIndex(0);
        setQuizStarted(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (!currentQuiz) {
        return (
            <EmptyState
                icon="🧠"
                title="No quiz available"
                description="Generate a quiz from your documents to test your knowledge"
                action={
                    <Button variant="primary" onClick={() => navigate('/documents')}>
                        Go to Documents
                    </Button>
                }
            />
        );
    }

    // Get active questions based on selected count
    const getActiveQuestions = () => {
        if (selectedQuestionCount === 'all') return currentQuiz.questions;
        return currentQuiz.questions.slice(0, Math.min(selectedQuestionCount, currentQuiz.questions.length));
    };

    const activeQuestions = getActiveQuestions();
    const currentQuestion = activeQuestions[currentQuestionIndex];
    const selectedAnswer = answers[currentQuestion?.id];
    const progress = ((currentQuestionIndex + 1) / activeQuestions.length) * 100;
    const answeredCount = Object.keys(answers).filter(id =>
        activeQuestions.some(q => q.id === id)
    ).length;
    const allQuestionsAnswered = answeredCount === activeQuestions.length;
    const isLastQuestion = currentQuestionIndex === activeQuestions.length - 1;

    // Mock data
    const mockDifficulty = 'Medium';
    const estimatedMinutes = Math.ceil(activeQuestions.length * 0.6);

    // Question Setup Screen
    if (!quizStarted) {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-800 rounded-3xl p-8 text-white shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
                            <span>{currentQuiz.title}</span>
                            <span className="text-4xl">🧠</span>
                        </h2>
                        <p className="text-white/90 text-lg mb-4">
                            Test your knowledge and track your progress 📈
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <Zap className="w-4 h-4" />
                                <span className="text-sm font-semibold">{mockDifficulty}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-semibold">~{estimatedMinutes} mins</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quiz Setup Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
                >
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Choose Your Challenge
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            How many questions would you like to tackle?
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                        {[5, 10, 15, 'all'].map((count) => (
                            <motion.button
                                key={count}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCountChange(count)}
                                className={`relative p-6 rounded-xl font-bold text-lg transition-all ${selectedQuestionCount === count
                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl scale-105'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-1">
                                        {count === 'all' ? currentQuiz.questions.length : count}
                                    </div>
                                    <div className="text-xs opacity-90">
                                        {count === 'all' ? 'All Questions' : 'Questions'}
                                    </div>
                                </div>
                                {selectedQuestionCount === count && (
                                    <div className="absolute top-2 right-2">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 mb-6 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-start gap-3">
                            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-1">
                                    You've selected {selectedQuestionCount === 'all' ? activeQuestions.length : selectedQuestionCount} questions
                                </p>
                                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                                    Estimated time: ~{estimatedMinutes} minutes
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        onClick={handleStartQuiz}
                        className="w-full py-4 text-lg"
                    >
                        Start Quiz
                        <Zap className="w-5 h-5 ml-2" />
                    </Button>
                </motion.div>
            </div>
        );
    }

    // Completion Animation
    if (showCompletion) {
        return (
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-3xl p-12 text-center shadow-2xl border border-emerald-200 dark:border-emerald-800"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="text-7xl mb-4"
                    >
                        🎯
                    </motion.div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Quiz Complete!
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                        Calculating your results...
                    </p>
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
                </motion.div>
            </div>
        );
    }

    // Main Quiz Interface
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Enhanced Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-800 rounded-3xl p-6 text-white shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <h2 className="text-2xl font-display font-bold mb-3 flex items-center gap-2">
                        <span>{currentQuiz.title}</span>
                        <span className="text-3xl">🧠</span>
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-white/20">
                            <span className="font-semibold">{activeQuestions.length} Questions</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-white/20">
                            <Zap className="w-3.5 h-3.5" />
                            <span>{mockDifficulty}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-white/20">
                            <Clock className="w-3.5 h-3.5" />
                            <span>~{estimatedMinutes} mins</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced Progress Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Question {currentQuestionIndex + 1} of {activeQuestions.length}
                    </span>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {Math.round(progress)}% Complete
                    </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg"
                    />
                </div>

                {/* Progress Dots */}
                <div className="flex gap-1 overflow-x-auto pb-2">
                    {activeQuestions.map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className={`flex-shrink-0 w-2 h-2 rounded-full transition-all ${index < currentQuestionIndex
                                    ? 'bg-emerald-500 scale-110'
                                    : index === currentQuestionIndex
                                        ? 'bg-teal-600 scale-125 shadow-lg'
                                        : 'bg-slate-300 dark:bg-slate-600'
                                }`}
                        />
                    ))}
                </div>

                {/* Mid-Quiz Feedback */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                        Answered: {answeredCount} / {activeQuestions.length}
                    </span>
                    {answeredCount > activeQuestions.length / 2 && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1"
                        >
                            <Award className="w-4 h-4" />
                            You're doing great! 👍
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Enhanced Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-shadow"
                >
                    {/* Topic Tag */}
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-300 dark:border-teal-700 rounded-full text-xs font-semibold">
                            💡 React Fundamentals
                        </span>
                    </div>

                    {/* Question */}
                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8 leading-relaxed">
                        {currentQuestion.question}
                    </h3>

                    {/* Enhanced Answer Options */}
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.01, x: 4 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => handleAnswerSelect(index)}
                                className={clsx(
                                    'w-full text-left p-5 rounded-xl border-2 transition-all duration-300 group',
                                    selectedAnswer === index
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg ring-2 ring-emerald-200 dark:ring-emerald-800'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Enhanced Radio Circle */}
                                    <div className={clsx(
                                        'w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                                        selectedAnswer === index
                                            ? 'border-emerald-500 bg-emerald-500 shadow-lg'
                                            : 'border-slate-300 dark:border-slate-600 group-hover:border-emerald-400'
                                    )}>
                                        {selectedAnswer === index && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-3.5 h-3.5 rounded-full bg-white"
                                            />
                                        )}
                                    </div>

                                    {/* Option Text */}
                                    <span className={clsx(
                                        'font-medium text-lg flex-1',
                                        selectedAnswer === index
                                            ? 'text-emerald-900 dark:text-emerald-100'
                                            : 'text-slate-700 dark:text-slate-300'
                                    )}>
                                        {option}
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Enhanced Navigation */}
            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="flex-1 sm:flex-initial"
                >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">←</span>
                </Button>

                <div className="hidden sm:block text-center px-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        💡 Use ← → keys to navigate
                    </p>
                </div>

                {isLastQuestion ? (
                    <Button
                        variant="success"
                        onClick={handleSubmit}
                        disabled={!allQuestionsAnswered}
                        className="flex-1 sm:flex-initial"
                    >
                        Submit Quiz
                        <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleNext}
                        className="flex-1 sm:flex-initial"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">→</span>
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Quiz;
