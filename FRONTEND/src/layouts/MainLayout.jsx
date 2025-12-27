import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import BottomNav from '../components/common/BottomNav';
import TopHeader from '../components/common/TopHeader';
import { motion } from 'framer-motion';

/**
 * Main Layout with sidebar and header
 */
const MainLayout = () => {
    const location = useLocation();

    // Get page title from current route
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard';
        if (path.startsWith('/documents')) return 'Documents';
        if (path.startsWith('/flashcards')) return 'Flashcards';
        if (path.startsWith('/quiz')) return 'Quiz';
        if (path.startsWith('/analytics')) return 'Analytics';
        if (path.startsWith('/profile')) return 'Profile';
        return 'AI Learning Assistant';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
                {/* Header */}
                <TopHeader title={getPageTitle()} />

                {/* Content Area */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default MainLayout;
