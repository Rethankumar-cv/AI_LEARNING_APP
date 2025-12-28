import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Crown, Edit2, Moon, Sun, Shield, Key, Bell,
    TrendingUp, Download, Trash2, AlertTriangle, CheckCircle,
    XCircle, Calendar, Clock, Smartphone, FileText, Layers,
    Brain, Flame, Lock, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { analyticsAPI, profileAPI } from '../services/api';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import EditProfileModal from '../components/profile/EditProfileModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import DeleteAccountModal from '../components/profile/DeleteAccountModal';
import toast from 'react-hot-toast';

/**
 * Profile Page - Fully Functional User Account Management
 */
const Profile = () => {
    const { user, updateUserProfile, logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Notification preferences state with localStorage persistence
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('notificationPreferences');
        return saved ? JSON.parse(saved) : {
            email: true,
            quizReminders: true,
            studyStreak: false,
            updates: true
        };
    });

    // Fetch user stats
    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await analyticsAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    // Save notification preferences when changed
    useEffect(() => {
        localStorage.setItem('notificationPreferences', JSON.stringify(notifications));

        // Also sync to backend
        const syncPreferences = async () => {
            try {
                await profileAPI.updatePreferences({
                    email: notifications.email,
                    quizReminders: notifications.quizReminders,
                    studyStreakReminders: notifications.studyStreak,
                    newFeatures: notifications.updates,
                });
            } catch (error) {
                console.error('Failed to sync preferences:', error);
            }
        };
        syncPreferences();
    }, [notifications]);

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
        toast.success('Notification preference updated');
    };

    // Handle profile update
    const handleUpdateProfile = async (data) => {
        try {
            const response = await profileAPI.updateProfile(data);
            updateUserProfile(response.user);
            toast.success('Profile updated successfully!');
        } catch (error) {
            throw error;
        }
    };

    // Handle password change
    const handleChangePassword = async (data) => {
        try {
            await profileAPI.changePassword(data);
            toast.success('Password changed successfully!');
        } catch (error) {
            throw error;
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async (data) => {
        try {
            await profileAPI.deleteAccount(data);
            toast.success('Account deleted successfully');
            logout();
            navigate('/login');
        } catch (error) {
            throw error;
        }
    };

    // Format date nicely
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Profile
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Manage your personal information and preferences
                </p>
            </motion.div>

            {/* Cards Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {/* Profile Overview Card */}
                <motion.div
                    variants={cardVariants}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 md:p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Profile Overview
                        </h2>
                        <button
                            onClick={() => setEditModalOpen(true)}
                            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-xl">
                                <User className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                                <Crown className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                {user?.name || 'Student'}
                            </h3>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-600 dark:text-slate-400 mb-3">
                                <Mail className="w-4 h-4" />
                                <span>{user?.email || 'student@example.com'}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700 rounded-full">
                                <Crown className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                                    Level {stats?.level?.currentLevel || 1} Learner
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid Layout for smaller cards */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Personal Information Card */}
                    <motion.div
                        variants={cardVariants}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
                    >
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                            Personal Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={user?.name || ''}
                                    readOnly
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium outline-none cursor-not-allowed text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-medium outline-none cursor-not-allowed text-sm"
                                />
                            </div>

                            <button
                                onClick={() => setEditModalOpen(true)}
                                className="w-full px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors text-sm"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </motion.div>

                    {/* Account Details Card */}
                    <motion.div
                        variants={cardVariants}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
                    >
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                            Account Details
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                <User className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">User ID</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        #{user?.id?.slice(-8).toUpperCase() || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                <Crown className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Current Level</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Level {stats?.level?.currentLevel || 1}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Account Created</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatDate(user?.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                <Clock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Total XP</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {stats?.level?.totalXP || 0} XP
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Preferences Card */}
                <motion.div
                    variants={cardVariants}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
                >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                        Preferences
                    </h2>

                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                {isDark ? (
                                    <Moon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                ) : (
                                    <Sun className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                )}
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                    Appearance
                                </h3>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 ml-8">
                                Switch between light and dark theme
                            </p>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-violet-200 dark:focus:ring-violet-800 ${isDark
                                ? 'bg-gradient-to-r from-violet-600 to-purple-600'
                                : 'bg-slate-300 dark:bg-slate-600'
                                }`}
                            aria-label="Toggle dark mode"
                        >
                            <motion.span
                                layout
                                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${isDark ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </motion.div>

                {/* Security & Login Settings */}
                <motion.div
                    variants={cardVariants}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Security
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {/* Change Password */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Key className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Change Password</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Update your password regularly</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPasswordModalOpen(true)}
                                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Change
                                </button>
                            </div>
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full flex items-center gap-1">
                                    <XCircle className="w-3 h-3" />
                                    Disabled
                                </span>
                            </div>
                            <button
                                className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed"
                                disabled
                            >
                                Enable 2FA (Coming Soon)
                            </button>
                        </div>

                        {/* Active Sessions */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                            <div className="flex items-center gap-3 mb-3">
                                <Smartphone className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Active Sessions</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage your logged-in devices</p>
                                </div>
                            </div>
                            <div className="mb-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'} · {navigator.platform}
                                    </p>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 ml-6">Current device</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Notification Preferences */}
                <motion.div
                    variants={cardVariants}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Notifications
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {/* Email Notifications */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Email Notifications</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Receive updates via email</p>
                            </div>
                            <button
                                onClick={() => toggleNotification('email')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${notifications.email
                                    ? 'bg-violet-600'
                                    : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                aria-label="Toggle email notifications"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Quiz Reminders */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Quiz Reminders</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Get notified about pending quizzes</p>
                            </div>
                            <button
                                onClick={() => toggleNotification('quizReminders')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${notifications.quizReminders
                                    ? 'bg-violet-600'
                                    : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                aria-label="Toggle quiz reminders"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${notifications.quizReminders ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Study Streak Reminders */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Study Streak Reminders</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Stay motivated with streak alerts</p>
                            </div>
                            <button
                                onClick={() => toggleNotification('studyStreak')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${notifications.studyStreak
                                    ? 'bg-violet-600'
                                    : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                aria-label="Toggle study streak reminders"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${notifications.studyStreak ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* New Feature Updates */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">New Feature Updates</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Learn about new features</p>
                            </div>
                            <button
                                onClick={() => toggleNotification('updates')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${notifications.updates
                                    ? 'bg-violet-600'
                                    : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                aria-label="Toggle feature updates"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${notifications.updates ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Usage & Activity Summary */}
                <motion.div
                    variants={cardVariants}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Your Activity
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Documents */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
                            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {stats?.stats?.totalDocuments || 0}
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Documents</p>
                        </div>

                        {/* Flashcards */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700">
                            <Layers className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                {stats?.stats?.totalFlashcards || 0}
                            </p>
                            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Flashcards</p>
                        </div>

                        {/* Quizzes */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700">
                            <Brain className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-2" />
                            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                                {stats?.stats?.totalQuizzes || 0}
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Quizzes</p>
                        </div>

                        {/* Study Streak */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700">
                            <Flame className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
                            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                {stats?.stats?.studyStreak || 0}
                            </p>
                            <p className="text-xs text-orange-700 dark:text-orange-300 font-medium">Day Streak</p>
                        </div>
                    </div>
                </motion.div>

                {/* Data & Privacy */}
                <motion.div
                    variants={cardVariants}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Settings className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Data & Privacy
                        </h2>
                    </div>

                    <div className="space-y-3">
                        <button
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-not-allowed opacity-50"
                            disabled
                        >
                            <div className="flex items-center gap-3">
                                <Download className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Download My Data</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Export all your data</p>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400">Coming Soon</span>
                        </button>

                        <button
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-not-allowed opacity-50"
                            disabled
                        >
                            <div className="flex items-center gap-3">
                                <Trash2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Clear Local Data</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Remove cached information</p>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400">Coming Soon</span>
                        </button>

                        <a
                            href="#"
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Privacy Policy</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Read our privacy policy</p>
                                </div>
                            </div>
                            <span className="text-xs text-violet-600 dark:text-violet-400">View →</span>
                        </a>
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <motion.div
                    variants={cardVariants}
                    className="bg-red-50 dark:bg-red-900/10 rounded-2xl shadow-lg border-2 border-red-200 dark:border-red-800 p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        <h2 className="text-xl font-bold text-red-900 dark:text-red-400">
                            Danger Zone
                        </h2>
                    </div>

                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>

                    <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all"
                    >
                        Delete Account
                    </button>
                </motion.div>
            </motion.div>

            {/* Modals */}
            <EditProfileModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                user={user}
                onSave={handleUpdateProfile}
            />

            <ChangePasswordModal
                isOpen={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
                onSave={handleChangePassword}
            />

            <DeleteAccountModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleDeleteAccount}
            />
        </div>
    );
};

export default Profile;
