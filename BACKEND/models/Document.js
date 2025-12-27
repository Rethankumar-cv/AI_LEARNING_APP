/**
 * Document Model
 * Stores uploaded documents (PDFs/TXT), their content, and AI-generated summaries
 */

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Document title is required'],
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    summary: {
        type: mongoose.Schema.Types.Mixed, // AI-generated summary (Object or String)
    },
    fileType: {
        type: String,
        enum: ['pdf', 'txt'],
        required: true,
    },
    fileUrl: {
        type: String, // URL or path to uploaded file
    },
    fileSize: {
        type: Number, // In bytes
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    processedAt: {
        type: Date, // When AI processing completed
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'failed'],
        default: 'processing',
    },
}, {
    timestamps: true,
});

// Index for faster user document lookups
documentSchema.index({ userId: 1, createdAt: -1 });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
