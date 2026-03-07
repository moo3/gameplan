import React from 'react';

export const CloseIcon = ({ className = '', height = 24, width = 24 }) => (
    <svg
        className={className}
        strokeLinejoin="round"
        stroke="currentColor"
        strokeLinecap="round"
        viewBox="0 0 24 24"
        height={height}
        strokeWidth="2"
        width={width}
        fill="none"
    >
        <line x1="18" y2="18" y1="6" x2="6"></line>
        <line x2="18" y2="18" x1="6" y1="6"></line>
    </svg>
);
