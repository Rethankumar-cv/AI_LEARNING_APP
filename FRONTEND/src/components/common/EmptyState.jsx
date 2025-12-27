import React from 'react';
import { motion } from 'framer-motion';

/**
 * Empty State component
 */
const EmptyState = ({
    icon,
    title,
    description,
    action
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
        >
            {icon && (
                <div className="text-7xl mb-6 animate-bounce-in">
                    {icon}
                </div>
            )}

            <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                {title}
            </h3>

            {description && (
                <p className="text-slate-600 mb-6 max-w-md text-lg">
                    {description}
                </p>
            )}

            {action && action}
        </motion.div>
    );
};

export default EmptyState;
