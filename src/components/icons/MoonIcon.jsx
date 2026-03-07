import React from 'react';

export const MoonIcon = ({ className = '', height = 18, width = 18 }) => (
    <svg
        className={className}
        stroke="currentColor"
        strokeLinecap="round"
        viewBox="0 0 24 24"
        height={height}
        strokeWidth="2"
        width={width}
        fill="none"
    >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);
