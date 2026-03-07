import React from 'react';
import { Stage } from 'react-konva';

import { useFieldGestures } from '../hooks/useFieldGestures';
import CoverageLayer from './layers/CoverageLayer';
import GroundLayer from './layers/GroundLayer';
import PlayersLayer from './layers/PlayersLayer';

const FIELD_WIDTH_RATIO = 0.842;

const CricketField = ({
    containerHeight,
    containerWidth,
    focusedPlayerIndex,
    height,
    isLeftHanded,
    onPlayerDrag,
    onPlayerNameChange,
    panPos = { x: 0, y: 0 },
    players,
    setPanPos,
    setZoomScale,
    showBoundaryCoverage,
    showCatchCoverage,
    showNames,
    showPositions,
    stageRef,
    width,
    zoomScale = 1,
    children,
}) => {
    // The inner field boundary is a logical square within the full stage
    const fieldW = width * FIELD_WIDTH_RATIO;
    const fieldH = height;
    const offsetX = (width - fieldW) / 2;

    // Compute uniform scale to fit logical field into the container
    const scale =
        containerWidth && containerHeight
            ? Math.min(containerWidth / width, containerHeight / height)
            : 1;
    const stagePixelW = width * scale;
    const stagePixelH = height * scale;
    const currentScale = scale * zoomScale;

    // Canvas Events Hook
    const { handleDragMove, handleTouchEnd, handleTouchMove, handleWheel } = useFieldGestures({
        panPos,
        setPanPos,
        setZoomScale,
        stageRef,
        zoomScale,
    });

    return (
        <div className="cricket-field-wrapper" style={{ width: stagePixelW, height: stagePixelH }}>
            <Stage
                ref={stageRef}
                className="field-stage"
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onDragMove={handleDragMove}
                onWheel={handleWheel}
                draggable={zoomScale > 1} // Only allow panning when zoomed in
                scaleX={currentScale}
                scaleY={currentScale}
                height={stagePixelH}
                width={stagePixelW}
                x={panPos.x}
                y={panPos.y}
            >
                <GroundLayer
                    isLeftHanded={isLeftHanded}
                    offsetX={offsetX}
                    fieldW={fieldW}
                    fieldH={fieldH}
                />

                <CoverageLayer
                    showBoundaryCoverage={showBoundaryCoverage}
                    showCatchCoverage={showCatchCoverage}
                    players={players}
                    offsetX={offsetX}
                    fieldW={fieldW}
                    fieldH={fieldH}
                />

                <PlayersLayer
                    onPlayerNameChange={onPlayerNameChange}
                    onPlayerDrag={onPlayerDrag}
                    focusedPlayerIndex={focusedPlayerIndex}
                    showPositions={showPositions}
                    currentScale={currentScale}
                    showNames={showNames}
                    players={players}
                    offsetX={offsetX}
                    fieldW={fieldW}
                    fieldH={fieldH}
                    panPos={panPos}
                />
            </Stage>
            {children}
        </div>
    );
};

export default CricketField;
