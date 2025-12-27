import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import TypingIndicator from './TypingIndicator';
import Button from '../common/Button';
import { formatRelativeTime } from '../../utils/helpers';
import clsx from 'clsx';

/**
 * ChatGPT-style Chat UI Component
 */
const ChatUI = ({ documentId }) => {
    const { chatMessages, typing, sendMessage } = useAI();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, typing]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const message = input.trim();
        setInput('');

        try {
            await sendMessage(message, documentId);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {chatMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center">
                        <div>
                            <Bot className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 text-sm">
                                Ask me anything about this document!
                            </p>
                            <p className="text-slate-400 text-xs mt-2">
                                I can explain concepts, summarize sections, or answer questions.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <AnimatePresence>
                            {chatMessages.map((msg, index) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={clsx(
                                        'flex gap-3',
                                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {/* AI Avatar */}
                                    {msg.sender === 'ai' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div
                                        className={clsx(
                                            'max-w-[80%] px-4 py-3 rounded-2xl',
                                            msg.sender === 'user'
                                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                                                : 'bg-slate-100 text-slate-900'
                                        )}
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {msg.message}
                                        </p>
                                        <p
                                            className={clsx(
                                                'text-xs mt-1',
                                                msg.sender === 'user' ? 'text-primary-100' : 'text-slate-500'
                                            )}
                                        >
                                            {formatRelativeTime(msg.timestamp)}
                                        </p>
                                    </div>

                                    {/* User Avatar */}
                                    {msg.sender === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing Indicator */}
                        {typing && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <TypingIndicator />
                            </motion.div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about this document..."
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                        disabled={typing}
                    />
                    <Button
                        variant="primary"
                        onClick={handleSend}
                        disabled={!input.trim() || typing}
                        icon={<Send className="w-5 h-5" />}
                    >
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatUI;
