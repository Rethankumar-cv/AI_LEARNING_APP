import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

/**
 * Enhanced Learning Progress Chart with Insights
 */
const LearningChart = ({ data }) => {
    // Find highest data point for insight
    const maxHours = Math.max(...(data?.map(d => d.hours) || [0]));
    const maxDay = data?.find(d => d.hours === maxHours)?.day || '';

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-800 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700"
                >
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        {payload[0].payload.day}
                    </p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {payload[0].value} hours
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Study time
                    </p>
                </motion.div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                    Weekly Learning Progress
                </h3>
                <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    On track
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="50%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="currentColor"
                            className="text-slate-200 dark:text-slate-700"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="day"
                            stroke="currentColor"
                            className="text-slate-600 dark:text-slate-400"
                            style={{ fontSize: '12px', fontWeight: 500 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="currentColor"
                            className="text-slate-600 dark:text-slate-400"
                            style={{ fontSize: '12px', fontWeight: 500 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5 5' }} />
                        <Area
                            type="monotone"
                            dataKey="hours"
                            stroke="url(#strokeGradient)"
                            strokeWidth={3}
                            fill="url(#colorHours)"
                            animationDuration={1500}
                            animationBegin={200}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Insight Text */}
            {maxDay && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 rounded-xl"
                >
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                        <span className="text-lg">📊</span>
                        <span>You learn best on {maxDay}s - keep it up!</span>
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default LearningChart;
