import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { formatFileSize } from '../../utils/helpers';
import Button from '../common/Button';
import clsx from 'clsx';

/**
 * Upload Zone Component with Drag & Drop
 */
const UploadZone = () => {
    const { uploadDocument, loading } = useDocuments();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [error, setError] = useState('');

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const validateFile = (file) => {
        if (!file) return 'No file selected';

        // Check if PDF
        if (file.type !== 'application/pdf') {
            return 'Only PDF files are allowed';
        }

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return 'File size must be less than 10MB';
        }

        return null;
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        const validationError = validateFile(droppedFile);

        if (validationError) {
            setError(validationError);
            return;
        }

        setFile(droppedFile);
        setError('');
    }, []);

    const handleFileInput = (e) => {
        const selectedFile = e.target.files[0];
        const validationError = validateFile(selectedFile);

        if (validationError) {
            setError(validationError);
            return;
        }

        setFile(selectedFile);
        setError('');
    };

    const simulateProgress = () => {
        return new Promise((resolve) => {
            let currentProgress = 0;
            const interval = setInterval(() => {
                currentProgress += Math.random() * 30;
                if (currentProgress >= 100) {
                    currentProgress = 100;
                    clearInterval(interval);
                    resolve();
                }
                setProgress(Math.min(currentProgress, 100));
            }, 200);
        });
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setUploading(true);
            setProgress(0);

            // Simulate progress
            await simulateProgress();

            // Upload file
            await uploadDocument(file);

            setUploadComplete(true);

            // Reset after 2 seconds
            setTimeout(() => {
                setFile(null);
                setProgress(0);
                setUploading(false);
                setUploadComplete(false);
            }, 2000);
        } catch (err) {
            setError(err.message || 'Upload failed');
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setFile(null);
        setProgress(0);
        setUploading(false);
        setUploadComplete(false);
        setError('');
    };

    return (
        <div className="mb-8">
            <AnimatePresence mode="wait">
                {!file ? (
                    // Upload Zone
                    <motion.div
                        key="upload-zone"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={clsx(
                            'bg-white/70 backdrop-blur-md border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300',
                            isDragging
                                ? 'border-primary-500 bg-primary-50/50 scale-105'
                                : 'border-slate-300 hover:border-primary-400'
                        )}
                    >
                        <div className="flex flex-col items-center">
                            <div className={clsx(
                                'w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center mb-4 transition-all duration-300 shadow-lg',
                                isDragging
                                    ? 'from-primary-500 via-purple-500 to-pink-500 scale-110 animate-pulse'
                                    : 'from-slate-200 to-slate-300'
                            )}>
                                <Upload className={clsx('w-10 h-10', isDragging ? 'text-white animate-bounce' : 'text-slate-600')} />
                            </div>

                            <h3 className="text-xl font-display font-semibold text-slate-900 mb-2">
                                {isDragging ? '✨ Drop your PDF here! ✨' : '📄 Upload PDF Document'}
                            </h3>

                            <p className="text-sm text-slate-600 mb-4">
                                Drag and drop your file or click to browse 🎯
                            </p>

                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileInput}
                                className="hidden"
                                id="file-upload"
                            />

                            <label htmlFor="file-upload">
                                <Button variant="primary" as="span">
                                    Choose File
                                </Button>
                            </label>

                            <p className="text-xs text-slate-500 mt-4">
                                PDF files only. Max size: 10MB
                            </p>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 text-sm text-red-600 font-medium"
                            >
                                {error}
                            </motion.p>
                        )}
                    </motion.div>
                ) : (
                    // File Preview & Upload
                    <motion.div
                        key="file-preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/70 backdrop-blur-md border border-white/20 shadow-glass rounded-2xl p-6"
                    >
                        <div className="flex items-start gap-4">
                            {/* File Icon */}
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                {uploadComplete ? (
                                    <CheckCircle className="w-6 h-6 text-white animate-bounce-in" />
                                ) : (
                                    <FileText className="w-6 h-6 text-white" />
                                )}
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 truncate">
                                    {file.name}
                                </h4>
                                <p className="text-sm text-slate-500">
                                    {formatFileSize(file.size)}
                                </p>

                                {/* Progress Bar */}
                                {uploading && (
                                    <div className="mt-3">
                                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-gradient-to-r from-primary-600 to-primary-700"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-600 mt-1">
                                            {Math.round(progress)}% uploaded
                                        </p>
                                    </div>
                                )}

                                {uploadComplete && (
                                    <p className="text-sm text-green-600 font-semibold mt-2">
                                        ✓ Upload complete!
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            {!uploading && !uploadComplete && (
                                <button
                                    onClick={handleCancel}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Upload Button */}
                        {!uploading && !uploadComplete && (
                            <div className="mt-6 flex justify-end gap-3">
                                <Button variant="secondary" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleUpload}
                                    loading={uploading}
                                >
                                    Upload Document
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UploadZone;
