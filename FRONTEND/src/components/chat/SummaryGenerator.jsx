import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, CheckCircle } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import Button from '../common/Button';
import { ParagraphSkeleton } from '../common/LoadingSkeleton';

/**
 * AI Summary Generator Component
 */
const SummaryGenerator = ({ document }) => {
    const { summary: contextSummary, loading, generateSummary } = useAI();
    const [copied, setCopied] = useState(false);

    // Use context summary (if just generated) or document summary (from DB)
    const activeSummary = contextSummary || document?.summary;

    // Check if we have a valid summary to display
    // It should have sections (if structured) or at least be a non-empty string/object
    const hasSummary = activeSummary && (
        (typeof activeSummary === 'object' && (activeSummary.sections || activeSummary.title)) ||
        (typeof activeSummary === 'string' && activeSummary.length > 0)
    );

    const handleGenerate = async () => {
        try {
            await generateSummary(document.id);
        } catch (error) {
            console.error('Error generating summary:', error);
        }
    };

    const handleCopy = () => {
        if (!displaySummary) return;

        // Convert summary to plain text
        let text = `${displaySummary.title}\n\n`;
        displaySummary.sections.forEach(section => {
            text += `${section.heading}\n`;
            section.points.forEach(point => {
                text += `• ${point}\n`;
            });
            text += '\n';
        });
        if (displaySummary.keywords?.length) {
            text += `Keywords: ${displaySummary.keywords.join(', ')}`;
        }

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Normalize summary for display
    const displaySummary = React.useMemo(() => {
        if (!activeSummary) return null;
        if (typeof activeSummary === 'string') {
            return {
                title: 'Document Summary',
                sections: [
                    { heading: 'Summary', points: [activeSummary] }
                ],
                keywords: []
            };
        }
        return activeSummary;
    }, [activeSummary]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
                {!displaySummary && !loading ? (
                    // Empty State
                    <div className="h-full flex items-center justify-center text-center">
                        <div>
                            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 text-sm mb-4">
                                Generate an AI-powered summary of this document
                            </p>
                            <Button variant="primary" onClick={handleGenerate}>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Generate Summary
                            </Button>
                        </div>
                    </div>
                ) : loading ? (
                    // Loading State
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
                            <ParagraphSkeleton lines={3} />
                        </div>
                        <div className="space-y-2">
                            <div className="h-6 w-2/3 bg-slate-200 rounded animate-pulse" />
                            <ParagraphSkeleton lines={4} />
                        </div>
                    </div>
                ) : (
                    // Summary Content
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Title */}
                        <div className="flex items-start justify-between">
                            <h3 className="text-2xl font-display font-bold text-slate-900">
                                {displaySummary.title || 'Document Summary'}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                icon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </div>

                        {/* Sections */}
                        {displaySummary.sections?.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="space-y-2"
                            >
                                <h4 className="text-lg font-display font-semibold text-primary-600">
                                    {section.heading}
                                </h4>
                                <ul className="space-y-2">
                                    {section.points.map((point, pointIndex) => (
                                        <li key={pointIndex} className="flex gap-2">
                                            <span className="text-primary-600 font-bold mt-1">•</span>
                                            <span className="text-slate-700 flex-1">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}

                        {/* Keywords */}
                        {displaySummary.keywords?.length > 0 && (
                            <div className="pt-4 border-t border-slate-200">
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                    Key Topics
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {displaySummary.keywords.map((keyword, index) => (
                                        <motion.span
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + index * 0.05 }}
                                            className="px-3 py-1 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 rounded-full text-sm font-medium"
                                        >
                                            {keyword}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Regenerate Button */}
                        <div className="pt-4">
                            <Button variant="secondary" onClick={handleGenerate} size="sm">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Regenerate
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SummaryGenerator;
