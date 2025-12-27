import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Eye, Trash2 } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { formatFileSize, formatDate } from '../../utils/helpers';
import Button from '../common/Button';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';
import clsx from 'clsx';

/**
 * Document List Component
 */
const DocumentList = () => {
    const navigate = useNavigate();
    const { documents, deleteDocument, loading } = useDocuments();
    const [deleteModal, setDeleteModal] = useState(null);

    const handleDelete = async () => {
        if (!deleteModal) return;

        try {
            await deleteDocument(deleteModal.id);
            setDeleteModal(null);
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    if (documents.length === 0) {
        return (
            <EmptyState
                icon="📄"
                title="No documents yet"
                description="Upload your first PDF document to get started with AI-powered learning"
            />
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc, index) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="bg-white/70 backdrop-blur-md border border-white/20 shadow-glass rounded-2xl p-6 hover:shadow-glass-lg transition-all duration-300 group"
                    >
                        {/* Document Icon */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-white" />
                        </div>

                        {/* Document Info */}
                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {doc.name}
                        </h3>

                        <div className="space-y-1 mb-4">
                            <p className="text-sm text-slate-500">
                                {formatFileSize(doc.size)}
                            </p>
                            <p className="text-xs text-slate-400">
                                {formatDate(doc.uploadedAt)}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                className="flex-1"
                                onClick={() => navigate(`/documents/${doc.id}`)}
                                icon={<Eye className="w-4 h-4" />}
                            >
                                View
                            </Button>

                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setDeleteModal(doc)}
                                icon={<Trash2 className="w-4 h-4" />}
                            >
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteModal}
                onClose={() => setDeleteModal(null)}
                title="Delete Document"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-slate-700">
                        Are you sure you want to delete <span className="font-semibold">{deleteModal?.name}</span>?
                        This action cannot be undone.
                    </p>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModal(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            loading={loading}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default DocumentList;
