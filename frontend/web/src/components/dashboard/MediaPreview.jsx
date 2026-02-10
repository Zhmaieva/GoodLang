// MediaPreview.jsx — FULL DROP-IN (NO in-component px / numbers / colors in CSS styles)
// ✅ All sizing / colors / transitions / breakpoints live in theme.mediaPreview
import React, { useEffect, useMemo, useRef, useState } from "react";
import { theme } from "../../App.jsx";
import AwesomeActionButton from "./AwesomeActionButton.jsx"; // adjust path if needed

function inferMediaKind(url) {
    const u = String(url || "").toLowerCase();
    if (!u) return null;
    if (u.match(/\.(mp4|webm|ogg)(\?.*)?$/)) return "video";
    if (u.match(/\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/)) return "image";
    return "image";
}

function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia?.(query);
        if (!mq) return;

        const update = () => setMatches(!!mq.matches);
        update();

        if (mq.addEventListener) mq.addEventListener("change", update);
        else mq.addListener(update);

        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", update);
            else mq.removeListener(update);
        };
    }, [query]);

    return matches;
}

/**
 * MediaPreview
 *
 * - Desktop: fixed “drawer card” that slides from right, hovering above content (no layout shift)
 * - Mobile: slides from bottom, full width
 * - Default: out of screen. If content changes: slides out → swaps → slides in.
 *
 * Props:
 * - mediaUrl?: string
 * - mediaKind?: "auto" | "image" | "video"
 * - title?: string
 * - text?: string
 * - actionText?: string
 * - onAction?: () => void
 * - actionIconUrl?: string
 * - actionSymbol?: string
 * - open?: boolean (optional; default: true when there is any content)
 * - contentKey?: string (optional; controls change animation; default derived)
 * - onClose?: () => void (optional; click outside + ESC)
 */
