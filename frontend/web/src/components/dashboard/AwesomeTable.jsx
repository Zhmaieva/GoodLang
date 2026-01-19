import React from "react";

export default function AwesomeTable({ columns, rows, emptyText = "Немає даних" }) {
    return (
        <div style={styles.wrap}>
            <div style={{ ...styles.row, ...styles.head }}>
                {columns.map((c) => (
                    <div key={c.key} style={{ ...styles.cell, ...c.style }}>
                        {c.title}
                    </div>
                ))}
            </div>

            {rows.length === 0 ? (
                <div style={styles.empty}>{emptyText}</div>
            ) : (
                rows.map((r, idx) => (
                    <div key={r.id || idx} style={styles.row}>
                        {columns.map((c) => (
                            <div key={c.key} style={{ ...styles.cell, ...c.style }}>
                                {typeof c.render === "function" ? c.render(r) : r[c.key]}
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}

const styles = {
    wrap: {
        border: "2px solid rgba(0,0,0,0.12)",
    },
    row: {
        display: "grid",
        gridTemplateColumns: "2fr 2fr 1fr",
        gap: 10,
        padding: "10px 10px",
        borderTop: "1px solid rgba(0,0,0,0.1)",
        alignItems: "center",
    },
    head: {
        borderTop: "none",
        background: "rgba(0,0,0,0.03)",
        fontWeight: 900,
    },
    cell: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    empty: {
        padding: 12,
        color: "var(--muted, #a47856)",
    },
};
