import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { themeStyles as theme } from "../../utils/theme.js";

export default function TabSwitcher({ tabs = [], value, onChange, renderContent, style }) {
    const t = theme.tabSwitcher;

    const [hoverKey, setHoverKey] = useState(null);

    // content crossfade state
    const [shownKey, setShownKey] = useState(value);
    const [isFading, setIsFading] = useState(false);
    const fadeTimerRef = useRef(null);

    // indicator measurement
    const barRef = useRef(null);
    const tabRefs = useRef(new Map());
    const rafRef = useRef(null);

    const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

    const safeTabs = useMemo(() => (Array.isArray(tabs) ? tabs : []), [tabs]);
    const selectedKey = value ?? safeTabs?.[0]?.key;

    // ----- content fade (previous out -> swap -> next in)
    useEffect(() => {
        if (selectedKey === shownKey) return;

        setIsFading(true);
        if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

        fadeTimerRef.current = setTimeout(() => {
            setShownKey(selectedKey);
            requestAnimationFrame(() => setIsFading(false));
        }, t.fadeMs || 220);

        return () => {
            if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKey]);

    function cancelRaf() {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    }

    function scheduleRecompute() {
        cancelRaf();
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            recomputeIndicator();
        });
    }

    function recomputeIndicator() {
        const barEl = barRef.current;
        if (!barEl) return;

        const tabEl = tabRefs.current.get(String(selectedKey));
        if (!tabEl) {
            // ✅ DON'T hide it on transient unmounts; just retry next frame
            scheduleRecompute();
            return;
        }

        const barRect = barEl.getBoundingClientRect();
        const tabRect = tabEl.getBoundingClientRect();

        // ✅ During resize you can momentarily read zeros. Don’t commit those.
        if (!barRect.width || !tabRect.width) {
            scheduleRecompute();
            return;
        }

        const left = tabRect.left - barRect.left;
        const width = tabRect.width;

        setIndicator((prev) => ({
            left,
            width,
            opacity: 1, // keep it visible once we have a valid measure
        }));
    }

    // ✅ measure at layout time (pre-paint)
    useLayoutEffect(() => {
        recomputeIndicator();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKey, safeTabs.length]);

    // ✅ on resize: debounce via rAF + don’t “reset” indicator
    useEffect(() => {
        const onResize = () => scheduleRecompute();
        window.addEventListener("resize", onResize);

        // also good: fonts/images can change width
        const onLoad = () => scheduleRecompute();
        window.addEventListener("load", onLoad);

        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("load", onLoad);
            cancelRaf();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKey]);

    const contentNode = useMemo(() => {
        if (typeof renderContent === "function") return renderContent(shownKey);
        const found = safeTabs.find((x) => String(x.key) === String(shownKey));
        return found?.content ?? null;
    }, [renderContent, shownKey, safeTabs]);

    return (
        <div style={{ ...t.wrap, ...style }}>
            <div ref={barRef} role={t.a11y.role} style={t.bar}>
                {/* animated indicator */}
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        left: indicator.left,
                        bottom: -1,
                        width: indicator.width,
                        height: t.indicator.height,
                        borderRadius: t.indicator.radius,
                        background: theme.textDark,
                        opacity: indicator.opacity,
                        transition: t.indicator.transition,
                        pointerEvents: "none",
                    }}
                />

                {safeTabs.map((tab) => {
                    const k = String(tab.key);
                    const isSelected = String(selectedKey) === k;
                    const isHover = hoverKey === k;

                    return (
                        <div
                            key={k}
                            ref={(el) => {
                                if (el) tabRefs.current.set(k, el);
                                else tabRefs.current.delete(k);
                                // ✅ if this tab is selected and just mounted, re-measure
                                if (el && k === String(selectedKey)) scheduleRecompute();
                            }}
                            role="tab"
                            aria-selected={isSelected}
                            tabIndex={0}
                            onClick={() => onChange?.(k)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    onChange?.(k);
                                }
                            }}
                            onMouseEnter={() => setHoverKey(k)}
                            onMouseLeave={() => setHoverKey(null)}
                            style={t.tab}
                        >
                            <div
                                style={{
                                    ...t.label,
                                    fontWeight:
                                        isSelected || isHover ? theme.weights.subtitleSelected : t.label.fontWeight,
                                    opacity: isSelected || isHover ? 1 : 0.88,
                                }}
                            >
                                {tab.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* content with crossfade */}
            <div style={t.content}>
                <div
                    style={{
                        flex: "1 1 auto",
                        minHeight: 0,
                        height: "100%",
                        ...t.fade,
                        opacity: isFading ? 0 : 1,
                    }}
                >
                    {contentNode}
                </div>
            </div>
        </div>
    );
}
