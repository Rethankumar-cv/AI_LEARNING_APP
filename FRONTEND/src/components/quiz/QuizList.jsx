import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Clock, CheckCircle, TrendingUp, PlayCircle, FileText, Trash2, Award } from 'lucide-react';
import { quizzesAPI } from '../../services/api';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import { CardSkeleton } from '../common/LoadingSkeleton';

/**
 * Quiz List Component - Displays all user quizzes and history
 */
const QuizList = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [quizResults, setQuizResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchQuizzes();
        fetchQuizResults();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const response = await quizzesAPI.getAll();
            setQuizzes(response.quizzes || []);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            setQuizzes([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuizResults = async () => {
        try {
            const response = await quizzesAPI.getHistory();
            // Group results by quizId and find best score
            const resultsByQuiz = {};
            (response.results || []).forEach(result => {
                const quizId = result.quizId?._id || result.quizId;
                if (!resultsByQuiz[quizId] || result.score > resultsByQuiz[quizId].score) {
                    resultsByQuiz[quizId] = result;
                }
            });
            setQuizResults(resultsByQuiz);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
        }
    };

    const handleDeleteQuiz = async (quizId, quizTitle) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${quizTitle}"? This action cannot be undone.`);
        if (!confirmed) return;

        try {
            setDeletingId(quizId);
            await quizzesAPI.delete(quizId);
            // Remove from local state
            setQuizzes(quizzes.filter(q => (q._id || q.id) !== quizId));
        } catch (error) {
            console.error('Error deleting quiz:', error);
            alert('Failed to delete quiz. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleTakeQuiz = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <CardSkeleton count={3} />
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <EmptyState
                icon="🧠"
                title="No quizzes yet"
                description="Generate a quiz from your documents to test your knowledge"
                action={
                    <Button variant="primary" onClick={() => navigate('/documents')}>
                        Go to Documents
                    </Button>
                }
            />
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
                        Your Quizzes
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => navigate('/documents')}
                    icon={<FileText className="w-4 h-4" />}
                >
                    Generate New Quiz
                </Button>
            </div>

            {/* Quiz Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz, index) => {
                    const quizId = quiz._id || quiz.id;
                    const result = quizResults[quizId];
                    const hasBeenAttempted = !!result;

                    return (
                        <motion.div
                            key={quizId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 relative"
                        >
                            {/* Delete Button */}
                            <button
                                onClick={() => handleDeleteQuiz(quizId, quiz.title)}
                                disabled={deletingId === quizId}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete quiz"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            {/* Quiz Icon & Difficulty */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold">
                                    {quiz.difficulty || 'Medium'}
                                </span>
                            </div>

                            {/* Quiz Title */}
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 pr-8">
                                {quiz.title}
                            </h3>

                            {/* Document Info */}
                            {quiz.documentId && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-1">
                                    📄 {quiz.documentId.title || 'Document'}
                                </p>
                            )}

                            {/* Best Score Badge */}
                            {hasBeenAttempted && (
                                <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-purple-900 dark:text-purple-100">Best Score</p>
                                            <p className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                                                {result.score}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quiz Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {quiz.questions?.length || 0} questions
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {formatDate(quiz.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleTakeQuiz(quizId)}
                                className="w-full"
                                icon={<PlayCircle className="w-4 h-4" />}
                            >
                                {hasBeenAttempted ? 'Retake Quiz' : 'Take Quiz'}
                            </Button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizList;
