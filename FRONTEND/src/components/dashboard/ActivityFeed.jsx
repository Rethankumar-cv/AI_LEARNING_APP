import React from 'react';
import { motion } from 'framer-motion';
import { formatRelativeTime } from '../../utils/helpers';
import { FileText, CheckCircle, Layers, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

/**
 * Enhanced Recent Activity Feed with Timeline Style
 */
const ActivityFeed = ({ activities }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'document':
                return FileText;
            case 'quiz':
                return CheckCircle;
            case 'flashcard':
                return Layers;
            default:
                return FileText;
        }
    };

    const getIconColor = (color) => {
        const colors = {
            blue: 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30',
            green: 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/30',
            purple: 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30',
            orange: 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30',
        };
        return colors[color] || colors.blue;
    };

    // Group activities (mock grouping for visual effect)
    const groupActivities = (activities) => {
        const today = activities.slice(0, 2);
        const yesterday = activities.slice(2, 4);
        const earlier = activities.slice(4);

        const groups = [];
        if (today.length) groups.push({ label: 'Today', items: today });
        if (yesterday.length) groups.push({ label: 'Yesterday', items: yesterday });
        if (earlier.length) groups.push({ label: 'Earlier', items: earlier });

        return groups;
    };

    const groups = groupActivities(activities);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Recent Activity
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full">
                        Live
                    </span>
                </h3>
            </div>

            <div className="space-y-6">
                {groups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        {/* Group Label */}
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                            {group.label}
                        </p>

                        {/* Timeline Items */}
                        <div className="space-y-0 relative">
                            {/* Vertical Timeline Connector */}
                            <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-purple-200 via-pink-200 to-transparent dark:from-purple-800 dark:via-pink-900 dark:to-transparent" />

                            {group.items.map((activity, index) => {
                                const Icon = getIcon(activity.type);
                                const isLast = index === group.items.length - 1;

                                return (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + (groupIndex * 0.2) + (index * 0.1), duration: 0.3 }}
                                        className="relative flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group"
                                    >
                                        {/* Timeline Icon */}
                                        <div className={clsx(
                                            'relative z-10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg',
                                            getIconColor(activity.color)
                                        )}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 mt-0.5">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                {activity.title}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
                                                {formatRelativeTime(activity.timestamp)}
                                            </p>
                                        </div>

                                        {/* Hover Arrow */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -5 }}
                                            whileHover={{ opacity: 1, x: 0 }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Activity Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
                View all activity
                <ArrowRight className="w-4 h-4" />
            </motion.button>
        </motion.div>
    );
};

export default ActivityFeed;
