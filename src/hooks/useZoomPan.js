import { useCallback, useState } from 'react';

export function useZoomPan(stageRef) {
    const [zoomScale, setZoomScale] = useState(1);
    const [panPos, setPanPos] = useState({ x: 0, y: 0 });

    const zoomAroundCenter = useCallback((delta) => {
        const nextZoom = Math.max(1, Math.min(zoomScale + delta, 4));
        if (nextZoom === zoomScale) return;

        if (nextZoom === 1) {
            setZoomScale(1);
            setPanPos({ x: 0, y: 0 });
            return;
        }

        if (stageRef && stageRef.current) {
            const konvaStage = stageRef.current;
            const center = {
                x: konvaStage.width() / 2,
                y: konvaStage.height() / 2,
            };

            const pointTo = {
                x: (center.x - panPos.x) / zoomScale,
                y: (center.y - panPos.y) / zoomScale,
            };

            const newPos = {
                x: center.x - pointTo.x * nextZoom,
                y: center.y - pointTo.y * nextZoom,
            };

            setZoomScale(nextZoom);
            setPanPos(newPos);
        } else {
            setZoomScale(nextZoom);
        }
    }, [zoomScale, panPos, stageRef]);

    const handleZoomIn = useCallback(() => {
        zoomAroundCenter(0.5);
    }, [zoomAroundCenter]);

    const handleZoomOut = useCallback(() => {
        zoomAroundCenter(-0.5);
    }, [zoomAroundCenter]);

    const handleResetZoom = useCallback(() => {
        setZoomScale(1);
        setPanPos({ x: 0, y: 0 });
    }, []);

    return {
        handleResetZoom,
        handleZoomIn,
        handleZoomOut,
        panPos,
        setPanPos,
        setZoomScale,
        zoomScale
    };
}
