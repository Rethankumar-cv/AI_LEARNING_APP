// Achievement Configuration
export const ACHIEVEMENT_CATEGORIES = {
    LEARNING: {
        id: 'learning',
        name: 'Learning',
        icon: '📚',
        color: 'from-blue-500 to-indigo-600'
    },
    CONSISTENCY: {
        id: 'consistency',
        name: 'Consistency',
        icon: '🔥',
        color: 'from-orange-500 to-red-600'
    },
    MASTERY: {
        id: 'mastery',
        name: 'Mastery',
        icon: '🧠',
        color: 'from-purple-500 to-pink-600'
    },
    MILESTONES: {
        id: 'milestones',
        name: 'Milestones',
        icon: '🚀',
        color: 'from-emerald-500 to-teal-600'
    }
};

// Achievement Definitions
export const ACHIEVEMENTS = [
    // Learning Category
    {
        id: 'first_quiz',
        category: 'learning',
        title: 'Quiz Rookie',
        description: 'Complete your first quiz',
        icon: '🎯',
        xpReward: 50,
        requirement: { type: 'quizzes_completed', count: 1 },
        status: 'unlocked',
        unlockedAt: '2025-12-15T10:30:00Z',
    },
    {
        id: 'quiz_master',
        category: 'learning',
        title: 'Quiz Master',
        description: 'Complete 10 quizzes',
        icon: '🏆',
        xpReward: 200,
        requirement: { type: 'quizzes_completed', count: 10 },
        status: 'locked',
        progress: 7,
    },
    {
        id: 'flashcard_beginner',
        category: 'learning',
        title: 'Flashcard Beginner',
        description: 'Study 25 flashcards',
        icon: '🃏',
        xpReward: 75,
        requirement: { type: 'flashcards_studied', count: 25 },
        status: 'in-progress',
        progress: 18,
    },
    {
        id: 'document_explorer',
        category: 'learning',
        title: 'Document Explorer',
        description: 'Upload 5 documents',
        icon: '📄',
        xpReward: 100,
        requirement: { type: 'documents_uploaded', count: 5 },
        status: 'unlocked',
        unlockedAt: '2025-12-20T14:22:00Z',
    },
    {
        id: 'speed_learner',
        category: 'learning',
        title: 'Speed Learner',
        description: 'Complete a quiz in under 3 minutes',
        icon: '⚡',
        xpReward: 150,
        requirement: { type: 'quiz_time', seconds: 180 },
        status: 'locked',
    },

    // Consistency Category
    {
        id: 'streak_3',
        category: 'consistency',
        title: '3-Day Streak',
        description: 'Study for 3 consecutive days',
        icon: '🔥',
        xpReward: 100,
        requirement: { type: 'streak_days', count: 3 },
        status: 'unlocked',
        unlockedAt: '2025-12-18T09:15:00Z',
    },
    {
        id: 'streak_7',
        category: 'consistency',
        title: 'Weekly Warrior',
        description: 'Study for 7 consecutive days',
        icon: '💪',
        xpReward: 250,
        requirement: { type: 'streak_days', count: 7 },
        status: 'in-progress',
        progress: 4,
        featured: true,
    },
    {
        id: 'streak_30',
        category: 'consistency',
        title: 'Streak Champion',
        description: 'Study for 30 consecutive days',
        icon: '👑',
        xpReward: 1000,
        requirement: { type: 'streak_days', count: 30 },
        status: 'locked',
    },
    {
        id: 'early_bird',
        category: 'consistency',
        title: 'Early Bird',
        description: 'Study before 8 AM five times',
        icon: '🌅',
        xpReward: 150,
        requirement: { type: 'morning_sessions', count: 5 },
        status: 'in-progress',
        progress: 2,
    },
    {
        id: 'night_owl',
        category: 'consistency',
        title: 'Night Owl',
        description: 'Study after 10 PM five times',
        icon: '🦉',
        xpReward: 150,
        requirement: { type: 'night_sessions', count: 5 },
        status: 'locked',
    },

    // Mastery Category
    {
        id: 'perfect_quiz',
        category: 'mastery',
        title: 'Perfect Score',
        description: 'Score 100% on a quiz',
        icon: '💯',
        xpReward: 200,
        requirement: { type: 'quiz_score', percentage: 100 },
        status: 'unlocked',
        unlockedAt: '2025-12-22T16:45:00Z',
    },
    {
        id: 'quiz_ace',
        category: 'mastery',
        title: 'Quiz Ace',
        description: 'Score above 90% on 5 quizzes',
        icon: '🎓',
        xpReward: 300,
        requirement: { type: 'high_quiz_scores', count: 5, percentage: 90 },
        status: 'in-progress',
        progress: 3,
    },
    {
        id: 'flashcard_pro',
        category: 'mastery',
        title: 'Flashcard Pro',
        description: 'Master 100 flashcards',
        icon: '🌟',
        xpReward: 400,
        requirement: { type: 'flashcards_mastered', count: 100 },
        status: 'locked',
    },
    {
        id: 'knowledge_guru',
        category: 'mastery',
        title: 'Knowledge Guru',
        description: 'Complete 50 quizzes with average score above 85%',
        icon: '🧙',
        xpReward: 1000,
        requirement: { type: 'quiz_average', count: 50, percentage: 85 },
        status: 'locked',
    },

    // Milestones Category
    {
        id: 'first_step',
        category: 'milestones',
        title: 'First Step',
        description: 'Create your account',
        icon: '👋',
        xpReward: 25,
        requirement: { type: 'account_created' },
        status: 'unlocked',
        unlockedAt: '2025-12-10T12:00:00Z',
    },
    {
        id: 'bronze_level',
        category: 'milestones',
        title: 'Bronze Learner',
        description: 'Reach Level 5',
        icon: '🥉',
        xpReward: 500,
        requirement: { type: 'level_reached', level: 5 },
        status: 'unlocked',
        unlockedAt: '2025-12-21T11:30:00Z',
    },
    {
        id: 'silver_level',
        category: 'milestones',
        title: 'Silver Learner',
        description: 'Reach Level 10',
        icon: '🥈',
        xpReward: 1000,
        requirement: { type: 'level_reached', level: 10 },
        status: 'in-progress',
        progress: 7,
    },
    {
        id: 'gold_level',
        category: 'milestones',
        title: 'Gold Learner',
        description: 'Reach Level 20',
        icon: '🥇',
        xpReward: 2000,
        requirement: { type: 'level_reached', level: 20 },
        status: 'locked',
    },
    {
        id: 'dedicated_learner',
        category: 'milestones',
        title: 'Dedicated Learner',
        description: 'Spend 50 hours studying',
        icon: '⏰',
        xpReward: 750,
        requirement: { type: 'study_hours', hours: 50 },
        status: 'in-progress',
        progress: 32,
    },
];

