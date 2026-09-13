import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import {
    APP_ACCENT_COLOR,
    APP_BORDER_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
} from "../../theme.js";

export const modalShellTokens = {
    panelPadding: "40px",
    panelBorderWidth: 1,
    panelRadius: 26,
    optionBorderWidth: 1,
    optionRadius: 14,
    maxWidth: 520,
};

function readVisualViewport() {
    if (typeof window === "undefined") {
        return { top: 0, left: 0, width: "100%", height: "100%" };
    }

    const viewport = window.visualViewport;
    return {
        top: viewport?.offsetTop ?? 0,
        left: viewport?.offsetLeft ?? 0,
        width: viewport?.width ?? window.innerWidth,
        height: viewport?.height ?? window.innerHeight,
    };
}

export default function ModalShell({
    open = true,
    id,
    theme,
    title,
    subtitle,
    children,
    footer,
    onClose,
    closeDisabled = false,
    closeOnBackdrop = true,
    hideClose = false,
    hidden = false,
    zIndex = 9998,
    maxWidth = modalShellTokens.maxWidth,
    width = "90%",
    panelStyle,
    contentStyle,
    titleStyle,
    subtitleStyle,
}) {
    const modalId = id ?? "modal-shell";
    const [visualViewport, setVisualViewport] = useState(readVisualViewport);
    const [scrollIndicator, setScrollIndicator] = useState(null);
    const panelRef = useRef(null);
    const scrollFrameRef = useRef(null);
    const surface = theme?.surface ?? APP_SURFACE_COLOR;
    const border = theme?.border ?? APP_BORDER_COLOR;
    const text = theme?.text ?? APP_TEXT_COLOR;
    const muted = theme?.muted ?? APP_MUTED_TEXT_COLOR;
    const accent = theme?.accent ?? APP_ACCENT_COLOR;

    const updateScrollIndicator = useCallback(() => {
        const panel = panelRef.current;
        if (!panel) return;

        const {clientHeight, scrollHeight, scrollTop} = panel;
        const maxScrollTop = scrollHeight - clientHeight;
        if (maxScrollTop <= 1) {
            setScrollIndicator(null);
            return;
        }

        const rect = panel.getBoundingClientRect();
        const trackInset = 8;
        const trackHeight = Math.max(0, rect.height - trackInset * 2);
        const thumbHeight = Math.max(32, trackHeight * (clientHeight / scrollHeight));
        const thumbTravel = Math.max(0, trackHeight - thumbHeight);
        const thumbOffset = thumbTravel * (scrollTop / maxScrollTop);

        setScrollIndicator({
            left: rect.right - 8,
            top: rect.top + trackInset,
            trackHeight,
            thumbHeight,
            thumbOffset,
        });
    }, []);

    const scheduleScrollIndicatorUpdate = useCallback(() => {
        if (scrollFrameRef.current != null) return;
        scrollFrameRef.current = window.requestAnimationFrame(() => {
            scrollFrameRef.current = null;
            updateScrollIndicator();
        });
    }, [updateScrollIndicator]);

    useEffect(() => {
        if (!open) return;

        const viewport = window.visualViewport;
        const updateViewport = () => setVisualViewport(readVisualViewport());
        updateViewport();
        viewport?.addEventListener("resize", updateViewport);
        viewport?.addEventListener("scroll", updateViewport);
        window.addEventListener("orientationchange", updateViewport);

        return () => {
            viewport?.removeEventListener("resize", updateViewport);
            viewport?.removeEventListener("scroll", updateViewport);
            window.removeEventListener("orientationchange", updateViewport);
        };
    }, [open]);

    useEffect(() => {
        if (!open) {
            setScrollIndicator(null);
            return undefined;
        }

        const panel = panelRef.current;
        if (!panel) return undefined;

        scheduleScrollIndicatorUpdate();
        const resizeObserver = typeof ResizeObserver === "undefined"
            ? null
            : new ResizeObserver(scheduleScrollIndicatorUpdate);
        const mutationObserver = typeof MutationObserver === "undefined"
            ? null
            : new MutationObserver(scheduleScrollIndicatorUpdate);

        resizeObserver?.observe(panel);
        mutationObserver?.observe(panel, {childList: true, subtree: true, characterData: true});
        window.addEventListener("resize", scheduleScrollIndicatorUpdate);
        window.visualViewport?.addEventListener("resize", scheduleScrollIndicatorUpdate);

        return () => {
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();
            window.removeEventListener("resize", scheduleScrollIndicatorUpdate);
            window.visualViewport?.removeEventListener("resize", scheduleScrollIndicatorUpdate);
            if (scrollFrameRef.current != null) {
                window.cancelAnimationFrame(scrollFrameRef.current);
                scrollFrameRef.current = null;
            }
        };
    }, [
        open,
        scheduleScrollIndicatorUpdate,
        visualViewport.height,
        visualViewport.left,
        visualViewport.top,
        visualViewport.width,
    ]);

    if (!open || typeof document === "undefined") return null;

    const handleClose = () => {
        if (closeDisabled) return;
        onClose?.();
    };

    return createPortal(
        <div
            style={{
                position: "fixed",
                top: visualViewport.top,
                left: visualViewport.left,
                width: visualViewport.width,
                height: visualViewport.height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex,
                paddingBottom: "env(safe-area-inset-bottom)",
                paddingTop: "env(safe-area-inset-top)",
                background: "rgba(248, 249, 252, 0.66)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxSizing: "border-box",
            }}
            onClick={() => {
                if (closeOnBackdrop) handleClose();
            }}
        >
            <div
                id={modalId}
                ref={panelRef}
                className="modal-shell-scroll"
                style={{
                    position: "relative",
                    background: surface,
                    padding: modalShellTokens.panelPadding,
                    borderRadius: modalShellTokens.panelRadius,
                    border: `${modalShellTokens.panelBorderWidth}px solid ${border}`,
                    width,
                    maxWidth,
                    boxShadow: "0 24px 80px rgba(31, 36, 54, 0.14)",
                    display: hidden ? "none" : "block",
                    maxHeight: "calc(100% - 24px)",
                    overflowY: "scroll",
                    scrollbarGutter: "stable",
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                    fontFamily: "var(--font-family-base)",
                    color: text,
                    ...panelStyle,
                }}
                onScroll={scheduleScrollIndicatorUpdate}
                onClick={(event) => event.stopPropagation()}
            >
                {!hideClose && (
                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close modal"
                        disabled={closeDisabled}
                        style={{
                            position: "absolute",
                            top: 18,
                            right: 18,
                            width: 36,
                            height: 36,
                            border: "none",
                            background: "transparent",
                            color: accent,
                            cursor: closeDisabled ? "not-allowed" : "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                            opacity: closeDisabled ? 0.6 : 1,
                        }}
                    >
                        <X size={28} weight="regular" aria-hidden />
                    </button>
                )}

                {(title || subtitle) && (
                    <div style={{ marginBottom: 28 }}>
                        {title && (
                            <h2
                                style={{
                                    textAlign: "left",
                                    margin: 0,
                                    color: text,
                                    fontFamily: "var(--font-family-base)",
                                    fontSize: "clamp(2rem, 6vw, 3rem)",
                                    fontWeight: 800,
                                    lineHeight: 1.05,
                                    letterSpacing: 0,
                                    ...titleStyle,
                                }}
                            >
                                {title}
                            </h2>
                        )}

                        {subtitle && (
                            <p
                                style={{
                                    margin: "10px 0 0",
                                    color: muted,
                                    fontFamily: "var(--font-family-base)",
                                    fontWeight: 400,
                                    opacity: 1,
                                    fontSize: "1rem",
                                    lineHeight: 1.45,
                                    textAlign: "left",
                                    ...subtitleStyle,
                                }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                <div style={contentStyle}>{children}</div>
                {footer}
            </div>

            {scrollIndicator && (
                <div
                    aria-hidden="true"
                    style={{
                        position: "fixed",
                        left: scrollIndicator.left,
                        top: scrollIndicator.top,
                        width: 4,
                        height: scrollIndicator.trackHeight,
                        borderRadius: 999,
                        background: "rgba(32, 36, 58, 0.14)",
                        pointerEvents: "none",
                        zIndex: zIndex + 2,
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            height: scrollIndicator.thumbHeight,
                            borderRadius: 999,
                            background: "rgba(64, 69, 96, 0.62)",
                            transform: `translateY(${scrollIndicator.thumbOffset}px)`,
                        }}
                    />
                </div>
            )}
        </div>,
        document.body,
    );
}
