import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowLeft } from 'lucide-react';
import mockApi from '../services/mockApi';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

/**
 * Favorites Flashcards Page
 */
const FlashcardsFavorites = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const cards = await mockApi.getFlashcards();
            const favoriteCards = cards.filter(card => card.isFavorite);
            setFavorites(favoriteCards);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (id) => {
        try {
            await mockApi.toggleFavorite(id);
            setFavorites(cards => cards.filter(card => card.id !== id));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardSkeleton />
                <CardSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/flashcards')}
                    icon={<ArrowLeft className="w-5 h-5" />}
                >
                    Back
                </Button>

                <div className="flex-1">
                    <h2 className="text-2xl font-display font-bold text-slate-900">
                        Favorite Flashcards ⭐
                    </h2>
                    <p className="text-slate-600">
                        {favorites.length} card{favorites.length !== 1 ? 's' : ''} marked as favorite
                    </p>
                </div>
            </div>

            {/* Favorites Grid */}
            {favorites.length === 0 ? (
                <EmptyState
                    icon="⭐"
                    title="No favorites yet"
                    description="Star flashcards to save them here for quick access"
                    action={
                        <Button variant="primary" onClick={() => navigate('/flashcards')}>
                            Browse Flashcards
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/70 backdrop-blur-md border border-white/20 shadow-glass rounded-2xl p-6 hover:shadow-glass-lg transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h4 className="text-sm font-semibold text-primary-600">QUESTION</h4>
                                <button
                                    onClick={() => toggleFavorite(card.id)}
                                    className="hover:scale-110 transition-transform"
                                >
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                </button>
                            </div>

                            <p className="font-semibold text-slate-900 mb-4">
                                {card.question}
                            </p>

                            <div className="pt-4 border-t border-slate-200">
                                <h4 className="text-sm font-semibold text-purple-600 mb-2">ANSWER</h4>
                                <p className="text-sm text-slate-700">
                                    {card.answer}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlashcardsFavorites;
