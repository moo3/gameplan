import React from 'react';

export const CheckIcon = ({ className = '', height = 16, width = 16 }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        height={height}
        width={width}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
