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

        // Get document
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user.id,
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Generate flashcards using AI
        const aiFlashcards = await generateFlashcards(document.content, count);

        // Save flashcards to database
        const flashcards = await Flashcard.insertMany(
            aiFlashcards.map(fc => ({
                userId: req.user.id,
                documentId: document._id,
                question: fc.question,
                answer: fc.answer,
                topic: fc.topic || 'General',
                difficulty: fc.difficulty || 'medium',
            }))
        );

        // Update user stats
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { 'stats.totalFlashcards': flashcards.length },
        });

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
            flashcards,
        });
    } catch (error) {
        console.error('Generate flashcards error:', error);
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
        if (documentId) query.documentId = documentId;
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
