import React, { useState, useEffect } from "react";

/**
 * A fully dynamic table component with mobile responsiveness.
 *
 * @param {object} props
 * @param {object} props.theme - color theme
 * @param {string[]} props.headers - array of column titles
 * @param {Array<Array<string|JSX.Element>>} props.rows - 2D array of data rows
 */
export default function ConjugationTable({ theme, headers = [], rows = [] }) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 600 : false
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener("resize", handleResize);

        // cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const container = {
        width: "100%",
        overflowX: isMobile ? "auto" : "visible",
        WebkitOverflowScrolling: "touch",
    };

    const table = {
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        minWidth: isMobile ? 480 : "auto", // щоб не зжималось занадто
    };

    const thtdBase = {
        padding: isMobile ? "6px 8px" : 10,
        borderBottom: `2px solid ${theme.accent}`,
        verticalAlign: "top",
        textAlign: "left",
        fontSize: isMobile ? 14 : 16,
        lineHeight: 1.3,
    };

    const theadTh = {
        ...thtdBase,
        background: "linear-gradient(#fffaf3,#fff)",
        textTransform: "uppercase",
        fontSize: isMobile ? 10 : 12,
        color: theme.muted,
        letterSpacing: ".06em",
        fontWeight: 700,
        whiteSpace: "nowrap",
    };

    return (
        <div style={container}>
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
                            <td key={j} style={thtdBase}>
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
