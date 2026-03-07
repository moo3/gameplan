import { useEffect, useRef, useState } from 'react';

/**
 * Observes the dimensions of a container element via ResizeObserver.
 *
 * @returns {{ containerRef: React.RefObject, containerSize: { width: number, height: number } }}
 */
export function useContainerSize() {
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ height: 0, width: 0 });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver((entries) => {
            const { height, width } = entries[0].contentRect;
            setContainerSize({ height, width });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return { containerRef, containerSize };
}
