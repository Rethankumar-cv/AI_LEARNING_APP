import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UploadZone from '../components/documents/UploadZone';
import DocumentList from '../components/documents/DocumentList';
import DocumentSearch from '../components/documents/DocumentSearch';
import { useDocuments } from '../context/DocumentContext';

/**
 * Documents Page
 */
const Documents = () => {
    const { fetchDocuments } = useDocuments();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filterType) params.append('type', filterType);
            if (sortOrder) params.append('sort', sortOrder);

            const queryString = params.toString() ? `?${params.toString()}` : '';
            fetchDocuments(queryString);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, filterType, sortOrder]);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <h2 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
                        <span>Document Library</span>
                        <span className="text-4xl">📚</span>
                    </h2>
                    <p className="text-white/90 text-lg">
                        Upload and manage your learning documents with AI-powered insights ✨
                    </p>
                </div>
            </motion.div>

            {/* Upload Zone */}
            <UploadZone />

            {/* Document List */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                        Your Documents
                    </h3>
                </div>

                <DocumentSearch
                    searchTerm={searchTerm}
                    onSearch={setSearchTerm}
                    filterType={filterType}
                    onFilter={setFilterType}
                    sortOrder={sortOrder}
                    onSort={setSortOrder}
                />

                <DocumentList />
            </div>
        </div>
    );
};

export default Documents;
