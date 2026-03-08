import { useCallback, useMemo, useState } from 'react';

import { fieldPositionVectors, initialFielderPositions } from '../data/fieldData';
import { flipCoords, getPositionLabel, getVectorForPositionName } from '../utils/fieldUtils';

const positionCoordinates = fieldPositionVectors;

const FIELD_W = 800;
const FIELD_HEIGHT = 800;

export function usePlayers(initialFieldState) {
    const [posCoords, setPosCoords] = useState(() => {
        if (initialFieldState?.isLeftHanded) return flipCoords(positionCoordinates);
        return positionCoordinates;
    });
    const [players, setPlayers] = useState(() => {
        if (initialFieldState?.coords) {
            return initializePlayersFromCoords(
                initialFieldState.coords,
                initialFieldState.isLeftHanded
                    ? flipCoords(positionCoordinates)
                    : positionCoordinates,
                initialFieldState.names,
            );
        }
        return initializePlayers(positionCoordinates);
    });

    // playerNames: index 0=batter, 1=WK, 2=bowler, 3..10=fielders 3-11
    const [playerNames, setPlayerNames] = useState(() => {
        const arr = Array.from({ length: initialFielderPositions.length + 1 }, () => '');
        if (initialFieldState?.names) {
            for (const [index, name] of Object.entries(initialFieldState.names)) {
                // playerNames uses +1 offset: playerNames[i+1] = players[i].name
                const nameIndex = parseInt(index, 10) + 1;
                if (nameIndex < arr.length) arr[nameIndex] = name;
            }
        }
        return arr;
    });

    const [isLeftHanded, setIsLeftHanded] = useState(initialFieldState?.isLeftHanded ?? false);
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
                    p.posId === 'wk' || p.posId === 'bowler'
                        ? ''
                        : getPositionLabel(normX, normY, newCoords);
                return { ...p, posLabel: newLabel, x: newX };
            }),
        );
    }, []);

    const handlePlayerDrag = useCallback(
        (index, e) => {
            const node = e.target;
            const newX = node.x();
            const newY = node.y();

            setPlayers((prev) =>
                prev.map((p, i) => {
                    if (i !== index) return p;
                    const normX = newX / FIELD_W;
                    const normY = newY / FIELD_HEIGHT;
                    const newLabel =
                        p.posId === 'wk' || p.posId === 'bowler'
                            ? ''
                            : getPositionLabel(normX, normY, posCoords);
                    return { ...p, posLabel: newLabel, x: newX, y: newY };
                }),
            );
        },
        [posCoords],
    );

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
                }),
            );
        }
    }, []);

    const handleApplyPreset = useCallback(
        (presetPlayers) => {
            setPlayers((prev) => {
                const next = [...prev];
                let presetIdx = 0;
                for (let i = 2; i < next.length; i++) {
                    if (presetIdx >= presetPlayers.length) break;

                    const pData = presetPlayers[presetIdx];
                    let nameStr = pData;
                    let explicitX, explicitY;

                    if (Array.isArray(pData)) {
                        nameStr = pData[0];
                        explicitX = pData[1];
                        explicitY = pData[2];
                    }

                    let normX, normY;
                    if (explicitX !== undefined && explicitY !== undefined) {
                        // if they are > 1, assume pixels, else normalized
                        normX = explicitX > 1 ? explicitX / FIELD_W : explicitX;
                        normY = explicitY > 1 ? explicitY / FIELD_HEIGHT : explicitY;
                    } else {
                        const vector = getVectorForPositionName(nameStr);
                        // if isLeftHanded is true, we need to flip the vector.
                        normX = isLeftHanded ? 0.98 - vector[0] : vector[0];
                        normY = vector[1];
                    }

                    const newX = normX * FIELD_W;
                    const newY = normY * FIELD_HEIGHT;

                    next[i] = {
                        ...next[i],
                        posLabel: getPositionLabel(normX, normY, posCoords),
                        x: newX,
                        y: newY,
                    };
                    presetIdx++;
                }
                return next;
            });
        },
        [isLeftHanded, posCoords],
    );

    return {
        batterDisplayName,
        bowlerDisplayName,
        focusedPlayerIndex,
        handleApplyPreset,
        handleLeftHandedToggle,
        handlePlayerDrag,
        handlePlayerNameChange,
        isLeftHanded,
        playerNames,
        players,
        setFocusedPlayerIndex,
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

function initializePlayersFromCoords(coords, posCoords, names = {}) {
    return coords.map(({ x, y }, i) => {
        let color = '#4A90D9';
        let posLabel = '';

        if (i === 0) {
            color = '#F5C542';
        } else if (i === 1) {
            color = '#E06050';
        } else {
            posLabel = getPositionLabel(x / FIELD_W, y / FIELD_HEIGHT, posCoords);
        }

        return {
            color,
            name: names[i] || `Player${i + 1}`,
            posId: i < 2 ? (i === 0 ? 'wk' : 'bowler') : `pos${i}`,
            posLabel,
            roleMarker: i === 0 ? 'WK' : i === 1 ? 'B' : '',
            x,
            y,
        };
    });
}
