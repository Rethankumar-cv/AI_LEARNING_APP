/**
 * Achievement Service
 * Defines achievement criteria and checks user progress
 */

const Achievement = require('../models/Achievement');

// Achievement definitions
const ACHIEVEMENTS = {
    // Document achievements
    FIRST_DOCUMENT: {
        id: 'first_document',
        title: 'First Steps',
        description: 'Upload your first document',
        icon: '📄',
        category: 'document',
        target: 1,
        check: (user) => user.stats.totalDocuments >= 1,
    },
    DOCUMENT_COLLECTOR: {
        id: 'document_collector',
        title: 'Document Collector',
        description: 'Upload 10 documents',
        icon: '📚',
        category: 'document',
        target: 10,
        check: (user) => user.stats.totalDocuments >= 10,
    },
    LIBRARY_MASTER: {
        id: 'library_master',
        title: 'Library Master',
        description: 'Upload 50 documents',
        icon: '🏛️',
        category: 'document',
        target: 50,
        check: (user) => user.stats.totalDocuments >= 50,
    },

    // Quiz achievements
    FIRST_QUIZ: {
        id: 'first_quiz',
        title: 'Quiz Taker',
        description: 'Complete your first quiz',
        icon: '🧠',
        category: 'quiz',
        target: 1,
        check: (user) => user.stats.totalQuizzes >= 1,
    },
    QUIZ_ENTHUSIAST: {
        id: 'quiz_enthusiast',
        title: 'Quiz Enthusiast',
        description: 'Complete 10 quizzes',
        icon: '🎯',
        category: 'quiz',
        target: 10,
        check: (user) => user.stats.totalQuizzes >= 10,
    },
    QUIZ_MASTER: {
        id: 'quiz_master',
        title: 'Quiz Master',
        description: 'Complete 50 quizzes',
        icon: '🏆',
        category: 'quiz',
        target: 50,
        check: (user) => user.stats.totalQuizzes >= 50,
    },

    // Flashcard achievements
    FIRST_FLASHCARDS: {
        id: 'first_flashcards',
        title: 'Card Collector',
        description: 'Create your first flashcards',
        icon: '⚡',
        category: 'flashcard',
        target: 1,
        check: (user) => user.stats.totalFlashcards >= 1,
    },
    FLASHCARD_FAN: {
        id: 'flashcard_fan',
        title: 'Flashcard Fan',
        description: 'Create 100 flashcards',
        icon: '🎴',
        category: 'flashcard',
        target: 100,
        check: (user) => user.stats.totalFlashcards >= 100,
    },
    MEMORY_CHAMPION: {
        id: 'memory_champion',
        title: 'Memory Champion',
        description: 'Create 500 flashcards',
        icon: '🧩',
        category: 'flashcard',
        target: 500,
        check: (user) => user.stats.totalFlashcards >= 500,
    },

    // Streak achievements
    WEEK_WARRIOR: {
        id: 'week_warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day study streak',
        icon: '🔥',
        category: 'streak',
        target: 7,
        check: (user) => user.stats.studyStreak >= 7,
    },
    MONTH_MASTER: {
        id: 'month_master',
        title: 'Month Master',
        description: 'Maintain a 30-day study streak',
        icon: '⭐',
        category: 'streak',
        target: 30,
        check: (user) => user.stats.studyStreak >= 30,
    },
    DEDICATION_LEGEND: {
        id: 'dedication_legend',
        title: 'Dedication Legend',
        description: 'Maintain a 100-day study streak',
        icon: '👑',
        category: 'streak',
        target: 100,
        check: (user) => user.stats.studyStreak >= 100,
    },

    // Level achievements
    LEVEL_5: {
        id: 'level_5',
        title: 'Rising Star',
        description: 'Reach level 5',
        icon: '🌟',
        category: 'level',
        target: 5,
        check: (user) => user.level.currentLevel >= 5,
    },
    LEVEL_10: {
        id: 'level_10',
        title: 'Expert Learner',
        description: 'Reach level 10',
        icon: '💎',
        category: 'level',
        target: 10,
        check: (user) => user.level.currentLevel >= 10,
    },
    LEVEL_25: {
        id: 'level_25',
        title: 'Learning Legend',
        description: 'Reach level 25',
        icon: '🏅',
        category: 'level',
        target: 25,
        check: (user) => user.level.currentLevel >= 25,
    },
};

/**
 * Check and unlock achievements for a user
 */
async function checkAchievements(userId, user) {
    try {
        const newAchievements = [];

        for (const [key, achievementDef] of Object.entries(ACHIEVEMENTS)) {
            // Check if achievement criteria is met
            if (achievementDef.check(user)) {
                // Check if user already has this achievement
                let achievement = await Achievement.findOne({
                    userId,
                    achievementId: achievementDef.id,
                });

                if (!achievement) {
                    // Create new achievement
                    achievement = await Achievement.create({
                        userId,
                        achievementId: achievementDef.id,
                        title: achievementDef.title,
                        description: achievementDef.description,
                        icon: achievementDef.icon,
                        category: achievementDef.category,
                        progress: achievementDef.target,
                        target: achievementDef.target,
                        unlocked: true,
                        unlockedAt: new Date(),
                    });

                    newAchievements.push(achievement);
                } else if (!achievement.unlocked) {
                    // Unlock existing achievement
                    achievement.unlocked = true;
                    achievement.unlockedAt = new Date();
                    achievement.progress = achievementDef.target;
                    await achievement.save();

                    newAchievements.push(achievement);
                }
            } else {
                // Update progress for locked achievements
                let achievement = await Achievement.findOne({
                    userId,
                    achievementId: achievementDef.id,
                });

                if (!achievement) {
                    // Create with current progress
                    const progress = getCurrentProgress(user, achievementDef);
                    await Achievement.create({
                        userId,
                        achievementId: achievementDef.id,
                        title: achievementDef.title,
                        description: achievementDef.description,
                        icon: achievementDef.icon,
                        category: achievementDef.category,
                        progress,
                        target: achievementDef.target,
                        unlocked: false,
                    });
                } else if (!achievement.unlocked) {
                    // Update progress
                    achievement.progress = getCurrentProgress(user, achievementDef);
                    await achievement.save();
                }
            }
        }

        return newAchievements;
    } catch (error) {
        console.error('Check achievements error:', error);
        return [];
    }
}

/**
 * Get current progress for an achievement
 */
function getCurrentProgress(user, achievementDef) {
    switch (achievementDef.category) {
        case 'document':
            return user.stats.totalDocuments;
        case 'quiz':
            return user.stats.totalQuizzes;
        case 'flashcard':
            return user.stats.totalFlashcards;
        case 'streak':
            return user.stats.studyStreak;
        case 'level':
            return user.level.currentLevel;
        default:
            return 0;
    }
}

/**
 * Get all achievements for a user
 */
async function getUserAchievements(userId) {
    try {
        const achievements = await Achievement.find({ userId }).sort({ unlockedAt: -1 });
        return achievements;
    } catch (error) {
        console.error('Get user achievements error:', error);
        return [];
    }
}

module.exports = {
    ACHIEVEMENTS,
    checkAchievements,
    getUserAchievements,
};
