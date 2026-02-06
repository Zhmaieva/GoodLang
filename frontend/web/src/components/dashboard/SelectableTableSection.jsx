import React, { useMemo, useState } from "react";
import AwesomeCard from "./AwesomeCard.jsx";
import AwesomeTable from "./AwesomeTable.jsx";
import AwesomeButton from "./AwesomeButton.jsx";

function norm(v) {
    return String(v || "").trim().toLowerCase();
}

function uniqStrings(arr) {
    const s = new Set((arr || []).map((x) => String(x)).filter(Boolean));
    return Array.from(s);
}

/**
 * SelectableTableSection
 *
 * - Single table "section" with search + selection.
 * - Adds a checkbox column.
 * - Clicking anywhere in a row toggles selection.
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

    // ✅ Row-wrapper: make the whole row clickable by wrapping EVERY cell in a full-height clickable div,
    // and add a real checkbox column as first column for clear UX.
    const selectionColumn = useMemo(() => {
        return {
            key: "__selected",
            title: "",
            size: 0.35,
            sortable: false,
            width: "44px",
            render: (r) => {
                const id = String(getId(r));
                const isSelected = id && selectedSet.has(id);

                return (
                    <div style={styles.checkboxCell}>
                        <span
                            aria-hidden="true"
                            style={{
                                ...styles.checkboxBox,
                                ...(isSelected ? styles.checkboxBoxOn : null),
                            }}
                        >
                            {isSelected ? "✓" : ""}
                        </span>
                    </div>
                );
            },
        };
    }, [getId, selectedSet]);

    const clickableColumns = useMemo(() => {
        const cols = Array.isArray(columns) ? columns : [];

        // Wrap each cell so any click toggles the row.
        const wrapped = cols.map((c) => {
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
                            style={{
                                ...styles.clickCell,
                                ...(isSelected ? styles.clickCellSelected : null),
                            }}
                            title={isSelected ? "Click to deselect" : "Click to select"}
                        >
                            {content}
                        </div>
                    );
                },
            };
        });

        // Also wrap the checkbox column so clicking checkbox area toggles too.
        const wrappedSelection = {
            ...selectionColumn,
            render: (r) => {
                const id = String(getId(r));
                const isSelected = id && selectedSet.has(id);

                return (
                    <div
                        role="button"
                        tabIndex={0}
                        style={{
                            ...styles.clickCell,
                            ...(isSelected ? styles.clickCellSelected : null),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        title={isSelected ? "Click to deselect" : "Click to select"}
                    >
                        <span
                            aria-hidden="true"
                            style={{
                                ...styles.checkboxBox,
                                ...(isSelected ? styles.checkboxBoxOn : null),
                            }}
                        >
                            {isSelected ? "✓" : ""}
                        </span>
                    </div>
                );
            },
        };

        return [wrappedSelection, ...wrapped];
    }, [columns, getId, selectedSet, toggle, selectionColumn]);

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
                            onRowClick={(r) => toggle(r, { source: "row_click" })}
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
        height: "100%",
    },

    cardFill: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
    },

    body: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
        minHeight: 0,
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
        minHeight: 0,
        overflow: "hidden", // table handles internal scroll
        height: "100%",
    },

    clickCell: {
        width: "100%",
        height: "100%",
        cursor: "pointer",
        userSelect: "none",
        padding: "2px 0",
        minWidth: 0,
    },

    clickCellSelected: {
        //background: "rgba(255,97,56,0.10)",
    },

    checkboxCell: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    checkboxBox: {
        width: 18,
        height: 18,
        border: "2px solid rgba(0,0,0,0.25)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: 12,
        lineHeight: 1,
        background: "rgba(255,255,255,0.9)",
    },

    checkboxBoxOn: {
        border: "2px solid var(--accent, #ff6138)",
        background: "rgba(255,97,56,0.10)",
        color: "var(--text, #3a2a1d)",
    },
};
