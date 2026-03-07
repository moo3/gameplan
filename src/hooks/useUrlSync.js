import { useEffect, useRef, useState } from 'react';

import { encodeField } from '../utils/fieldCodec';

/**
 * Keeps the browser address bar in sync with the current field state.
 * Uses history.replaceState to update the URL without navigation.
 *
 * @param {object} params
 * @param {Array} params.players - Current player positions and names
 * @param {boolean} params.isLeftHanded - Whether the batter is left-handed
 * @param {boolean} params.showPositions - Whether position labels are visible
 * @param {boolean} params.showBoundaryCoverage - Whether boundary coverage is visible
 * @param {boolean} params.showCatchCoverage - Whether catch coverage is visible
 * @returns {{ shareUrl: string, openShare: () => void, closeShare: () => void }}
 */
export function useUrlSync({
    players,
    isLeftHanded,
    showPositions,
    showBoundaryCoverage,
    showCatchCoverage,
}) {
    const [shareUrl, setShareUrl] = useState('');
    const shareOpenRef = useRef(false);

    useEffect(() => {
        const playerStrings = players.map((p, index) => {
            const defaultName = `Player${index + 1}`;
            if (p.name === defaultName) {
                return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            }
            return `${p.x.toFixed(1)},${p.y.toFixed(1)},${p.name}`;
        });
        const delimitedString = `${isLeftHanded ? 1 : 0}|${playerStrings.join('|')}`;
        const compressed = encodeField(delimitedString, {
            showPositions,
            showBoundaryCoverage,
            showCatchCoverage,
        });
        const newPath = `/${compressed}`;
        if (window.location.pathname !== newPath) {
            window.history.replaceState(null, '', newPath);
        }
        // If share popup is open, update its URL too
        if (shareOpenRef.current) {
            setShareUrl(`${window.location.origin}${newPath}`);
        }
    }, [players, isLeftHanded, showPositions, showBoundaryCoverage, showCatchCoverage]);

    const openShare = () => {
        shareOpenRef.current = true;
        setShareUrl(window.location.href);
    };

    const closeShare = () => {
        shareOpenRef.current = false;
        setShareUrl('');
    };

    return { shareUrl, openShare, closeShare };
}
