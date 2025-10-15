import React from "react";

export default function BrandHeader({ theme, title, subtitle, right }) {
    const wrap = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "end",
        gap: 16,
        borderBottom: `3px solid ${theme.accent}`,
        paddingBottom: 12,
        marginBottom: 20,
    };
    const brand = { display: "flex", alignItems: "center", gap: 12 };
    const logo = {
        width: 48, height: 48, borderRadius: 12, background: theme.accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 800
    };
    const h1 = { margin: 0, fontSize: 28, color: theme.accentDark, letterSpacing: ".02em" };
    const sub = { color: theme.muted, fontSize: 14 };

    return (
        <header style={wrap}>
            <div style={brand}>
                <div style={logo}>SL</div>
                <div>
                    <h1 style={h1}>{title}</h1>
                    <div style={sub}>{subtitle}</div>
                </div>
            </div>
            {right}
        </header>
    );
}
