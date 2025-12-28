/**
 * Flashcard Routes
 * Handles flashcard generation and management
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Flashcard = require('../models/Flashcard');
const Document = require('../models/Document');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { generateFlashcards } = require('../services/geminiService');

/**
 * @route   POST /api/flashcards/generate
 * @desc    Generate flashcards from a document using AI
 * @access  Private
 */
router.post('/generate', protect, async (req, res) => {
    try {
        const { documentId, count = 10 } = req.body;

        if (!documentId) {
            return res.status(400).json({ error: 'Document ID is required' });
        }

        // Validate count
        const flashcardCount = parseInt(count);
        if (isNaN(flashcardCount) || flashcardCount < 1 || flashcardCount > 50) {
            return res.status(400).json({
                error: 'Count must be a number between 1 and 50',
                count: flashcardCount
            });
        }

        // Get document
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user.id,
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found or access denied' });
        }

        // Check if document has content
        if (!document.content || document.content.length < 50) {
            return res.status(400).json({ error: 'Document content is too short to generate flashcards' });
        }

        // Generate flashcards using AI
        const aiFlashcards = await generateFlashcards(document.content, flashcardCount);

        // Validate AI response
        if (!Array.isArray(aiFlashcards) || aiFlashcards.length === 0) {
            throw new Error('AI returned invalid flashcard format');
        }

        // Save flashcards to database - map front/back to question/answer
        const flashcards = await Flashcard.insertMany(
            aiFlashcards.map(fc => ({
                userId: req.user.id,
                documentId: document._id,
                question: fc.front || fc.question,  // Support both formats
                answer: fc.back || fc.answer,
                topic: fc.topic || document.title || 'General',
                difficulty: fc.difficulty || 'medium',
            }))
        );

        // Update user stats
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { 'stats.totalFlashcards': flashcards.length } },
            { new: true }
        );

        // Update study streak
        const { updateStreak } = require('../utils/streakUtils');
        await updateStreak(user);

        // Create activity
        await Activity.create({
            userId: req.user.id,
            type: 'flashcard',
            title: 'Generated flashcards',
            description: `Generated ${flashcards.length} flashcards from "${document.title}"`,
            metadata: { documentId: document._id, count: flashcards.length },
        });

        res.status(201).json({
            success: true,
            count: flashcards.length,
            documentTitle: document.title,
            flashcards,
        });
    } catch (error) {
        console.error('Generate flashcards error:', error);

        // Return specific error messages
        if (error.message.includes('AI')) {
            return res.status(503).json({
                error: 'AI service temporarily unavailable. Please try again.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }

        res.status(500).json({ error: 'Failed to generate flashcards' });
    }
});

/**
 * @route   GET /api/flashcards
 * @desc    Get all user flashcards
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const { documentId, difficulty, favorites } = req.query;

        // Build query
        const query = { userId: req.user.id };

        // Validate and add documentId if provided
        if (documentId) {
            // Check if documentId is a valid MongoDB ObjectId
            const mongoose = require('mongoose');
            if (!mongoose.Types.ObjectId.isValid(documentId)) {
                return res.status(400).json({
                    error: 'Invalid document ID format',
                    flashcards: []
                });
            }
            query.documentId = documentId;
        }

        if (difficulty) query.difficulty = difficulty;
        if (favorites === 'true') query.isFavorite = true;

        const flashcards = await Flashcard.find(query)
            .populate('documentId', 'title')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: flashcards.length,
            flashcards,
        });
    } catch (error) {
        console.error('Get flashcards error:', error);
        res.status(500).json({ error: 'Failed to get flashcards' });
    }
});

/**
 * @route   GET /api/flashcards/favorites
 * @desc    Get favorited flashcards
 * @access  Private
 */
router.get('/favorites', protect, async (req, res) => {
    try {
        const flashcards = await Flashcard.find({
            userId: req.user.id,
            isFavorite: true,
        })
            .populate('documentId', 'title')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: flashcards.length,
            flashcards,
        });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'Failed to get favorites' });
    }
});

/**
 * @route   PUT /api/flashcards/:id/favorite
 * @desc    Toggle flashcard favorite status
 * @access  Private
 */
router.put('/:id/favorite', protect, async (req, res) => {
    try {
        const flashcard = await Flashcard.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }

        flashcard.isFavorite = !flashcard.isFavorite;
        await flashcard.save();

        res.json({
            success: true,
            isFavorite: flashcard.isFavorite,
            flashcard,
        });
    } catch (error) {
        console.error('Toggle favorite error:', error);
        res.status(500).json({ error: 'Failed to toggle favorite' });
    }
});

/**
 * @route   PUT /api/flashcards/:id/study
 * @desc    Record a study session for a flashcard
 * @access  Private
 */
router.put('/:id/study', protect, async (req, res) => {
    try {
        const flashcard = await Flashcard.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }

        flashcard.studyCount += 1;
        flashcard.lastStudied = Date.now();

        // Simple mastery calculation (can be enhanced)
        flashcard.masteryLevel = Math.min(100, flashcard.masteryLevel + 5);

        await flashcard.save();

        res.json({
            success: true,
            flashcard,
        });
    } catch (error) {
        console.error('Study flashcard error:', error);
        res.status(500).json({ error: 'Failed to record study session' });
    }
});

module.exports = router;
