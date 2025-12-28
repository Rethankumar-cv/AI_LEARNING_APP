import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Award, Sparkles, Share2, Crown, Star, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import AchievementShareModal from '../components/achievements/AchievementShareModal';
import clsx from 'clsx';

/**
 * Multi-Level Achievements Page - 5 Levels with Progressive Difficulty
 */
const Achievements = () => {
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [expandedLevels, setExpandedLevels] = useState({ 1: true }); // Level 1 expanded by default

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            setLoading(true);
            const [achievementsData, statsData] = await Promise.all([
                analyticsAPI.getAchievements(),
                analyticsAPI.getStats(),
            ]);

            setAchievements(achievementsData.achievements || []);
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = (achievement) => {
        setSelectedAchievement(achievement);
        setShareModalOpen(true);
    };

    const toggleLevel = (level) => {
        setExpandedLevels(prev => ({
            ...prev,
            [level]: !prev[level]
        }));
    };

    // Group achievements by level
    const achievementsByLevel = achievements.reduce((acc, achievement) => {
        const level = achievement.level || 1;
        if (!acc[level]) {
            acc[level] = [];
        }
        acc[level].push(achievement);
        return acc;
    }, {});

    // Calculate level progress
    const getLevelProgress = (level) => {
        const levelAchievements = achievementsByLevel[level] || [];
        const total = levelAchievements.length;
        const unlocked = levelAchievements.filter(a => a.unlocked).length;
        const percentage = total > 0 ? (unlocked / total) * 100 : 0;
        return { unlocked, total, percentage };
    };

    // Check if level is locked
    const isLevelLocked = (level) => {
        if (level === 1) return false; // Level 1 always unlocked
        const levelAchievements = achievementsByLevel[level] || [];
        return levelAchievements.length === 0 || levelAchievements.some(a => a.levelLocked);
    };

    // Level metadata
    const levelInfo = {
        1: {
            title: 'Beginner',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
            borderColor: 'border-blue-200 dark:border-blue-700',
            icon: Star,
            description: 'Start your learning journey'
        },
        2: {
            title: 'Intermediate',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
            borderColor: 'border-green-200 dark:border-green-700',
            icon: Award,
            description: 'Build your knowledge base'
        },
        3: {
            title: 'Advanced',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
            borderColor: 'border-purple-200 dark:border-purple-700',
            icon: Trophy,
            description: 'Master your skills'
        },
        4: {
            title: 'Expert',
            color: 'from-orange-500 to-red-500',
            bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
            borderColor: 'border-orange-200 dark:border-orange-700',
            icon: Zap,
            description: 'Reach elite status'
        },
        5: {
            title: 'Legend',
            color: 'from-yellow-500 to-amber-500',
            bgColor: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
            borderColor: 'border-yellow-200 dark:border-yellow-700',
            icon: Crown,
            description: 'Become a legend'
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto space-y-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        );
    }

    const totalAchievements = achievements.length;
    const unlockedAchievements = achievements.filter(a => a.unlocked).length;
    const overallProgress = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                    <Trophy className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                    Achievements
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Complete challenges to unlock achievements and level up!
                </p>
            </motion.div>

            {/* Overall Progress Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Overall Progress
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {unlockedAchievements} of {totalAchievements} achievements unlocked
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                {Math.round(overallProgress)}%
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Complete</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${overallProgress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full"
                        />
                    </div>

                    {/* Current Level Badge */}
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-lg">
                        <Crown className="w-5 h-5" />
                        <span className="font-bold">Level {stats?.level?.currentLevel || 1}</span>
                    </div>
                </Card>
            </motion.div>

            {/* Achievement Levels */}
            <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((level) => {
                    const levelData = levelInfo[level];
                    const progress = getLevelProgress(level);
                    const locked = isLevelLocked(level);
                    const isExpanded = expandedLevels[level];
                    const LevelIcon = levelData.icon;
                    const levelAchievements = achievementsByLevel[level] || [];

                    return (
                        <motion.div
                            key={level}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: level * 0.1 }}
                        >
                            <Card className={clsx(
                                'overflow-hidden',
                                locked && 'opacity-60'
                            )}>
                                {/* Level Header */}
                                <button
                                    onClick={() => !locked && toggleLevel(level)}
                                    disabled={locked}
                                    className={clsx(
                                        'w-full p-6 text-left transition-colors',
                                        !locked && 'hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer',
                                        locked && 'cursor-not-allowed'
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Level Icon */}
                                            <div className={clsx(
                                                'w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg',
                                                levelData.color,
                                                locked && 'grayscale'
                                            )}>
                                                {locked ? (
                                                    <Lock className="w-8 h-8 text-white" />
                                                ) : (
                                                    <LevelIcon className="w-8 h-8 text-white" />
                                                )}
                                            </div>

                                            {/* Level Info */}
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                        Level {level}: {levelData.title}
                                                    </h3>
                                                    {locked && (
                                                        <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full">
                                                            LOCKED
                                                        </span>
                                                    )}
                                                    {progress.percentage === 100 && !locked && (
                                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3" />
                                                            COMPLETE
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                    {levelData.description}
                                                </p>
                                                {!locked && (
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                            {progress.unlocked}/{progress.total} Complete
                                                        </span>
                                                        <div className="flex-1 max-w-xs h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${progress.percentage}%` }}
                                                                className={clsx(
                                                                    'h-full bg-gradient-to-r rounded-full',
                                                                    levelData.color
                                                                )}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                            {Math.round(progress.percentage)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expand Icon */}
                                        {!locked && (
                                            <div>
                                                {isExpanded ? (
                                                    <ChevronUp className="w-6 h-6 text-slate-400" />
                                                ) : (
                                                    <ChevronDown className="w-6 h-6 text-slate-400" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* Achievement Grid */}
                                <AnimatePresence>
                                    {isExpanded && !locked && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className={clsx(
                                                'p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gradient-to-br',
                                                levelData.bgColor
                                            )}>
                                                {levelAchievements.map((achievement, index) => (
                                                    <motion.div
                                                        key={achievement._id || achievement.id}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className={clsx(
                                                            'p-4 rounded-xl border-2 transition-all',
                                                            achievement.unlocked
                                                                ? 'bg-white dark:bg-slate-800 border-green-200 dark:border-green-700 shadow-lg'
                                                                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                                                        )}
                                                    >
                                                        {/* Achievement Content */}
                                                        <div className="flex items-start gap-3 mb-3">
                                                            <div className="text-3xl">{achievement.icon}</div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                                                                    {achievement.title}
                                                                </h4>
                                                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                                                    {achievement.description}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Progress/Status */}
                                                        {achievement.unlocked ? (
                                                            <div className="space-y-2">
                                                                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                                                                    <Trophy className="w-3 h-3" />
                                                                    <span>Unlocked</span>
                                                                </div>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleShare(achievement)}
                                                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-semibold rounded-lg shadow transition-all"
                                                                >
                                                                    <Share2 className="w-3 h-3" />
                                                                    Share
                                                                </motion.button>
                                                            </div>
                                                        ) : achievement.progress !== undefined && achievement.target ? (
                                                            <div>
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                                        Progress
                                                                    </span>
                                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                                        {achievement.progress}/{achievement.target}
                                                                    </span>
                                                                </div>
                                                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-violet-600 to-purple-600 rounded-full transition-all duration-500"
                                                                        style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full text-xs font-semibold">
                                                                <Lock className="w-3 h-3" />
                                                                <span>Locked</span>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Empty State */}
            {achievements.length === 0 && (
                <Card className="p-12 text-center">
                    <Trophy className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        No achievements yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Start learning to unlock achievements!
                    </p>
                </Card>
            )}

            {/* Share Modal */}
            <AchievementShareModal
                achievement={selectedAchievement}
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                userName={user?.name || 'Student'}
            />
        </div>
    );
};

export default Achievements;
