import React, { useEffect } from "react";
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { X } from "@phosphor-icons/react";
import {
    APP_ACCENT_COLOR,
    APP_BACKGROUND_COLOR,
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
    const bg = theme?.bg ?? APP_BACKGROUND_COLOR;
    const surface = theme?.surface ?? APP_SURFACE_COLOR;
    const border = theme?.border ?? APP_BORDER_COLOR;
    const text = theme?.text ?? APP_TEXT_COLOR;
    const muted = theme?.muted ?? APP_MUTED_TEXT_COLOR;
    const accent = theme?.accent ?? APP_ACCENT_COLOR;

    useEffect(() => {
        if (!open) return;

        const element = document.querySelector(`#${modalId}`);
        if (element) disableBodyScroll(element);

        return () => {
            clearAllBodyScrollLocks();
            if (element) enableBodyScroll(element);
        };
    }, [modalId, open]);

    if (!open) return null;

    const handleClose = () => {
        if (closeDisabled) return;
        clearAllBodyScrollLocks();
        onClose?.();
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex,
                paddingBottom: "env(safe-area-inset-bottom)",
                paddingTop: "env(safe-area-inset-top)",
                background: "rgba(248, 249, 252, 0.66)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
            }}
            onClick={() => {
                if (closeOnBackdrop) handleClose();
            }}
        >
            <div
                id={modalId}
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
                    fontFamily: "var(--font-family-base)",
                    color: text,
                    ...panelStyle,
                }}
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
        </div>
    );
}
