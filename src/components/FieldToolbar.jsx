import React from 'react';

/**
 * SVG icon toggle buttons for field-level controls.
 * Positioned at top-right of the field container.
 */
// --- SVG Icons ---
import { BatterIcon, BoundaryIcon, CatchIcon, NameTagIcon, PositionIcon } from './icons';

// --- Component ---

const FieldToolbar = ({
    isLeftHanded,
    setIsLeftHanded,
    setShowBoundaryCoverage,
    setShowCatchCoverage,
    setShowNames,
    setShowPositions,
    showBoundaryCoverage,
    showCatchCoverage,
    showNames,
    showPositions,
}) => {
    const buttons = [
        {
            active: showNames,
            icon: <NameTagIcon />,
            key: 'playerNames',
            label: 'Player Names',
            toggle: () => setShowNames(!showNames),
        },
        {
            active: showPositions,
            icon: <PositionIcon />,
            key: 'positions',
            label: 'Positions',
            toggle: () => setShowPositions(!showPositions),
        },
        {
            active: isLeftHanded,
            icon: <BatterIcon leftHanded={isLeftHanded} />,
            key: 'batter',
            label: isLeftHanded ? 'Switch to Right-Handed' : 'Switch to Left-Handed',
            toggle: () => setIsLeftHanded(!isLeftHanded),
        },
        {
            active: showBoundaryCoverage,
            icon: <BoundaryIcon />,
            key: 'boundary',
            label: 'Boundary Coverage',
            toggle: () => setShowBoundaryCoverage(!showBoundaryCoverage),
        },
        {
            active: showCatchCoverage,
            icon: <CatchIcon />,
            key: 'catch',
            label: 'Catch Coverage',
            toggle: () => setShowCatchCoverage(!showCatchCoverage),
        },
    ];

    return (
        <div className="field-toolbar">
            {buttons.map((buttonItem) => (
                <button
                    key={buttonItem.key}
                    className={`field-toolbar-btn${buttonItem.active ? ' active' : ''}`}
                    onClick={buttonItem.toggle}
                    data-tooltip={buttonItem.label}
                    aria-label={buttonItem.label}
                >
                    {buttonItem.icon}
                </button>
            ))}
        </div>
    );
};

export default FieldToolbar;
