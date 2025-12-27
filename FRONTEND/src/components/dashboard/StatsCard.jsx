import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

/**
 * Enhanced Animated Stat Card with Premium Aesthetics
 */
const StatsCard = ({ title, value, icon: Icon, trend, color, delay = 0 }) => {
    const [count, setCount] = React.useState(0);

    // Animate number counting on mount
    React.useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;

        let timer = setInterval(() => {
            start += Math.ceil(end / 20);
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 50);

        return () => clearInterval(timer);
    }, [value]);

    const colorClasses = {
        blue: {
            gradient: 'from-blue-500 to-blue-600',
            glow: 'group-hover:shadow-blue-500/50',
            bg: 'bg-blue-50 dark:bg-blue-950/20',
        },
        purple: {
            gradient: 'from-purple-500 to-purple-600',
            glow: 'group-hover:shadow-purple-500/50',
            bg: 'bg-purple-50 dark:bg-purple-950/20',
        },
        emerald: {
            gradient: 'from-emerald-500 to-emerald-600',
            glow: 'group-hover:shadow-emerald-500/50',
            bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        },
        orange: {
            gradient: 'from-orange-500 to-orange-600',
            glow: 'group-hover:shadow-orange-500/50',
            bg: 'bg-orange-50 dark:bg-orange-950/20',
        },
    };

    const colorConfig = colorClasses[color] || colorClasses.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl rounded-2xl p-6 transition-all duration-300 overflow-hidden"
        >
            {/* Subtle Background Pattern */}
            <div className={clsx(
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                colorConfig.bg
            )} />

            {/* Glow Effect on Hover */}
            <div className={clsx(
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl -z-10',
                colorConfig.glow
            )} />

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{title}</p>

                    {/* Animated Counter */}
                    <motion.h3
                        key={count}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-3"
                    >
                        {count}
                    </motion.h3>

                    {/* Trend Indicator */}
                    {trend && (
                        <div className="flex items-center gap-1.5">
                            {trend > 0 ? (
                                <>
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                        +{trend}%
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                        <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                        {trend}%
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Micro-label */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Last 7 days
                    </p>
                </div>

                {/* Enhanced Icon with Gradient and Glow */}
                <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className={clsx(
                        'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg',
                        colorConfig.gradient,
                        colorConfig.glow
                    )}
                >
                    <Icon className="w-7 h-7 text-white" />
                </motion.div>
            </div>

            {/* Tiny Progress Ring (Visual Only) */}
            <div className="mt-4 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count % 100)}%` }}
                    transition={{ delay: delay + 0.5, duration: 0.8 }}
                    className={clsx('h-full bg-gradient-to-r rounded-full', colorConfig.gradient)}
                />
            </div>
        </motion.div>
    );
};

export default StatsCard;
