import React, {
    forwardRef,
    useImperativeHandle,
    useMemo,
    useState,
} from "react";
import AwesomeCard from "./AwesomeCard.jsx";
import AwesomeGrid from "./AwesomeGrid.jsx";
import AwesomeTable from "./AwesomeTable.jsx";
import AwesomeButton from "./AwesomeButton.jsx";

function norm(v) {
    return String(v || "").trim().toLowerCase();
}

/**
 * CombinedTables
 *
 * Controlled data:
 * - items: full data source (array)
 * - selectedIds: array of ids currently selected (must correspond to getId(item))
 * - onChangeSelectedIds: (nextIds, meta) => void
 *
 * Moving:
 * - Clicking a row in Available => moves to Selected
 * - Clicking a row in Selected => moves back to Available
 *
 * Parent-controlled moves (imperative API via ref):
 * - ref.current.addByIds(ids)
 * - ref.current.removeByIds(ids)
 * - ref.current.setSelectedIds(ids)
 * - ref.current.moveAllToSelected()
 * - ref.current.moveAllToAvailable()
 *
 * Layout:
 * - This component does not scroll
 * - Each table scrolls (internal overflow)
 * - Height is controlled externally by parent (via style / height)
 */
const CombinedTables = forwardRef(function CombinedTables(
    {
        items = [],
        selectedIds = [],
        onChangeSelectedIds,

        // id and text search helpers
        getId = (x) => x?.id,
        // used for filtering; default: join all primitive values
        getSearchText = (x) => {
            if (!x || typeof x !== "object") return String(x || "");
            // best effort: join primitive fields
            return Object.values(x)
                .map((v) => (v == null ? "" : typeof v === "string" || typeof v === "number" ? String(v) : ""))
                .join(" ");
        },

        // tables
        columns, // same columns passed to AwesomeTable for both sides
        availableTitle = "Доступні",
        selectedTitle = "Вибрані",

        // storage keys (keep sorting separate)
        storageKeyAvailable = "combined_table_available_sort_v1",
        storageKeySelected = "combined_table_selected_sort_v1",

        // optional meta
        emptyTextAvailable = "Немає доступних",
        emptyTextSelected = "Обери зліва",

        // container styles
        style,
        className,
    },
    ref
) {
    const [qAvail, setQAvail] = useState("");
    const [qSel, setQSel] = useState("");

    // normalize ids
    const selectedSet = useMemo(() => {
        const s = new Set((selectedIds || []).map((id) => String(id)));
        return s;
    }, [selectedIds]);

    const all = useMemo(() => (Array.isArray(items) ? items : []), [items]);

    const available = useMemo(() => {
        return all.filter((x) => !selectedSet.has(String(getId(x))));
    }, [all, selectedSet, getId]);

    const selected = useMemo(() => {
        return all.filter((x) => selectedSet.has(String(getId(x))));
    }, [all, selectedSet, getId]);

    const filterList = (list, q) => {
        const query = norm(q);
        if (!query) return list;

        // AND-match tokens (same style as StudentsSection)
        const tokens = query.split(/\s+/).filter(Boolean);

        return list.filter((x) => {
            const hay = norm(getSearchText(x));
            return tokens.every((t) => hay.includes(t));
        });
    };

    const filteredAvailable = useMemo(() => filterList(available, qAvail), [available, qAvail]);
    const filteredSelected = useMemo(() => filterList(selected, qSel), [selected, qSel]);

    const emitChange = (nextIds, meta) => {
        onChangeSelectedIds?.(nextIds, meta);
    };

    const addOne = (item, meta = {}) => {
        const id = String(getId(item));
        if (!id) return;
        if (selectedSet.has(id)) return;

        emitChange([...(selectedIds || []).map(String), id], { ...meta, action: "add", ids: [id] });
    };

    const removeOne = (item, meta = {}) => {
        const id = String(getId(item));
        if (!id) return;
        if (!selectedSet.has(id)) return;

        const next = (selectedIds || []).map(String).filter((x) => x !== id);
        emitChange(next, { ...meta, action: "remove", ids: [id] });
    };

    const addByIds = (ids, meta = {}) => {
        const base = new Set((selectedIds || []).map(String));
        const toAdd = (ids || []).map(String).filter((id) => id && !base.has(id));
        if (!toAdd.length) return;

        const next = [...base, ...toAdd];
        emitChange(Array.from(next), { ...meta, action: "add_many", ids: toAdd });
    };

    const removeByIds = (ids, meta = {}) => {
        const removeSet = new Set((ids || []).map(String));
        if (!removeSet.size) return;

        const next = (selectedIds || []).map(String).filter((id) => !removeSet.has(id));
        emitChange(next, { ...meta, action: "remove_many", ids: Array.from(removeSet) });
    };

    const setSelectedIds = (ids, meta = {}) => {
        const next = Array.from(new Set((ids || []).map(String).filter(Boolean)));
        emitChange(next, { ...meta, action: "set" });
    };

    const moveAllToSelected = (meta = {}) => {
        const next = all.map((x) => String(getId(x))).filter(Boolean);
        setSelectedIds(next, { ...meta, action: "add_all" });
    };

    const moveAllToAvailable = (meta = {}) => {
        setSelectedIds([], { ...meta, action: "remove_all" });
    };

    useImperativeHandle(
        ref,
        () => ({
            addByIds,
            removeByIds,
            setSelectedIds,
            moveAllToSelected,
            moveAllToAvailable,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [items, selectedIds, getId]
    );

    const gridHeightStyle = useMemo(() => {
        // parent can pass height via style; we ensure children can fill it
        return {
            display: "block",
            minWidth: 0,
            ...style,
        };
    }, [style]);

    return (
        <div className={className} style={gridHeightStyle}>
            <AwesomeGrid
                gridStyle={{
                    height: "100%",
                }}
                colStyle={{
                    height: '100%',
                    minHeight: 0
                }}
                left={
                    <TablePanel
                        title={availableTitle}
                        query={qAvail}
                        onQueryChange={setQAvail}
                        onClear={() => setQAvail("")}
                        rows={filteredAvailable}
                        columns={columns}
                        emptyText={emptyTextAvailable}
                        storageKey={storageKeyAvailable}
                        onRowClick={(row) => addOne(row, { source: "available_click" })}
                    />
                }
                right={
                    <TablePanel
                        title={selectedTitle}
                        query={qSel}
                        onQueryChange={setQSel}
                        onClear={() => setQSel("")}
                        rows={filteredSelected}
                        columns={columns}
                        emptyText={emptyTextSelected}
                        storageKey={storageKeySelected}
                        onRowClick={(row) => removeOne(row, { source: "selected_click" })}
                    />
                }
            />
        </div>
    );
});

export default CombinedTables;

/**
 * Panel: header + search + scroll table
 *
 * IMPORTANT:
 * - panel fills available height from parent
 * - table area scrolls (not the whole component)
 */
function TablePanel({
                        title,
                        query,
                        onQueryChange,
                        onClear,
                        rows,
                        columns,
                        emptyText,
                        storageKey,
                        onRowClick,
                    }) {
    // AwesomeTable currently doesn't accept onRowClick,
    // so we wrap each row cell rendering with a clickable surface via render(),
    // OR we add a transparent overlay click handler per row.
    //
    // We'll do the simple + reusable approach:
    // - Use a single clickable wrapper in the first column render (if provided),
    // - Otherwise wrap entire row via a custom renderer is not supported.
    //
    // To keep this component generic, we "decorate" columns with a click wrapper
    // that spans the cell content, so clicking any cell moves the row.
    const clickableColumns = useMemo(() => {
        const cols = Array.isArray(columns) ? columns : [];
        return cols.map((c, idx) => {
            const userRender = c.render;

            return {
                ...c,
                render: (r) => {
                    const content = typeof userRender === "function" ? userRender(r) : r?.[c.key];

                    return (
                        <div
                            role="button"
                            tabIndex={0}
                            title="Click to move"
                            style={{
                                ...panelStyles.clickCell,
                                // allow inner text ellipsis to work
                                minWidth: 0,
                            }}
                        >
                            {content}
                        </div>
                    );
                },
            };
        });
    }, [columns, onRowClick]);

    return (
        <AwesomeCard
            title={title}
            right={
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={panelStyles.count}>
            {Array.isArray(rows) ? rows.length : 0}
          </span>
                </div>
            }
            style={panelStyles.cardFill}
        >
            <div style={panelStyles.body}>
                <div style={panelStyles.searchRow}>
                    <input
                        value={query}
                        onChange={(e) => onQueryChange?.(e.target.value)}
                        placeholder="Пошук…"
                        style={panelStyles.searchInput}
                    />
                    {query ? (
                        <AwesomeButton variant="ghost" onClick={onClear} title="Очистити">
                            ✕
                        </AwesomeButton>
                    ) : null}
                </div>

                {/* scroll region */}
                <div style={panelStyles.tableScroll}>
                    <AwesomeTable
                        storageKey={storageKey}
                        columns={clickableColumns}
                        onRowClick={(r) => onRowClick?.(r)}
                        rows={(rows || []).map((r, idx) => ({
                            ...r,
                            // ensure stable row key for AwesomeTable
                            id: r?.id ?? `${idx}`,
                        }))}
                        emptyText={emptyText}
                    />
                </div>
            </div>
        </AwesomeCard>
    );
}

const panelStyles = {
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
        // The parent sets the overall height.
        // This scroll area consumes remaining height.
        flex: "1 1 auto",
        minHeight: 0, // ✅ critical for flex scroll areas
        overflow: "auto",
        height: "100%",
    },

    clickCell: {
        width: "100%",
        height: "100%",
        cursor: "pointer",
        userSelect: "none",
    },

    count: {
        fontWeight: 900,
        color: "var(--muted, #a47856)",
    },
};
