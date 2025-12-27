import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Glassmorphic Card component
 */
const Card = ({
    children,
    className = '',
    hover = false,
    onClick,
    ...props
}) => {
    const Component = onClick ? motion.div : motion.div;

    return (
        <Component
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={hover ? { scale: 1.02, transition: { duration: 0.3 } } : {}}
            onClick={onClick}
            className={clsx(
                'bg-white/70 backdrop-blur-md border border-white/20 shadow-glass rounded-2xl p-6',
                'transition-all duration-300',
                hover && 'cursor-pointer hover:shadow-glass-lg',
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Card;
