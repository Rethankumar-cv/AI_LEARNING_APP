import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Trophy } from 'lucide-react';
import CountUp from 'react-countup';

/**
 * Enhanced Hero Section with animated greeting and level display
 */
const DashboardHero = ({ user, stats }) => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const levelProgress = stats?.level
        ? (stats.level.currentXP / stats.level.xpToNextLevel) * 100
        : 0;

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 md:p-12 shadow-2xl mb-8">
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Greeting */}
                    <div className="flex items-center gap-3 mb-2">
                        <motion.div
                            animate={{
                                rotate: [0, 10, 0, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                        >
                            <Sparkles className="w-6 h-6 text-yellow-300" />
                        </motion.div>
                        <span className="text-white/80 text-lg font-medium">
                            {greeting}
                        </span>
                    </div>

                    {/* User Name */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {user?.name || 'Student'}! 👋
                    </h1>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {/* Current Level */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-yellow-300" />
                                </div>
                                <div>
                                    <p className="text-white/70 text-sm">Current Level</p>
                                    <p className="text-2xl font-bold text-white">
                                        {stats?.level?.currentLevel || 1}
                                    </p>
                                </div>
                            </div>
                            {/* Level Progress Bar */}
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-white/60 mb-1">
                                    <span>{stats?.level?.currentXP || 0} XP</span>
                                    <span>{stats?.level?.xpToNextLevel || 100} XP</span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${levelProgress}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Total XP */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-400/20 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-purple-300" />
                                </div>
                                <div>
                                    <p className="text-white/70 text-sm">Total XP</p>
                                    <p className="text-2xl font-bold text-white">
                                        <CountUp
                                            end={stats?.level?.totalXP || 0}
                                            duration={2}
                                            separator=","
                                        />
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Study Streak */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
                        >
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                    }}
                                    className="w-10 h-10 rounded-lg bg-orange-400/20 flex items-center justify-center"
                                >
                                    <span className="text-2xl">🔥</span>
                                </motion.div>
                                <div>
                                    <p className="text-white/70 text-sm">Study Streak</p>
                                    <p className="text-2xl font-bold text-white">
                                        <CountUp
                                            end={stats?.stats?.studyStreak || 0}
                                            duration={2}
                                        />
                                        <span className="text-lg ml-1">days</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardHero;
