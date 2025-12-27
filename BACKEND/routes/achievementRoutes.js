/**
 * Achievement Routes
 * Handles achievement tracking, progress, and unlocking
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Activity = require('../models/Activity');
// Achievement definitions can be imported from frontend or defined here
// For now, we'll handle initialization on first request

/**
 * @route   GET /api/achievements
 * @desc    Get all user achievements with progress
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const userAchievements = await Achievement.find({ userId: req.user.id });

        // If no achievements exist, initialize them from config
        if (userAchievements.length === 0) {
            const initialAchievements = ACHIEVEMENTS.map(ach => ({
                userId: req.user.id,
                achievementId: ach.id,
                category: ach.category,
                title: ach.title,
                description: ach.description,
                icon: ach.icon,
                xpReward: ach.xpReward,
                status: 'locked',
                progress: 0,
                requirement: ach.requirement,
            }));

            const created = await Achievement.insertMany(initialAchievements);
            return res.json({
                success: true,
                achievements: created,
            });
        }

        res.json({
            success: true,
            achievements: userAchievements,
        });
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ error: 'Failed to get achievements' });
    }
});

/**
 * @route   GET /api/achievements/unlocked
 * @desc    Get only unlocked achievements
 * @access  Private
 */
router.get('/unlocked', protect, async (req, res) => {
    try {
        const achievements = await Achievement.find({
            userId: req.user.id,
            status: 'unlocked',
        }).sort({ unlockedAt: -1 });

        res.json({
            success: true,
            count: achievements.length,
            achievements,
        });
    } catch (error) {
        console.error('Get unlocked achievements error:', error);
        res.status(500).json({ error: 'Failed to get unlocked achievements' });
    }
});

/**
 * @route   POST /api/achievements/check
 * @desc    Check and unlock achievements based on user progress
 * @access  Private
 */
router.post('/check', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const achievements = await Achievement.find({
            userId: req.user.id,
            status: { $in: ['locked', 'in-progress'] },
        });

        const unlocked = [];

        for (const achievement of achievements) {
            let progress = 0;
            let shouldUnlock = false;

            // Calculate progress based on requirement type
            if (achievement.requirement.type === 'documents') {
                progress = (user.stats.totalDocuments / achievement.requirement.count) * 100;
                shouldUnlock = user.stats.totalDocuments >= achievement.requirement.count;
            } else if (achievement.requirement.type === 'flashcards') {
                progress = (user.stats.totalFlashcards / achievement.requirement.count) * 100;
                shouldUnlock = user.stats.totalFlashcards >= achievement.requirement.count;
            } else if (achievement.requirement.type === 'quizzes') {
                progress = (user.stats.totalQuizzes / achievement.requirement.count) * 100;
                shouldUnlock = user.stats.totalQuizzes >= achievement.requirement.count;
            } else if (achievement.requirement.type === 'streak') {
                progress = (user.stats.studyStreak / achievement.requirement.count) * 100;
                shouldUnlock = user.stats.studyStreak >= achievement.requirement.count;
            }

            // Update progress
            achievement.progress = Math.min(Math.round(progress), 100);

            // Determine status
            if (shouldUnlock && achievement.status !== 'unlocked') {
                achievement.status = 'unlocked';
                achievement.unlockedAt = Date.now();

                // Award XP
                user.level.totalXP += achievement.xpReward;
                user.level.currentXP += achievement.xpReward;

                // Level up logic
                while (user.level.currentXP >= user.level.nextLevelXP) {
                    user.level.currentXP -= user.level.nextLevelXP;
                    user.level.currentLevel += 1;
                    user.level.nextLevelXP = Math.floor(user.level.nextLevelXP * 1.5);
                }

                unlocked.push(achievement);

                // Create activity
                await Activity.create({
                    userId: req.user.id,
                    type: 'achievement',
                    title: 'Achievement unlocked!',
                    description: achievement.title,
                    metadata: { achievementId: achievement.achievementId, xpReward: achievement.xpReward },
                });
            } else if (progress > 0 && achievement.status === 'locked') {
                achievement.status = 'in-progress';
            }

            await achievement.save();
        }

        if (unlocked.length > 0) {
            await user.save();
        }

        res.json({
            success: true,
            unlocked: unlocked.map(a => ({
                title: a.title,
                xpReward: a.xpReward,
            })),
            newLevel: user.level.currentLevel,
            totalXP: user.level.totalXP,
        });
    } catch (error) {
        console.error('Check achievements error:', error);
        res.status(500).json({ error: 'Failed to check achievements' });
    }
});

module.exports = router;
