import { simulateAsync, generateId } from '../utils/helpers';

// Mock user data
export const mockUsers = [
    {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'password123',
        avatar: null,
        createdAt: new Date('2024-01-01'),
    }
];

// Mock documents
export const mockDocuments = [
    {
        id: '1',
        name: 'React Concepts Detailed.pdf',
        size: 2456789,
        type: 'application/pdf',
        uploadedAt: new Date('2024-12-20'),
        url: '/sample.pdf',
    },
    {
        id: '2',
        name: 'A Comprehensive CSS Guide to Styling the Modern Web.pdf',
        size: 3245678,
        type: 'application/pdf',
        uploadedAt: new Date('2024-12-22'),
        url: '/sample.pdf',
    },
    {
        id: '3',
        name: 'JavaScript Core Concepts and Modern Development.pdf',
        size: 4123456,
        type: 'application/pdf',
        uploadedAt: new Date('2024-12-23'),
        url: '/sample.pdf',
    },
    {
        id: '4',
        name: 'Ultimate HTML Guide.pdf',
        size: 1987654,
        type: 'application/pdf',
        uploadedAt: new Date('2024-12-23'),
        url: '/sample.pdf',
    },
];

// Mock flashcards
export const mockFlashcards = [
    {
        id: '1',
        documentId: '1',
        question: 'What is React?',
        answer: 'React is a JavaScript library for building user interfaces, particularly single-page applications. It allows developers to create reusable UI components.',
        isFavorite: false,
    },
    {
        id: '2',
        documentId: '1',
        question: 'What are React Hooks?',
        answer: 'Hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, and useContext.',
        isFavorite: true,
    },
    {
        id: '3',
        documentId: '1',
        question: 'What is the Virtual DOM?',
        answer: 'The Virtual DOM is a lightweight copy of the actual DOM. React uses it to optimize updates by comparing changes and only updating what is necessary.',
        isFavorite: false,
    },
    {
        id: '4',
        documentId: '2',
        question: 'What is CSS Flexbox?',
        answer: 'Flexbox is a one-dimensional layout method for arranging items in rows or columns. It provides efficient space distribution and alignment capabilities.',
        isFavorite: true,
    },
    {
        id: '5',
        documentId: '2',
        question: 'What is CSS Grid?',
        answer: 'CSS Grid is a two-dimensional layout system that allows you to create complex layouts with rows and columns simultaneously.',
        isFavorite: false,
    },
];

// Mock quizzes
export const mockQuizzes = [
    {
        id: '1',
        documentId: '1',
        title: 'React Fundamentals Quiz',
        questions: [
            {
                id: 'q1',
                question: 'Which hook is used to manage state in functional components?',
                options: ['useEffect', 'useState', 'useContext', 'useReducer'],
                correctAnswer: 1,
                explanation: 'useState is the hook used to add state to functional components. It returns an array with the current state value and a function to update it.',
            },
            {
                id: 'q2',
                question: 'What does JSX stand for?',
                options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
                correctAnswer: 0,
                explanation: 'JSX stands for JavaScript XML. It allows you to write HTML-like code in JavaScript files.',
            },
            {
                id: 'q3',
                question: 'Which method is used to render a React component to the DOM?',
                options: ['React.render()', 'ReactDOM.render()', 'render()', 'mount()'],
                correctAnswer: 1,
                explanation: 'ReactDOM.render() is used to render a React component to the DOM. In React 18+, createRoot is the preferred method.',
            },
        ],
    },
];

