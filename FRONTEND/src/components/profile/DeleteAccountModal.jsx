import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

/**
 * Delete Account Modal
 */
const DeleteAccountModal = ({ isOpen, onClose, onDelete }) => {
    const [formData, setFormData] = useState({
        password: '',
        confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.confirmation !== 'DELETE MY ACCOUNT') {
            setError('Please type "DELETE MY ACCOUNT" exactly to confirm');
            return;
        }

        setLoading(true);

        try {
            await onDelete(formData);
            // Logout will be handled by the parent component
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete account');
            setLoading(false);
        }
    };

    const reset = () => {
        setFormData({ password: '', confirmation: '' });
        setError('');
        setShowPassword(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-red-200 dark:border-red-800"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-red-900 dark:text-red-400">
                                Delete Account
                            </h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Warning */}
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-300 font-semibold mb-2">
                            ⚠️ This action cannot be undone!
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                            Deleting your account will permanently remove:
                        </p>
                        <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside mt-2 space-y-1">
                            <li>All your documents and uploads</li>
                            <li>All flashcards and quizzes</li>
                            <li>Your achievement progress</li>
                            <li>All activity history</li>
                            <li>Your account and profile</li>
                        </ul>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Enter Your Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="Your password"
                                    className="w-full px-4 py-2.5 pr-12 rounded-xl border-2 border-red-200 dark:border-red-800 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:border-red-500 transition-colors text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirmation Text */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Type <code className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-xs">DELETE MY ACCOUNT</code> to confirm
                            </label>
                            <input
                                type="text"
                                value={formData.confirmation}
                                onChange={(e) => setFormData({ ...formData, confirmation: e.target.value })}
                                required
                                placeholder="DELETE MY ACCOUNT"
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-800 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:border-red-500 transition-colors text-sm font-mono"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || formData.confirmation !== 'DELETE MY ACCOUNT'}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                {loading ? 'Deleting...' : 'Delete Forever'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DeleteAccountModal;
