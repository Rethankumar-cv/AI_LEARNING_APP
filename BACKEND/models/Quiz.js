/**
 * Quiz Model
 * Stores AI-generated quiz questions with MCQs
 */

const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: true,
    },
    questions: [{
        id: String,
        question: String,
        options: [String],
        correctAnswer: Number, // Index of correct option (0-3)
        explanation: String,
    }],
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Index for user quizzes
quizSchema.index({ userId: 1, createdAt: -1 });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
