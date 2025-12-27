import React from 'react';

/**
 * Purple Wave SVG Decoration for Sign In Page
 * Based on reference image design - creates organic wavy shapes
 */
const PurpleWave = ({ className = '', position = 'top' }) => {
    if (position === 'top') {
        return (
            <svg
                viewBox="0 0 600 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                preserveAspectRatio="xMaxYMin slice"
            >
                <defs>
                    <linearGradient id="topWaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#5B21B6" />
                    </linearGradient>
                </defs>
                <path
                    d="M600 0C600 0 500 80 400 100C300 120 200 90 100 60C50 45 0 20 0 20V0H600Z"
                    fill="url(#topWaveGradient)"
                />
                <path
                    d="M600 50C600 50 520 130 420 140C320 150 220 120 120 100C70 90 20 70 0 60V0H600V50Z"
                    fill="url(#topWaveGradient)"
                    opacity="0.8"
                />
            </svg>
        );
    } else {
        return (
            <svg
                viewBox="0 0 600 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                preserveAspectRatio="xMaxYMax slice"
            >
                <defs>
                    <linearGradient id="bottomWaveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#5B21B6" />
                    </linearGradient>
                </defs>
                <path
                    d="M600 400C600 400 500 320 400 300C300 280 200 310 100 340C50 355 0 380 0 380V400H600Z"
                    fill="url(#bottomWaveGradient)"
                />
                <path
                    d="M600 350C600 350 520 270 420 260C320 250 220 280 120 300C70 310 20 330 0 340V400H600V350Z"
                    fill="url(#bottomWaveGradient)"
                    opacity="0.8"
                />
            </svg>
        );
    }
};

export default PurpleWave;

