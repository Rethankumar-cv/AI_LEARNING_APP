import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { flashcardsAPI } from '../../services/api';
import Button from '../common/Button';

/**
 * Flashcard Generator Component for Document Viewer
 * Allows users to generate flashcards from the current document
 */
const FlashcardGenerator = ({ document }) => {
    const navigate = useNavigate();
    const [selectedCount, setSelectedCount] = useState(10);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [generatedFlashcards, setGeneratedFlashcards] = useState(null);

    const handleGenerate = async () => {
        // Support both _id (MongoDB) and id properties
        const documentId = document?._id || document?.id;

        if (!document || !documentId) {
            console.error('Document missing or invalid:', document);
            setError('Document not available. Please refresh the page.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const result = await flashcardsAPI.generate(documentId, selectedCount);

            if (result.success) {
                setGeneratedFlashcards(result);
                setSuccess(true);
            } else {
                setError(result.error || 'Failed to generate flashcards');
            }
        } catch (err) {
            console.error('Flashcard generation error:', err);
            setError(err.response?.data?.error || 'Failed to generate flashcards. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewFlashcards = () => {
        const documentId = document?._id || document?.id;
        navigate(`/flashcards?documentId=${documentId}`);
    };

    const countOptions = [5, 10, 15, 20];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Generate Flashcards
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Create AI-powered flashcards from this document
                    </p>
                </div>
            </div>

            {/* Success Message */}
            {success && generatedFlashcards && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                Success! Generated {generatedFlashcards.count} flashcards
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                From: {generatedFlashcards.documentTitle || document.name}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleViewFlashcards}
                        className="mt-3 w-full"
                    >
                        View & Study Flashcards
                    </Button>
                </motion.div>
            )}

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-900 dark:text-red-100">
                                {error}
                            </p>
                            {/* Debug info */}
                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-xs">
                                    <p className="font-mono">
                                        Document ID: {document?._id || document?.id || 'not found'}<br />
                                        Has document: {document ? 'yes' : 'no'}<br />
                                        Keys: {document ? Object.keys(document).join(', ') : 'n/a'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Count Selector */}
            {!success && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Number of Flashcards
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {countOptions.map((count) => (
                                <button
                                    key={count}
                                    onClick={() => setSelectedCount(count)}
                                    disabled={loading}
                                    className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all ${selectedCount === count
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {count}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                        variant="primary"
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate {selectedCount} Flashcards
                            </>
                        )}
                    </Button>

                    {/* Info Text */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                        💡 AI will create study flashcards based on the document content
                    </p>
                </>
            )}

            {/* Reset Button (shown after success) */}
            {success && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setSuccess(false);
                        setGeneratedFlashcards(null);
                        setError('');
                    }}
                    className="w-full"
                >
                    Generate More Flashcards
                </Button>
            )}
        </div>
    );
};

export default FlashcardGenerator;
