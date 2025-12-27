import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import Button from '../common/Button';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * PDF Viewer Component using react-pdf
 */
const PDFViewer = ({ document }) => {
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
        setError(null);
    };

    const onDocumentLoadError = (error) => {
        console.error('Error loading PDF:', error);
        setError('Failed to load PDF. Please try again.');
        setLoading(false);
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.25, 2.0));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, numPages || 1));
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    // Get the PDF URL from the document
    // Backend now provides 'url' field with full path
    const pdfUrl = document?.url || document?.fileUrl;

    if (!pdfUrl) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <div className="text-center p-8">
                    <p className="text-slate-600 dark:text-slate-400">No PDF source available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
            {/* Controls */}
            <div className="bg-white dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 px-4 py-3 flex items-center justify-between">
                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1 || loading}
                        icon={<ChevronLeft className="w-4 h-4" />}
                    >
                    </Button>

                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[100px] text-center">
                        {loading ? 'Loading...' : `Page ${currentPage} of ${numPages || '?'}`}
                    </span>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === numPages || loading}
                        icon={<ChevronRight className="w-4 h-4" />}
                    >
                    </Button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomOut}
                        disabled={zoom === 0.5}
                        icon={<ZoomOut className="w-4 h-4" />}
                    >
                    </Button>

                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[60px] text-center">
                        {Math.round(zoom * 100)}%
                    </span>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomIn}
                        disabled={zoom === 2.0}
                        icon={<ZoomIn className="w-4 h-4" />}
                    >
                    </Button>
                </div>
            </div>

            {/* PDF Display Area */}
            <div className="flex-1 overflow-auto p-4 flex items-start justify-center bg-slate-50 dark:bg-slate-900">
                {error ? (
                    <div className="text-center p-8">
                        <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Document: {document?.name}</p>
                    </div>
                ) : (
                    <div className="shadow-2xl">
                        <Document
                            file={pdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={
                                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-lg min-h-[600px]">
                                    <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                                    <p className="text-slate-600 dark:text-slate-400">Loading PDF...</p>
                                </div>
                            }
                        >
                            <Page
                                pageNumber={currentPage}
                                scale={zoom}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="bg-white dark:bg-slate-100"
                            />
                        </Document>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;
