// AssignmentList.jsx — FULL DROP-IN
// - subtitle under title: TYPE only
// - only 3 info chips inside card (non-pressable)
// - includes SelectableChip (grey-filled when selected) for filters/sorting UI elsewhere

import React, { useMemo, useState } from "react";
import DynamicList from "../DynamicList.jsx";
import RectangleGroup from "../RectangleGroup.jsx";
import EmptyContent from "../EmptyContent.jsx";
import { theme } from "../../../App.jsx";

function formatDate(d) {
    if (!d) return "";
    try {
        const dt = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
        if (Number.isNaN(dt.getTime())) return "";
        return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
    } catch {
        return "";
    }
}

function safeInt(n, fallback = 0) {
    const x = Number(n);
    return Number.isFinite(x) ? x : fallback;
}

function toTypeLine(a) {
    const raw = a?.type ?? a?.taskType ?? a?.assignmentType ?? "";
    const t = raw ? String(raw) : "Assignment";
    return t.length ? t.charAt(0).toUpperCase() + t.slice(1) : "Assignment";
}

function toCompletedLine(a) {
    const done = safeInt(a?.submittedCount ?? a?.doneCount ?? a?.completedStudents, 0);
    if (!done) return "";
    return `Completed by: ${done} ${done === 1 ? "student" : "students"}`;
}

function toAssignedToLine(a) {
    if (a?.className) return `Assigned to: ${String(a.className)}`;
    if (a?.audienceLabel) return `Assigned to: ${String(a.audienceLabel)}`;
    return "";
}

// ---------- local UI helpers

function getGreyFill() {
    // Use whatever your project has; fall back to a subtle grey.
    return (
        theme?.colors?.buttonSelectedBg ||
        theme?.bgSoft ||
        theme?.bgMuted ||
        theme?.surfaceMuted ||
        "rgba(0,0,0,0.06)"
    );
}

// ✅ NON-pressable info chip (for inside assignment card)
function InfoChip({ children, title, style }) {
    const s = useMemo(() => {
        const base = {
            fontFamily: theme.fontFamily,
            fontSize: theme.type.subtitle,
            fontWeight: theme.weights.normal,
            lineHeight: theme.type.subtitleLineHeight,
            color: theme.textDark,

            border: theme.borders.card,
            background: "transparent",
            borderRadius: theme.radius.card,

            padding: `${Math.max(6, Math.floor(theme.spacing.listPad * 0.8))}px ${theme.spacing.cardPadX}px`,

            whiteSpace: "nowrap",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",

            userSelect: "text",
            cursor: "default",
            outline: "none",
        };
        return { ...base, ...(style || {}) };
    }, [style]);

    if (!children) return null;

    return (
        <div title={title} style={s}>
            {children}
        </div>
    );
}

// ✅ SELECTABLE chip for filters/sorting (grey fill when selected)
export function SelectableChip({ children, title, selected = false, onClick, style, disabled = false }) {
    const [hovered, setHovered] = useState(false);

    const s = useMemo(() => {
        const reduceMotion = !!theme?.accessibility?.reduceMotion;
        const bg = selected ? getGreyFill() : "transparent";

        return {
            fontFamily: theme.fontFamily,
            fontSize: theme.type.subtitle,
            fontWeight: theme.weights.normal,
            lineHeight: theme.type.subtitleLineHeight,
            color: theme.textDark,

            border: selected ? theme.borders.cardSelected : hovered ? theme.borders.cardSelected : theme.borders.card,
            background: bg,
            borderRadius: theme.radius.card,

            padding: `${Math.max(6, Math.floor(theme.spacing.listPad * 0.8))}px ${theme.spacing.cardPadX}px`,

            whiteSpace: "nowrap",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",

            cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.5 : 1,
            userSelect: "none",

            transition: reduceMotion
                ? "none"
                : `transform ${theme.motion.fast} ${theme.motion.ease},
           border ${theme.motion.fast} ${theme.motion.ease},
           background ${theme.motion.fast} ${theme.motion.ease},
           opacity ${theme.motion.fast} ${theme.motion.ease}`,

            transform: hovered && !disabled && !reduceMotion ? "scale(1.02)" : "scale(1)",
            outline: "none",

            ...style,
        };
    }, [hovered, selected, disabled, style]);

    if (!children) return null;

    return (
        <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            title={title}
            style={s}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => {
                if (disabled) return;
                onClick?.();
            }}
            onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            {children}
        </div>
    );
}

