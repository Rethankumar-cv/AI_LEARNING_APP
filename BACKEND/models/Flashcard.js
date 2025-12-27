/**
 * Flashcard Model
 * Stores AI-generated flashcard Q&A pairs with study progress tracking
 */

const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },
    question: {
        type: String,
        required: [true, 'Question is required'],
    },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
    },
    topic: {
        type: String,
        default: 'General',
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    studyCount: {
        type: Number,
        default: 0,
    },
    lastStudied: {
        type: Date,
    },
    masteryLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Indexes for faster queries
flashcardSchema.index({ userId: 1, documentId: 1 });
flashcardSchema.index({ userId: 1, isFavorite: 1 });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
