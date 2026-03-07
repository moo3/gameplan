import React from 'react';

import { CloseIcon } from './icons';

const Sidebar = ({
    focusedPlayerIndex,
    isOpen,
    onClose,
    onPlayerFocus,
    onPlayerNameChange,
    playerNames,
}) => {
    return (
        <>
            {/* Backdrop overlay — closes sidebar on click */}
            <div className={`sidebar-backdrop${isOpen ? ' visible' : ''}`} onClick={onClose} />
            <div className={`sidebar${isOpen ? ' open' : ''}`}>
                <div className="sidebar-header">
                    <span className="sidebar-section-label">Player Names</span>
                    <button
                        className="sidebar-close-btn"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        <CloseIcon height={18} width={18} />
                    </button>
                </div>

                <div className="name-inputs">
                    {playerNames.map((name, index) => {
                        // Skip the Batter (index 0)
                        if (index === 0) return null;

                        // Index 1 is WK, Index 2 is Bowler
                        let label = `Player ${index}`;
                        if (index === 1) label = 'WK';
                        if (index === 2) label = 'Bowler';

                        const isFocused = focusedPlayerIndex === index;

                        return (
                            <input
                                key={index}
                                className={`name-input${isFocused ? ' highlighted' : ''}`}
                                onChange={(e) => onPlayerNameChange(index, e.target.value)}
                                onFocus={() => onPlayerFocus(index)}
                                onBlur={() => onPlayerFocus(null)}
                                placeholder={label}
                                value={name}
                                type="text"
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
