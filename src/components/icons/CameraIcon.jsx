import React from 'react';

export const CameraIcon = ({ className = "", height = 20, width = 20 }) => (
    <svg className={className} strokeLinejoin="round" stroke="currentColor" strokeLinecap="round" viewBox="0 0 24 24" height={height} strokeWidth="2" width={width} fill="none">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);
