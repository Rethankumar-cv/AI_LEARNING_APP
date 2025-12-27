import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Download, Copy, CheckCircle, Eye, EyeOff } from 'lucide-react';
import html2canvas from 'html2canvas';

/**
 * Strava-Style Achievement Share Modal
 */
const AchievementShareModal = ({ achievement, isOpen, onClose, userName = "Student" }) => {
    const [caption, setCaption] = useState('');
    const [showName, setShowName] = useState(true);
    const [showDate, setShowDate] = useState(true);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const cardRef = useRef(null);

    // Generate caption on mount or achievement change
    useEffect(() => {
        if (achievement) {
            setCaption(generateCaption(achievement));
        }
    }, [achievement]);

    if (!isOpen || !achievement) return null;

    // Auto-generate captions based on achievement
    const generateCaption = (achievement) => {
        const templates = [
            `Just unlocked 🏆 ${achievement.title} on AI Learning Assistant! 🚀`,
            `Consistency pays off ${achievement.icon} ${achievement.title} achieved!`,
            `Learning one step at a time 📚 Proud of this milestone: ${achievement.title}!`,
            `Another achievement unlocked ${achievement.icon} ${achievement.title}. Keep growing! 💪`,
            `${achievement.icon} ${achievement.title} - Progress feels good! #Learning #Growth`,
        ];

        // Pick template based on category
        const categoryIndex = ['learning', 'consistency', 'mastery', 'milestones'].indexOf(achievement.category);
        return templates[categoryIndex >= 0 ? categoryIndex : 0];
    };

    // Download achievement card as image
    const handleDownload = async () => {
        if (!cardRef.current) return;

        setDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
                logging: false,
            });

            const link = document.createElement('a');
            link.download = `achievement-${achievement.id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error generating image:', error);
        } finally {
            setDownloading(false);
        }
    };

    // Copy caption to clipboard
    const handleCopyCaption = () => {
        navigator.clipboard.writeText(caption);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Share to LinkedIn
    const handleShareLinkedIn = () => {
        const text = encodeURIComponent(caption);
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    // Share to Twitter/X
    const handleShareTwitter = () => {
        const text = encodeURIComponent(caption);
        const url = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>

                        <div className="p-8">
                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-2">
                                    <Share2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    Share Your Achievement
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Celebrate your progress and inspire others!
                                </p>
                            </div>

                            {/* Share Card Preview */}
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                    Preview
                                </p>
                                <div className="flex justify-center">
                                    <ShareCard
                                        ref={cardRef}
                                        achievement={achievement}
                                        userName={showName ? userName : null}
                                        showDate={showDate}
                                    />
                                </div>
                            </div>

                            {/* Privacy Controls */}
                            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                    Privacy Settings
                                </p>
                                <div className="flex flex-col gap-3">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Show my name</span>
                                        <button
                                            onClick={() => setShowName(!showName)}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${showName
                                                    ? 'bg-purple-600'
                                                    : 'bg-slate-300 dark:bg-slate-600'
                                                }`}
                                        >
                                            <motion.div
                                                animate={{ x: showName ? 24 : 2 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                                            />
                                        </button>
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Show achievement date</span>
                                        <button
                                            onClick={() => setShowDate(!showDate)}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${showDate
                                                    ? 'bg-purple-600'
                                                    : 'bg-slate-300 dark:bg-slate-600'
                                                }`}
                                        >
                                            <motion.div
                                                animate={{ x: showDate ? 24 : 2 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                                            />
                                        </button>
                                    </label>
                                </div>
                            </div>

                            {/* Caption Editor */}
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                    Caption
                                </label>
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    rows={3}
                                    placeholder="Write your caption..."
                                />
                            </div>

                            {/* Share Actions */}
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleShareLinkedIn}
                                        className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                        LinkedIn
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleShareTwitter}
                                        className="px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                        Twitter/X
                                    </motion.button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDownload}
                                        disabled={downloading}
                                        className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Download className="w-5 h-5" />
                                        {downloading ? 'Generating...' : 'Download Image'}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCopyCaption}
                                        className="px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-5 h-5" />
                                                Copy Caption
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Helper Text */}
                            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                                💡 Download the image to share on Instagram, WhatsApp, or anywhere else!
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

/**
 * Shareable Achievement Card Component
 */
const ShareCard = React.forwardRef(({ achievement, userName, showDate }, ref) => {
    const categoryColors = {
        learning: 'from-blue-500 to-indigo-600',
        consistency: 'from-orange-500 to-red-600',
        mastery: 'from-purple-500 to-pink-600',
        milestones: 'from-emerald-500 to-teal-600',
    };

    const gradientClass = categoryColors[achievement.category] || categoryColors.learning;

    return (
        <div
            ref={ref}
            className="w-[600px] h-[600px] relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ backgroundColor: '#ffffff' }}
        >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between p-12 text-white">
                {/* Header */}
                <div className="text-center">
                    <div className="text-6xl mb-4">{achievement.icon}</div>
                    <h2 className="text-4xl font-bold mb-3">{achievement.title}</h2>
                    <p className="text-xl opacity-90 leading-relaxed max-w-md">
                        {achievement.description}
                    </p>
                </div>

                {/* User Info */}
                <div className="text-center">
                    {userName && (
                        <p className="text-2xl font-semibold mb-2">{userName}</p>
                    )}
                    {showDate && achievement.unlockedAt && (
                        <p className="text-lg opacity-80">
                            Achieved on {new Date(achievement.unlockedAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center">
                    <div className="text-sm opacity-70 mb-2">Powered by</div>
                    <div className="text-2xl font-bold">AI Learning Assistant</div>
                </div>
            </div>
        </div>
    );
});

ShareCard.displayName = 'ShareCard';

export default AchievementShareModal;
