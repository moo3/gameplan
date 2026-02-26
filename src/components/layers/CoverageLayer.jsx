import React, { useMemo } from 'react';
import { Ellipse, Layer, Line } from 'react-konva';

import { computeBoundaryCoverage, computeCatchCoverage } from '../../utils/fieldUtils';

const CoverageLayer = ({
    fieldH,
    fieldW,
    offsetX,
    players,
    showBoundaryCoverage,
    showCatchCoverage
}) => {
    const pitchY = 0.18;
    const batY = fieldH / 2 - fieldH * (pitchY / 2 - 0.01);

    // Clip function for coverage layers
    const clipFunc = useMemo(() => {
        return (ctx) => {
            ctx.beginPath();
            ctx.arc(fieldW / 2, fieldH / 2, (fieldW * 0.945) / 2, 0, 2 * Math.PI, false);
            ctx.clip();
        };
    }, [fieldW, fieldH]);

    // Pre-compute boundary coverages for fielders 2..10 (indices 2-10 = fielders 3-11)
    const boundaryCoverages = useMemo(() => {
        return players.slice(2).map((p) => {
            return computeBoundaryCoverage(p.x, p.y, fieldW / 2, batY);
        });
    }, [players, fieldW, batY]);

    // Pre-compute catch coverages
    const catchCoverages = useMemo(() => {
        return players.slice(2).map((p) => {
            return computeCatchCoverage(p.x, p.y, fieldW / 2, batY);
        });
    }, [players, fieldW, batY]);

    return (
        <>
            <Layer visible={showBoundaryCoverage} clipFunc={clipFunc} x={offsetX}>
                {boundaryCoverages.map((tri, i) =>
                    tri ? (
                        <Line
                            key={`bc-${i}`}
                            opacity={0.25}
                            fill="yellow"
                            points={tri}
                            closed
                        />
                    ) : null
                )}
            </Layer>
            <Layer visible={showCatchCoverage} clipFunc={clipFunc} x={offsetX}>
                {catchCoverages.map((ell, i) =>
                    ell ? (
                        <Ellipse
                            key={`cc-${i}`}
                            fillRadialGradientColorStops={[
                                0, 'rgba(249, 168, 69, 0.85)',
                                0.50, 'rgba(249, 168, 69, 0.75)',
                                1, 'rgba(255, 140, 40, 0)',
                            ]}
                            fillRadialGradientEndRadius={Math.max(ell.radiusX, ell.radiusY)}
                            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
                            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                            fillRadialGradientStartRadius={0}
                            rotation={ell.rotation}
                            radiusX={ell.radiusX}
                            radiusY={ell.radiusY}
                            x={ell.x}
                            y={ell.y}
                        />
                    ) : null
                )}
            </Layer>
        </>
    );
};

export default CoverageLayer;
