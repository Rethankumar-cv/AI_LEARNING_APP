import React from 'react';
import { motion } from 'framer-motion';

/**
 * Typing Indicator Animation
 */
const TypingIndicator = () => {
    return (
        <div className="flex items-center gap-1 px-4 py-3 bg-slate-100 rounded-2xl w-fit">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                    }}
                />
            ))}
        </div>
    );
};

export default TypingIndicator;