// Level System Configuration
export const LEVEL_SYSTEM = {
    currentLevel: 7,
    currentXP: 2250,
    nextLevelXP: 3000,
    totalXP: 8750,
};

// Helper function to get XP for next level
export const getXPForLevel = (level) => {
    return level * 500; // Simple formula: each level requires 500 more XP
};

// Helper function to get level from total XP
export const getLevelFromXP = (totalXP) => {
    let level = 1;
    let requiredXP = 500;
    let accumulatedXP = 0;

    while (totalXP >= accumulatedXP + requiredXP) {
        accumulatedXP += requiredXP;
        level++;
        requiredXP = level * 500;
    }

    return {
        level,
        currentXP: totalXP - accumulatedXP,
        nextLevelXP: requiredXP,
    };
};

// Get achievements by category
export const getAchievementsByCategory = (categoryId) => {
    return ACHIEVEMENTS.filter(a => a.category === categoryId);
};

// Get unlocked achievements
export const getUnlockedAchievements = () => {
    return ACHIEVEMENTS.filter(a => a.status === 'unlocked');
};

// Get featured achievement
export const getFeaturedAchievement = () => {
    return ACHIEVEMENTS.find(a => a.featured) || ACHIEVEMENTS.find(a => a.status === 'in-progress');
};

// Calculate progress percentage
export const getAchievementProgress = (achievement) => {
    if (achievement.status === 'unlocked') return 100;
    if (achievement.status === 'locked') return 0;

    const { progress, requirement } = achievement;
    const total = requirement.count || requirement.level || requirement.hours || 100;
    return Math.round((progress / total) * 100);
};
