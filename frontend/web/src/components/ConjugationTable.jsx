import React, { useState, useEffect } from "react";
import {
    APP_ACCENT_COLOR,
    APP_BACKGROUND_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
} from "../theme.js";

/**
 * A fully dynamic table component with mobile responsiveness.
 *
 * @param {object} props
 * @param {object} props.theme - color theme
 * @param {string[]} props.headers - array of column titles
 * @param {Array<Array<string|JSX.Element>>} props.rows - 2D array of data rows
 * @param {string} props.headerBackground - optional header background color
 * @param {string} props.headerColor - optional header text color
 * @param {number|string} props.fontSize - optional table body text size
 */
export default function ConjugationTable({
    theme,
    headers = [],
    rows = [],
    headerBackground,
    headerColor,
    fontSize,
}) {
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

    const accentColor = theme?.accent ?? APP_ACCENT_COLOR;
    const backgroundColor = theme?.bg ?? APP_BACKGROUND_COLOR;
    const surfaceColor = theme?.surface ?? APP_SURFACE_COLOR;
    const textColor = theme?.text ?? APP_TEXT_COLOR;

    const bodyFontSize = fontSize ?? (isMobile ? 14 : 16);

    const thtdBase = {
        padding: isMobile ? "10px 12px" : "14px 16px",
        borderBottom: `1px solid ${accentColor}`,
        verticalAlign: "top",
        textAlign: "left",
        fontSize: bodyFontSize,
        lineHeight: 1.3,
        color: textColor,
        fontFamily: "var(--font-family-base)",
    };

    const theadTh = {
        ...thtdBase,
        background: headerBackground ?? surfaceColor ?? backgroundColor,
        color: headerColor ?? textColor,
        letterSpacing: ".03em",
        fontWeight: 800,
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
                            <td
                                key={j}
                                style={{
                                    ...thtdBase,
                                    borderBottom: i === rows.length - 1 ? "none" : thtdBase.borderBottom,
                                }}
                            >
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
