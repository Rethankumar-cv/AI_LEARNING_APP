import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Layers, Brain, Flame, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsCard from '../components/dashboard/StatsCard';
import LearningChart from '../components/dashboard/LearningChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import DashboardHero from '../components/dashboard/DashboardHero';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

/**
 * Enhanced Dashboard Page - Completely Dynamic
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [progress, setProgress] = useState(null);
    const [activities, setActivities] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsData, progressData, activityData, achievementsData] = await Promise.all([
                analyticsAPI.getStats(),
                analyticsAPI.getProgress(),
                analyticsAPI.getActivity(6),
                analyticsAPI.getAchievements(),
            ]);

            setStats(statsData);
            setProgress(progressData);
            setActivities(activityData.activities || []);
            setAchievements(achievementsData.achievements || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        );
    }

    // Real user data
    const userName = user?.name || 'there';
    const studyStreak = stats?.stats?.studyStreak || 0;
    const currentLevel = stats?.level?.currentLevel || 1;
    const currentXP = stats?.level?.currentXP || 0;
    const nextLevelXP = stats?.level?.nextLevelXP || 500;
    const xpProgress = nextLevelXP > 0 ? Math.round((currentXP / nextLevelXP) * 100) : 0;

    // Calculate achievements close to unlock (70%+ progress)
    const achievementsClose = achievements.filter(
        a => !a.unlocked && a.progress && a.target && (a.progress / a.target) >= 0.7
    ).length;

    // Calculate productivity increase from recent activity
    const recentActivities = progress?.totalActivities || 0;
    const productivityIncrease = Math.min(Math.round(recentActivities * 2.5), 99);

    return (
        <div className="space-y-8 relative">
            {/* Soft Background Gradient */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-950/10 dark:via-pink-950/5 dark:to-blue-950/10 pointer-events-none" />

            {/* Enhanced Hero Section */}
            <DashboardHero user={user} stats={stats} />

            {/* Micro-Gamification Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>Level {currentLevel} Learner</span>
                            <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                                {xpProgress}% to Level {currentLevel + 1}
                            </span>
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {achievementsClose > 0 ? (
                                <>{achievementsClose} achievement{achievementsClose !== 1 ? 's' : ''} close to unlock 🏆</>
                            ) : (
                                <>Keep learning to unlock achievements! 🏆</>
                            )}
                        </p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/achievements')}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg text-sm transition-all"
                >
                    View Achievements
                </motion.button>
            </motion.div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Documents"
                    value={stats?.stats?.totalDocuments || 0}
                    icon={FileText}
                    color="blue"
                    delay={0}
                />
                <StatsCard
                    title="Flashcards Created"
                    value={stats?.stats?.totalFlashcards || 0}
                    icon={Layers}
                    color="purple"
                    delay={0.1}
                />
                <StatsCard
                    title="Quizzes Taken"
                    value={stats?.stats?.totalQuizzes || 0}
                    icon={Brain}
                    color="emerald"
                    delay={0.2}
                />
                <StatsCard
                    title="Study Streak"
                    value={studyStreak}
                    icon={Flame}
                    color="orange"
                    delay={0.3}
                />
            </div>

            {/* Charts and Activity with Enhanced Spacing */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Enhanced Learning Chart - 2 columns */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2"
                >
                    <LearningChart data={progress?.progress || []} />
                </motion.div>

                {/* Enhanced Activity Feed - 1 column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="lg:col-span-1"
                >
                    <ActivityFeed activities={activities} />
                </motion.div>
            </div>

            {/* Decorative Section Divider */}
            <div className="relative h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent my-8">
                <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800 to-transparent" />
            </div>
        </div>
    );
};

export default Dashboard;
