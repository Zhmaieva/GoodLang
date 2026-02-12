import React, { useEffect, useMemo, useRef, useState } from "react";
import { themeStyles as theme } from "../../utils/theme.js";
import {hover} from "framer-motion";

/**
 * TabSwitcher
 *
 * Props:
 * - tabs: Array<{ key: string, label: string, content?: ReactNode }>
 * - value: string (selected key)
 * - onChange: (key: string) => void
 * - renderContent?: (key: string) => ReactNode   // if you don't want to pass content per tab
 * - style?: object
 */
export default function TabSwitcher({
                                        tabs = [],
                                        value,
                                        onChange,
                                        renderContent,
                                        style,
                                    }) {
    const t = theme.tabSwitcher;

    const [hoverKey, setHoverKey] = useState(null);

    // content crossfade state
    const [shownKey, setShownKey] = useState(value);
    const [isFading, setIsFading] = useState(false);
    const fadeTimerRef = useRef(null);

    // indicator measurement
    const barRef = useRef(null);
    const tabRefs = useRef(new Map());
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
            // next tick fade back in
            requestAnimationFrame(() => setIsFading(false));
        }, t.fadeMs || 220);

        return () => {
            if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKey]);

    // ----- indicator positioning (expands/shrinks as it moves)
    function recomputeIndicator() {
        const barEl = barRef.current;
        if (!barEl) return;

        const tabEl = tabRefs.current.get(String(selectedKey));
        if (!tabEl) {
            setIndicator((p) => ({ ...p, opacity: 0 }));
            return;
        }

        const barRect = barEl.getBoundingClientRect();
        const tabRect = tabEl.getBoundingClientRect();

        const left = tabRect.left - barRect.left;
        const width = tabRect.width;

        setIndicator({ left, width, opacity: 1 });
    }

    useEffect(() => {
        recomputeIndicator();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKey, safeTabs.length]);

    useEffect(() => {
        // handle resize
        const onResize = () => recomputeIndicator();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ----- divider “hack”: background gradient draws 1px lines at tab boundaries
    const dividerBg = useMemo(() => {
        const n = safeTabs.length;
        if (n <= 1) return "none";

        // 1px lines at i/n positions (i=1..n-1)
        // We build multiple linear-gradients, each positioned.
        const lines = [];
        for (let i = 1; i <= n - 1; i++) {
            const x = (i / n) * 100;
            lines.push(
                `linear-gradient(to right, transparent calc(${x}% - ${t.divider.width / 2}px), rgba(0,0,0,0) calc(${x}% - ${t.divider.width / 2}px), ${t.divider.color} ${x}%, transparent calc(${x}% + ${t.divider.width / 2}px))`
            );
        }
        return lines.join(", ");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safeTabs.length]);

    const contentNode = useMemo(() => {
        if (typeof renderContent === "function") return renderContent(shownKey);
        const found = safeTabs.find((x) => String(x.key) === String(shownKey));
        return found?.content ?? null;
    }, [renderContent, shownKey, safeTabs]);

    return (
        <div style={{ ...t.wrap, ...style }}>
            <div
                ref={barRef}
                role={t.a11y.role}
                style={{
                    ...t.bar,
                    //backgroundImage: dividerBg,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
                    backgroundPosition: "0 0",
                }}
            >
                {/* animated indicator */}
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        left: indicator.left,
                        bottom: -1, // sits over bar border
                        width: indicator.width,
                        height: t.indicator.height,
                        borderRadius: t.indicator.radius,
                        background: theme.textDark, // no selected color
                        opacity: indicator.opacity,
                        transition: t.indicator.transition,
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
                                    fontWeight: isSelected || isHover ? theme.weights.subtitleSelected : t.label.fontWeight,
                                    opacity: isSelected || isHover ? 1 : 0.88,
                                }}
                            >
                                {tab.label}
                            </div>

                            {/*/!* hover underline (small centered, only if not selected) *!/*/}
                            {/*{!isSelected && (*/}
                            {/*    <div*/}
                            {/*        aria-hidden*/}
                            {/*        style={{*/}
                            {/*            position: "absolute",*/}
                            {/*            left: "50%",*/}
                            {/*            transform: "translateX(-50%)",*/}
                            {/*            bottom: -1,*/}
                            {/*            width: t.hoverUnderline.width,*/}
                            {/*            height: t.hoverUnderline.height,*/}
                            {/*            borderRadius: t.hoverUnderline.radius,*/}
                            {/*            background: theme.textDark,*/}
                            {/*            opacity: isHover ? t.hoverUnderline.opacity : 0,*/}
                            {/*            transition: `opacity ${theme.motion.fast} ${theme.motion.ease}`,*/}
                            {/*            pointerEvents: "none",*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*)}*/}
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
                        height: '100%',
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
