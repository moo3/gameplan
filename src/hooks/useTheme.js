import { useEffect, useState } from 'react';

/**
 * Manages theme state and syncs it to the <html> data-theme attribute.
 *
 * @param {string} [initialTheme='light'] - The initial theme value
 * @returns {[string, (theme: string) => void]} - [theme, setTheme]
 */
export function useTheme(initialTheme = 'light') {
    const [theme, setTheme] = useState(initialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return [theme, setTheme];
}
