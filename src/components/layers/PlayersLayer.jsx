import React, { useMemo } from 'react';
import { Layer } from 'react-konva';

import { fieldDragBound } from '../../utils/fieldUtils';
import PlayerMarker from '../PlayerMarker';

const PlayersLayer = ({
    currentScale,
    fieldH,
    fieldW,
    focusedPlayerIndex,
    offsetX,
    onPlayerDrag,
    onPlayerNameChange,
    panPos,
    players,
    showNames,
    showPositions,
}) => {
    // Drag bound that constrains to ellipse
    // dragBoundFunc receives absolute (pixel) coords; we must convert
    // to logical coords, apply constraint, then convert back.
    const makeDragBound = useMemo(() => {
        return (pos) => {
            // Pixel → logical: undo pan, stage scale, then subtract layer offset
            const logicalX = (pos.x - panPos.x) / currentScale - offsetX;
            const logicalY = (pos.y - panPos.y) / currentScale;

            // Apply elliptical constraint in logical space
            const clamped = fieldDragBound({ x: logicalX, y: logicalY }, fieldW, fieldH);

            // Logical → pixel: add layer offset, then apply stage scale and add pan
            return {
                x: (clamped.x + offsetX) * currentScale + panPos.x,
                y: clamped.y * currentScale + panPos.y,
            };
        };
    }, [fieldW, fieldH, currentScale, panPos, offsetX]);

    return (
        <Layer x={offsetX}>
            {players.map((player, index) => (
                <PlayerMarker
                    key={index}
                    onNameChange={(newName) => onPlayerNameChange(index, newName)}
                    onDragMove={(e) => onPlayerDrag(index, e)}
                    onDragEnd={(e) => onPlayerDrag(index, e)}
                    highlighted={focusedPlayerIndex !== null && focusedPlayerIndex - 1 === index}
                    roleMarker={player.roleMarker}
                    dragBoundFunc={makeDragBound}
                    posLabel={player.posLabel}
                    playerName={player.name}
                    showPos={showPositions}
                    color={player.color}
                    showName={showNames}
                    x={player.x}
                    y={player.y}
                    draggable
                />
            ))}
        </Layer>
    );
};

export default PlayersLayer;
