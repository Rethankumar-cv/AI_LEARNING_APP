import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Lock, Brain, FileText, Zap, Award, TrendingUp, Target } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import Card from '../components/common/Card';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import clsx from 'clsx';

/**
 * Analytics Page - Dynamic user statistics and achievements
 */
const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [progress, setProgress] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const [statsData, progressData, performanceData, achievementsData] = await Promise.all([
                analyticsAPI.getStats(),
                analyticsAPI.getProgress(),
                analyticsAPI.getPerformance(),
                analyticsAPI.getAchievements(),
            ]);

            setStats(statsData);
            setProgress(progressData);
            setPerformance(performanceData);
            setAchievements(achievementsData.achievements || []);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        );
    }

    const statCards = [
        {
            icon: <Brain className="w-6 h-6" />,
            label: 'Total Quizzes',
            value: stats?.stats?.totalQuizzes || 0,
            color: 'from-purple-500 to-indigo-600',
        },
        {
            icon: <Zap className="w-6 h-6" />,
            label: 'Total Flashcards',
            value: stats?.stats?.totalFlashcards || 0,
            color: 'from-emerald-500 to-teal-600',
        },
        {
            icon: <FileText className="w-6 h-6" />,
            label: 'Documents',
            value: stats?.stats?.totalDocuments || 0,
            color: 'from-blue-500 to-cyan-600',
        },
        {
            icon: <Award className="w-6 h-6" />,
            label: 'Current Level',
            value: stats?.level?.currentLevel || 1,
            color: 'from-orange-500 to-red-600',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <h2 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
                        <span>Analytics</span>
                        <span className="text-4xl">📊</span>
                    </h2>
                    <p className="text-white/90 text-lg">
                        Track your learning progress and achievements 🏆
                    </p>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
                    >
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4`}>
                            {stat.icon}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Performance Metrics */}
            {performance && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-600" />
                            Quiz Performance
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Average Score</span>
                                <span className="text-2xl font-bold text-purple-600">{performance.performance.quiz.averageScore}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Best Score</span>
                                <span className="text-2xl font-bold text-green-600">{performance.performance.quiz.bestScore}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Total Quizzes</span>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">{performance.performance.quiz.totalQuizzes}</span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-emerald-600" />
                            Flashcard Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Total Cards</span>
                                <span className="text-2xl font-bold text-emerald-600">{performance.performance.flashcards.total}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Favorites</span>
                                <span className="text-2xl font-bold text-yellow-600">{performance.performance.flashcards.favorites}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Weekly Progress Chart */}
            {progress?.progress && progress.progress.length > 0 && (
                <Card>
                    <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Weekly Activity
                    </h3>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={progress.progress}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="day"
                                    stroke="#64748b"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            )}

            {/* Achievement Badges */}
            <div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4">
                    Achievements 🏆
                </h3>

                {achievements.length === 0 ? (
                    <Card>
                        <p className="text-center text-slate-600 dark:text-slate-400 py-8">
                            Complete activities to unlock achievements!
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={achievement.achievementId || achievement._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={clsx(
                                    'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl p-6 text-center',
                                    achievement.unlocked
                                        ? 'hover:shadow-xl transition-all duration-300'
                                        : 'opacity-60 grayscale'
                                )}
                            >
                                {/* Icon */}
                                <div className={clsx(
                                    'text-5xl mb-3',
                                    !achievement.unlocked && 'relative'
                                )}>
                                    {achievement.unlocked ? achievement.icon : (
                                        <div className="relative inline-block">
                                            <span className="opacity-30">{achievement.icon}</span>
                                            <Lock className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <h4 className="font-display font-bold text-slate-900 dark:text-white mb-1">
                                    {achievement.title}
                                </h4>

                                {/* Description */}
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    {achievement.description}
                                </p>

                                {/* Status */}
                                {achievement.unlocked ? (
                                    <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                                        <Trophy className="w-3 h-3" />
                                        <span>Unlocked</span>
                                    </div>
                                ) : achievement.progress !== undefined ? (
                                    <div>
                                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
                                                style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {achievement.progress} / {achievement.target}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-semibold">
                                        <Lock className="w-3 h-3" />
                                        <span>Locked</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
