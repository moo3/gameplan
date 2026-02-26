import React from 'react';

/**
 * Left-side action buttons: theme toggle, sidebar toggle, download image.
 * Positioned at top-left of the field container.
 */
// --- SVG Icons ---
import { CameraIcon, HelpIcon, MenuIcon, MoonIcon, SunIcon } from './icons';

// --- Component ---

const FieldActions = ({
    onDownloadImage,
    onOpenHelp,
    onOpenSidebar,
    setTheme,
    theme,
}) => {
    const isDark = theme === 'dark';

    const buttons = [
        {
            action: () => setTheme(isDark ? 'light' : 'dark'),
            icon: isDark ? <SunIcon /> : <MoonIcon />,
            key: 'theme',
            label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        },
        {
            action: onOpenSidebar,
            icon: <MenuIcon />,
            key: 'sidebar',
            label: 'Edit Names',
        },
        {
            action: onDownloadImage,
            icon: <CameraIcon />,
            key: 'download',
            label: 'Download Image',
        },
        {
            action: onOpenHelp,
            icon: <HelpIcon />,
            key: 'help',
            label: 'Help / Info',
        },
    ];

    return (
        <div className="field-actions">
            <div className="field-actions-top-row">
                <button
                    key={buttons[0].key}
                    className="field-toolbar-btn"
                    onClick={buttons[0].action}
                    data-tooltip={buttons[0].label}
                    aria-label={buttons[0].label}
                >
                    {buttons[0].icon}
                </button>
            </div>

            {buttons.slice(1).map((buttonItem) => (
                <button
                    key={buttonItem.key}
                    className="field-toolbar-btn"
                    onClick={buttonItem.action}
                    data-tooltip={buttonItem.label}
                    aria-label={buttonItem.label}
                >
                    {buttonItem.icon}
                </button>
            ))}
        </div>
    );
};

export default FieldActions;
