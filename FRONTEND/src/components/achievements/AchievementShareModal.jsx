import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Twitter, Facebook, Download } from 'lucide-react';
import { generateCaptionOptions, generateShareableText } from '../../utils/captionGenerator';
import html2canvas from 'html2canvas';

/**
 * Achievement Share Modal - Strava-inspired social sharing
 */
const AchievementShareModal = ({ achievement, isOpen, onClose, userName }) => {
    const [captionOptions, setCaptionOptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState('');
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // Generate captions when achievement changes
    React.useEffect(() => {
        if (achievement) {
            const options = generateCaptionOptions(achievement);
            setCaptionOptions(options);
            setSelectedCaption(options[0]);
        }
    }, [achievement]);

    if (!isOpen || !achievement) return null;

    const shareData = generateShareableText(achievement, userName);

    // Copy caption to clipboard
    const copyCaption = () => {
        navigator.clipboard.writeText(`${selectedCaption}\n\n${shareData.hashtags}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Download achievement as image
    const downloadImage = async () => {
        setDownloading(true);
        try {
            const element = document.getElementById('achievement-card');
            const canvas = await html2canvas(element, {
                backgroundColor: null,
                scale: 2,
            });

            const link = document.createElement('a');
            link.download = `${achievement.title.replace(/\s+/g, '_')}_achievement.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setDownloading(false);
        }
    };

    // Share to social platforms
    const shareToTwitter = () => {
        const text = `${selectedCaption}\n\n${shareData.hashtags}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareToFacebook = () => {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(selectedCaption)}`, '_blank');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>

                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
                                Share Your Achievement! 🎉
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Let the world know about your success
                            </p>
                        </div>

                        {/* Achievement Card Preview */}
                        <div
                            id="achievement-card"
                            className="mb-8 p-8 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-2xl text-white text-center relative overflow-hidden"
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10">
                                <div className="text-7xl mb-4">{achievement.icon}</div>
                                <h3 className="text-2xl font-bold mb-2">{achievement.title}</h3>
                                <p className="text-white/80 mb-4">{achievement.description}</p>
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <span className="text-sm font-semibold">Unlocked by {userName}</span>
                                </div>
                                <div className="mt-6 text-sm text-white/60">
                                    StudyHub - Your Learning Companion
                                </div>
                            </div>
                        </div>

                        {/* Caption Selection */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                Choose Your Vibe ✨
                            </h3>
                            <div className="space-y-2">
                                {captionOptions.map((caption, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedCaption(caption)}
                                        className={`w-full p-4 rounded-xl text-left transition-all ${selectedCaption === caption
                                            ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500'
                                            : 'bg-slate-50 dark:bg-slate-700/50 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <p className="text-sm text-slate-900 dark:text-white font-medium">
                                            {caption}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Selected Caption Preview */}
                        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                        Selected Caption:
                                    </p>
                                    <p className="text-slate-900 dark:text-white font-medium mb-2">
                                        {selectedCaption}
                                    </p>
                                    <p className="text-xs text-purple-600 dark:text-purple-400">
                                        {shareData.hashtags}
                                    </p>
                                </div>
                                <button
                                    onClick={copyCaption}
                                    className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors"
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-slate-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Share Buttons */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={shareToTwitter}
                                className="flex items-center justify-center gap-2 p-4 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-xl font-semibold transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                                Share on Twitter
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={shareToFacebook}
                                className="flex items-center justify-center gap-2 p-4 bg-[#4267B2] hover:bg-[#365899] text-white rounded-xl font-semibold transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                                Share on Facebook
                            </motion.button>
                        </div>

                        {/* Download Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={downloadImage}
                            disabled={downloading}
                            className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                        >
                            <Download className="w-5 h-5" />
                            {downloading ? 'Downloading...' : 'Download as Image'}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AchievementShareModal;
