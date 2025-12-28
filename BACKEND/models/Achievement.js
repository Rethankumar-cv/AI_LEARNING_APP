/**
 * Achievement Model
 * Stores user achievement progress and unlocks
 */

const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    achievementId: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['document', 'quiz', 'flashcard', 'streak', 'level', 'mastery', 'consistency', 'speed', 'accuracy'],
    },
    level: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
        max: 5,
    },
    levelLocked: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    xpReward: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['locked', 'in-progress', 'unlocked'],
        default: 'locked',
    },
    progress: {
        type: Number,
        default: 0,
    },
    target: {
        type: Number,
        required: true,
    },
    unlocked: {
        type: Boolean,
        default: false,
    },
    requirement: {
        type: mongoose.Schema.Types.Mixed, // Flexible structure for different requirements
    },
    unlockedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Compound index for unique achievements per user
achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
