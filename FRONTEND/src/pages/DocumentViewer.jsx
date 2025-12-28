import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import { documentsAPI } from '../services/api';
import PDFViewer from '../components/documents/PDFViewer';
import AIActionPanel from '../components/documents/AIActionPanel';
import ExplanationModal from '../components/documents/ExplanationModal';
import Button from '../components/common/Button';

/**
 * Document Viewer Page with AI Features
 */
const DocumentViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getDocument, loading } = useDocuments();
    const [currentDocument, setCurrentDocument] = useState(null);

    // Explanation feature state
    const [selectedText, setSelectedText] = useState('');
    const [showExplanation, setShowExplanation] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [explanationLoading, setExplanationLoading] = useState(false);
    const [showExplainButton, setShowExplainButton] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        loadDocument();
    }, [id]);

    // Handle text selection
    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            const text = selection.toString().trim();

            if (text && text.length > 5) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                setSelectedText(text);
                setButtonPosition({
                    x: rect.left + (rect.width / 2),
                    y: rect.bottom + window.scrollY + 10
                });
                setShowExplainButton(true);
            } else {
                setShowExplainButton(false);
            }
        };

        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('touchend', handleSelection);

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('touchend', handleSelection);
        };
    }, []);

    const loadDocument = async () => {
        try {
            const doc = await getDocument(id);
            setCurrentDocument(doc);
        } catch (error) {
            console.error('Error loading document:', error);
            navigate('/documents');
        }
    };

    const handleExplain = async () => {
        if (!selectedText || !id) return;

        setShowExplainButton(false);
        setExplanationLoading(true);
        setShowExplanation(true);
        setExplanation('');

        try {
            const result = await documentsAPI.explainText(id, selectedText);
            if (result.success) {
                setExplanation(result.explanation);
            } else {
                setExplanation('Failed to generate explanation. Please try again.');
            }
        } catch (error) {
            console.error('Explanation error:', error);
            setExplanation('Failed to generate explanation. Please try again.');
        } finally {
            setExplanationLoading(false);
        }
    };

    const handleCloseExplanation = () => {
        setShowExplanation(false);
        setSelectedText('');
        setExplanation('');
        window.getSelection().removeAllRanges();
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-slate-600">Loading document...</p>
                </div>
            </div>
        );
    }

    if (!currentDocument) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <Button
                    variant="ghost"
                    onClick={() => navigate('/documents')}
                    icon={<ArrowLeft className="w-5 h-5" />}
                >
                    Back to Documents
                </Button>

                <div className="flex-1">
                    <h2 className="text-xl font-display font-bold text-slate-900 truncate">
                        {currentDocument.name}
                    </h2>
                </div>
            </motion.div>

            {/* Floating Explain Button */}
            {showExplainButton && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                        position: 'absolute',
                        left: `${buttonPosition.x}px`,
                        top: `${buttonPosition.y}px`,
                        transform: 'translateX(-50%)',
                        zIndex: 40
                    }}
                >
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleExplain}
                        icon={<Lightbulb className="w-4 h-4" />}
                        className="shadow-lg"
                    >
                        Explain
                    </Button>
                </motion.div>
            )}

            {/* Viewer Layout: PDF (70%) | AI Panel (30%) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-250px)]">
                {/* PDF Viewer - 2 columns on large screens */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <PDFViewer document={currentDocument} />
                </motion.div>

                {/* AI Action Panel - 1 column on large screens */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <AIActionPanel document={currentDocument} />
                </motion.div>
            </div>

            {/* Explanation Modal */}
            <ExplanationModal
                isOpen={showExplanation}
                onClose={handleCloseExplanation}
                selectedText={selectedText}
                explanation={explanation}
                loading={explanationLoading}
            />
        </div>
    );
};

export default DocumentViewer;
