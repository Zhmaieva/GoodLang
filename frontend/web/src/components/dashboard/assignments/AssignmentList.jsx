// AssignmentList.jsx — FULL DROP-IN (theme-driven, rectangle cards, actions)
// Renders assignments as “rectangle-like” cards with:
// - name
// - details (type / mode / tasks / rules count)
// - created date
// - submissions progress (students done / total)
// - actions: View, Edit, Delete
//
// ✅ Parent can pass callbacks; component stays UI-only.

import React, { useMemo, useState } from "react";
import DynamicList from "../DynamicList.jsx";
import RectangleGroup from "../RectangleGroup.jsx";
import AwesomeActionButton from "../AwesomeActionButton.jsx";
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

function toMetaLine(a) {
    const type = a?.type ? String(a.type) : "assignment";
    const mode = a?.taskMode ? String(a.taskMode) : "";
    const tasks = safeInt(a?.tasksCount ?? a?.tasks ?? a?.numberOfTasks, 0);
    const rules = Array.isArray(a?.ruleIds)
        ? a.ruleIds.length
        : safeInt(a?.rulesCount, 0);

    const bits = [
        type,
        mode ? `mode: ${mode}` : "",
        tasks ? `${tasks} ${tasks === 1 ? "task" : "tasks"}` : "",
        rules ? `${rules} ${rules === 1 ? "rule" : "rules"}` : "",
    ].filter(Boolean);

    return bits.join(" • ");
}

function toProgressLine(a) {
    const done = safeInt(a?.submittedCount ?? a?.doneCount ?? a?.completedStudents, 0);
    const total = safeInt(a?.studentsCount ?? a?.assignedStudents ?? a?.totalStudents, 0);
    if (!total) return done ? `${done} done` : "";
    return `${done} / ${total} students done`;
}

export function AssignmentList({
                                   assignments = [],

                                   // optional actions
                                   onOpen,    // (assignment) => void
                                   onEdit,    // (assignment) => void
                                   onDelete,  // (assignment) => Promise<void> | void

                                   // optional UI
                                   groupTitle = "All assignments",
                                   emptyTitle = "No assignments yet",
                                   emptySubtitle = "Create your first assignment to start tracking submissions.",
                                   onCreate, // optional CTA for empty state
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

            detailsRow: {
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.rowGap,
                alignItems: "center",
                justifyContent: "flex-start",
            },

            pill: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.subtitle,
                fontWeight: theme.weights.normal,
                lineHeight: theme.type.subtitleLineHeight,
                color: theme.textDark,
                border: theme.borders.card,
                background: theme.surfaceSoft,
                borderRadius: theme.radius.card,
                padding: `${Math.max(6, Math.floor(theme.spacing.listPad * 0.8))}px ${theme.spacing.cardPadX}px`,
                whiteSpace: "nowrap",
                maxWidth: "100%",
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
        };
    }, []);

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
            const metaLine = toMetaLine(a);
            const progress = toProgressLine(a);

            const isBusy = busyId && String(busyId) === id;

            return (
                <div key={id} style={styles.card}>
                    <div style={styles.topRow}>
                        <div style={styles.titleCol}>
                            <h3 style={styles.title} title={name}>
                                {name}
                            </h3>

                            <div style={styles.meta} title={metaLine}>
                                {metaLine}
                            </div>
                        </div>

                        <div style={styles.actions}>
                            <AwesomeActionButton
                                size="compact"
                                variant="ghost"
                                title="View"
                                disabled={isBusy}
                                onClick={() => onOpen?.(a)}
                            >
                                View
                            </AwesomeActionButton>

                            <AwesomeActionButton
                                size="compact"
                                variant="ghost"
                                title="Edit"
                                disabled={isBusy}
                                onClick={() => onEdit?.(a)}
                            >
                                Edit
                            </AwesomeActionButton>

                            <AwesomeActionButton
                                size="compact"
                                variant="ghost"
                                title="Delete"
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
                            >
                                Delete
                            </AwesomeActionButton>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.detailsRow}>
                        {created ? <div style={styles.pill}>Created: {created}</div> : null}
                        {progress ? <div style={styles.pill}>{progress}</div> : null}
                        {a?.className ? <div style={styles.pill}>Class: {String(a.className)}</div> : null}
                    </div>
                </div>
            );
        });
    }, [assignments, busyId, styles, onOpen, onEdit, onDelete, onCreate, emptyTitle, emptySubtitle]);

    return (
        <RectangleGroup title={groupTitle} boxStyle={{ flexDirection: "column", flexWrap: "nowrap" }}>
            <DynamicList contentStyle={{ paddingRight: 0 }}>
                {content}
            </DynamicList>
        </RectangleGroup>
    );
}
