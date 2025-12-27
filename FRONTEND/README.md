# AI-Powered Learning Assistant

A production-grade, AI-powered learning assistant built with React, Tailwind CSS, and modern web technologies. This is a frontend-only implementation with mocked backend functionality, designed to provide a premium SaaS-like user experience.

## 🚀 Features

- **Authentication System** - Secure login/signup with mock JWT authentication
- **Dashboard** - Real-time learning analytics and progress tracking
- **Document Management** - Upload, view, and manage PDF documents
- **AI Chat** - ChatGPT-style interface for document Q&A
- **Flashcards** - Interactive flip cards with favorites system
- **Quiz System** - Multiple-choice quizzes with detailed results
- **Analytics** - Performance tracking and achievement badges
- **Responsive Design** - Mobile-first, works beautifully on all devices

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling with custom design system
- **React Router v6** - Client-side routing
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful data visualizations
- **Lucide React** - Modern icon library
- **React PDF** - PDF viewing capabilities

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

- **Primary Colors**: Indigo/Violet gradient
- **Secondary Colors**: Emerald & Orange accents
- **Typography**: Inter (body), Outfit (headings)
- **Effects**: Glassmorphism, smooth animations, micro-interactions

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── layouts/        # Layout components
├── context/        # React Context providers
├── services/       # Mock API services
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
└── App.jsx         # Main app component
```

## 🔐 Mock Authentication

The app uses localStorage for mock authentication. Default credentials:
- Email: demo@example.com
- Password: password123

## 🧪 Features in Detail

### Dashboard
- 4 animated stat cards (Documents, Flashcards, Quizzes, Streak)
- Learning progress chart with gradient
- Recent activity timeline

### Documents
- Drag & drop PDF upload
- File validation and progress animation
- PDF viewer with AI action panel
- Chat, Summary, Flashcards, Quiz tabs

### Flashcards
- 3D flip animation
- Favorite/unfavorite functionality
- Progress tracking
- Dedicated favorites page

### Quiz
- Multiple choice questions
- Progress bar
- Detailed results with explanations
- Score visualization

### Analytics
- Performance line charts
- Achievement badge system
- Completion statistics

## 🎯 State Management

The app uses React Context API for global state:
- **AuthContext** - User authentication
- **DocumentContext** - Document management
- **AIContext** - AI interactions
- **QuizContext** - Quiz state

## 📱 Responsive Design

- Desktop: Sidebar navigation
- Mobile: Bottom navigation bar
- Tablet: Optimized layouts
- All interactions work seamlessly across devices

## 🚧 Future Enhancements

- Real backend integration
- WebSocket for real-time AI responses
- Advanced analytics
- Collaborative features
- Mobile app (React Native)

## 📄 License

MIT License - feel free to use this project for learning or as a template!

## 👨‍💻 Developer

Built with ❤️ using modern web technologies.
