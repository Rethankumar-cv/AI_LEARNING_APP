import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Layers,
    Brain,
    BarChart3
} from 'lucide-react';
import clsx from 'clsx';

/**
 * Mobile Bottom Navigation
 */
const BottomNav = () => {
    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
        { path: '/documents', icon: FileText, label: 'Docs' },
        { path: '/flashcards', icon: Layers, label: 'Cards' },
        { path: '/quiz', icon: Brain, label: 'Quiz' },
        { path: '/analytics', icon: BarChart3, label: 'Stats' },
    ];

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 safe-bottom"
        >
            <div className="flex items-center justify-around px-2 py-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 min-w-[60px]',
                                isActive
                                    ? 'text-primary-600'
                                    : 'text-slate-400'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={clsx(
                                    'relative',
                                    isActive && 'scale-110'
                                )}>
                                    <item.icon className="w-6 h-6" />
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobileActiveTab"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"
                                        />
                                    )}
                                </div>
                                <span className={clsx(
                                    'text-xs font-medium',
                                    isActive && 'font-semibold'
                                )}>
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </motion.nav>
    );
};

export default BottomNav;
