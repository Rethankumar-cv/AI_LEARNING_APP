/**
 * Streak Utility Service
 * Handles daily streak calculation and updates
 */

/**
 * Update user's study streak based on last study date
 * Call this whenever a user performs any learning activity (document upload, quiz, flashcard)
 */
async function updateStreak(user) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day

    const lastStudy = user.stats.lastStudyDate ? new Date(user.stats.lastStudyDate) : null;

    if (!lastStudy) {
        // First time studying
        user.stats.studyStreak = 1;
        user.stats.lastStudyDate = today;
        await user.save();
        console.log(`🔥 Streak started for user ${user._id}: Day 1`);
        return { streakIncreased: true, currentStreak: 1 };
    }

    lastStudy.setHours(0, 0, 0, 0); // Reset to start of day

    const daysDifference = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
        // Already studied today, no change
        return { streakIncreased: false, currentStreak: user.stats.studyStreak };
    } else if (daysDifference === 1) {
        // Consecutive day - increase streak
        user.stats.studyStreak += 1;
        user.stats.lastStudyDate = today;
        await user.save();
        console.log(`🔥 Streak increased for user ${user._id}: Day ${user.stats.studyStreak}`);
        return { streakIncreased: true, currentStreak: user.stats.studyStreak };
    } else {
        // Streak broken - reset to 1
        const oldStreak = user.stats.studyStreak;
        user.stats.studyStreak = 1;
        user.stats.lastStudyDate = today;
        await user.save();
        console.log(`💔 Streak broken for user ${user._id}: ${oldStreak} → 1`);
        return { streakIncreased: false, currentStreak: 1, streakBroken: true, oldStreak };
    }
}

/**
 * Check if streak should be reset (run this daily via cron job)
 * This resets streaks for users who haven't studied in 2+ days
 */
async function checkExpiredStreaks() {
    const User = require('../models/User');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Find users with lastStudyDate older than 2 days ago and streak > 0
    const expiredUsers = await User.find({
        'stats.lastStudyDate': { $lt: twoDaysAgo },
        'stats.studyStreak': { $gt: 0 },
    });

    let resetCount = 0;
    for (const user of expiredUsers) {
        const oldStreak = user.stats.studyStreak;
        user.stats.studyStreak = 0;
        await user.save();
        console.log(`💔 Expired streak reset for user ${user._id}: ${oldStreak} → 0`);
        resetCount++;
    }

    if (resetCount > 0) {
        console.log(`✅ Reset ${resetCount} expired streaks`);
    }

    return resetCount;
}

module.exports = {
    updateStreak,
    checkExpiredStreaks,
};
