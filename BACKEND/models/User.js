/**
 * User Model
 * Stores user account information, preferences, stats, and level progression
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false, // Don't include password in queries by default
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150',
    },

    // User Preferences
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light',
        },
        notifications: {
            email: { type: Boolean, default: true },
            quizReminders: { type: Boolean, default: true },
            studyStreakReminders: { type: Boolean, default: true },
            newFeatures: { type: Boolean, default: true },
        },
    },

    // User Statistics
    stats: {
        studyStreak: { type: Number, default: 0 },
        totalDocuments: { type: Number, default: 0 },
        totalFlashcards: { type: Number, default: 0 },
        totalQuizzes: { type: Number, default: 0 },
        totalStudyHours: { type: Number, default: 0 },
    },

    // Level/XP System
    level: {
        currentLevel: { type: Number, default: 1 },
        totalXP: { type: Number, default: 0 },
        currentXP: { type: Number, default: 0 },
        nextLevelXP: { type: Number, default: 500 },
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
});

// Index for faster email lookups
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
