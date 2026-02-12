import React, { useEffect, useMemo, useRef, useState } from "react";
import { themeStyles as theme } from "../../utils/theme.js";

export default function Link({
                                 title,
                                 href,
                                 children,
                                 onClick,
                                 style,
                             }) {
    const t = theme.link;

    const [hover, setHover] = useState(false);
    const [copied, setCopied] = useState(false);

    const timerRef = useRef(null);

    const copyValue = useMemo(() => {
        // prefer href; if children is a plain string and href is empty, copy children
        if (href) return String(href);
        if (typeof children === "string") return children;
        return "";
    }, [href, children]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    async function copyToClipboard() {
        if (!copyValue) return;

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(copyValue);
            } else {
                // fallback
                const ta = document.createElement("textarea");
                ta.value = copyValue;
                ta.style.position = "fixed";
                ta.style.left = "-9999px";
                ta.style.top = "0";
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }

            setCopied(true);
            if (timerRef.current) clearTimeout(timerRef.current);

            // visible for a few seconds, then fade out
            timerRef.current = setTimeout(() => {
                setCopied(false);
            }, t?.copied?.durationMs ?? 1800);
        } catch (e) {
            // optional: you can show another message here (e.g. "Couldn't copy")
            setCopied(false);
        }
    }

    const copiedOpacity = copied ? 1 : 0;

    return (
        <div style={{ ...t.wrap, ...style }}>
            {title && <div style={t.title}>{title}</div>}

            <div style={t.row}>
                {/* ICON (click to copy) */}
                <span
                    role="button"
                    tabIndex={0}
                    aria-label={t?.a11y?.copyLabel || "Copy link"}
                    onClick={copyToClipboard}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            copyToClipboard();
                        }
                    }}
                    style={{
                        width: t.icon.size,
                        height: t.icon.size,
                        backgroundColor: t.icon.bg,
                        opacity: t.icon.opacity,
                        flex: "0 0 auto",
                        cursor: "pointer",

                        mask: "url(/copy.svg) center / contain no-repeat",
                        WebkitMask: "url(/copy.svg) center / contain no-repeat",

                        // tiny affordance
                        transition: `transform ${theme.motion?.fast ?? "160ms"} ${theme.motion?.ease ?? "ease"}`,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.08)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                />

                {/* LINK */}
                <a
                    href={href}
                    onClick={onClick}
                    style={{
                        ...t.link,
                        opacity: hover ? t.linkHoverOpacity : 1,
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.a11y.ariaLabel}
                >
                    {children || href}
                </a>
            </div>

            {/* "Link copied" */}
            <div
                style={{
                    ...(t?.copied?.textStyle || {
                        fontFamily: theme.fontFamily,
                        fontSize: theme.smallType?.hint || theme.type?.subtitle,
                        color: theme.textMutedDark,
                        opacity: 0.8,
                    }),
                    opacity: copiedOpacity,
                    transition: `opacity ${t?.copied?.fadeMs ?? 220}ms`,
                }}
            >
                {t?.copied?.text || "Link copied"}
            </div>
        </div>
    );
}
