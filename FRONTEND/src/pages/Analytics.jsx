import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Lock } from 'lucide-react';
import mockApi from '../services/mockApi';
import Card from '../components/common/Card';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import clsx from 'clsx';
import { formatDate } from '../utils/helpers';

/**
 * Analytics Page
 */
const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await mockApi.getAnalytics();
            setAnalytics(data);
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

            {/* Performance Chart */}
            <Card>
                <h3 className="text-lg font-display font-bold text-slate-900 mb-4">
                    Weekly Study Hours
                </h3>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics?.weeklyProgress || []}>
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
                                dataKey="hours"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ fill: '#8b5cf6', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Achievement Badges */}
            <div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-4">
                    Achievements 🏆
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analytics?.achievements.map((achievement, index) => (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={clsx(
                                'bg-white/70 backdrop-blur-md border border-white/20 shadow-glass rounded-2xl p-6 text-center',
                                achievement.unlocked
                                    ? 'hover:shadow-glass-lg transition-all duration-300'
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
                            <h4 className="font-display font-bold text-slate-900 mb-1">
                                {achievement.title}
                            </h4>

                            {/* Description */}
                            <p className="text-sm text-slate-600 mb-3">
                                {achievement.description}
                            </p>

                            {/* Status */}
                            {achievement.unlocked ? (
                                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                    <Trophy className="w-3 h-3" />
                                    <span>Unlocked {formatDate(achievement.unlockedAt)}</span>
                                </div>
                            ) : achievement.progress !== undefined ? (
                                <div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-1">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-600 to-primary-700"
                                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        {achievement.progress} / {achievement.target}
                                    </p>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                                    <Lock className="w-3 h-3" />
                                    <span>Locked</span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
