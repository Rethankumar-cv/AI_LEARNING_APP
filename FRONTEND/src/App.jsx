import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';
import { AIProvider } from './context/AIContext';
import { QuizProvider } from './context/QuizContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import DocumentViewer from './pages/DocumentViewer';
import Flashcards from './pages/Flashcards';
import FlashcardsFavorites from './pages/FlashcardsFavorites';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import { ToastContainer } from './components/common/Toast';
import useToast from './hooks/useToast';

/**
 * App Provider Wrapper with Toast
 */
const AppProviders = ({ children }) => {
    const toast = useToast();

    return (
        <ThemeProvider>
            <AuthProvider>
                <DocumentProvider>
                    <AIProvider>
                        <QuizProvider>
                            {children}
                            <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
                        </QuizProvider>
                    </AIProvider>
                </DocumentProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

/**
 * Main App Component
 */
function App() {
    return (
        <BrowserRouter>
            <AppProviders>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="documents" element={<Documents />} />
                        <Route path="documents/:id" element={<DocumentViewer />} />
                        <Route path="flashcards" element={<Flashcards />} />
                        <Route path="flashcards/favorites" element={<FlashcardsFavorites />} />
                        <Route path="quiz" element={<Quiz />} />
                        <Route path="quiz/:id" element={<Quiz />} />
                        <Route path="quiz/result" element={<QuizResult />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="achievements" element={<Achievements />} />
                    </Route>

                    {/* Fallback - Redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AppProviders>

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </BrowserRouter>
    );
}

export default App;
