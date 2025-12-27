import React from 'react';
import { motion } from 'framer-motion';
import UploadZone from '../components/documents/UploadZone';
import DocumentList from '../components/documents/DocumentList';

/**
 * Documents Page
 */
const Documents = () => {
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
                <h3 className="text-xl font-display font-bold text-slate-900 mb-4">
                    Your Documents
                </h3>
                <DocumentList />
            </div>
        </div>
    );
};

export default Documents;
