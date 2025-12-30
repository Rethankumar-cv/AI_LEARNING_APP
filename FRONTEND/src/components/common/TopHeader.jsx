import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, LogOut, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInitials } from '../../utils/helpers';

/**
 * Top Header with user menu
 */
const TopHeader = ({ title }) => {
    const { user, logout } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-20">
            <div className="flex items-center justify-between">
                {/* Page Title */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-slate-100">
                        {title}
                    </h1>
                </div>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
                            {getInitials(user?.name || 'User')}
                        </div>

                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {user?.name || 'Demo User'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {user?.email || 'demo@example.com'}
                            </p>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {showDropdown && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowDropdown(false)}
                                />

                                {/* Menu */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-purple-500/30 py-2 z-20"
                                >
                                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {user?.name || 'Demo User'}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {user?.email || 'demo@example.com'}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Profile</span>
                                    </button>

                                    <button
                                        onClick={toggleTheme}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                    </button>

                                    <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setShowDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;
