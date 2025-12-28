import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Loader } from 'lucide-react';
import Button from '../common/Button';

/**
 * Modal component for displaying AI-generated text explanations
 */
const ExplanationModal = ({ isOpen, onClose, selectedText, explanation, loading }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                AI Explanation
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
                        {/* Selected Text */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                Selected Text:
                            </h3>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border-l-4 border-indigo-600">
                                <p className="text-slate-700 dark:text-slate-300 italic">
                                    "{selectedText}"
                                </p>
                            </div>
                        </div>

                        {/* Explanation */}
                        <div>
                            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                Explanation:
                            </h3>
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Generating explanation...
                                        </p>
                                    </div>
                                </div>
                            ) : explanation ? (
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {explanation}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                    No explanation available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <Button variant="secondary" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExplanationModal;
