/**
 * Quiz Routes
 * Handles quiz generation, retrieval, and submission
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Document = require('../models/Document');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { generateQuiz } = require('../services/geminiService');

/**
 * @route   POST /api/quizzes/generate
 * @desc    Generate a quiz from a document using AI
 * @access  Private
 */
router.post('/generate', protect, async (req, res) => {
    try {
        const { documentId, questionCount = 10 } = req.body;

        if (!documentId) {
            return res.status(400).json({ error: 'Document ID is required' });
        }

        // Validate questionCount
        const count = parseInt(questionCount);
        if (isNaN(count) || count < 1 || count > 50) {
            return res.status(400).json({
                error: 'Question count must be a number between 1 and 50',
                questionCount: count
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

        // Check if document has sufficient content
        if (!document.content || document.content.length < 100) {
            return res.status(400).json({ error: 'Document content is too short to generate a quiz' });
        }

        // Generate quiz using AI
        const aiQuestions = await generateQuiz(document.content, count);

        // Validate AI response
        if (!Array.isArray(aiQuestions) || aiQuestions.length === 0) {
            throw new Error('AI returned invalid quiz format');
        }

        // Create quiz
        const quiz = new Quiz({
            userId: req.user.id,
            documentId: document._id,
            title: `Quiz: ${document.title}`,
            questions: aiQuestions,
            difficulty: 'medium', // Can be enhanced with AI difficulty detection
        });

        await quiz.save();

        // Update user stats
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { 'stats.totalQuizzes': 1 },
        });

        // Create activity
        await Activity.create({
            userId: req.user.id,
            type: 'quiz',
            title: 'Generated quiz',
            description: `Generated quiz with ${aiQuestions.length} questions from "${document.title}"`,
            metadata: { quizId: quiz._id, questionCount: aiQuestions.length },
        });

        res.status(201).json({
            success: true,
            quiz,
            questionCount: aiQuestions.length,
            documentTitle: document.title,
        });
    } catch (error) {
        console.error('Generate quiz error:', error);

        // Return specific error messages
        if (error.message.includes('AI')) {
            return res.status(503).json({
                error: 'AI service temporarily unavailable. Please try again.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }

        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

/**
 * @route   GET /api/quizzes
 * @desc    Get all user quizzes
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const quizzes = await Quiz.find({ userId: req.user.id })
            .populate('documentId', 'title')
            .select('-questions') // Exclude questions for list view
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: quizzes.length,
            quizzes,
        });
    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({ error: 'Failed to get quizzes' });
    }
});

/**
 * @route   GET /api/quizzes/:id
 * @desc    Get quiz by ID with questions
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user.id,
        }).populate('documentId', 'title');

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Remove correct answers and explanations for quiz-taking
        const quizData = {
            ...quiz.toObject(),
            questions: quiz.questions.map(q => ({
                id: q.id,
                question: q.question,
                options: q.options,
            })),
        };

        res.json({
            success: true,
            quiz: quizData,
        });
    } catch (error) {
        console.error('Get quiz error:', error);
        res.status(500).json({ error: 'Failed to get quiz' });
    }
});

/**
 * @route   POST /api/quizzes/:id/submit
 * @desc    Submit quiz answers and get results
 * @access  Private
 */
router.post('/:id/submit', protect, async (req, res) => {
    try {
        const { answers, timeTaken } = req.body; // answers: { questionId: selectedAnswerIndex }

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Calculate score
        let correctCount = 0;
        const results = quiz.questions.map(q => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            if (isCorrect) correctCount++;

            return {
                questionId: q.id,
                question: q.question,
                userAnswer,
                userAnswerText: q.options[userAnswer] || 'Not answered',
                correctAnswer: q.correctAnswer,
                correctAnswerText: q.options[q.correctAnswer],
                isCorrect,
                explanation: q.explanation,
            };
        });

        const totalQuestions = quiz.questions.length;
        const score = Math.round((correctCount / totalQuestions) * 100);

        // Save quiz result
        const quizResult = new QuizResult({
            userId: req.user.id,
            quizId: quiz._id,
            answers: new Map(Object.entries(answers)),
            score,
            totalQuestions,
            correctAnswers: correctCount,
            timeTaken,
        });

        await quizResult.save();

        // Create activity
        await Activity.create({
            userId: req.user.id,
            type: 'quiz',
            title: 'Completed quiz',
            description: `Scored ${score}% on "${quiz.title}"`,
            metadata: { quizId: quiz._id, score, correctCount, totalQuestions },
        });

        res.json({
            success: true,
            result: {
                score,
                correctCount,
                totalQuestions,
                percentage: score,
                results,
            },
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

/**
 * @route   GET /api/quizzes/results/history
 * @desc    Get quiz results history
 * @access  Private
 */
router.get('/results/history', protect, async (req, res) => {
    try {
        const results = await QuizResult.find({ userId: req.user.id })
            .populate('quizId', 'title')
            .sort({ completedAt: -1 })
            .limit(20);

        res.json({
            success: true,
            count: results.length,
            results,
        });
    } catch (error) {
        console.error('Get quiz history error:', error);
        res.status(500).json({ error: 'Failed to get quiz history' });
    }
});

/**
 * @route   DELETE /api/quizzes/:id
 * @desc    Delete a quiz
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        await Quiz.deleteOne({ _id: req.params.id });

        // Also delete associated quiz results
        await QuizResult.deleteMany({ quizId: req.params.id });

        res.json({
            success: true,
            message: 'Quiz deleted successfully',
        });
    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({ error: 'Failed to delete quiz' });
    }
});

module.exports = router;
