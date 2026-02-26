import React from 'react';

import { MoonIcon, SunIcon } from './icons';

const ThemeSwitcher = ({ setTheme, theme }) => {
    const isDark = theme === 'dark';
    const nextLabel = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

    return (
        <button
            className={`field-toolbar-btn theme-switcher-btn`}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            data-tooltip={nextLabel}
            aria-label={nextLabel}
        >
            {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};

export default ThemeSwitcher;