// Mock analytics data
export const mockAnalytics = {
    weeklyProgress: [
        { day: 'Mon', hours: 2.5 },
        { day: 'Tue', hours: 3.2 },
        { day: 'Wed', hours: 1.8 },
        { day: 'Thu', hours: 4.1 },
        { day: 'Fri', hours: 2.9 },
        { day: 'Sat', hours: 3.5 },
        { day: 'Sun', hours: 2.2 },
    ],
    achievements: [
        {
            id: '1',
            title: 'React Rookie',
            description: 'Complete your first React quiz',
            icon: '⚛️',
            unlocked: true,
            unlockedAt: new Date('2024-12-20'),
        },
        {
            id: '2',
            title: 'Speed Reader',
            description: 'Read 10 documents',
            icon: '📚',
            unlocked: false,
            progress: 4,
            target: 10,
        },
        {
            id: '3',
            title: 'Quiz Master',
            description: 'Score 100% on 5 quizzes',
            icon: '🏆',
            unlocked: false,
            progress: 1,
            target: 5,
        },
        {
            id: '4',
            title: 'Flashcard Pro',
            description: 'Create 50 flashcards',
            icon: '🎯',
            unlocked: true,
            unlockedAt: new Date('2024-12-22'),
        },
        {
            id: '5',
            title: '7-Day Streak',
            description: 'Study for 7 consecutive days',
            icon: '🔥',
            unlocked: false,
            progress: 4,
            target: 7,
        },
        {
            id: '6',
            title: 'Document Uploader',
            description: 'Upload 5 documents',
            icon: '📄',
            unlocked: true,
            unlockedAt: new Date('2024-12-21'),
        },
    ],
};

// Mock recent activities
export const mockActivities = [
    {
        id: '1',
        type: 'document',
        title: 'Accessed Document: React Concepts Detailed',
        timestamp: new Date('2024-12-26T09:41:10'),
        icon: '📄',
        color: 'blue',
    },
    {
        id: '2',
        type: 'document',
        title: 'Accessed Document: A Comprehensive CSS Guide to Styling the Modern Web',
        timestamp: new Date('2024-12-23T14:39:56'),
        icon: '📄',
        color: 'blue',
    },
    {
        id: '3',
        type: 'document',
        title: 'Accessed Document: JavaScript Core Concepts and Modern Development',
        timestamp: new Date('2024-12-23T14:39:54'),
        icon: '📄',
        color: 'blue',
    },
    {
        id: '4',
        type: 'document',
        title: 'Accessed Document: Ultimate HTML Guide',
        timestamp: new Date('2024-12-23T13:26:21'),
        icon: '📄',
        color: 'blue',
    },
    {
        id: '5',
        type: 'quiz',
        title: 'Completed Quiz: React Fundamentals',
        timestamp: new Date('2024-12-22T16:30:00'),
        icon: '✅',
        color: 'green',
    },
    {
        id: '6',
        type: 'flashcard',
        title: 'Reviewed 12 flashcards',
        timestamp: new Date('2024-12-22T11:15:00'),
        icon: '🎯',
        color: 'purple',
    },
];

// Mock AI responses
export const mockAIResponses = [
    "That's a great question! Let me help you understand that better.",
    "Based on the document, here's what I found...",
    "This concept is important because it forms the foundation of...",
    "To put it simply, think of it this way...",
    "Here's a practical example that might help clarify...",
];

