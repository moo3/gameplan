import React from 'react';

export const MenuIcon = ({ className = "", height = 20, width = 20 }) => (
    <svg className={className} stroke="currentColor" strokeLinecap="round" viewBox="0 0 24 24" height={height} strokeWidth="2" width={width} fill="none">
        <line x2="21" x1="3" y1="6" y2="6" />
        <line y1="12" x2="21" y2="12" x1="3" />
        <line y1="18" x2="21" y2="18" x1="3" />
    </svg>
);
