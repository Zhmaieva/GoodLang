import React, { useEffect, useMemo, useState } from "react";
import Tooltip from "./Tooltip.jsx";

/**
 * StepScreens (with validation gating)
 *
 * - validateStep(stepIndex) => { ok: boolean, message?: string }
 * - If current step invalid => all next steps show lock + tooltip (message)
 * - If a step validation passed => green + checkmark (instead of circle)
 * - If step is available but not valid => circle muted
 * - Locked steps are not clickable
 *
 * lock icon: /lock-icon.svg (from public)
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

                                        // validation
                                        validateStep, // (idx) => { ok, message }

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

    // ---- validation map
    const validations = useMemo(() => {
        const out = [];
        for (let i = 0; i < count; i++) {
            const v = typeof validateStep === "function" ? validateStep(i) : null;
            out.push({
                ok: !!v?.ok,
                message: v?.message || "",
            });
        }
        return out;
    }, [validateStep, count]);

    // can open step idx if:
    // - idx <= current
    // - OR all steps before idx are valid
    const canNavigateTo = (idx) => {
        if (idx <= safeStep) return true;
        for (let i = 0; i < idx; i++) {
            if (!validations[i]?.ok) return false;
        }
        return true;
    };

    // if a step is not navigable => show lock with message of the blocking invalid step
    const getBlockMessage = (idx) => {
        for (let i = 0; i < idx; i++) {
            if (!validations[i]?.ok) return validations[i]?.message || "Заповніть попередній крок";
        }
        return "Заповніть попередній крок";
    };

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
                                const isActive = idx === safeStep;
                                const isHover = hovered === idx;

                                const ok = !!validations[idx]?.ok;

                                // completed meaning: step validated and is at/before current
                                const isCompleted = ok && idx <= safeStep;

                                const unlocked = canNavigateTo(idx);
                                const isLocked = !unlocked;

                                // available but not valid (only makes sense for current/visited steps)
                                const isAvailableButInvalid = unlocked && !ok && idx <= safeStep;

                                const tooltip = isLocked
                                    ? getBlockMessage(idx)
                                    : (validations[idx]?.message || (typeof s === "string" ? s : s?.label) || "");

                                const pillStyle = isCompleted
                                    ? styles.stepPillDoneGreen
                                    : isActive
                                        ? styles.stepPillActive
                                        : isAvailableButInvalid
                                            ? styles.stepPillMuted
                                            : null;

                                const btn = (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            if (isLocked) return;
                                            setStep(idx, { source: "step_click" });
                                        }}
                                        onMouseEnter={() => (!isActive ? setHovered(idx) : null)}
                                        onMouseLeave={() => setHovered(null)}
                                        style={{
                                            ...styles.stepBtn,
                                            ...(isActive ? styles.stepBtnActive : null),
                                            ...(isLocked ? styles.stepBtnLocked : null),
                                        }}
                                        aria-disabled={isLocked}
                                    >
                                        <div
                                            style={{
                                                ...styles.stepPill,
                                                ...(pillStyle || null),
                                                transform: isHover ? "scale(1.03)" : "scale(1)",
                                                filter: isHover ? "brightness(0.985)" : "none",
                                            }}
                                        >
                                            {/* ICON AREA */}
                                            {isLocked ? (
                                                <img src="/lock-icon.svg" alt="locked" style={styles.lockIcon} />
                                            ) : isCompleted ? (
                                                <div style={styles.checkMark}></div>
                                            ) : (
                                                <div
                                                    style={{
                                                        ...styles.dot,
                                                        ...(isActive ? styles.dotActive : null),
                                                        ...(!isActive && isAvailableButInvalid ? styles.dotMuted : null),
                                                    }}
                                                />
                                            )}

                                            <div
                                                style={{
                                                    ...styles.label,
                                                    ...(isActive ? styles.labelActive : null),
                                                    ...(isCompleted ? styles.labelGreen : null),
                                                    ...(isLocked ? styles.labelLocked : null),
                                                }}
                                            >
                                                {typeof s === "string" ? s : s?.label}
                                            </div>
                                        </div>
                                    </button>
                                );

                                // Tooltip wrapper (auto-hide + fade)
                                return (
                                    <>
                                        {
                                            isLocked &&
                                            <Tooltip key={idx} content={tooltip} autoHideMs={1500} fadeMs={260}>
                                                {btn}
                                            </Tooltip>
                                        }

                                        {
                                            !isLocked &&
                                            <div key={idx}>{btn}</div>
                                        }
                                    </>
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
        flex: "0 0 34%",
        minWidth: 220,
        maxWidth: 420,
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
        fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
        lineHeight: 1.1,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },

    screenSubtitle: {
        fontWeight: 800,
        color: "var(--muted, #a47856)",
        fontSize: "clamp(0.9rem, 1.2vw, 1rem)",
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

    stepBtnLocked: {
        cursor: "not-allowed",
        opacity: 0.9,
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

    // completed (valid) => green
    stepPillDoneGreen: {
        border: "2px solid rgba(75,163,110,0.65)",
        boxShadow: "3px 3px 0 rgba(0,0,0,0.06)",
    },

    // available but invalid => muted
    stepPillMuted: {
        border: "2px solid rgba(0,0,0,0.10)",
        opacity: 0.85,
    },

    dot: {
        width: 14,
        height: 14,
        borderRadius: 999,
        background: "rgba(0,0,0,0.18)",
        boxShadow: "0 0 0 3px rgba(255,255,255,0.98)",
        flex: "0 0 auto",
    },

    dotActive: {
        background: "var(--accent, #ff6138)",
    },

    dotMuted: {
        background: "rgba(0,0,0,0.12)",
    },

    checkMark: {
        width: 18,
        height: 18,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 1000,
        fontSize: 14,
        color: "var(--green, #4ba36e)",
        background: "rgba(75,163,110,0.10)",
        boxShadow: "0 0 0 3px rgba(255,255,255,0.98)",
        flex: "0 0 auto",
    },

    lockIcon: {
        width: 16,
        height: 16,
        display: "block",
        flex: "0 0 auto",
        opacity: 0.95,
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

    labelActive: {
        color: "var(--text, #3a2a1d)",
        fontSize: 20,
        lineHeight: 1.1,
    },

    labelGreen: {
        color: "var(--greenDark, #2d6f48)",
    },

    labelLocked: {
        color: "rgba(0,0,0,0.45)",
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
