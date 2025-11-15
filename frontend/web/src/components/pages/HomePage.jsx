import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../AppShell";
import Header from "../Header";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import Trainer from "../training/Trainer.jsx";

export default function HomePage({ theme }) {

    const [loading, setLoading] = useState(false);
    const [level, setLevel] = useState("beginner");

    // Responsive grid (container-based)
    const { ref: containerRef, isWide: twoCols } = useBreakpoint(880);

    const gridStyle = {
        display: "flex",
        flexDirection: "column",
        gap: 24,
    };

    // Analytics button (LevelSwitch style)
    const [hoveredAnalytics, setHoveredAnalytics] = useState(false);
    const analyticsButtonStyles = {
        container: { display: "flex", justifyContent: "center", margin: "16px 0 0", flexDirection: "row",},
        button: (isHover) => ({
            appearance: "none",
            padding: "10px 18px",
            fontWeight: 800,
            fontSize: 14,
            lineHeight: 1,
            borderRadius: 999,
            cursor: "pointer",
            background: "#fffdf8",
            color: theme.text,
            border: `2px solid ${theme.accent}`,
            boxShadow: `2px 2px 0 ${theme.accentDark}`,
            transform: isHover ? "translateY(1px)" : "none",
            transition: "transform 120ms ease",
        }),
    };

    const navigate = useNavigate();
    const handleAnalyticsClick = () => navigate("/analytics");

    return (
        <AppShell theme={theme}>
            <div ref={containerRef}>
                <Header
                    theme={theme}
                    level={level}
                    defaultLevel="beginner"
                    loading={loading}
                    onLevelChange={setLevel}
                />
                <section style={gridStyle}>
                    <Trainer
                        theme={theme}
                        onLoadingChange={setLoading}
                        nextLevel={level}/>
                    <button
                        onMouseEnter={() => setHoveredAnalytics(true)}
                        onMouseLeave={() => setHoveredAnalytics(false)}
                        style={analyticsButtonStyles.button(hoveredAnalytics)}
                        onClick={handleAnalyticsClick}
                    >
                        Що мені підтягнути? →
                    </button>
                </section>

                <footer style={{
                    marginTop: 32,
                    textAlign: "center",
                    color: theme.muted,
                    fontSize: 13,
                    borderTop: `2px solid ${theme.accent}`,
                    paddingTop: 12
                }}>
                    <div style={analyticsButtonStyles.container}>
                        <div>© 2025 GoodLang</div>
                    </div>
                </footer>
            </div>
        </AppShell>
    );
}
