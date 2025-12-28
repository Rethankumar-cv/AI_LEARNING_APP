/**
 * Analytics Routes
 * Handles user statistics, progress tracking, and activity feed
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Activity = require('../models/Activity');
const QuizResult = require('../models/QuizResult');
const Document = require('../models/Document');
const Flashcard = require('../models/Flashcard');
const { getUserAchievements } = require('../services/achievementService');

/**
 * @route   GET /api/analytics/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            stats: user.stats,
            level: user.level,
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

/**
 * @route   GET /api/analytics/progress
 * @desc    Get weekly learning progress
 * @access  Private
 */
router.get('/progress', protect, async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Get quiz results from last 7 days
        const quizResults = await QuizResult.find({
            userId: req.user.id,
            completedAt: { $gte: sevenDaysAgo },
        }).sort({ completedAt: 1 });

        // Get activities from last 7 days
        const activities = await Activity.find({
            userId: req.user.id,
            timestamp: { $gte: sevenDaysAgo },
        });

        // Group by day
        const progressByDay = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Initialize all days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = days[date.getDay()];
            progressByDay[dayName] = {
                day: dayName,
                value: 0,
                date: date.toISOString().split('T')[0],
            };
        }

        // Count activities per day
        activities.forEach(activity => {
            const dayName = days[new Date(activity.timestamp).getDay()];
            if (progressByDay[dayName]) {
                progressByDay[dayName].value += 1;
            }
        });

        const progressData = Object.values(progressByDay);

        res.json({
            success: true,
            progress: progressData,
            totalActivities: activities.length,
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ error: 'Failed to get progress data' });
    }
});

/**
 * @route   GET /api/analytics/activity
 * @desc    Get recent activity feed
 * @access  Private
 */
router.get('/activity', protect, async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        const activities = await Activity.find({ userId: req.user.id })
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: activities.length,
            activities,
        });
    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({ error: 'Failed to get activity feed' });
    }
});

/**
 * @route   GET /api/analytics/performance
 * @desc    Get performance metrics
 * @access  Private
 */
router.get('/performance', protect, async (req, res) => {
    try {
        // Quiz performance
        const quizResults = await QuizResult.find({ userId: req.user.id });

        const quizStats = {
            totalQuizzes: quizResults.length,
            averageScore: 0,
            bestScore: 0,
        };

        if (quizResults.length > 0) {
            const totalScore = quizResults.reduce((sum, result) => sum + result.score, 0);
            quizStats.averageScore = Math.round(totalScore / quizResults.length);
            quizStats.bestScore = Math.max(...quizResults.map(r => r.score));
        }

        // Flashcard stats
        const totalFlashcards = await Flashcard.countDocuments({ userId: req.user.id });
        const favoriteFlashcards = await Flashcard.countDocuments({
            userId: req.user.id,
            isFavorite: true
        });

        res.json({
            success: true,
            performance: {
                quiz: quizStats,
                flashcards: {
                    total: totalFlashcards,
                    favorites: favoriteFlashcards,
                },
            },
        });
    } catch (error) {
        console.error('Get performance error:', error);
        res.status(500).json({ error: 'Failed to get performance data' });
    }
});

/**
 * @route   GET /api/analytics/achievements
 * @desc    Get user achievements
 * @access  Private
 */
router.get('/achievements', protect, async (req, res) => {
    try {
        const achievements = await getUserAchievements(req.user.id);

        res.json({
            success: true,
            achievements,
        });
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});

module.exports = router;
