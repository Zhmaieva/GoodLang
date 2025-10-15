import React from "react";

export default function ConjugationTable({ theme, rows }) {
    const table = { width: "100%", borderCollapse: "separate", borderSpacing: 0 };
    const thtd = { padding: 10, borderBottom: `2px solid ${theme.accent}` };
    const theadTh = {
        ...thtd,
        background: "linear-gradient(#fffaf3,#fff)",
        textTransform: "uppercase",
        fontSize: 12,
        color: theme.muted,
        letterSpacing: ".06em",
    };
    return (
        <table style={table} aria-label="Conjugation table">
            <thead>
            <tr>
                <th style={theadTh}>Особа</th>
                <th style={theadTh}>Ствердження</th>
                <th style={theadTh}>Заперечення</th>
                <th style={theadTh}>Питання</th>
                <th style={theadTh}>Короткі відповіді</th>
            </tr>
            </thead>
            <tbody>
            {rows.map((r, i) => (
                <tr key={i}>
                    {r.map((cell, j) => (
                        <td key={j} style={thtd}>{cell}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
