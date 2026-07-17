import React, { useEffect } from "react";
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { X } from "@phosphor-icons/react";
import { APP_ACCENT_COLOR, APP_BACKGROUND_COLOR } from "../../theme.js";

export const modalShellTokens = {
    panelPadding: "40px",
    panelBorderWidth: 1,
    panelRadius: 10,
    optionBorderWidth: 1,
    optionRadius: 5,
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
    const text = theme?.text ?? "#000";
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
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
            }}
            onClick={() => {
                if (closeOnBackdrop) handleClose();
            }}
        >
            <div
                id={modalId}
                style={{
                    position: "relative",
                    background: bg,
                    padding: modalShellTokens.panelPadding,
                    borderRadius: modalShellTokens.panelRadius,
                    border: `${modalShellTokens.panelBorderWidth}px solid #000`,
                    width,
                    maxWidth,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    display: hidden ? "none" : "block",
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
                            top: 16,
                            right: 16,
                            width: 32,
                            height: 32,
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
                    <div style={{ marginBottom: 32 }}>
                        {title && (
                            <h2
                                style={{
                                    textAlign: "left",
                                    margin: 0,
                                    color: text,
                                    fontSize: "2rem",
                                    fontWeight: 800,
                                    lineHeight: 1,
                                    ...titleStyle,
                                }}
                            >
                                {title}
                            </h2>
                        )}

                        {subtitle && (
                            <p
                                style={{
                                    margin: "8px 0 0",
                                    color: "#000",
                                    fontWeight: 400,
                                    opacity: 1,
                                    fontSize: "1rem",
                                    lineHeight: 1.2,
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
