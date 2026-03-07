import React, { useEffect, useRef, useState } from 'react';
import { Circle, Group, Text } from 'react-konva';
import { Html } from 'react-konva-utils';

/**
 * A single fielder marker on the canvas.
 * Props:
 *   x, y         – position
 *   color        – fill color (blue, yellow, red)
 *   playerName   – display name (e.g. "Player3")
 *   posLabel     – position label (e.g. "point")
 *   posId        – id for the position node
 *   showName     – whether to show the player name
 *   showPos      – whether to show the position label
 *   draggable    – whether the marker can be dragged
 *   dragBoundFunc – function to constrain dragging
 *   onDragEnd    – callback when drag finishes
 */
const PlayerMarker = ({
    color = 'blue',
    dragBoundFunc,
    draggable = true,
    highlighted = false,
    onDragEnd,
    onDragMove,
    onNameChange,
    playerName = '',
    posLabel = '',
    roleMarker = '',
    showName = true,
    showPos = true,
    x,
    y,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(playerName);
    const inputRef = useRef(null);

    // Sync local edit value if external prop changes
    useEffect(() => {
        setEditValue(playerName);
    }, [playerName]);

    // Handle double click to start editing
    const handleDoubleClick = () => {
        if (!showName) return;
        setIsEditing(true);
    };

    // Auto-focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    // Save changes when input loses focus or Enter is pressed
    const handleSave = () => {
        setIsEditing(false);
        if (onNameChange && editValue !== playerName) {
            onNameChange(editValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(playerName);
        }
    };
    return (
        <Group
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
            dragBoundFunc={dragBoundFunc}
            draggable={draggable}
            x={x}
            y={y}
        >
            {/* Invisible enlarged hit area for easier touch targeting */}
            <Circle fill="transparent" hitStrokeWidth={0} radius={25} />
            {/* Highlight glow when player input is focused in sidebar */}
            {highlighted && (
                <Circle
                    x={color !== '#4A90D9' ? 5 : 0}
                    y={color !== '#4A90D9' ? 5 : 0}
                    fill="transparent"
                    strokeWidth={3}
                    stroke="white"
                    opacity={0.8}
                    radius={18}
                />
            )}
            <Circle
                x={color !== '#4A90D9' ? 5 : 0}
                y={color !== '#4A90D9' ? 5 : 0}
                stroke="rgba(0, 0, 0, 0.35)"
                strokeWidth={1.5}
                fill={color}
                radius={10}
            />
            {roleMarker && (
                <Text
                    x={(color !== '#4A90D9' ? 5 : 0) - 10}
                    y={(color !== '#4A90D9' ? 5 : 0) - 5}
                    verticalAlign="middle"
                    fontFamily="Arial"
                    text={roleMarker}
                    fontStyle="bold"
                    align="center"
                    fontSize={8}
                    fill="white"
                    height={10}
                    width={20}
                />
            )}
            {/* Name Label or Editor */}
            {isEditing ? (
                <Html
                    divProps={{
                        style: {
                            left: `${(color !== '#4A90D9' ? 5 : 0) - 75}px`,
                            position: 'absolute',
                            top: `${(color !== '#4A90D9' ? 5 : 0) + 12}px`,
                        },
                    }}
                >
                    <input
                        ref={inputRef}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        style={{
                            background: '#fff',
                            border: '1px solid #4A90D9',
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            color: '#000',
                            fontFamily: 'Arial',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginLeft: '75px',
                            marginTop: '10px',
                            outline: 'none',
                            padding: '2px',
                            textAlign: 'center',
                            transform: 'translate(-50%, -50%)', // Center relative to origin
                            width: '150px',
                        }}
                        value={editValue}
                        type="text"
                    />
                </Html>
            ) : (
                <Text
                    onDblClick={handleDoubleClick}
                    onDblTap={handleDoubleClick}
                    x={(color !== '#4A90D9' ? 5 : 0) - 75}
                    y={(color !== '#4A90D9' ? 5 : 0) + 12}
                    fontFamily="Arial"
                    visible={showName}
                    text={playerName}
                    fontStyle="bold"
                    align="center"
                    fontSize={14}
                    fill="black"
                    width={150}
                />
            )}
            <Text
                verticalAlign="top"
                fontFamily="Arial"
                visible={showPos}
                text={posLabel}
                fontSize={12}
                fill="black"
                y={-13}
                x={12}
            />
        </Group>
    );
};

export default PlayerMarker;
