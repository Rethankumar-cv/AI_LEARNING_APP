import React from 'react';
import { Search, Filter, SortAsc, X } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Document Search & Filter Component
 * Provides real-time search, file type filtering, and sorting options
 */
const DocumentSearch = ({
    onSearch,
    onFilter,
    onSort,
    searchTerm,
    filterType,
    sortOrder
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 mb-6"
        >
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search documents by title or content..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 bg-slate-200/50 dark:bg-slate-700/50 rounded-full transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
                    {/* Filter Dropdown */}
                    <div className="relative min-w-[140px]">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => onFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none cursor-pointer text-slate-700 dark:text-slate-200 text-sm font-medium"
                        >
                            <option value="">All Types</option>
                            <option value="pdf">PDF Documents</option>
                            <option value="txt">Text Files</option>
                        </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative min-w-[150px]">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <SortAsc className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <select
                            value={sortOrder}
                            onChange={(e) => onSort(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none cursor-pointer text-slate-700 dark:text-slate-200 text-sm font-medium"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="size">Size (Large-Small)</option>
                        </select>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DocumentSearch;
