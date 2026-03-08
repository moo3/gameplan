import { fieldPositionNames, fieldPositions } from '../data/fieldData';

/** Squared distance between two 2D points [x,y] */
export function calculateSquaredDistance(a, b) {
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
}

/**
 * Compute boundary coverage triangle points.
 * Returns [x1,y1, x2,y2, x3,y3] for a Konva.Line or null.
 */
export function computeBoundaryCoverage(fielderX, fielderY, batOriginX, batOriginY) {
    const batPosition = [batOriginX, batOriginY];
    const fielderPosition = [fielderX, fielderY];
    const distToBatter = Math.sqrt(calculateSquaredDistance(batPosition, fielderPosition));
    if (distToBatter < 1) return null;
    const coverageFactor = distanceToBoundaryFactor(distToBatter);

    let leftEdge = rotatePoint(batPosition, fielderPosition, coverageFactor);
    leftEdge = extendPoint(batPosition, leftEdge, 500 / distToBatter);
    let rightEdge = rotatePoint(batPosition, fielderPosition, -coverageFactor);
    rightEdge = extendPoint(batPosition, rightEdge, 500 / distToBatter);

    return [batPosition[0], batPosition[1], leftEdge[0], leftEdge[1], rightEdge[0], rightEdge[1]];
}

/**
 * Compute catch coverage ellipse params.
 * Returns { x, y, radiusX, radiusY, rotation } or null.
 */
export function computeCatchCoverage(fielderX, fielderY, batOriginX, batOriginY) {
    const batPosition = [batOriginX, batOriginY];
    const fielderPosition = [fielderX, fielderY];
    const distToBatter = Math.sqrt(calculateSquaredDistance(batPosition, fielderPosition));
    if (distToBatter < 1) return null;
    const catchRadiusFactor = (distToBatter * 6.28 * distanceToCatchFactor(distToBatter)) / 360;
    const angleToBatter = Math.atan2(
        fielderPosition[1] - batPosition[1],
        fielderPosition[0] - batPosition[0],
    );

    return {
        radiusX: catchRadiusFactor * 1.1,
        radiusY: catchRadiusFactor,
        rotation: (angleToBatter * 180) / Math.PI,
        x: fielderPosition[0] + (batPosition[0] - fielderPosition[0]) * 0.02,
        y: fielderPosition[1] + (batPosition[1] - fielderPosition[1]) * 0.02,
    };
}

/** Map distance to boundary-coverage angular spread factor */
export function distanceToBoundaryFactor(distToBatter) {
    return 4 + (distToBatter / 500) * 18;
}

/** Map distance to catch-coverage radius factor */
export function distanceToCatchFactor(distToBatter) {
    return 6 + (distToBatter / 500) * 12;
}

/** Extend point2 from point1 by a given factor */
export function extendPoint(batPos, fieldPos, multFactor) {
    const x = batPos[0] + multFactor * (fieldPos[0] - batPos[0]);
    const y = batPos[1] + multFactor * (fieldPos[1] - batPos[1]);
    return [x, y];
}

/**
 * Drag-bound function: constrain position within elliptical field.
 * width/height are the field pixel dimensions.
 * markerRadius accounts for the visible circle so its outer edge
 * stops at the boundary line rather than its center.
 */
export function fieldDragBound(pos, width, height, markerRadius = 10) {
    let { x, y } = pos;

    const cx = width / 2;
    const cy = height / 2;

    // The visible boundary line is drawn at 0.945 of the full field radius.
    // Shrink further by markerRadius so the dot's edge touches the line.
    const boundaryRx = (width * 0.945) / 2 - markerRadius;
    const boundaryRy = (height * 0.945) / 2 - markerRadius;

    const dx = x - cx;
    const dy = y - cy;
    const norm = (dx * dx) / (boundaryRx * boundaryRx) + (dy * dy) / (boundaryRy * boundaryRy);

    if (norm > 1) {
        // Project onto the effective boundary ellipse
        const scale = 1 / Math.sqrt(norm);
        x = cx + dx * scale;
        y = cy + dy * scale;
    }

    return { x, y };
}

/**
 * Flip positionCoordinates horizontally for left-hand mode toggle.
 */
export function flipCoords(coords) {
    return coords.map(([cx, cy]) => [0.98 - cx, cy]);
}

/** Get position label for an absolute position [normX, normY] */
export function getPositionLabel(normX, normY, posCoords) {
    const idx = nearestNeighbor([normX, normY], posCoords);
    return fieldPositionNames[idx];
}

/** Helper to find a position coordinate by key  */
export function getVectorForPositionName(name) {
    const key = name.toLowerCase(); 
    
    // Check if it's a direct key (since we now use keys in presets)
    if (fieldPositions[key]) return fieldPositions[key].vector;
    
    console.warn(`Position not found exactly: ${name}`);
    return [0.5, 0.5]; 
}

/** Find the index of the nearest point in `bank` to `query` */
export function nearestNeighbor(query, bank) {
    let ret = 0;
    let minDist = Infinity;
    for (let i = 0; i < bank.length; i++) {
        const d = calculateSquaredDistance(query, bank[i]);
        if (d < minDist) {
            ret = i;
            minDist = d;
        }
    }
    return ret;
}

/** Rotate point2 around point1 by `angle` degrees */
export function rotatePoint(batPos, fieldPos, angle) {
    const rad = (angle * Math.PI) / 180;
    const x =
        batPos[0] +
        Math.cos(rad) * (fieldPos[0] - batPos[0]) -
        Math.sin(rad) * (fieldPos[1] - batPos[1]);
    const y =
        batPos[1] +
        Math.sin(rad) * (fieldPos[0] - batPos[0]) +
        Math.cos(rad) * (fieldPos[1] - batPos[1]);
    return [x, y];
}