export default function MediaPreview({
                                         mediaUrl,
                                         mediaKind = "auto",
                                         title,
                                         text,
                                         actionText,
                                         onAction,
                                         actionIconUrl,
                                         actionSymbol,
                                         open: openProp,
                                         contentKey,
                                         onClose,
                                     }) {
    const cfg = theme.mediaPreview;
    const reduceMotion = !!theme?.accessibility?.reduceMotion;

    const isMobile = useMediaQuery(cfg.mobileQuery);

    const derivedOpen = useMemo(() => {
        const hasAny = !!(mediaUrl || title || text || actionText);
        return typeof openProp === "boolean" ? openProp : hasAny;
    }, [openProp, mediaUrl, title, text, actionText]);

    const keyNow = useMemo(() => {
        if (contentKey != null) return String(contentKey);
        return [mediaUrl || "", title || "", text || "", actionText || ""].join(cfg.keyJoiner);
    }, [contentKey, mediaUrl, title, text, actionText, cfg.keyJoiner]);

    // We render “current payload” and swap it only after exit finishes.
    const [payload, setPayload] = useState({
        mediaUrl,
        title,
        text,
        actionText,
        actionIconUrl,
        actionSymbol,
    });

    const [phase, setPhase] = useState(derivedOpen ? cfg.phases.enter : cfg.phases.hidden);
    const lastKeyRef = useRef(keyNow);
    const closeBtnRef = useRef(null);
    const rootRef = useRef(null);

    // Handle open/close
    useEffect(() => {
        if (reduceMotion) {
            setPhase(derivedOpen ? cfg.phases.enter : cfg.phases.hidden);
            return;
        }

        if (derivedOpen) {
            setPhase(cfg.phases.enter);
        } else {
            // slide out first, then hide
            setPhase(cfg.phases.exit);
            const ms = parseInt(theme.motion.normal, 10) || cfg.fallbackMs;
            const t = window.setTimeout(() => setPhase(cfg.phases.hidden), ms);
            return () => window.clearTimeout(t);
        }
    }, [derivedOpen, reduceMotion, cfg.phases, cfg.fallbackMs]);

    // Handle content changes: exit → swap → enter (if open)
    useEffect(() => {
        const changed = lastKeyRef.current !== keyNow;
        if (!changed) return;

        lastKeyRef.current = keyNow;

        if (reduceMotion) {
            setPayload({ mediaUrl, title, text, actionText, actionIconUrl, actionSymbol });
            setPhase(derivedOpen ? cfg.phases.enter : cfg.phases.hidden);
            return;
        }

        // If not open, just swap and keep hidden
        if (!derivedOpen) {
            setPayload({ mediaUrl, title, text, actionText, actionIconUrl, actionSymbol });
            setPhase(cfg.phases.hidden);
            return;
        }

        // Exit, then swap, then enter
        setPhase(cfg.phases.exit);
        const ms = parseInt(theme.motion.normal, 10) || cfg.fallbackMs;

        const t = window.setTimeout(() => {
            setPayload({ mediaUrl, title, text, actionText, actionIconUrl, actionSymbol });
            setPhase(cfg.phases.enter);
        }, ms);

        return () => window.clearTimeout(t);
    }, [
        keyNow,
        derivedOpen,
        reduceMotion,
        mediaUrl,
        title,
        text,
        actionText,
        actionIconUrl,
        actionSymbol,
        cfg.phases,
        cfg.fallbackMs,
    ]);

    // Focus management + ESC
    useEffect(() => {
        if (!onClose) return;

        const isShown = phase === cfg.phases.enter;
        if (!isShown) return;

        // Focus close button when opened (best-effort)
        const raf = window.requestAnimationFrame(() => closeBtnRef.current?.focus?.());

        const onKeyDown = (e) => {
            if (e.key === cfg.keys.escape) onClose?.();
        };

        window.addEventListener(cfg.events.keydown, onKeyDown);
        return () => {
            window.cancelAnimationFrame(raf);
            window.removeEventListener(cfg.events.keydown, onKeyDown);
        };
    }, [phase, onClose, cfg.phases, cfg.keys, cfg.events]);

    const kind = useMemo(() => {
        if (mediaKind !== cfg.kinds.auto) return mediaKind;
        return inferMediaKind(payload.mediaUrl) || cfg.kinds.image;
    }, [mediaKind, payload.mediaUrl, cfg.kinds]);

    const shouldRender = phase !== cfg.phases.hidden;

    const motionStyle = useMemo(() => {
        if (reduceMotion) return cfg.motionStyles.reduce;

        const isEnter = phase === cfg.phases.enter;
        const isExit = phase === cfg.phases.exit;

        // For mobile we slide Y, for desktop we slide X.
        if (isMobile) {
            if (isEnter) return cfg.motionStyles.mobile.in;
            if (isExit) return cfg.motionStyles.mobile.out;
            return cfg.motionStyles.mobile.out;
        } else {
            if (isEnter) return cfg.motionStyles.desktop.in;
            if (isExit) return cfg.motionStyles.desktop.out;
            return cfg.motionStyles.desktop.out;
        }
    }, [phase, isMobile, reduceMotion, cfg.motionStyles, cfg.phases]);

    const cardStyle = useMemo(() => {
        return {
            ...(isMobile ? cfg.cardStyles.mobile : cfg.cardStyles.desktop),
            ...(motionStyle || {}),
        };
    }, [isMobile, cfg.cardStyles, motionStyle]);

    const showAction = !!payload.actionText && typeof onAction === "function";
    const ctaSize = useMemo(() => {
        // “giant” matches your big breadcrumb vibe; otherwise regular.
        // On mobile we keep it regular unless you want giant there too (set in theme).
        return isMobile ? cfg.ctaSizes.mobile : cfg.ctaSizes.desktop;
    }, [isMobile, cfg.ctaSizes]);

    const ctaVariant = cfg.ctaVariant;

    if (!shouldRender) return null;

    return (
        <div
            ref={rootRef}
            style={cfg.overlayStyle}
            onMouseDown={(e) => {
                if (!onClose) return;
                // click outside card closes
                if (e.target === e.currentTarget) onClose?.();
            }}
            aria-hidden={onClose ? undefined : true}
        >
            <section
                style={cardStyle}
                role={onClose ? cfg.a11y.role : undefined}
                aria-modal={onClose ? cfg.a11y.ariaModal : undefined}
                aria-label={onClose ? cfg.a11y.ariaLabel : undefined}
            >
                <header style={cfg.headerStyle}>
                    <div style={cfg.titleStyle} title={payload.title || ""}>
                        {payload.title || ""}
                    </div>

                    {onClose ? (
                        <button
                            ref={closeBtnRef}
                            type="button"
                            style={cfg.closeButtonStyle}
                            onClick={onClose}
                            aria-label={cfg.a11y.closeLabel}
                            title={cfg.a11y.closeLabel}
                        >
                            {cfg.closeSymbol}
                        </button>
                    ) : null}
                </header>

                {payload.mediaUrl ? (
                    <div style={cfg.mediaWrapStyle}>
                        {kind === cfg.kinds.video ? (
                            <video
                                key={payload.mediaUrl}
                                src={payload.mediaUrl}
                                style={cfg.mediaStyle}
                                controls={cfg.video.controls}
                                playsInline={cfg.video.playsInline}
                            />
                        ) : (
                            <img
                                key={payload.mediaUrl}
                                src={payload.mediaUrl}
                                alt={cfg.a11y.mediaAlt}
                                style={cfg.mediaStyle}
                                draggable={cfg.media.draggable}
                            />
                        )}
                    </div>
                ) : null}

                {payload.text ? (
                    <div style={cfg.textStyle}>{payload.text}</div>
                ) : null}

                {showAction ? (
                    <div style={cfg.ctaRowStyle}>
                        <AwesomeActionButton
                            iconUrl={actionIconUrl}
                            symbol={actionSymbol}
                            onClick={onAction}
                            size={ctaSize}
                            variant={ctaVariant}
                            disabled={false}
                            title={payload.actionText}
                        >
                            {payload.actionText}
                        </AwesomeActionButton>
                    </div>
                ) : null}
            </section>
        </div>
    );
}
