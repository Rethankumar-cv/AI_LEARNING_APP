import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, ChevronLeft, ChevronRight, RotateCw, CheckCircle,
    RefreshCw, Sparkles, Flame, Award, BookOpen
} from 'lucide-react';
import mockApi from '../services/mockApi';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

/**
 * Enhanced Flashcards Page with Advanced Study Controls
 */
const Flashcards = () => {
    const navigate = useNavigate();
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [completedCount, setCompletedCount] = useState(0);
    const [showCompletion, setShowCompletion] = useState(false);

    // Card count control with localStorage
    const [selectedCount, setSelectedCount] = useState(() => {
        const saved = localStorage.getItem('flashcardCount');
        return saved ? parseInt(saved) : 10;
    });

    // Mock study data
    const studyStreak = 7;
    const cardsStudiedToday = 15;
    const mockAccuracy = 85;

    useEffect(() => {
        fetchFlashcards();
    }, []);

    // Save selected count to localStorage
    useEffect(() => {
        localStorage.setItem('flashcardCount', selectedCount.toString());
    }, [selectedCount]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') handlePrevious();
            else if (e.key === 'ArrowRight') handleNext();
            else if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleFlip();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentIndex, flashcards.length, isFlipped]);

    const fetchFlashcards = async () => {
        try {
            setLoading(true);
            const cards = await mockApi.getFlashcards();
            setFlashcards(cards);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        const activeCards = getActiveCards();
        if (currentIndex < activeCards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        } else {
            // Show completion
            setShowCompletion(true);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleKnowThis = () => {
        setCompletedCount(prev => prev + 1);
        handleNext();
    };

    const handleReviewAgain = () => {
        // Just advance for now, could implement spaced repetition later
        handleNext();
    };

    const toggleFavorite = async () => {
        try {
            const activeCards = getActiveCards();
            const currentCard = activeCards[currentIndex];
            const updatedCard = await mockApi.toggleFavorite(currentCard.id);

            setFlashcards(cards =>
                cards.map(card => card.id === updatedCard.id ? updatedCard : card)
            );

            // Show toast
            if (updatedCard.isFavorite) {
                showToastMessage('Saved for revision ⭐');
            } else {
                showToastMessage('Removed from favorites');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleCountChange = (count) => {
        setSelectedCount(count);
        setCurrentIndex(0);
        setIsFlipped(false);
        setShowCompletion(false);
        setCompletedCount(0);
    };

    const getActiveCards = () => {
        if (selectedCount === 'all') return flashcards;
        return flashcards.slice(0, Math.min(selectedCount, flashcards.length));
    };

    const restartSession = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setShowCompletion(false);
        setCompletedCount(0);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <CardSkeleton />
            </div>
        );
    }

    if (flashcards.length === 0) {
        return (
            <EmptyState
                icon="🎯"
                title="No flashcards yet"
                description="Generate flashcards from your documents to start studying"
                action={
                    <Button variant="primary" onClick={() => navigate('/documents')}>
                        Go to Documents
                    </Button>
                }
            />
        );
    }

    const activeCards = getActiveCards();
    const currentCard = activeCards[currentIndex];
    const favoriteCount = flashcards.filter(c => c.isFavorite).length;

    // Difficulty badge colors
    const difficultyColors = {
        Easy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
        Medium: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700',
        Hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700'
    };

    const mockDifficulty = currentIndex % 3 === 0 ? 'Easy' : currentIndex % 3 === 1 ? 'Medium' : 'Hard';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-20 right-4 bg-white dark:bg-slate-800 shadow-2xl rounded-xl px-6 py-3 z-50 border border-slate-200 dark:border-slate-700"
                    >
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{toastMessage}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header with Stats */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 dark:from-purple-700 dark:via-pink-700 dark:to-purple-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
                                <span>Flashcards</span>
                                <span className="text-4xl">🎯</span>
                            </h2>
                            <p className="text-white/90 text-lg">
                                Master your concepts with interactive flashcards ⚡
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/flashcards/favorites')}
                        >
                            <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                            Favorites ({favoriteCount})
                        </Button>
                    </div>

                    {/* Session Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <div className="flex items-center gap-2 mb-1">
                                <Flame className="w-4 h-4 text-orange-300" />
                                <p className="text-xs text-white/80">Streak</p>
                            </div>
                            <p className="text-xl font-bold">{studyStreak} days</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <div className="flex items-center gap-2 mb-1">
                                <BookOpen className="w-4 h-4 text-blue-300" />
                                <p className="text-xs text-white/80">Today</p>
                            </div>
                            <p className="text-xl font-bold">{cardsStudiedToday} cards</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <div className="flex items-center gap-2 mb-1">
                                <Award className="w-4 h-4 text-yellow-300" />
                                <p className="text-xs text-white/80">Accuracy</p>
                            </div>
                            <p className="text-xl font-bold">{mockAccuracy}%</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="w-4 h-4 text-yellow-300" />
                                <p className="text-xs text-white/80">Saved</p>
                            </div>
                            <p className="text-xl font-bold">{favoriteCount} cards</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Card Count Selector */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Study Session Size</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Choose how many cards to study</p>
                    </div>
                    <div className="flex gap-2">
                        {[5, 10, 20, 'all'].map((count) => (
                            <button
                                key={count}
                                onClick={() => handleCountChange(count)}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${selectedCount === count
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {count === 'all' ? 'All' : count}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Completion Screen */}
            {showCompletion ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/30 rounded-3xl p-12 text-center shadow-2xl border border-purple-200 dark:border-purple-700"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="text-7xl mb-4"
                    >
                        🎉
                    </motion.div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Excellent Work!</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                        You've completed {activeCards.length} flashcards today!
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="primary" onClick={restartSession}>
                            <RotateCw className="w-4 h-4 mr-2" />
                            Study Again
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/flashcards/favorites')}>
                            <Star className="w-4 h-4 mr-2" />
                            Review Favorites
                        </Button>
                    </div>
                </motion.div>
            ) : (
                <>
                    {/* Visual Progress Indicator */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Progress: {currentIndex + 1} / {activeCards.length}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {Math.round(((currentIndex + 1) / activeCards.length) * 100)}% Complete
                            </p>
                        </div>
                        {/* Progress Dots */}
                        <div className="flex gap-1.5 overflow-x-auto pb-2">
                            {activeCards.map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    className={`flex-shrink-0 w-2 h-2 rounded-full transition-all ${index < currentIndex
                                            ? 'bg-green-500 scale-110'
                                            : index === currentIndex
                                                ? 'bg-purple-600 scale-125 shadow-lg'
                                                : 'bg-slate-300 dark:bg-slate-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Flashcard */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="perspective-1000"
                    >
                        {/* Context Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700 rounded-full text-xs font-semibold">
                                📄 React Concepts
                            </span>
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-700 rounded-full text-xs font-semibold">
                                💡 Fundamentals
                            </span>
                            <span className={`px-3 py-1 ${difficultyColors[mockDifficulty]} border rounded-full text-xs font-semibold`}>
                                {mockDifficulty}
                            </span>
                        </div>

                        <div
                            onClick={handleFlip}
                            className="relative w-full aspect-[3/2] cursor-pointer"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Card Inner Container with 3D Flip */}
                            <motion.div
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
                                style={{ transformStyle: 'preserve-3d' }}
                                className="relative w-full h-full"
                            >
                                {/* Front Side - Question */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 dark:from-violet-700 dark:via-purple-800 dark:to-indigo-800 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center justify-center text-center"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden'
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full"
                                    >
                                        <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                                            <p className="text-xs font-bold text-white uppercase tracking-wider">
                                                Question
                                            </p>
                                        </div>
                                        <p className="text-xl md:text-3xl font-display font-bold text-white leading-relaxed mb-8">
                                            {currentCard.question}
                                        </p>
                                        <div className="flex items-center justify-center gap-2 text-white/70">
                                            <RotateCw className="w-4 h-4" />
                                            <p className="text-sm">Click or press Space to reveal answer</p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Back Side - Answer */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-600 to-purple-600 dark:from-pink-700 dark:via-rose-800 dark:to-purple-800 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center justify-center text-center"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)'
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full"
                                    >
                                        <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                                            <p className="text-xs font-bold text-white uppercase tracking-wider">
                                                Answer
                                            </p>
                                        </div>
                                        <p className="text-lg md:text-2xl text-white leading-relaxed font-medium">
                                            {currentCard.answer}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Favorite Button (Floating) */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite();
                            }}
                            className="absolute top-4 right-4 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center z-10 border-2 border-white dark:border-slate-700"
                        >
                            <Star
                                className={`w-6 h-6 transition-all ${currentCard.isFavorite
                                        ? 'fill-yellow-400 text-yellow-400 scale-110'
                                        : 'text-slate-400 dark:text-slate-500'
                                    }`}
                            />
                        </motion.button>
                    </motion.div>

                    {/* Study Feedback Controls */}
                    <div className="grid grid-cols-2 gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleKnowThis}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all"
                        >
                            <CheckCircle className="w-5 h-5" />
                            <span>I Know This</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleReviewAgain}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition-all"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Review Again</span>
                        </motion.button>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between gap-4">
                        <Button
                            variant="ghost"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            icon={<ChevronLeft className="w-5 h-5" />}
                            className="flex-1 sm:flex-initial"
                        >
                            <span className="hidden sm:inline">Previous</span>
                        </Button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleFlip}
                                className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-slate-200 dark:border-slate-700"
                            >
                                <RotateCw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </button>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={handleNext}
                            disabled={currentIndex === activeCards.length - 1}
                            className="flex-1 sm:flex-initial"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>

                    {/* Keyboard Hints */}
                    <div className="text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            💡 Tip: Use ← → arrow keys to navigate • Space to flip
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default Flashcards;
