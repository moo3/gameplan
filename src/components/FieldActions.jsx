import React from 'react';

import { CameraIcon, HelpIcon, MenuIcon, MoonIcon, ShareIcon, SunIcon } from './icons';

/**
 * Left-side action buttons: theme toggle, sidebar toggle, download image, share, help.
 * Positioned at top-left of the field container.
 */
const FieldActions = ({ onDownloadImage, onOpenHelp, onOpenSidebar, onShare, setTheme, theme }) => {
    const isDark = theme === 'dark';

    return (
        <div className="field-actions">
            <div className="field-actions-top-row">
                <button
                    className="field-toolbar-btn"
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    data-tooltip={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDark ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>

            <button
                className="field-toolbar-btn"
                onClick={onOpenSidebar}
                data-tooltip="Edit Player Names"
                aria-label="Edit Player Names"
            >
                <MenuIcon />
            </button>

            <button
                className="field-toolbar-btn"
                onClick={onDownloadImage}
                data-tooltip="Download Image"
                aria-label="Download Image"
            >
                <CameraIcon />
            </button>

            <button
                className="field-toolbar-btn"
                onClick={onShare}
                data-tooltip="Share"
                aria-label="Share"
            >
                <ShareIcon />
            </button>

            <button
                className="field-toolbar-btn"
                onClick={onOpenHelp}
                data-tooltip="Help / Info"
                aria-label="Help / Info"
            >
                <HelpIcon />
            </button>
        </div>
    );
};

export default FieldActions;
