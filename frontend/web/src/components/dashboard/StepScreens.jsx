import React, { useEffect, useMemo, useState } from "react";

/**
 * StepScreens
 *
 * Top header:
 * - Left: screen title + subtitle (NOT step label)
 * - Right: progress line + steps spread (first at start, last at end)
 *
 * Steps:
 * - Solid pill background (not transparent) so it "cuts" the line behind
 * - Hover scale
 *
 * Content:
 * - Fills remaining height
 */
export default function StepScreens({
                                        // header (screen) text
                                        title = "",
                                        subtitle = "",

                                        steps = [],
                                        step: controlledStep,
                                        defaultStep = 0,
                                        onStepChange,
                                        style,

                                        children,
                                        renderStep,
                                        contentPadding = 8,
                                    }) {
    const isControlled = Number.isFinite(controlledStep);
    const [innerStep, setInnerStep] = useState(defaultStep);
    const [hovered, setHovered] = useState(null);

    const count = Array.isArray(steps) ? steps.length : 0;
    const step = isControlled ? controlledStep : innerStep;
    const safeStep = clamp(step, 0, Math.max(0, count - 1));

    useEffect(() => {
        if (!isControlled && step !== safeStep) setInnerStep(safeStep);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safeStep]);

    const setStep = (next, meta) => {
        const v = clamp(next, 0, Math.max(0, count - 1));
        if (!isControlled) setInnerStep(v);
        onStepChange?.(v, meta);
    };

    const stepContent = useMemo(() => {
        if (typeof renderStep === "function") return renderStep(safeStep);
        if (typeof children === "function") return children(safeStep);
        if (Array.isArray(children)) return children[safeStep] ?? null;
        return children ?? null;
    }, [children, renderStep, safeStep]);

    return (
        <div style={{ ...styles.wrap, ...style }}>
            {/* Header row: left title/subtitle + right progress */}
            <div style={styles.headerRow}>
                {/* Left: screen title/subtitle */}
                <div style={styles.headerLeft}>
                    {title ? <div style={styles.screenTitle}>{title}</div> : null}
                    {subtitle ? <div style={styles.screenSubtitle}>{subtitle}</div> : null}
                </div>

                {/* Right: progress */}
                <div style={styles.headerRight}>
                    <div style={styles.progressWrap}>
                        <div style={styles.line} />

                        <div style={styles.stepsRow}>
                            {steps.map((s, idx) => {
                                const isDone = idx < safeStep;
                                const isActive = idx === safeStep;
                                const isHover = hovered === idx;

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setStep(idx, { source: "step_click" })}
                                        onMouseEnter={() => setHovered(idx)}
                                        onMouseLeave={() => setHovered(null)}
                                        style={{
                                            ...styles.stepBtn,
                                            ...(isActive ? styles.stepBtnActive : null),
                                        }}
                                        title={typeof s === "string" ? s : s?.label}
                                    >
                                        <div
                                            style={{
                                                ...styles.stepPill,
                                                ...(isActive ? styles.stepPillActive : null),
                                                ...(isDone ? styles.stepPillDone : null),

                                                transform: isHover ? "scale(1.03)" : "scale(1)",
                                                filter: isHover ? "brightness(0.985)" : "none",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    ...styles.dot,
                                                    ...(isDone ? styles.dotDone : null),
                                                    ...(isActive ? styles.dotActive : null),
                                                }}
                                            />
                                            <div
                                                style={{
                                                    ...styles.label,
                                                    ...(isActive ? styles.labelActive : null),
                                                    ...(isDone ? styles.labelDone : null),
                                                }}
                                            >
                                                {typeof s === "string" ? s : s?.label}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content fills remaining height */}
            <div style={{ ...styles.contentWrap, padding: contentPadding }}>
                <div style={styles.contentInner}>{stepContent}</div>
            </div>
        </div>
    );
}

function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
}

const styles = {
    wrap: {
        height: "100%",
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },

    /* -------- header row -------- */
    headerRow: {
        flex: "0 0 auto",
        display: "flex",
        alignItems: "stretch",
        gap: 14,
        padding: "10px 6px 12px 6px",
        minWidth: 0,
        borderBottom: "1px solid rgba(0,0,0,0.06)",
    },

    headerLeft: {
        flex: "0 0 34%",          // ~1/3
        minWidth: 220,            // keeps readable
        maxWidth: 420,            // prevents taking too much
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 4,
        paddingLeft: 4,
    },

    screenTitle: {
        fontWeight: 1000,
        color: "var(--text, #3a2a1d)",
        fontSize: "clamp(1.4rem, 2.2vw, 2rem)", // ✅ fluid
        lineHeight: 1.1,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },

    screenSubtitle: {
        fontWeight: 800,
        color: "var(--muted, #a47856)",
        fontSize: "clamp(0.9rem, 1.2vw, 1rem)", // ✅ fluid
        lineHeight: 1.2,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },


    headerRight: {
        flex: "1 1 auto",
        minWidth: 0,
        display: "flex",
        alignItems: "center",
    },

    progressWrap: {
        width: "100%",
        position: "relative",
        minWidth: 0,
        padding: "6px 0",
    },

    line: {
        position: "absolute",
        left: 8,
        right: 8,
        top: 22,
        height: 4,
        background: "rgba(0,0,0,0.10)",
        borderRadius: 999,
        pointerEvents: "none",
        zIndex: 0,
    },

    // ✅ spread steps: first left, last right, middle evenly between
    stepsRow: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
    },

    stepBtn: {
        appearance: "none",
        border: "none",
        background: "transparent",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        minWidth: 0,
        textAlign: "left",
        flex: "0 0 auto",
    },

    stepBtnActive: {
        cursor: "default",
    },

    stepPill: {
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 999,

        background: "var(--card, #fffdf8)",
        border: "2px solid rgba(0,0,0,0.10)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.06)",

        minWidth: 0,
        transformOrigin: "left center",
        transition: "transform 130ms ease, filter 130ms ease, border-color 130ms ease, box-shadow 130ms ease",
    },

    stepPillActive: {
        border: "2px solid rgba(255,97,56,0.55)",
        boxShadow: "3px 3px 0 rgba(0,0,0,0.08)",
    },

    stepPillDone: {
        border: "2px solid rgba(0,0,0,0.16)",
    },

    dot: {
        width: 14,
        height: 14,
        borderRadius: 999,
        background: "rgba(0,0,0,0.18)",
        boxShadow: "0 0 0 3px rgba(255,255,255,0.98)",
        flex: "0 0 auto",
    },

    dotDone: {
        background: "rgba(0,0,0,0.40)",
    },

    dotActive: {
        background: "var(--accent, #ff6138)",
    },

    label: {
        fontWeight: 900,
        color: "rgba(0,0,0,0.55)",
        fontSize: 14,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },

    labelDone: {
        color: "rgba(0,0,0,0.75)",
    },

    labelActive: {
        color: "var(--text, #3a2a1d)",
        fontSize: 20,
        lineHeight: 1.1,
    },

    /* -------- content -------- */
    contentWrap: {
        flex: "1 1 auto",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },

    contentInner: {
        flex: "1 1 auto",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
};
