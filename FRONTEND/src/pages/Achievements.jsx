import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Lock, Sparkles, Clock, Star, Award, ChevronLeft, Share2 } from 'lucide-react';
import clsx from 'clsx';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import AchievementShareModal from '../components/achievements/AchievementShareModal';
import {
    ACHIEVEMENTS,
    ACHIEVEMENT_CATEGORIES,
    LEVEL_SYSTEM,
    getAchievementsByCategory,
    getUnlockedAchievements,
    getFeaturedAchievement,
    getAchievementProgress,
} from '../config/achievements';

/**
 * Achievements Page - Gamification Hub
 */
const Achievements = () => {
    const navigate = useNavigate();
    const { width, height } = useWindowSize();
    const [activeCategory, setActiveCategory] = useState('learning');
    const [showConfetti, setShowConfetti] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    // Handle share button click
    const handleShare = (achievement) => {
        setSelectedAchievement(achievement);
        setShareModalOpen(true);
    };

    // Calculate level progress
    const levelProgress = (LEVEL_SYSTEM.currentXP / LEVEL_SYSTEM.nextLevelXP) * 100;
    const xpToNextLevel = LEVEL_SYSTEM.nextLevelXP - LEVEL_SYSTEM.currentXP;

    // Get filtered achievements
    const filteredAchievements = getAchievementsByCategory(activeCategory);
    const unlockedAchievements = getUnlockedAchievements();
    const featuredAchievement = getFeaturedAchievement();

    // Confetti effect for demo (could be triggered by unlocking)
    useEffect(() => {
        // Auto-show confetti on first load for demo purposes
        const timer = setTimeout(() => {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-8 relative">
            {/* Confetti Effect */}
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.3}
                />
            )}

            {/* Background Gradients */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-yellow-50/30 dark:from-amber-950/10 dark:via-orange-950/5 dark:to-yellow-950/10 pointer-events-none" />
            <div className="fixed top-0 right-1/4 w-96 h-96 bg-amber-300/20 dark:bg-amber-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <span>Achievements</span>
                            <span className="text-4xl">🏆</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Track your progress and unlock rewards
                        </p>
                    </div>
                </div>

                {/* Timeline Toggle */}
                <button
                    onClick={() => setShowTimeline(!showTimeline)}
                    className={clsx(
                        'px-4 py-2 rounded-xl font-semibold text-sm transition-all',
                        showTimeline
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    )}
                >
                    {showTimeline ? '📊 Grid View' : '📅 Timeline View'}
                </button>
            </motion.div>

            {/* Level System Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 dark:from-amber-700 dark:via-orange-800 dark:to-amber-800 rounded-3xl p-8 text-white shadow-2xl overflow-hidden"
            >
                {/* Animated Glow */}
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Level Badge */}
                    <div className="flex items-center gap-6">
                        <motion.div
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="relative"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-2xl shadow-2xl flex flex-col items-center justify-center border-4 border-white/30">
                                <Trophy className="w-10 h-10 text-white mb-1" />
                                <span className="text-sm font-bold">Lv. {LEVEL_SYSTEM.currentLevel}</span>
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Sparkles className="w-5 h-5 text-amber-600" />
                            </div>
                        </motion.div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">Level {LEVEL_SYSTEM.currentLevel} Learner</h2>
                            <p className="text-white/80 mb-3">
                                {xpToNextLevel} XP to level up 🚀
                            </p>

                            {/* XP Progress Bar */}
                            <div className="w-full max-w-md">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="font-semibold">{LEVEL_SYSTEM.currentXP} XP</span>
                                    <span className="font-semibold">{LEVEL_SYSTEM.nextLevelXP} XP</span>
                                </div>
                                <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/30">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${levelProgress}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className="h-full bg-gradient-to-r from-white to-yellow-200 shadow-lg relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Level Preview */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                        <p className="text-xs text-white/70 mb-1">Next Level</p>
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">Level {LEVEL_SYSTEM.currentLevel + 1}</p>
                                <p className="text-xs text-white/80">Unlocks new badge</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Featured Achievement */}
            {featuredAchievement && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 dark:from-purple-800 dark:via-pink-800 dark:to-purple-900 rounded-3xl p-6 overflow-hidden group"
                >
                    {/* Spotlight Glow */}
                    <motion.div
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />

                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/30" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-yellow-400 via-pink-500 to-yellow-400 opacity-30 blur-xl"
                    />

                    <div className="relative z-10 flex items-center gap-6">
                        <div className="text-6xl">{featuredAchievement.icon}</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-yellow-300" />
                                <span className="text-xs font-bold text-yellow-200 uppercase tracking-wider">
                                    Featured Achievement
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                                {featuredAchievement.title}
                            </h3>
                            <p className="text-white/80 mb-3">{featuredAchievement.description}</p>

                            {/* Progress */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                                            style={{ width: `${getAchievementProgress(featuredAchievement)}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-white">
                                    {featuredAchievement.progress}/{featuredAchievement.requirement.count}
                                </span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-white/70 mb-1">Days Left</p>
                            <p className="text-3xl font-bold text-white">3</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {Object.values(ACHIEVEMENT_CATEGORIES).map((category, index) => (
                    <motion.button
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        onClick={() => setActiveCategory(category.id)}
                        className={clsx(
                            'px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap',
                            activeCategory === category.id
                                ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        )}
                    >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                        <span className={clsx(
                            'px-2 py-0.5 rounded-full text-xs font-bold',
                            activeCategory === category.id
                                ? 'bg-white/20'
                                : 'bg-slate-100 dark:bg-slate-700'
                        )}>
                            {getAchievementsByCategory(category.id).filter(a => a.status === 'unlocked').length}
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* Achievement Display */}
            {!showTimeline ? (
                <AchievementGrid achievements={filteredAchievements} onShare={handleShare} />
            ) : (
                <AchievementTimeline achievements={unlockedAchievements} />
            )}

            {/* Share Modal */}
            <AchievementShareModal
                achievement={selectedAchievement}
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                userName="Student"
            />
        </div>
    );
};

/**
 * Achievement Grid View
 */
const AchievementGrid = ({ achievements, onShare }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} delay={index * 0.05} onShare={onShare} />
        ))}
    </div>
);

/**
 * Achievement Card Component
 */
const AchievementCard = ({ achievement, delay, onShare }) => {
    const progress = getAchievementProgress(achievement);
    const isLocked = achievement.status === 'locked';
    const isUnlocked = achievement.status === 'unlocked';
    const inProgress = achievement.status === 'in-progress';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={clsx(
                'relative rounded-2xl p-6 transition-all duration-300 overflow-hidden group',
                isLocked && 'bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700',
                inProgress && 'bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 shadow-lg shadow-amber-100 dark:shadow-amber-900/20',
                isUnlocked && 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-300 dark:border-green-700 shadow-lg'
            )}
        >
            {/* Unlock Glow Effect */}
            {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-500/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}

            {/* Progress Glow */}
            {inProgress && (
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-500/10 to-amber-400/10"
                />
            )}

            <div className="relative z-10">
                {/* Icon and Status */}
                <div className="flex items-start justify-between mb-4">
                    <div className={clsx(
                        'text-5xl transition-all',
                        isLocked && 'grayscale opacity-40',
                        inProgress && 'animate-pulse'
                    )}>
                        {achievement.icon}
                    </div>

                    {isLocked && (
                        <div className="w-8 h-8 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                    )}
                    {isUnlocked && (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                            <Trophy className="w-4 h-4 text-white" />
                        </motion.div>
                    )}
                    {inProgress && (
                        <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    className="text-slate-200 dark:text-slate-700"
                                />
                                <motion.circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray={126}
                                    strokeDashoffset={126 - (126 * progress) / 100}
                                    className="text-amber-500"
                                    initial={{ strokeDashoffset: 126 }}
                                    animate={{ strokeDashoffset: 126 - (126 * progress) / 100 }}
                                    transition={{ duration: 1, delay: delay + 0.3 }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                                    {progress}%
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Title and Description */}
                <h4 className={clsx(
                    'text-lg font-bold mb-2',
                    isLocked && 'text-slate-500 dark:text-slate-500',
                    inProgress && 'text-slate-900 dark:text-white',
                    isUnlocked && 'text-green-900 dark:text-green-100'
                )}>
                    {achievement.title}
                </h4>
                <p className={clsx(
                    'text-sm mb-4',
                    isLocked && 'text-slate-400 dark:text-slate-600',
                    inProgress && 'text-slate-600 dark:text-slate-400',
                    isUnlocked && 'text-green-700 dark:text-green-300'
                )}>
                    {achievement.description}
                </p>

                {/* Progress or Status */}
                {inProgress && (
                    <div className="mb-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                            <span>Almost there!</span>
                            <span>{achievement.progress}/{achievement.requirement.count}</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: delay + 0.5 }}
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
                            />
                        </div>
                    </div>
                )}

                {isUnlocked && achievement.unlockedAt && (
                    <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                    </div>
                )}

                {/* XP Reward */}
                <div className={clsx(
                    'flex items-center gap-2 text-xs font-bold mb-3',
                    isLocked && 'text-slate-400 dark:text-slate-600',
                    inProgress && 'text-purple-600 dark:text-purple-400',
                    isUnlocked && 'text-emerald-600 dark:text-emerald-400'
                )}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{achievement.xpReward} XP</span>
                </div>

                {/* Share Button - Only for unlocked achievements */}
                {isUnlocked && onShare && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onShare(achievement)}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Share2 className="w-4 h-4" />
                        Share Achievement
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

/**
 * Achievement Timeline View
 */
const AchievementTimeline = ({ achievements }) => {
    const sortedAchievements = [...achievements].sort((a, b) =>
        new Date(b.unlockedAt) - new Date(a.unlockedAt)
    );

    return (
        <div className="max-w-3xl mx-auto">
            <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-orange-400 to-transparent dark:from-amber-700 dark:via-orange-800" />

                <div className="space-y-6">
                    {sortedAchievements.map((achievement, index) => (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex gap-6"
                        >
                            {/* Timeline Dot */}
                            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>

                            {/* Content Card */}
                            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{achievement.icon}</span>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {achievement.title}
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Unlocked</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {new Date(achievement.unlockedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>+{achievement.xpReward} XP Earned</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Achievements;
