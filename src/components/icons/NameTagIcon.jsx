import React from 'react';

export const NameTagIcon = ({ className = "", height = 24, width = 24 }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" height={height} width={width}>
        <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7V5h10v14zM8 15h8v2H8zm0-4h8v2H8zm0-4h5v2H8z" />
    </svg>
);
