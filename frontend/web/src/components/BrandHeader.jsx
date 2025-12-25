import React from "react";

import "./pages/analytics.css";

export default function BrandHeader({ theme, title, subtitle, right }) {
    const wrap = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        borderBottom: `3px solid ${theme.accent}`,
        paddingBottom: 12,
        marginBottom: 20,
        flexWrap: "wrap",

        /* ✔ На мобільних — кнопка падає вниз */
        rowGap: 12,
    };

    const leftWrap = {
        display: "flex",
        alignItems: "center",
        gap: 12,
        flex: "1 1 auto",
        minWidth: 0,
    };

    const logo = (size) => ({
        flex: "0 0 auto",        // НЕ СТИСКАЄТЬСЯ
        width: size,
        height: size,
        borderRadius: 12,
        background: theme.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 800,
        fontSize: size * 0.45,
        boxShadow: `0 2px 0 ${theme.accentDark}`,
    });

    const titleBox = {
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
    };

    const h1 = {
        margin: 0,
        color: theme.accentDark,
        fontSize: "2rem",
        fontWeight: 900,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    };

    const sub = {
        color: theme.muted,
        fontSize: "1rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    };

    return (
        <header style={wrap}>
            <div style={leftWrap}>
                <div style={logo(64)}>GL</div>

                <div style={titleBox}>
                    <h1 style={h1}>{title}</h1>
                    <div style={sub}>{subtitle}</div>
                </div>
            </div>

            <nav className="actions">
                {right}
            </nav>
        </header>
    );
}
