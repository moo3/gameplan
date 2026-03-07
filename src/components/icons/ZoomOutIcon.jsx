import React from 'react';

export const ZoomOutIcon = ({ className = '', height = 24, width = 24 }) => (
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
        <circle cx="11" cy="11" r="8" />
        <line x2="16.65" y2="16.65" x1="21" y1="21" />
        <line y1="11" x2="14" y2="11" x1="8" />
    </svg>
);