// API Methods
export const mockApi = {
    // Authentication
    login: async (email, password) => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const token = 'mock-jwt-token-' + generateId();
        return simulateAsync({ user: { ...user, password: undefined }, token });
    },

    signup: async (name, email, password) => {
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const user = {
            id: generateId(),
            name,
            email,
            password,
            avatar: null,
            createdAt: new Date(),
        };
        mockUsers.push(user);
        const token = 'mock-jwt-token-' + generateId();
        return simulateAsync({ user: { ...user, password: undefined }, token });
    },

    // Documents
    getDocuments: async () => {
        // Load from localStorage if available
        const stored = localStorage.getItem('uploadedDocuments');
        if (stored) {
            try {
                const storedDocs = JSON.parse(stored);
                // Merge with mock documents
                const allDocs = [...mockDocuments, ...storedDocs];
                return simulateAsync(allDocs);
            } catch (e) {
                console.error('Error parsing stored documents:', e);
            }
        }
        return simulateAsync([...mockDocuments]);
    },

    uploadDocument: async (file) => {
        const doc = {
            id: generateId(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            url: URL.createObjectURL(file),
        };

        // Save to localStorage
        const stored = localStorage.getItem('uploadedDocuments');
        let uploadedDocs = [];
        if (stored) {
            try {
                uploadedDocs = JSON.parse(stored);
            } catch (e) {
                uploadedDocs = [];
            }
        }
        uploadedDocs.push(doc);
        localStorage.setItem('uploadedDocuments', JSON.stringify(uploadedDocs));

        return simulateAsync(doc);
    },

    deleteDocument: async (id) => {
        // Remove from localStorage if it exists there
        const stored = localStorage.getItem('uploadedDocuments');
        if (stored) {
            try {
                let uploadedDocs = JSON.parse(stored);
                uploadedDocs = uploadedDocs.filter(d => d.id !== id);
                localStorage.setItem('uploadedDocuments', JSON.stringify(uploadedDocs));
            } catch (e) {
                console.error('Error updating stored documents:', e);
            }
        }

        const index = mockDocuments.findIndex(d => d.id === id);
        if (index > -1) {
            mockDocuments.splice(index, 1);
        }
        return simulateAsync({ success: true });
    },

    getDocument: async (id) => {
        // Check localStorage first
        const stored = localStorage.getItem('uploadedDocuments');
        if (stored) {
            try {
                const uploadedDocs = JSON.parse(stored);
                const doc = uploadedDocs.find(d => d.id === id);
                if (doc) return simulateAsync(doc);
            } catch (e) {
                console.error('Error parsing stored documents:', e);
            }
        }

        // Fallback to mock documents
        const doc = mockDocuments.find(d => d.id === id);
        if (!doc) throw new Error('Document not found');
        return simulateAsync(doc);
    },

    // Flashcards
    getFlashcards: async (documentId) => {
        const cards = documentId
            ? mockFlashcards.filter(f => f.documentId === documentId)
            : mockFlashcards;
        return simulateAsync([...cards]);
    },

    toggleFavorite: async (id) => {
        const card = mockFlashcards.find(f => f.id === id);
        if (card) {
            card.isFavorite = !card.isFavorite;
        }
        return simulateAsync(card);
    },

    generateFlashcards: async (documentId) => {
        // Simulate AI generating flashcards
        const newCards = [
            {
                id: generateId(),
                documentId,
                question: 'What is the main concept discussed?',
                answer: 'The document discusses key principles and best practices in modern development.',
                isFavorite: false,
            },
            {
                id: generateId(),
                documentId,
                question: 'What are the benefits mentioned?',
                answer: 'Improved performance, better code organization, and enhanced developer experience.',
                isFavorite: false,
            },
        ];
        mockFlashcards.push(...newCards);
        return simulateAsync(newCards, 2000); // Longer delay for AI generation
    },

    // Quizzes
    getQuiz: async (documentId) => {
        const quiz = mockQuizzes.find(q => q.documentId === documentId) || mockQuizzes[0];
        return simulateAsync({ ...quiz });
    },

    generateQuiz: async (documentId) => {
        // Simulate AI generating quiz
        const quiz = {
            id: generateId(),
            documentId,
            title: 'Generated Quiz',
            questions: [
                {
                    id: 'q1',
                    question: 'What is the primary focus of this document?',
                    options: ['Basic concepts', 'Advanced techniques', 'Best practices', 'All of the above'],
                    correctAnswer: 3,
                    explanation: 'The document covers a comprehensive range of topics including basics, advanced concepts, and best practices.',
                },
            ],
        };
        return simulateAsync(quiz, 2000);
    },

    // AI Chat
    sendChatMessage: async (message, documentId) => {
        const randomResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
        const response = {
            id: generateId(),
            message: randomResponse + ' ' + message.slice(0, 50) + '...',
            sender: 'ai',
            timestamp: new Date(),
        };
        return simulateAsync(response, 1500);
    },

    generateSummary: async (documentId) => {
        const summary = {
            title: 'Document Summary',
            sections: [
                {
                    heading: 'Key Concepts',
                    points: [
                        'Understanding the fundamental principles',
                        'Practical applications and use cases',
                        'Common patterns and best practices',
                    ],
                },
                {
                    heading: 'Important Takeaways',
                    points: [
                        'Focus on building scalable solutions',
                        'Prioritize code maintainability',
                        'Leverage modern tools and frameworks',
                    ],
                },
            ],
            keywords: ['Development', 'Best Practices', 'Modern Approach', 'Scalability'],
        };
        return simulateAsync(summary, 2000);
    },

    // Analytics
    getAnalytics: async () => {
        return simulateAsync({ ...mockAnalytics });
    },

    getActivities: async () => {
        return simulateAsync([...mockActivities]);
    },

    // Stats
    getStats: async () => {
        return simulateAsync({
            totalDocuments: mockDocuments.length,
            totalFlashcards: mockFlashcards.length,
            totalQuizzes: 4,
            studyStreak: 4,
        });
    },
};

export default mockApi;
