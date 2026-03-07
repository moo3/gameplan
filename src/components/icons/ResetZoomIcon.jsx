import React from 'react';

export const ResetZoomIcon = ({ className = '', height = 24, width = 24 }) => (
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
        <path d="M15 3h6v6" />
        <path d="M9 21H3v-6" />
        <path d="M21 3l-7 7" />
        <path d="M3 21l7-7" />
    </svg>
);
