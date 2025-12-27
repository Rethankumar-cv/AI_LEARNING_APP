import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Reusable Button component with variants and polymorphic rendering
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    icon = null,
    onClick,
    className = '',
    as,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:ring-primary-200',
        secondary: 'bg-white text-primary-600 border-2 border-primary-200 hover:bg-primary-50 hover:scale-105 active:scale-95 focus:ring-primary-100',
        ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-100',
        danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:ring-red-200',
        success: 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:ring-green-200',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    // If 'as' prop is provided, don't use motion and use the specified element
    if (as) {
        const Component = as;
        return (
            <Component
                className={clsx(baseStyles, variants[variant], sizes[size], className, 'cursor-pointer')}
                {...props}
            >
                {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {icon && !loading && <span className="mr-2">{icon}</span>}
                {children}
            </Component>
        );
    }

    return (
        <motion.button
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={clsx(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {icon && !loading && <span className="mr-2">{icon}</span>}
            {children}
        </motion.button>
    );
};

export default Button;

