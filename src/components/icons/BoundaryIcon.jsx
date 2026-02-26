import React from 'react';

export const BoundaryIcon = ({ className = "", height = 20, width = 20 }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" height={height} width={width}>
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" opacity="0.85" />
    </svg>
);
