/**
 * Document Routes
 * Handles document upload, processing, and management
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const Document = require('../models/Document');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { extractTextFromPDF } = require('../utils/pdfExtractor');
const { generateSummary, chatWithDocument, explainText } = require('../services/geminiService');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and TXT files are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/**
 * @route   POST /api/documents/upload
 * @desc    Upload and process a document
 * @access  Private
 */
router.post('/upload', protect, upload.single('file'), async (req, res) => {
    console.log('📥 Upload request received from user:', req.user?.id);
    console.log('📁 File received:', req.file ? req.file.originalname : 'NO FILE');

    try {
        if (!req.file) {
            console.log('❌ No file in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title } = req.body;
        const filePath = req.file.path;
        const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'txt';

        console.log('📄 Processing file:', {
            title: title || req.file.originalname,
            fileType,
            fileSize: req.file.size
        });

        // Initialize content and summary
        let content = '';
        let summary = '';

        try {
            console.log('🤖 Processing document with AI...');

            if (fileType === 'pdf') {
                // Extract text from PDF using pdf-parse
                try {
                    content = await extractTextFromPDF(filePath);
                    console.log(`📄 Extracted ${content.length} characters from PDF`);

                    // Generate summary from extracted text
                    summary = await generateSummary(content.substring(0, 30000));
                    console.log('✅ PDF processed successfully');
                } catch (pdfError) {
                    console.error('PDF extraction failed:', pdfError);
                    content = 'PDF text extraction failed. Content available in PDF viewer.';
                    summary = {
                        title: 'Summary Not Available',
                        sections: [{
                            heading: 'Error',
                            points: ['Unable to extract text from PDF for AI processing']
                        }],
                        keywords: []
                    };
                }
            } else {
                // For text files, read content and summarize
                content = fs.readFileSync(filePath, 'utf-8');
                summary = await generateSummary(content.substring(0, 30000));
                console.log('✅ Text file processed successfully');
            }
        } catch (error) {
            console.error('❌ AI processing failed:', error.message);
            // Fallback
            summary = {
                title: 'Processing Failed',
                sections: [
                    {
                        heading: 'Error',
                        points: ['Failed to process document with AI', error.message]
                    }
                ],
                keywords: []
            };
            if (!content) content = 'Content processing failed';
        }

        // Create document
        const document = new Document({
            userId: req.user.id,
            title: title || req.file.originalname,
            content,
            summary,
            fileType,
            fileUrl: `/uploads/${req.file.filename}`,
            fileSize: req.file.size,
            status: 'completed',
            processedAt: Date.now(),
        });

        await document.save();

        // Update user stats
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { 'stats.totalDocuments': 1 } },
            { new: true }
        );

        // Update study streak
        const { updateStreak } = require('../utils/streakUtils');
        const streakUpdate = await updateStreak(user);
        if (streakUpdate.streakIncreased) {
            console.log(`🔥 Streak updated: Day ${streakUpdate.currentStreak}`);
        }

        // Create activity
        await Activity.create({
            userId: req.user.id,
            type: 'document',
            title: 'Uploaded document',
            description: `Uploaded "${title || req.file.originalname}"`,
            metadata: { documentId: document._id },
        });

        res.status(201).json({
            success: true,
            document: {
                id: document._id,
                title: document.title,
                summary: document.summary,
                fileType: document.fileType,
                fileSize: document.fileSize,
                uploadedAt: document.uploadedAt,
            },
        });

        console.log('✅ Document uploaded successfully!', document._id);
    } catch (error) {
        console.error('❌ Document upload error:', error.message);
        console.error('Stack:', error.stack);
        // Clean up uploaded file on error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to upload document' });
    }
});

/**
 * @route   GET /api/documents
 * @desc    Get all user documents
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const docs = await Document.find({ userId: req.user.id })
            .select('-content') // Exclude large content field
            .sort({ createdAt: -1 });

        // Map documents to match frontend expectations
        const documents = docs.map(doc => ({
            id: doc._id,
            name: doc.title,
            title: doc.title,
            summary: doc.summary,
            fileType: doc.fileType,
            size: doc.fileSize,
            fileSize: doc.fileSize,
            uploadedAt: doc.uploadedAt || doc.createdAt,
        }));

        res.json({
            success: true,
            count: documents.length,
            documents,
        });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ error: 'Failed to get documents' });
    }
});

/**
 * @route   GET /api/documents/:id
 * @desc    Get document by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Return properly formatted document for frontend
        res.json({
            success: true,
            document: {
                id: document._id,
                name: document.title,
                title: document.title,
                summary: document.summary,
                content: document.content,
                fileType: document.fileType,
                fileUrl: document.fileUrl,
                url: `http://localhost:5000${document.fileUrl}`, // Full URL for PDF viewer
                fileSize: document.fileSize,
                size: document.fileSize,
                uploadedAt: document.uploadedAt || document.createdAt,
            },
        });
    } catch (error) {
        console.error('Get document error:', error);
        res.status(500).json({ error: 'Failed to get document' });
    }
});

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete document
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Delete file from filesystem
        if (document.fileUrl) {
            const filePath = path.join(__dirname, '..', document.fileUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await document.deleteOne();

        // Update user stats
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { 'stats.totalDocuments': -1 },
        });

        res.json({
            success: true,
            message: 'Document deleted successfully',
        });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

/**
 * @route   POST /api/documents/:id/chat
 * @desc    Chat with a document
 * @access  Private
 */

router.post('/:id/chat', protect, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Use the content stored in the database
        const context = document.content;

        if (!context || context.length < 10) {
            return res.status(400).json({ error: 'Document content is empty or unavailable for chat' });
        }

        // Get AI response
        const answer = await chatWithDocument(message, context);

        res.json({
            success: true,
            answer,
        });
    } catch (error) {
        console.error("Chat route error:", error.message);

        // Return 503 Service Unavailable as requested
        res.status(503).json({
            success: false,
            message: "AI service unavailable. Please try again.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route   POST /api/documents/:id/explain
 * @desc    Explain selected text from a document
 * @access  Private
 */
router.post('/:id/explain', protect, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Text to explain is required' });
        }

        // Optionally get document for context
        let documentContext = '';
        try {
            const document = await Document.findOne({
                _id: req.params.id,
                userId: req.user.id,
            });

            if (document && document.content) {
                documentContext = document.content;
            }
        } catch (err) {
            // Continue without context if document not found
            console.log('Document context not available for explanation');
        }

        // Get AI explanation
        const explanation = await explainText(text, documentContext);

        res.json({
            success: true,
            explanation,
        });
    } catch (error) {
        console.error("Explain route error:", error.message);

        res.status(503).json({
            success: false,
            message: "AI service unavailable. Please try again.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
