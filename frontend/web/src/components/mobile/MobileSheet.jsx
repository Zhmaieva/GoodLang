import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { mobileCopy as t } from "./mobileCopy.js";

function keepFieldVisible(content, field) {
    if (!content?.contains(field) || !field.matches("input, textarea, select")) return;
    const fieldRect = field.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    if (fieldRect.bottom > contentRect.bottom - 6) content.scrollTop += fieldRect.bottom - contentRect.bottom + 6;
    else if (fieldRect.top < contentRect.top + 6) content.scrollTop -= contentRect.top - fieldRect.top + 6;
}

export default function MobileSheet({ open = true, title, children, footer, onClose, className = "", dismissible = true }) {
    const titleId = useId();
    const panelRef = useRef(null);
    const closeRef = useRef(onClose);
    const dismissibleRef = useRef(dismissible);
    const [viewport, setViewport] = useState(null);
    useEffect(() => { closeRef.current = onClose; }, [onClose]);
    useEffect(() => { dismissibleRef.current = dismissible; }, [dismissible]);
    useLayoutEffect(() => {
        if (!open) return;
        keepFieldVisible(panelRef.current?.querySelector(".gl-sheet-content"), document.activeElement);
    }, [open, viewport]);
    useEffect(() => {
        if (!open) return;
        const visualViewport = window.visualViewport;
        const update = () => setViewport({
            top: visualViewport?.offsetTop ?? 0,
            left: visualViewport?.offsetLeft ?? 0,
            width: visualViewport?.width ?? window.innerWidth,
            height: visualViewport?.height ?? window.innerHeight,
        });
        update();
        visualViewport?.addEventListener("resize", update);
        visualViewport?.addEventListener("scroll", update);
        window.addEventListener("resize", update);
        return () => {
            visualViewport?.removeEventListener("resize", update);
            visualViewport?.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [open]);
    useEffect(() => {
        if (!open) return;
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const panel = panelRef.current;
        panel?.focus({ preventScroll: true });
        const handleKey = (event) => {
            if (event.key === "Escape") {
                event.stopPropagation();
                if (dismissibleRef.current) closeRef.current?.();
            }
            if (event.key !== "Tab") return;
            const controls = [...panel.querySelectorAll('button, a[href], input, select, textarea, summary, [tabindex="0"]')]
                .filter((element) => !element.disabled && element.getClientRects().length > 0);
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (!first) { event.preventDefault(); return; }
            if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
                event.preventDefault(); last.focus();
            } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel)) {
                event.preventDefault(); first.focus();
            }
        };
        panel?.addEventListener("keydown", handleKey);
        return () => {
            panel?.removeEventListener("keydown", handleKey);
            document.body.style.overflow = previousOverflow;
            if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
        };
    }, [open]);
    if (!open) return null;
    return createPortal(
        <div className="gl-sheet-backdrop" onClick={dismissible ? onClose : undefined}
            style={viewport ? { top: viewport.top, left: viewport.left, width: viewport.width, height: viewport.height,
                bottom: "auto", right: "auto", "--gl-sheet-viewport-height": `${viewport.height}px` } : undefined}>
            <section className={`gl-sheet ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId}
                ref={panelRef} tabIndex={-1} onClick={(event) => event.stopPropagation()}>
                <div className="gl-sheet-handle" aria-hidden="true" />
                <header className="gl-sheet-heading">
                    <h2 id={titleId}>{title}</h2>
                    {dismissible && <button type="button" className="gl-icon-button" onClick={onClose} aria-label={t("Закрити", "Close")}><X size={22} /></button>}
                </header>
                <div className="gl-sheet-content" onFocusCapture={(event) => keepFieldVisible(event.currentTarget, event.target)}>{children}</div>
                {footer && <footer className="gl-sheet-footer">{footer}</footer>}
            </section>
        </div>, document.body,
    );
}
