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
        enum: ['learning', 'consistency', 'mastery', 'milestones'],
        required: true,
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
