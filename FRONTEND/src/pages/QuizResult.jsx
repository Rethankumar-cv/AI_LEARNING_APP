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
                <h3 className="text-xl font-display font-bold text-slate-900">
                    Review Your Answers
                </h3>

                {questionResults.map((result, index) => (
                    <motion.div
                        key={result.questionId}
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
                                <h4 className="font-semibold text-slate-900 mb-2">
                                    Question {index + 1}: {result.question}
                                </h4>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-2 mb-4">
                            {result.options.map((option, optionIndex) => (
                                <div
                                    key={optionIndex}
                                    className={clsx(
                                        'p-3 rounded-lg text-sm',
                                        optionIndex === result.correctAnswer && 'bg-green-100 border-2 border-green-300',
                                        optionIndex === result.userAnswer && optionIndex !== result.correctAnswer && 'bg-red-100 border-2 border-red-300',
                                        optionIndex !== result.correctAnswer && optionIndex !== result.userAnswer && 'bg-slate-50'
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {optionIndex === result.correctAnswer && (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        )}
                                        {optionIndex === result.userAnswer && optionIndex !== result.correctAnswer && (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className={clsx(
                                            optionIndex === result.correctAnswer && 'font-semibold text-green-900',
                                            optionIndex === result.userAnswer && optionIndex !== result.correctAnswer && 'font-semibold text-red-900'
                                        )}>
                                            {option}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Explanation */}
                        {result.explanation && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <p className="text-sm font-semibold text-blue-900 mb-1">
                                    Explanation:
                                </p>
                                <p className="text-sm text-blue-800">
                                    {result.explanation}
                                </p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default QuizResult;
