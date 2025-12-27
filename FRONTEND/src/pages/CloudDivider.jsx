import React from 'react';

/**
 * Organic Cloud Divider SVG for Sign In Page
 * Creates a soft, hand-drawn cloud shape cutting from left into purple section
 */
const CloudDivider = ({ className = '' }) => {
    return (
        <svg
            viewBox="0 0 100 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            preserveAspectRatio="none"
        >
            <path
                d="M0 0 
                   Q 20 50, 15 100
                   Q 10 150, 25 200
                   Q 30 250, 20 300
                   Q 15 350, 30 400
                   Q 25 450, 15 500
                   L 0 500
                   Z"
                fill="white"
            />
            <path
                d="M0 0 
                   Q 20 50, 15 100
                   Q 10 150, 25 200
                   Q 30 250, 20 300
                   Q 15 350, 30 400
                   Q 25 450, 15 500
                   Q 35 480, 40 450
                   Q 50 400, 45 350
                   Q 40 300, 55 250
                   Q 60 200, 50 150
                   Q 45 100, 60 50
                   Q 55 25, 40 0
                   Z"
                fill="white"
                opacity="0.8"
            />
            <path
                d="M40 0 
                   Q 55 25, 60 50
                   Q 70 100, 65 150
                   Q 60 200, 75 250
                   Q 80 300, 70 350
                   Q 65 400, 80 450
                   Q 75 475, 65 500
                   L 100 500
                   L 100 0
                   Z"
                fill="white"
            />
        </svg>
    );
};

export default CloudDivider;
