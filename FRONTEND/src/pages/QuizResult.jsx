import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RotateCw, Home } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import Button from '../components/common/Button';
import clsx from 'clsx';

/**
 * Quiz Result Page
 */
const QuizResult = () => {
    const navigate = useNavigate();
    const { results, retryQuiz } = useQuiz();

    if (!results) {
        navigate('/quiz');
        return null;
    }

    const { score, correct, total, questionResults } = results;
    const percentage = score;
    const isPerfect = percentage === 100;

    const handleRetry = () => {
        retryQuiz();
        navigate('/quiz');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Score Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={clsx(
                    'rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden',
                    percentage >= 80 ? 'bg-gradient-to-br from-green-500 to-green-700' :
                        percentage >= 60 ? 'bg-gradient-to-br from-yellow-500 to-orange-600' :
                            'bg-gradient-to-br from-red-500 to-red-700'
                )}
            >
                {/* Confetti for perfect score */}
                {isPerfect && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-white rounded-full"
                                initial={{
                                    top: '50%',
                                    left: '50%',
                                    opacity: 1,
                                }}
                                animate={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.1,
                                    repeat: Infinity,
                                }}
                            />
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="relative z-10"
                >
                    <h1 className="text-6xl md:text-8xl font-display font-bold mb-4">
                        {percentage}%
                    </h1>

                    <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                        {isPerfect ? '🎉 Perfect Score!' :
                            percentage >= 80 ? '✨ Great Job!' :
                                percentage >= 60 ? '👍 Good Work!' :
                                    '💪 Keep Practicing!'}
                    </h2>

                    <p className="text-lg opacity-90">
                        You got {correct} out of {total} questions correct
                    </p>
                </motion.div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
                <Button
                    variant="primary"
                    onClick={handleRetry}
                    icon={<RotateCw className="w-5 h-5" />}
                >
                    Retry Quiz
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => navigate('/dashboard')}
                    icon={<Home className="w-5 h-5" />}
                >
                    Go to Dashboard
                </Button>
            </div>

            {/* Question Review */}
            <div className="space-y-4">
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                    Review Your Answers
                </h3>

                {questionResults && questionResults.length > 0 ? (
                    questionResults.map((result, index) => (
                        <motion.div
                            key={result.questionId || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/70 backdrop-blur-md border border-white/20 shadow-glass rounded-2xl p-6"
                        >
                            {/* Question Header */}
                            <div className="flex items-start gap-3 mb-4">
                                {result.isCorrect ? (
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                ) : (
                                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                                        Question {index + 1}: {result.question}
                                    </h4>
                                </div>
                            </div>

                            {/* User Answer & Correct Answer */}
                            <div className="space-y-3 mb-4">
                                {!result.isCorrect && (
                                    <>
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                                            <div className="flex items-start gap-2">
                                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-semibold text-red-900 dark:text-red-100">Your Answer:</p>
                                                    <p className="text-sm text-red-800 dark:text-red-200 mt-1">{result.userAnswerText}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-semibold text-green-900 dark:text-green-100">Correct Answer:</p>
                                                    <p className="text-sm text-green-800 dark:text-green-200 mt-1">{result.correctAnswerText}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {result.isCorrect && (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-semibold text-green-600">You answered correctly!</span>
                                    </div>
                                )}
                            </div>

                            {/* Explanation */}
                            {result.explanation && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                        Explanation:
                                    </p>
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        {result.explanation}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <p>No detailed results available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizResult;
