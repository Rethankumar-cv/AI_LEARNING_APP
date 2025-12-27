import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, Lightbulb } from 'lucide-react';
import ChatUI from '../chat/ChatUI';
import SummaryGenerator from '../chat/SummaryGenerator';
import clsx from 'clsx';

/**
 * AI Action Panel with Tabs
 */
const AIActionPanel = ({ documentId }) => {
    const [activeTab, setActiveTab] = useState('chat');

    const tabs = [
        { id: 'chat', label: 'Chat', icon: MessageSquare },
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'explain', label: 'Explain', icon: Lightbulb },
    ];

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-slate-200 bg-slate-50">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                'flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium text-sm transition-all relative',
                                activeTab === tab.id
                                    ? 'text-primary-600'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>

                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'chat' && <ChatUI documentId={documentId} />}
                {activeTab === 'summary' && <SummaryGenerator documentId={documentId} />}
                {activeTab === 'explain' && (
                    <div className="h-full flex items-center justify-center p-6 text-center">
                        <div>
                            <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 text-sm">
                                Select text in the PDF to get AI explanations
                            </p>
                            <p className="text-slate-400 text-xs mt-2">
                                Coming soon: Highlight any concept for instant explanations
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIActionPanel;
