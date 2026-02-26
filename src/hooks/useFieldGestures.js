import { useRef } from 'react';

export function useFieldGestures({ panPos, setPanPos, setZoomScale, stageRef, zoomScale }) {
    const handleWheel = (e) => {
        e.evt.preventDefault();
        const konvaStage = stageRef.current;
        if (!konvaStage) return;

        const scaleBy = 1.05;
        const pointer = konvaStage.getPointerPosition();
        if (!pointer) return;

        const newScale = e.evt.deltaY > 0 ? zoomScale / scaleBy : zoomScale * scaleBy;
        const constrainedScale = Math.max(1, Math.min(newScale, 4));

        const mousePointTo = {
            x: (pointer.x - panPos.x) / zoomScale,
            y: (pointer.y - panPos.y) / zoomScale,
        };

        const newPos = {
            x: pointer.x - mousePointTo.x * constrainedScale,
            y: pointer.y - mousePointTo.y * constrainedScale,
        };

        setZoomScale(constrainedScale);
        setPanPos(constrainedScale === 1 ? { x: 0, y: 0 } : newPos);
    };

    const lastDist = useRef(null);
    const lastCenter = useRef(null);

    const getDistance = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const getCenter = (p1, p2) => ({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });

    const handleTouchMove = (e) => {
        e.evt.preventDefault();
        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];

        if (touch1 && touch2) {
            const konvaStage = stageRef.current;
            if (konvaStage.isDragging()) {
                konvaStage.stopDrag();
            }

            const p1 = { x: touch1.clientX, y: touch1.clientY };
            const p2 = { x: touch2.clientX, y: touch2.clientY };

            const touchDist = getDistance(p1, p2);
            const center = getCenter(p1, p2);

            if (!lastDist.current) {
                lastDist.current = touchDist;
                lastCenter.current = center;
            }

            const scaleBy = touchDist / lastDist.current;
            let newScale = zoomScale * scaleBy;
            newScale = Math.max(1, Math.min(newScale, 4));

            const pt = {
                x: (center.x - panPos.x) / zoomScale,
                y: (center.y - panPos.y) / zoomScale,
            };

            const newPos = {
                x: center.x - pt.x * newScale + (center.x - lastCenter.current.x),
                y: center.y - pt.y * newScale + (center.y - lastCenter.current.y),
            };

            setZoomScale(newScale);
            setPanPos(newScale === 1 ? { x: 0, y: 0 } : newPos);

            lastDist.current = touchDist;
            lastCenter.current = center;
        }
    };

    const handleTouchEnd = () => {
        lastDist.current = null;
        lastCenter.current = null;
    };

    const handleDragMove = (e) => {
        if (e.target === stageRef.current) {
            setPanPos({ x: e.target.x(), y: e.target.y() });
        }
    };

    return {
        handleDragMove,
        handleTouchEnd,
        handleTouchMove,
        handleWheel,
    };
}
