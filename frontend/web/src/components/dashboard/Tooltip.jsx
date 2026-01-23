import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Tooltip (reusable)
 *
 * - Works for disabled buttons (wraps children in a span that receives hover/focus)
 * - Auto hides after `autoHideMs` and fades out over `fadeMs`
 * - Positions itself above the target by default
 *
 * Usage:
 *  <Tooltip content="Hello" autoHideMs={1500}>
 *    <YourButton ... />
 *  </Tooltip>
 */
export default function Tooltip({
                                    content,
                                    children,
                                    disabled = false,

                                    // timing
                                    autoHideMs = 1500,
                                    fadeMs = 260,

                                    // placement
                                    placement = "top", // "top" | "bottom"
                                    offset = 10,

                                    // style overrides
                                    tooltipStyle,
                                    maxWidth = 320,

                                    // optional: keep open while hovering tooltip itself (default off)
                                    interactive = false,
                                }) {
    const wrapRef = useRef(null);
    const timersRef = useRef({ fade: null, hide: null });
    const rafRef = useRef(null);

    const [tip, setTip] = useState({
        open: false,
        fading: false,
        text: "",
        x: 0,
        y: 0,
    });

    const clearTimers = () => {
        if (timersRef.current.fade) clearTimeout(timersRef.current.fade);
        if (timersRef.current.hide) clearTimeout(timersRef.current.hide);
        timersRef.current.fade = null;
        timersRef.current.hide = null;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    };

    useEffect(() => {
        return () => clearTimers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const measureAndSetPosition = () => {
        const el = wrapRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();

        // anchor at center top/bottom of the wrapper
        const x = r.left + r.width / 2;
        const y = placement === "bottom" ? r.bottom : r.top;

        setTip((t) => ({ ...t, x, y }));
    };

    const openTip = () => {
        if (disabled) return;
        const text = String(content || "").trim();
        if (!text) return;

        clearTimers();
        measureAndSetPosition();

        setTip((t) => ({
            ...t,
            open: true,
            fading: false,
            text,
        }));

        // Keep position fresh for a moment (handles quick layout changes/scroll)
        const tick = () => {
            measureAndSetPosition();
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        // start fade after autoHideMs
        timersRef.current.fade = setTimeout(() => {
            setTip((t) => (t.open ? { ...t, fading: true } : t));
        }, autoHideMs);

        // fully hide after fade
        timersRef.current.hide = setTimeout(() => {
            setTip((t) => ({ ...t, open: false, fading: false }));
            clearTimers();
        }, autoHideMs + fadeMs);
    };

    const closeTip = () => {
        clearTimers();
        setTip((t) => ({ ...t, open: false, fading: false }));
    };

    const handleEnter = () => openTip();
    const handleLeave = () => {
        if (!interactive) closeTip();
    };

    const handleFocus = () => openTip();
    const handleBlur = () => closeTip();

    const transform =
        placement === "bottom"
            ? `translate(-50%, ${offset}px) ${tip.fading ? "scale(0.985)" : "scale(1)"}`
            : `translate(-50%, calc(-100% - ${offset}px)) ${tip.fading ? "scale(0.985)" : "scale(1)"}`;

    const node = tip.open ? (
        <div
            style={{
                position: "fixed",
                left: tip.x,
                top: tip.y,
                transform,
                opacity: tip.fading ? 0 : 1,
                transition: `opacity ${fadeMs}ms ease, transform ${fadeMs}ms ease`,
                zIndex: 99999,
                maxWidth,
                padding: "8px 10px",
                borderRadius: 12,
                background: "var(--accent)",
                color: "rgba(255,255,255,0.95)",
                fontWeight: 800,
                fontSize: 13,
                lineHeight: 1.2,
                boxShadow: "6px 8px 0 rgba(0,0,0,0.16)",
                border: "1px solid rgba(255,255,255,0.10)",
                pointerEvents: interactive ? "auto" : "none",
                whiteSpace: "normal",
                ...tooltipStyle,
            }}
            onMouseEnter={interactive ? handleEnter : undefined}
            onMouseLeave={interactive ? handleLeave : undefined}
        >
            {tip.text}
        </div>
    ) : null;

    return (
        <>
      <span
          ref={wrapRef}
          style={{ display: "inline-flex", minWidth: 0 }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
      >
        {children}
      </span>

            {tip.open ? createPortal(node, document.body) : null}
        </>
    );
}
