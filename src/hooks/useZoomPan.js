import { useCallback, useState } from 'react';

export function useZoomPan() {
    const [zoomScale, setZoomScale] = useState(1);
    const [panPos, setPanPos] = useState({ x: 0, y: 0 });

    const handleZoomIn = useCallback(() => {
        setZoomScale((prev) => Math.min(prev + 0.5, 4));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoomScale((prev) => {
            const next = prev - 0.5;
            if (next <= 1) {
                setPanPos({ x: 0, y: 0 });
                return 1;
            }
            return next;
        });
    }, []);

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
