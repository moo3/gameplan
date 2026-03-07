import React from 'react';

export const BatterIcon = ({ className = "", height = 24, leftHanded = false, width = 24 }) => (
    <svg
        className={className}
        style={leftHanded ? { transform: 'scaleX(-1)' } : undefined}
        viewBox="0 0 24 24"
        fill="currentColor"
        height={height}
        width={width}
    >
        <circle cx="14" cy="4" r="2" />
        <path d="M16 8.5l-2.5-1.5L11 8.5 9 21h2l1.5-7 2.5 3v4h2v-5.5l-2.5-3.5 1-4z" />
        <line
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
            x1="10"
            y1="8"
            x2="6"
            y2="3"
        />
    </svg>
);