function IconButton({ label, symbol, onClick, disabled }) {
    const [hovered, setHovered] = useState(false);

    const s = useMemo(() => {
        const reduceMotion = !!theme?.accessibility?.reduceMotion;

        return {
            btn: {
                appearance: "none",
                border: hovered ? theme.borders.cardSelected : theme.borders.card,
                background: "transparent",
                borderRadius: theme.radius.card,

                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",

                width: 34,
                height: 34,

                cursor: disabled ? "default" : "pointer",
                opacity: disabled ? 0.5 : 1,

                transform: hovered && !disabled && !reduceMotion ? "scale(1.03)" : "scale(1)",
                transition: reduceMotion
                    ? "none"
                    : `transform ${theme.motion.fast} ${theme.motion.ease},
             border ${theme.motion.fast} ${theme.motion.ease},
             background ${theme.motion.fast} ${theme.motion.ease}`,

                color: theme.textDark,
                userSelect: "none",
                outline: "none",
            },
            sym: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.title,
                fontWeight: theme.weights.title,
                lineHeight: 1,
                opacity: hovered && !disabled ? 1 : 0.9,
                pointerEvents: "none",
            },
        };
    }, [hovered, disabled]);

    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            disabled={disabled}
            style={s.btn}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={(e) => {
                if (disabled) return;
                onClick?.(e);
            }}
        >
      <span style={s.sym} aria-hidden="true">
        {symbol}
      </span>
        </button>
    );
}

export function AssignmentList({
                                   assignments = [],

                                   onOpen,
                                   onEdit,
                                   onDelete,

                                   // (kept for backwards compat; not used now because chips are non-pressable)
                                   onOpenSubmissions,
                                   onOpenAudience,
                                   onOpenMeta,
                                   onOpenCreated,

                                   groupTitle = "test",
                                   emptyTitle = "No assignments yet",
                                   emptySubtitle = "Create your first assignment to start tracking submissions.",
                                   onCreate,
                               }) {
    const [busyId, setBusyId] = useState(null);

    const styles = useMemo(() => {
        return {
            card: {
                width: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                borderRadius: theme.radius.card,
                border: theme.borders.card,
                background: "transparent",
                padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.rowGap,
            },

            topRow: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: theme.spacing.gap,
                minWidth: 0,
            },

            titleCol: {
                minWidth: 0,
                flex: "1 1 auto",
                display: "flex",
                flexDirection: "column",
                gap: 4,
            },

            title: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.title,
                fontWeight: theme.weights.title,
                lineHeight: theme.type.titleLineHeight,
                color: theme.textDark,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: 0,
                cursor: onOpen ? "pointer" : "default",
            },

            meta: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.subtitle,
                fontWeight: theme.weights.normal,
                lineHeight: theme.type.subtitleLineHeight,
                color: theme.textMutedDark,
                opacity: 0.95,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            },

            actions: {
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: theme.spacing.rowGap,
                flex: "0 0 auto",
                marginTop: 2,
            },

            divider: {
                width: "100%",
                height: 1,
                background: theme.border,
                opacity: 0.8,
                marginTop: 2,
                marginBottom: 2,
            },

            detailsRow: {
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.rowGap,
                alignItems: "center",
                justifyContent: "flex-start",
            },
        };
    }, [onOpen]);

    const content = useMemo(() => {
        if (!assignments?.length) {
            return (
                <EmptyContent
                    sourceText={emptyTitle}
                    subtitle={emptySubtitle}
                    actionText={onCreate ? "Create assignment" : undefined}
                    onAction={onCreate}
                    variant="accent"
                />
            );
        }

        return assignments.map((a) => {
            const id = String(a?.id ?? a?._id ?? a?.taskSetId ?? "");
            const name = String(a?.title ?? a?.name ?? "Untitled assignment");

            const created = formatDate(a?.createdAt ?? a?.created_at ?? a?.created);
            const typeLine = toTypeLine(a);

            const completedLine = toCompletedLine(a);
            const assignedToLine = toAssignedToLine(a);

            const isBusy = busyId && String(busyId) === id;

            return (
                <div key={id} style={styles.card}>
                    <div style={styles.topRow}>
                        <div style={styles.titleCol}>
                            <h3 style={styles.title} title={name} onClick={() => onOpen?.(a)}>
                                {name}
                            </h3>

                            <div style={styles.meta} title={typeLine}>
                                {typeLine}
                            </div>
                        </div>

                        <div style={styles.actions}>
                            <IconButton label="View" symbol="→" disabled={isBusy} onClick={() => onOpen?.(a)} />
                            <IconButton label="Edit" symbol="✎" disabled={isBusy} onClick={() => onEdit?.(a)} />
                            <IconButton
                                label="Delete"
                                symbol="🗑"
                                disabled={isBusy}
                                onClick={async () => {
                                    if (!onDelete) return;
                                    try {
                                        setBusyId(id);
                                        await onDelete(a);
                                    } finally {
                                        setBusyId(null);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div style={styles.divider} />

                    {/* ✅ non-pressable info chips (only 3) */}
                    <div style={styles.detailsRow}>
                        {created ? <InfoChip title={`Created: ${created}`}>Created: {created}</InfoChip> : null}
                        {completedLine ? <InfoChip title={completedLine}>{completedLine}</InfoChip> : null}
                        {assignedToLine ? <InfoChip title={assignedToLine}>{assignedToLine}</InfoChip> : null}
                    </div>
                </div>
            );
        });
    }, [assignments, busyId, styles, onOpen, onEdit, onDelete, onCreate, emptyTitle, emptySubtitle]);

    return (
        <RectangleGroup boxStyle={{ flexDirection: "column", flexWrap: "nowrap" }}>
            <DynamicList contentStyle={{ paddingRight: 0 }}>{content}</DynamicList>
        </RectangleGroup>
    );
}
