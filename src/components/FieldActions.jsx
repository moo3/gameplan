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
    onShare,
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
        {
            action: onShare,
            icon: <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" /></svg>,
            key: 'share',
            label: 'Share',
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
