import React from 'react';
import { Circle, Ellipse, Group, Layer, Line, Path, Rect } from 'react-konva';

const GroundLayer = ({ fieldH, fieldW, isLeftHanded, offsetX }) => {
    // Pitch dimensions (proportional)
    const pitchX = 0.058;
    const pitchY = 0.18;
    const creaseX = 0.004;
    const creaseY = 0.02;

    // Bat position
    const batX = fieldW / 2 - fieldW * 0.005;
    const batY = fieldH / 2 - fieldH * (pitchY / 2 - 0.01);
    const batWidth = fieldW * 0.006;
    const batHeight = fieldH * 0.02;
    const batRotation = isLeftHanded ? -30 : 30;

    // Wicket dimensions
    const wicketRadius = 1.5;
    const wicketSpacing = fieldW * 0.0045;
    const wicketYOffset = 3;

    // 30-yard circle (oval) dimensions
    // Semicircles centered on stumps joined by parallel straight lines
    const thirtyYardScaleFactor = 0.9; // Control factor to reduce/enlarge the oval size (0.8 = 20% reduction)
    const ovalRadius = ((fieldW * 0.47) / 2) * thirtyYardScaleFactor;
    const ovalL = fieldH * pitchY * thirtyYardScaleFactor;
    const cx = fieldW / 2;
    const cy = fieldH / 2;
    const yTop = cy - ovalL / 2;
    const yBot = cy + ovalL / 2;

    const thirtyYardPath = `M ${cx + ovalRadius} ${yTop} L ${cx + ovalRadius} ${yBot} A ${ovalRadius} ${ovalRadius} 0 0 1 ${cx - ovalRadius} ${yBot} L ${cx - ovalRadius} ${yTop} A ${ovalRadius} ${ovalRadius} 0 0 1 ${cx + ovalRadius} ${yTop} Z`;

    return (
        <Layer x={offsetX}>
            {/* Outer ellipse */}
            <Ellipse
                radiusX={fieldW / 2}
                radiusY={fieldH / 2}
                fill="#6dc872ff"
                x={fieldW / 2}
                y={fieldH / 2}
            />
            {/* Boundary line */}
            <Ellipse
                radiusX={(fieldW * 0.95) / 2}
                radiusY={(fieldH * 0.95) / 2}
                fill="#28a964ff"
                strokeWidth={4}
                x={fieldW / 2}
                y={fieldH / 2}
                stroke="white"
            />
            {/* 30-yard circle (technically an oval) */}
            <Path
                stroke="rgba(255, 255, 255, 0.55)"
                data={thirtyYardPath}
                fill="#179b53ff"
                strokeWidth={2}
                dash={[12, 8]}
            />
            {/* Pitch */}
            <Rect
                x={fieldW / 2 - (fieldW * pitchX) / 2}
                y={fieldH / 2 - (fieldH * pitchY) / 2}
                height={fieldH * pitchY}
                width={fieldW * pitchX}
                fill="#f0d395ff"
            />
            {/* Crease line 1 */}
            <Line
                points={[
                    fieldW / 2 - fieldW * (pitchX / 2 + creaseX),
                    fieldH / 2 - fieldH * (pitchY / 2 - creaseY),
                    fieldW / 2 + fieldW * (pitchX / 2 + creaseX),
                    fieldH / 2 - fieldH * (pitchY / 2 - creaseY),
                ]}
                strokeWidth={1}
                stroke="white"
            />
            {/* Crease line 2 */}
            <Line
                points={[
                    fieldW / 2 - fieldW * (pitchX / 2 + creaseX),
                    fieldH / 2 + fieldH * (pitchY / 2 - creaseY),
                    fieldW / 2 + fieldW * (pitchX / 2 + creaseX),
                    fieldH / 2 + fieldH * (pitchY / 2 - creaseY),
                ]}
                strokeWidth={1}
                stroke="white"
            />
            {/* Top Wickets (3 dots) */}
            <Circle
                y={fieldH / 2 - (fieldH * pitchY) / 2 + wicketYOffset}
                x={fieldW / 2 - wicketSpacing}
                radius={wicketRadius}
                fill="white"
            />
            <Circle
                y={fieldH / 2 - (fieldH * pitchY) / 2 + wicketYOffset}
                radius={wicketRadius}
                x={fieldW / 2}
                fill="white"
            />
            <Circle
                y={fieldH / 2 - (fieldH * pitchY) / 2 + wicketYOffset}
                x={fieldW / 2 + wicketSpacing}
                radius={wicketRadius}
                fill="white"
            />

            {/* Bottom Wickets (3 dots) */}
            <Circle
                y={fieldH / 2 + (fieldH * pitchY) / 2 - wicketYOffset}
                x={fieldW / 2 - wicketSpacing}
                radius={wicketRadius}
                fill="white"
            />
            <Circle
                y={fieldH / 2 + (fieldH * pitchY) / 2 - wicketYOffset}
                radius={wicketRadius}
                x={fieldW / 2}
                fill="white"
            />
            <Circle
                y={fieldH / 2 + (fieldH * pitchY) / 2 - wicketYOffset}
                x={fieldW / 2 + wicketSpacing}
                radius={wicketRadius}
                fill="white"
            />

            {/* Bat */}
            <Group rotation={batRotation} x={batX} y={batY}>
                <Rect
                    height={batHeight}
                    strokeWidth={0.5}
                    width={batWidth}
                    fill="#ae6908ff"
                    cornerRadius={1}
                    x={0}
                    y={0}
                />
                <Rect
                    x={batWidth / 2 - batWidth / 6}
                    height={batHeight / 2}
                    width={batWidth / 3}
                    strokeWidth={0.001}
                    y={-batHeight / 2}
                    stroke="white"
                    fill="black"
                />
            </Group>
        </Layer>
    );
};

export default GroundLayer;
