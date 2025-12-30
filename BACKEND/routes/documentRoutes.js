/**
 * Document Routes
 * Handles document upload, processing, and management
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { protect } = require('../middleware/auth');
const Document = require('../models/Document');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { extractTextFromPDF } = require('../utils/pdfExtractor');
const { generateSummary, chatWithDocument, explainText } = require('../services/geminiService');
const { cloudinary, storage: cloudinaryStorage, verifyCloudinaryConfig } = require('../config/cloudinary');

// Check if Cloudinary is configured
const isCloudinaryEnabled = verifyCloudinaryConfig();

// Configure multer with Cloudinary or local storage
const localStorage = multer.diskStorage({
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
    storage: isCloudinaryEnabled ? cloudinaryStorage : localStorage,
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
        let tempFilePath = null; // Track temp file for cleanup

        try {
            console.log('🤖 Processing document with AI...');

            if (fileType === 'pdf') {
                // Extract text from PDF using pdf-parse
                try {
                    // Check if file is on Cloudinary or local
                    const isCloudinary = filePath.includes('cloudinary.com');
                    let extractionPath = filePath;

                    if (isCloudinary) {
                        // Download PDF from Cloudinary to temp file for text extraction
                        console.log('☁️  Downloading PDF from Cloudinary for text extraction...');

                        const tempDir = path.join(__dirname, '../temp');
                        if (!fs.existsSync(tempDir)) {
                            fs.mkdirSync(tempDir, { recursive: true });
                        }

                        tempFilePath = path.join(tempDir, `temp-${Date.now()}.pdf`);

                        // Download file from Cloudinary
                        const response = await axios.get(filePath, { responseType: 'stream' });
                        const writer = fs.createWriteStream(tempFilePath);
                        response.data.pipe(writer);

                        await new Promise((resolve, reject) => {
                            writer.on('finish', resolve);
                            writer.on('error', reject);
                        });

                        extractionPath = tempFilePath;
                        console.log('✅ PDF downloaded to temp location');
                    }

                    content = await extractTextFromPDF(extractionPath);
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
                } finally {
                    // Clean up temp file if it was created
                    if (tempFilePath && fs.existsSync(tempFilePath)) {
                        try {
                            fs.unlinkSync(tempFilePath);
                            console.log('🗑️  Cleaned up temp file');
                        } catch (cleanupError) {
                            console.error('⚠️  Failed to cleanup temp file:', cleanupError.message);
                        }
                    }
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
            fileUrl: isCloudinaryEnabled ? req.file.path : `/uploads/${req.file.filename}`,
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
        // Clean up uploaded file on error (only for local storage)
        if (req.file && !isCloudinaryEnabled) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.error('⚠️  Failed to cleanup file:', cleanupError.message);
            }
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
        const { search, sort, type } = req.query;

        // Build query
        let query = { userId: req.user.id };

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        // Filter by file type
        if (type && ['pdf', 'txt'].includes(type)) {
            query.fileType = type;
        }

        // Determine sort order
        let sortOptions = { createdAt: -1 }; // Default: Newest

        if (sort === 'oldest') {
            sortOptions = { createdAt: 1 };
        } else if (sort === 'name') {
            sortOptions = { title: 1 };
        } else if (sort === 'size') {
            sortOptions = { fileSize: -1 };
        } else if (search && !sort) {
            // If searching and no specific sort, sort by relevance could be added here
            // but sticking to default newest for consistency unless requested
            sortOptions = { createdAt: -1 };
            // Ideally for search: { score: { $meta: "textScore" } } but requires projection
        }

        const docs = await Document.find(query)
            .select('-content') // Exclude large content field
            .sort(sortOptions);

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
                // Full URL for PDF viewer - use backend proxy for Cloudinary, local URL otherwise
                url: document.fileUrl.includes('cloudinary.com')
                    ? `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/documents/${document._id}/pdf`
                    : `${process.env.BACKEND_URL || 'http://localhost:5000'}${document.fileUrl}`,
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
 * @route   GET /api/documents/:id/pdf
 * @desc    Stream PDF file (proxy for Cloudinary or serve local file)
 * @access  Private
 */
router.get('/:id/pdf', protect, async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Check if file is on Cloudinary
        if (document.fileUrl.includes('cloudinary.com')) {
            // Stream from Cloudinary
            try {
                console.log('📄 Streaming PDF from Cloudinary:', document.fileUrl);

                // Try direct URL first (for public files)
                const fetchUrl = document.fileUrl;

                /* DISABLED - Testing with direct URLs for public files
                // Generate signed URL for private files
                let fetchUrl = document.fileUrl;
                const urlParts = document.fileUrl.split('/');
                const uploadIndex = urlParts.indexOf('upload');

                if (uploadIndex !== -1) {
                    // Extract path after 'upload' and optional version
                    let pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
                    if (pathAfterUpload.startsWith('v')) {
                        pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
                    }

                    // Remove file extension to get public_id
                    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');

                    // Generate signed URL
                    fetchUrl = cloudinary.url(publicId, {
                        resource_type: 'raw',
                        sign_url: true,
                        type: 'upload',
                    });

                    console.log('🔐 Using signed URL for authentication');
                }
                */

                const response = await axios.get(fetchUrl, {
                    responseType: 'stream',
                });

                console.log('✅ Cloudinary response received, status:', response.status);

                // Set appropriate headers
                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `inline; filename="${document.title}.pdf"`,
                    'Cache-Control': 'public, max-age=31536000',
                });

                // Pipe the Cloudinary stream to response
                response.data.pipe(res);
            } catch (cloudinaryError) {
                console.error('❌ Error streaming from Cloudinary:', {
                    message: cloudinaryError.message,
                    status: cloudinaryError.response?.status,
                    statusText: cloudinaryError.response?.statusText,
                    url: document.fileUrl
                });
                return res.status(500).json({ error: 'Failed to load PDF from cloud storage' });
            }
        } else {
            // Serve local file
            const filePath = path.join(__dirname, '..', document.fileUrl);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'PDF file not found' });
            }

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${document.title}.pdf"`,
            });

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        }
    } catch (error) {
        console.error('PDF streaming error:', error);
        res.status(500).json({ error: 'Failed to stream PDF' });
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

        // Delete file from storage (Cloudinary or local)
        if (document.fileUrl) {
            // Check if file is stored on Cloudinary
            if (document.fileUrl.includes('cloudinary.com')) {
                try {
                    // Extract public_id from Cloudinary URL
                    const urlParts = document.fileUrl.split('/');
                    const fileWithExt = urlParts[urlParts.length - 1];
                    const publicId = `ai-learning-documents/${fileWithExt}`;

                    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
                    console.log('✅ Deleted file from Cloudinary:', publicId);
                } catch (cloudError) {
                    console.error('⚠️  Failed to delete from Cloudinary:', cloudError.message);
                }
            } else {
                // Delete local file
                const filePath = path.join(__dirname, '..', document.fileUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log('✅ Deleted local file:', filePath);
                }
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
