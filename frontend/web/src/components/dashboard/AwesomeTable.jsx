import React, { useEffect, useMemo, useState } from "react";

/**
 * AwesomeTable — RulesTable-like look & feel + built-in sorting
 *
 * ✅ Now supports: fixed header + scrollable rows area
 *
 * columns: [
 *   {
 *     key: "email",
 *     title: "Email",
 *     style?: {},
 *     render?: (row) => ReactNode,
 *
 *     // Layout
 *     width?: string,   // e.g. "140px" or "minmax(160px, 2fr)" (wins if provided)
 *     size?: number,    // proportional width, default 1 => "1fr", 2 => "2fr", etc.
 *
 *     // Sorting controls
 *     sortable?: boolean,         // default true
 *     sortValue?: (row) => any,   // optional accessor
 *     sortType?: "string" | "number" | "date", // optional hint
 *   }
 * ]
 *
 * rows: array of objects
 *
 * options:
 * - storageKey: persist sorting in localStorage (optional)
 * - defaultSortKey / defaultSortDir
 * - headerHeight: fixed header height in px (default 44)
 * - headerGap: vertical gap between header and rows (default 8)
 */
export default function AwesomeTable({
                                         columns,
                                         rows,
                                         emptyText = "Немає даних",
                                         storageKey = null,
                                         defaultSortKey = null,
                                         defaultSortDir = "asc", // "asc" | "desc"
                                         onRowClick= (r) => {},
                                         headerHeight = 44,
                                         headerGap = 8,
                                         selectedRowId = null
                                     }) {
    const [hoverRow, setHoverRow] = useState(null);

    function readSortFromLS() {
        if (!storageKey) return null;
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed?.sortKey || !parsed?.sortDir) return null;
            return parsed;
        } catch (_) {
            return null;
        }
    }

    const saved = readSortFromLS();

    const firstSortableKey =
        defaultSortKey ||
        columns.find((c) => c.sortable !== false)?.key ||
        (columns[0]?.key ?? null);

    const [sortKey, setSortKey] = useState(saved?.sortKey ?? firstSortableKey);
    const [sortDir, setSortDir] = useState(saved?.sortDir ?? defaultSortDir);

    useEffect(() => {
        if (!storageKey) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify({ sortKey, sortDir }));
        } catch (_) {}
    }, [storageKey, sortKey, sortDir]);

    const toggleSort = (key) => {
        const col = columns.find((c) => c.key === key);
        if (!col || col.sortable === false) return;

        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const getColumn = (key) => columns.find((c) => c.key === key);

    const getSortValue = (row, col) => {
        if (!col) return null;
        if (typeof col.sortValue === "function") return col.sortValue(row);

        const v = row?.[col.key];

        if (col.sortType === "number") {
            const n = Number(v);
            return Number.isFinite(n) ? n : -Infinity;
        }
        if (col.sortType === "date") {
            const t = v ? new Date(v).getTime() : 0;
            return Number.isFinite(t) ? t : 0;
        }
        return v == null ? "" : String(v).toLowerCase();
    };

    const sortedRows = useMemo(() => {
        if (!Array.isArray(rows) || rows.length === 0) return [];
        const col = getColumn(sortKey);
        if (!col || col.sortable === false) return [...rows];

        const dir = sortDir === "asc" ? 1 : -1;
        const list = [...rows];

        list.sort((a, b) => {
            const av = getSortValue(a, col);
            const bv = getSortValue(b, col);

            if (typeof av === "number" && typeof bv === "number") {
                if (av !== bv) return (av - bv) * dir;
                return 0;
            }

            if (col.sortType === "date") {
                const an = Number(av) || 0;
                const bn = Number(bv) || 0;
                if (an !== bn) return (an - bn) * dir;
                return 0;
            }

            if (av < bv) return -1 * dir;
            if (av > bv) return 1 * dir;
            return 0;
        });

        return list;
    }, [rows, columns, sortKey, sortDir]);

    const ArrowPair = ({ columnKey }) => {
        const active = sortKey === columnKey;
        const upOpacity = active && sortDir === "asc" ? 1 : 0.25;
        const downOpacity = active && sortDir === "desc" ? 1 : 0.25;

        return (
            <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 0.9, marginLeft: 6 }}>
        <span style={{ opacity: upOpacity, fontSize: 12 }}>▲</span>
        <span style={{ opacity: downOpacity, fontSize: 12 }}>▼</span>
      </span>
        );
    };

    const headerBtnStyle = {
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        userSelect: "none",
        pointerEvents: "auto",
        minWidth: 0,
    };

    const rowStyle = (isHover, selected) => ({
        userSelect: "none",
        background: isHover || selected ? "#ededed" : "#fff",
        filter: isHover ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
    });

    const gridTemplateColumns = useMemo(() => {
        return columns
            .map((c) => {
                if (c.width) return c.width;
                const sRaw = c.size;
                const s = Number.isFinite(Number(sRaw)) ? Number(sRaw) : 1;
                const safe = s > 0 ? s : 1;
                return `${safe}fr`;
            })
            .join(" ");
    }, [columns]);

    return (
        <div style={styles().tableWrap} aria-live="polite">
            {/* HEADER (fixed height) */}
            <div
                style={{
                    ...styles().thead,
                    gridTemplateColumns,
                    height: headerHeight,
                }}
            >
                {columns.map((c) => {
                    const sortable = c.sortable !== false;
                    return (
                        <div
                            key={c.key}
                            style={{
                                ...styles().th,
                                ...(c.style || {}),
                                ...(sortable ? styles().thSortable : null),
                            }}
                            onClick={() => sortable && toggleSort(c.key)}
                            role={sortable ? "button" : undefined}
                            tabIndex={sortable ? 0 : undefined}
                            title={sortable ? "Sort" : undefined}
                        >
                            <div style={headerBtnStyle}>
                                <span style={styles().thText}>{c.title}</span>
                                {sortable ? <ArrowPair columnKey={c.key} /> : null}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ROWS (fills remaining space + scrolls) */}
            <div style={{ ...styles().rowsScroll, paddingTop: headerGap }}>
                {sortedRows.length === 0 ? (
                    <div style={styles().empty}>{emptyText}</div>
                ) : (
                    <div style={styles().rowsInner}>
                        {sortedRows.map((r, idx) => {
                            const key = r.id || r.key || idx;
                            const isHover = hoverRow === key;

                            return (
                                <div
                                    key={key}
                                    onClick={() => onRowClick(r)}
                                    style={{ ...styles().trow, gridTemplateColumns, ...rowStyle(isHover, key === selectedRowId) }}
                                    onMouseEnter={() => setHoverRow(key)}
                                    onMouseLeave={() => setHoverRow(null)}
                                >
                                    {columns.map((c) => (
                                        <div
                                            key={c.key}
                                            style={{
                                                ...styles().td,
                                                ...(c.style || {}),
                                            }}
                                        >
                                            {typeof c.render === "function" ? c.render(r) : r?.[c.key]}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = (selected) => {
    return {
        tableWrap: {
            border: "2px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.6)",

            height: "100%",
            minHeight: 0,

            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // ✅ rowsScroll becomes the only scroll container
        },

        thead: {
            display: "grid",
            gap: 10,
            padding: "0 10px", // ✅ deterministic height control (no vertical padding)
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            background: "rgba(0,0,0,0.03)",
            fontWeight: 900,
            alignItems: "center",
            flex: "0 0 auto",
        },

        rowsScroll: {
            flex: "1 1 auto",
            minHeight: 0,
            overflow: "auto",
        },

        rowsInner: {
            display: "block",
        },

        th: { minWidth: 0 },
        thSortable: { cursor: "pointer" },

        thText: {
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },

        trow: {
            display: "grid",
            gap: 10,
            padding: "10px 10px",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            alignItems: "center",
            cursor: "pointer",
            background: selected ? "red" : "transparent",
        },

        td: {
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: 800,
        },

        empty: {
            padding: 12,
            color: "var(--muted, #a47856)",
            fontWeight: 800,
        },
    };
}