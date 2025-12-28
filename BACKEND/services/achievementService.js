/**
 * Consolidated Achievement Service - 75 Total Achievements Across 5 Levels
 * Progressive difficulty system with level unlocking
 */

const Achievement = require('../models/Achievement');
const User = require('../models/User');

// Import all achievement levels
const { LEVEL_1_ACHIEVEMENTS, LEVEL_2_ACHIEVEMENTS, LEVEL_3_ACHIEVEMENTS } = require('./achievementLevels1-3');
const { LEVEL_4_ACHIEVEMENTS, LEVEL_5_ACHIEVEMENTS } = require('./achievementLevels4-5');

// Combine all achievements
const ALL_ACHIEVEMENTS = {
    ...LEVEL_1_ACHIEVEMENTS,
    ...LEVEL_2_ACHIEVEMENTS,
    ...LEVEL_3_ACHIEVEMENTS,
    ...LEVEL_4_ACHIEVEMENTS,
    ...LEVEL_5_ACHIEVEMENTS,
};

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
        case 'consistency':
            return user.stats.studyStreak;
        case 'level':
            return user.level.currentLevel;
        case 'mastery':
        case 'speed':
        case 'accuracy':
            return user.stats.totalDocuments + user.stats.totalQuizzes + user.stats.totalFlashcards;
        default:
            return 0;
    }
}

/**
 * Check which achievement level the user is on
 */
async function getUserAchievementLevel(userId) {
    const achievements = await Achievement.find({ userId });

    // Count unlocked achievements per level
    const levelProgress = {
        1: { total: 15, unlocked: 0 },
        2: { total: 15, unlocked: 0 },
        3: { total: 15, unlocked: 0 },
        4: { total: 15, unlocked: 0 },
        5: { total: 15, unlocked: 0 },
    };

    achievements.forEach(ach => {
        if (ach.unlocked && ach.level >= 1 && ach.level <= 5) {
            levelProgress[ach.level].unlocked++;
        }
    });

    // Determine current level (highest level with <15 unlocked OR level 5)
    let currentLevel = 1;
    for (let level = 1; level <= 5; level++) {
        if (levelProgress[level].unlocked < 15) {
            currentLevel = level;
            break;
        }
        if (level === 5) {
            currentLevel = 5; // All levels complete
        }
    }

    return {
        currentLevel,
        levelProgress,
        isLevelComplete: (level) => levelProgress[level].unlocked >= 15,
    };
}

/**
 * Get all achievements for a user (creates them if they don't exist)
 */
async function getUserAchievements(userId) {
    try {
        // Check if user has any achievements
        let userAchievements = await Achievement.find({ userId });

        // If no achievements exist, initialize Level 1 achievements only
        if (userAchievements.length === 0) {
            console.log('🎯 Initializing Level 1 achievements for new user...');

            // Fetch user to calculate initial progress
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Create only Level 1 achievements
            const level1Achievements = Object.values(ALL_ACHIEVEMENTS)
                .filter(def => def.level === 1)
                .map(def => {
                    const progress = getCurrentProgress(user, def);
                    const unlocked = def.check(user);

                    return {
                        userId,
                        achievementId: def.id,
                        title: def.title,
                        description: def.description,
                        icon: def.icon,
                        category: def.category,
                        level: def.level,
                        levelLocked: false, // Level 1 is always unlocked
                        progress,
                        target: def.target,
                        unlocked,
                        xpReward: def.xpReward,
                        unlockedAt: unlocked ? new Date() : null,
                    };
                });

            userAchievements = await Achievement.insertMany(level1Achievements);
            console.log(`✅ Initialized ${level1Achievements.length} Level 1 achievements`);
        }

        // Check if user has completed Level 1 and unlock Level 2, etc.
        const levelInfo = await getUserAchievementLevel(userId);
        const user = await User.findById(userId);

        // Unlock next level if current level is complete
        for (let level = 1; level <= 4; level++) {
            if (levelInfo.isLevelComplete(level)) {
                const nextLevel = level + 1;

                // Check if next level achievements already exist
                const nextLevelExists = await Achievement.exists({
                    userId,
                    level: nextLevel,
                });

                if (!nextLevelExists) {
                    console.log(`🎉 Level ${level} complete! Unlocking Level ${nextLevel}...`);

                    // Create next level achievements
                    const nextLevelAchievements = Object.values(ALL_ACHIEVEMENTS)
                        .filter(def => def.level === nextLevel)
                        .map(def => {
                            const progress = getCurrentProgress(user, def);
                            const unlocked = def.check(user);

                            return {
                                userId,
                                achievementId: def.id,
                                title: def.title,
                                description: def.description,
                                icon: def.icon,
                                category: def.category,
                                level: def.level,
                                levelLocked: false,
                                progress,
                                target: def.target,
                                unlocked,
                                xpReward: def.xpReward,
                                unlockedAt: unlocked ? new Date() : null,
                            };
                        });

                    await Achievement.insertMany(nextLevelAchievements);
                    console.log(`✅ Unlocked ${nextLevelAchievements.length} Level ${nextLevel} achievements`);

                    // Refresh achievements list
                    userAchievements = await Achievement.find({ userId });
                }
            }
        }

        return userAchievements;
    } catch (error) {
        console.error('❌ Get user achievements error:', error);
        throw error;
    }
}

/**
 * Check and update achievements for a user
 */
async function checkAchievements(userId, user) {
    try {
        const newAchievements = [];
        const userAchievements = await Achievement.find({ userId });

        for (const achievement of userAchievements) {
            // Skip if already unlocked or level is locked
            if (achievement.unlocked || achievement.levelLocked) {
                continue;
            }

            // Find achievement definition
            const achievementDef = ALL_ACHIEVEMENTS[Object.keys(ALL_ACHIEVEMENTS).find(
                key => ALL_ACHIEVEMENTS[key].id === achievement.achievementId
            )];

            if (!achievementDef) continue;

            // Update progress
            const currentProgress = getCurrentProgress(user, achievementDef);
            achievement.progress = currentProgress;

            // Check if unlocked
            if (achievementDef.check(user)) {
                achievement.unlocked = true;
                achievement.unlockedAt = new Date();
                newAchievements.push(achievement);
                console.log(`🎉 Achievement unlocked: ${achievement.title}`);
            }

            await achievement.save();
        }

        // Check if level is complete and unlock next level
        await getUserAchievements(userId); // This will auto-unlock next level

        return newAchievements;
    } catch (error) {
        console.error('❌ Check achievements error:', error);
        return [];
    }
}

module.exports = {
    ALL_ACHIEVEMENTS,
    getUserAchievements,
    checkAchievements,
    getUserAchievementLevel,
};
