import React, { useEffect, useRef } from "react";

export default function AwesomeModal({
                                         open,
                                         title,
                                         children,
                                         width,
                                         height,
                                         footer,
                                         onClose,
                                     }) {
    const backdropRef = useRef(null);

    // ✅ lock page scroll while modal is open
    useEffect(() => {
        if (!open) return;

        const prevOverflow = document.body.style.overflow;
        const prevPaddingRight = document.body.style.paddingRight;

        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.paddingRight = prevPaddingRight;
        };
    }, [open]);

    // ✅ prevent scroll chaining to page (trackpads/touch)
    useEffect(() => {
        if (!open) return;
        const el = backdropRef.current;
        if (!el) return;

        const stopIfBackdrop = (e) => {
            if (e.target === el) e.preventDefault();
        };

        el.addEventListener("wheel", stopIfBackdrop, { passive: false });
        el.addEventListener("touchmove", stopIfBackdrop, { passive: false });

        return () => {
            el.removeEventListener("wheel", stopIfBackdrop);
            el.removeEventListener("touchmove", stopIfBackdrop);
        };
    }, [open]);

    if (!open) return null;

    const styles = {
        backdrop: {
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 14,
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingTop: "env(safe-area-inset-top)",
            overscrollBehavior: "contain",
        },

        // ✅ Match PdfTypeModal visual language
        modal: {
            width: "100%",
            maxWidth: width ?? 560,
            height: height ?? "initial",

            background: "var(--bg, #fff3df)", // ✅ cream bg like PdfTypeModal theme.bg
            border: "4px solid var(--accent, #ff6138)", // ✅ thicker
            borderRadius: "calc(var(--radius, 20px) * 1.2)", // ✅ larger rounding
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)", // ✅ PdfTypeModal-like

            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
            overscrollBehavior: "contain",
        },

        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            padding: "16px 18px",
            flex: "0 0 auto",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            background: "transparent",
            minWidth: 0,
        },

        title: {
            fontWeight: 1000,
            color: "var(--text, #3a2a1d)",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },

        // closer to PdfTypeModal "X" (text, not button chrome)
        x: {
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--accent, #ff6138)",
            fontSize: "1.3rem",
            fontWeight: 600,
            lineHeight: 1,
            padding: "4px 6px",
            marginRight: -6,
            userSelect: "none",
        },

        // ✅ body fills remaining space between header/footer
        body: {
            flex: "1 1 auto",
            minHeight: 0,
            padding: "16px 18px",
            overflow: "hidden",
            background: "transparent",
        },

        footer: {
            padding: "16px 18px",
            flex: "0 0 auto",
            borderTop: "1px solid rgba(0,0,0,0.08)",
            background: "transparent",
        },
    };

    return (
        <div
            ref={backdropRef}
            style={styles.backdrop}
            onMouseDown={onClose}
        >
            <div
                style={styles.modal}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div style={styles.header}>
                    <div style={styles.title}>{title}</div>
                    <button style={styles.x} onClick={onClose} aria-label="close">
                        ✕
                    </button>
                </div>

                <div style={styles.body}>{children}</div>

                {footer && <div style={styles.footer}>{footer}</div>}
            </div>
        </div>
    );
}
