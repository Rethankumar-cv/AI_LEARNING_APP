import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import PDFViewer from '../components/documents/PDFViewer';
import AIActionPanel from '../components/documents/AIActionPanel';
import Button from '../components/common/Button';

/**
 * Document Viewer Page with AI Features
 */
const DocumentViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getDocument, loading } = useDocuments();
    const [document, setDocument] = useState(null);

    useEffect(() => {
        loadDocument();
    }, [id]);

    const loadDocument = async () => {
        try {
            const doc = await getDocument(id);
            setDocument(doc);
        } catch (error) {
            console.error('Error loading document:', error);
            navigate('/documents');
        }
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

    if (!document) {
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
                        {document.name}
                    </h2>
                </div>
            </motion.div>

            {/* Viewer Layout: PDF (70%) | AI Panel (30%) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-250px)]">
                {/* PDF Viewer - 2 columns on large screens */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <PDFViewer document={document} />
                </motion.div>

                {/* AI Action Panel - 1 column on large screens */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <AIActionPanel document={document} />
                </motion.div>
            </div>
        </div>
    );
};

export default DocumentViewer;
