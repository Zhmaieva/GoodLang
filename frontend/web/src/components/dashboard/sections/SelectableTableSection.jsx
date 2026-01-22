import React, { useMemo, useState } from "react";
import AwesomeCard from "../AwesomeCard.jsx";
import AwesomeTable from "../AwesomeTable.jsx";
import AwesomeButton from "../AwesomeButton.jsx";

function norm(v) {
    return String(v || "").trim().toLowerCase();
}

/**
 * SelectableTableSection
 *
 * A single-table "section" that:
 * - shows rows (items)
 * - allows searching
 * - allows selecting items (controlled by selectedIds)
 * - uses AwesomeTable sorting
 * - scrolls internally (table area)
 *
 * Props:
 * - title: string
 * - items: array
 * - columns: AwesomeTable columns (same format)
 * - selectedIds: array of ids (controlled)
 * - onChangeSelectedIds: (nextIds, meta) => void
 * - getId: (item) => id (default: item.id)
 * - getSearchText: (item) => string (default: join primitive values)
 * - storageKey: string for AwesomeTable sorting persistence
 * - emptyText: string
 * - style / className: for parent-controlled height and layout
 * - mode: "multi" | "single" (default: "multi")
 */
export default function SelectableTableSection({
                                                   title = "Select items",
                                                   items = [],
                                                   columns = [],

                                                   selectedIds = [],
                                                   onChangeSelectedIds,

                                                   getId = (x) => x?.id,
                                                   getSearchText = (x) => {
                                                       if (!x || typeof x !== "object") return String(x || "");
                                                       return Object.values(x)
                                                           .map((v) =>
                                                               v == null ? "" : typeof v === "string" || typeof v === "number" ? String(v) : ""
                                                           )
                                                           .join(" ");
                                                   },

                                                   storageKey = "selectable_table_section_sort_v1",
                                                   emptyText = "Нічого не знайдено",

                                                   mode = "multi", // or "single"
                                                   style,
                                                   className,
                                               }) {
    const [q, setQ] = useState("");

    const selectedSet = useMemo(() => {
        return new Set((selectedIds || []).map((id) => String(id)));
    }, [selectedIds]);

    const list = useMemo(() => (Array.isArray(items) ? items : []), [items]);

    const filtered = useMemo(() => {
        const query = norm(q);
        if (!query) return list;

        const tokens = query.split(/\s+/).filter(Boolean);
        return list.filter((x) => {
            const hay = norm(getSearchText(x));
            return tokens.every((t) => hay.includes(t));
        });
    }, [list, q, getSearchText]);

    const emit = (nextIds, meta) => {
        onChangeSelectedIds?.(nextIds, meta);
    };

    const toggle = (row, meta = {}) => {
        const id = String(getId(row));
        if (!id) return;

        const exists = selectedSet.has(id);

        if (mode === "single") {
            // single selection: clicking selected -> clear; clicking another -> set only it
            const next = exists ? [] : [id];
            emit(next, { ...meta, action: exists ? "clear_single" : "set_single", id });
            return;
        }

        // multi selection
        if (exists) {
            const next = (selectedIds || []).map(String).filter((x) => x !== id);
            emit(next, { ...meta, action: "remove", id });
        } else {
            const next = [...(selectedIds || []).map(String), id];
            emit(next, { ...meta, action: "add", id });
        }
    };

    const clearAll = () => emit([], { action: "clear_all" });

    const selectAllFiltered = () => {
        const base = new Set((selectedIds || []).map(String));
        for (const r of filtered) {
            const id = String(getId(r));
            if (id) base.add(id);
        }
        emit(Array.from(base), { action: "select_all_filtered" });
    };

    // Decorate columns to:
    // - allow click-to-toggle selection anywhere
    // - visually indicate selected rows (subtle background + accent border)
    const clickableColumns = useMemo(() => {
        const cols = Array.isArray(columns) ? columns : [];
        return cols.map((c) => {
            const userRender = c.render;

            return {
                ...c,
                render: (r) => {
                    const id = String(getId(r));
                    const isSelected = id && selectedSet.has(id);

                    const content =
                        typeof userRender === "function" ? userRender(r) : r?.[c.key];

                    return (
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => toggle(r, { source: "row_click" })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") toggle(r, { source: "row_key" });
                            }}
                            title={isSelected ? "Click to deselect" : "Click to select"}
                            style={{
                                ...styles.clickCell,
                                ...(isSelected ? styles.clickCellSelected : null),
                            }}
                        >
                            {content}
                        </div>
                    );
                },
            };
        });
    }, [columns, getId, selectedSet, toggle]);

    return (
        <div className={className} style={{ ...styles.wrap, ...style }}>
            <AwesomeCard
                title={title}
                right={
                    <div style={styles.headerRight}>
            <span style={styles.count}>
              {selectedIds?.length || 0} вибрано
            </span>

                        {mode === "multi" ? (
                            <>
                                <AwesomeButton variant="ghost" onClick={selectAllFiltered} title="Select all filtered">
                                    + Все
                                </AwesomeButton>
                                <AwesomeButton variant="ghost" onClick={clearAll} title="Clear selection">
                                    Очистити
                                </AwesomeButton>
                            </>
                        ) : (
                            <AwesomeButton variant="ghost" onClick={clearAll} title="Clear selection">
                                Очистити
                            </AwesomeButton>
                        )}
                    </div>
                }
                style={styles.cardFill}
            >
                <div style={styles.body}>
                    <div style={styles.searchRow}>
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Пошук…"
                            style={styles.searchInput}
                        />
                        {q ? (
                            <AwesomeButton variant="ghost" onClick={() => setQ("")} title="Очистити">
                                ✕
                            </AwesomeButton>
                        ) : null}
                    </div>

                    <div style={styles.tableScroll}>
                        <AwesomeTable
                            storageKey={storageKey}
                            columns={clickableColumns}
                            rows={(filtered || []).map((r, idx) => ({
                                ...r,
                                id: r?.id ?? String(getId(r) ?? idx),
                            }))}
                            emptyText={emptyText}
                        />
                    </div>
                </div>
            </AwesomeCard>
        </div>
    );
}

const styles = {
    wrap: {
        display: "block",
        minWidth: 0,
        height: "100%", // parent controls the height externally
    },

    cardFill: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
    },

    body: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
        height: "100%",
    },

    headerRight: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "flex-end",
    },

    count: {
        fontWeight: 900,
        color: "var(--muted, #a47856)",
        whiteSpace: "nowrap",
    },

    searchRow: {
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
    },

    searchInput: {
        flex: "1 1 220px",
        minWidth: 160,
        padding: "10px 12px",
        fontWeight: 800,
        border: "2px solid rgba(0,0,0,0.18)",
        outline: "none",
        background: "rgba(255,255,255,0.9)",
        color: "var(--text, #3a2a1d)",
    },

    tableScroll: {
        flex: "1 1 auto",
        minHeight: 0, // ✅ needed so overflow works inside flex
        overflow: "auto",
        height: "100%",
    },

    clickCell: {
        width: "100%",
        height: "100%",
        cursor: "pointer",
        userSelect: "none",
        padding: "2px 0",
    },

    clickCellSelected: {
        background: "rgba(255,97,56,0.10)",
        boxShadow: "inset 3px 0 0 var(--accent, #ff6138)",
    },
};
