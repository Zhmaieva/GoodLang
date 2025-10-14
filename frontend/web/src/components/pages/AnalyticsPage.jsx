import React from "react";

export default function AnalyticsPage({ theme }) {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: theme.bg,
                color: theme.text,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 32,
            }}
        >
            <header
                style={{
                    borderBottom: `3px solid ${theme.accent}`,
                    paddingBottom: 12,
                    fontWeight: 800,
                    fontSize: 24,
                    color: theme.accentDark,
                }}
            >
                Аналітика
            </header>

            <footer
                style={{
                    borderTop: `2px solid ${theme.accent}`,
                    paddingTop: 12,
                    color: theme.muted,
                    fontSize: 13,
                    textAlign: "center",
                }}
            >
                © 2025 StepLang
            </footer>
        </div>
    );
}
