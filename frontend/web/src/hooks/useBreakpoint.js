import { useEffect, useRef, useState } from "react";

export function useBreakpoint(breakpoint = 880) {
    const ref = useRef(null);
    const [isWide, setIsWide] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([entry]) => {
            setIsWide(entry.contentRect.width >= breakpoint);
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, [breakpoint]);

    return { ref, isWide };
}