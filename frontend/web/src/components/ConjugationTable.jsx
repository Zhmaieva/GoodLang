import React from "react";

/**
 * A fully dynamic table component.
 *
 * @param {object} props
 * @param {object} props.theme - color theme
 * @param {string[]} props.headers - array of column titles
 * @param {Array<Array<string|JSX.Element>>} props.rows - 2D array of data rows
 */
export default function ConjugationTable({ theme, headers = [], rows = [] }) {
    const table = {
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
    };
    const thtd = {
        padding: 10,
        borderBottom: `2px solid ${theme.accent}`,
        verticalAlign: "top",
        textAlign: "left",
    };
    const theadTh = {
        ...thtd,
        background: "linear-gradient(#fffaf3,#fff)",
        textTransform: "uppercase",
        fontSize: 12,
        color: theme.muted,
        letterSpacing: ".06em",
        fontWeight: 700,
    };

    return (
        <table style={table} aria-label="Dynamic table">
            {headers.length > 0 && (
                <thead>
                <tr>
                    {headers.map((h, i) => (
                        <th key={i} style={theadTh}>
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
            )}

            <tbody>
            {rows.map((row, i) => (
                <tr key={i}>
                    {row.map((cell, j) => (
                        <td key={j} style={thtd}>
                            {cell}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
