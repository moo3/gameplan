import { useCallback, useMemo, useState } from 'react';

import { fieldPositions, initialFielderPositions } from '../data/fieldData';
import { flipCoords, getPositionLabel } from '../utils/fieldUtils';

const positionCoordinates = fieldPositions.map(p => p.vector);

const FIELD_W = 800;
const FIELD_HEIGHT = 800;

export function usePlayers() {
    const [posCoords, setPosCoords] = useState(positionCoordinates);
    const [players, setPlayers] = useState(() => initializePlayers(positionCoordinates));

    // playerNames: index 0=batter, 1=WK, 2=bowler, 3..10=fielders 3-11
    const [playerNames, setPlayerNames] = useState(() =>
        Array.from({ length: initialFielderPositions.length + 1 }, () => '')
    );

    const [isLeftHanded, setIsLeftHanded] = useState(false);
    const [focusedPlayerIndex, setFocusedPlayerIndex] = useState(null);

    const bowlerDisplayName = playerNames[2] || 'Bowler';
    const batterDisplayName = useMemo(() => {
        const name = playerNames[0] || 'Batter';
        const hand = isLeftHanded ? 'LH' : 'RH';
        return `Batter: ${name} (${hand})`;
    }, [playerNames, isLeftHanded]);

    const handleLeftHandedToggle = useCallback((checked) => {
        setIsLeftHanded(checked);
        const newCoords = checked ? flipCoords(positionCoordinates) : positionCoordinates;
        setPosCoords(newCoords);
        setPlayers((prev) =>
            prev.map((p) => {
                const newX = FIELD_W - p.x;
                const normX = newX / FIELD_W;
                const normY = p.y / FIELD_HEIGHT;
                const newLabel =
                    p.posId === 'wk' || p.posId === 'bowler' ? '' : getPositionLabel(normX, normY, newCoords);
                return { ...p, posLabel: newLabel, x: newX };
            })
        );
    }, []);

    const handlePlayerDrag = useCallback((index, e) => {
        const node = e.target;
        const newX = node.x();
        const newY = node.y();

        setPlayers((prev) =>
            prev.map((p, i) => {
                if (i !== index) return p;
                const normX = newX / FIELD_W;
                const normY = newY / FIELD_HEIGHT;
                const newLabel =
                    p.posId === 'wk' || p.posId === 'bowler' ? '' : getPositionLabel(normX, normY, posCoords);
                return { ...p, posLabel: newLabel, x: newX, y: newY };
            })
        );
    }, [posCoords]);

    const handlePlayerNameChange = useCallback((index, value) => {
        setPlayerNames((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });

        if (index >= 1) {
            setPlayers((prev) =>
                prev.map((p, i) => {
                    if (i === index - 1) {
                        return { ...p, name: value || `Player${i + 1}` };
                    }
                    return p;
                })
            );
        }
    }, []);

    return {
        batterDisplayName,
        bowlerDisplayName,
        focusedPlayerIndex,
        handleLeftHandedToggle,
        handlePlayerDrag,
        handlePlayerNameChange,
        isLeftHanded,
        playerNames,
        players,
        setFocusedPlayerIndex
    };
}

function initializePlayers(posCoords) {
    return initialFielderPositions.map((pos, i) => {
        const x = pos[0] * FIELD_W;
        const y = pos[1] * FIELD_HEIGHT;
        let color = '#4A90D9';
        let posLabel = '';

        if (i === 0) {
            color = '#F5C542';
            posLabel = '';
        } else if (i === 1) {
            color = '#E06050';
            posLabel = '';
        } else {
            posLabel = getPositionLabel(pos[0], pos[1], posCoords);
        }

        return {
            color,
            name: `Player${i + 1}`,
            posId: i < 2 ? (i === 0 ? 'wk' : 'bowler') : `pos${i}`,
            posLabel,
            roleMarker: i === 0 ? 'WK' : i === 1 ? 'B' : '',
            x,
            y,
        };
    });
}
