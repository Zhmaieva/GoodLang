import { useState, useEffect } from "react";
import AccuracyKpi from "./training/AccuracyKpi.jsx";
import LevelKpi from "./training/LevelKpi.jsx";
import { APP_ACCENT_COLOR, APP_BACKGROUND_COLOR } from "../theme.js";

export default function KPIGrid({ theme, attempts, masteredRules }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 915);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 915);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const gridStyle = {
        display: "grid",
        gap: isMobile ? "12px" : "16px",
        marginTop: "14px",
        gridTemplateColumns: isMobile
            ? "repeat(auto-fit, minmax(120px, 1fr))"
            : "repeat(4, 1fr)",
    };

    // ✅ NON-header AccuracyKpi-like card styling tokens
    const CARD_BG = theme?.bg ?? APP_BACKGROUND_COLOR;
    const CARD_BORDER = "#000";
    const CARD_SHADOW = "none";

    const cardStyle = {
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 5,
        boxShadow: CARD_SHADOW,
        padding: isMobile ? "12px" : "18px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        textAlign: "center",
        userSelect: "none",
        justifyContent: "space-between",
    };

    const labelStyle = {
        fontSize: isMobile ? "0.9rem" : "1rem",
        color: "#000",
        textTransform: "uppercase",
        letterSpacing: ".06em",
        fontWeight: 700,
        fontFamily: 'var(--font-family-base)',
    };

    const valueStyle = {
        fontSize: isMobile ? "1rem" : "2rem",
        fontWeight: 700,
        color: "#000",
        fontFamily: 'var(--font-family-base)',
    };

    // ✅ your preferred spark style (no border)
    const sparkStyle = {
        height: isMobile ? "6px" : "8px",
        borderRadius: 5,
        background: "#000",
        border: "none",
        marginTop: "6px",
        position: "relative",
        overflow: "hidden",
    };

    const sparkFillStyle = (width) => ({
        display: "block",
        position: "absolute",
        height: "100%",
        width: `${width}%`,
        background: theme?.accent ?? APP_ACCENT_COLOR,
        left: 0,
        top: 0,
    });

    // ✅ FIX: correct precedence + convert to percent
    const attemptsPct = Math.min(100, ((attempts ?? 0) / 400) * 100);
    const masteredPct = Math.min(100, ((masteredRules ?? 0) / 91) * 100);

    return (
        <section style={gridStyle} id="kpis">
            <AccuracyKpi mobile={isMobile} theme={theme} />

            <div style={cardStyle}>
                <div style={labelStyle}>Attempts</div>
                <div style={valueStyle}>{attempts ?? 0}</div>
                <div style={sparkStyle}>
                    <i style={sparkFillStyle(attemptsPct)} />
                </div>
            </div>

            <div style={cardStyle}>
                <div style={labelStyle}>Rules learned</div>
                <div style={valueStyle}>{masteredRules ?? 0}</div>
                <div style={sparkStyle}>
                    <i style={sparkFillStyle(masteredPct)} />
                </div>
            </div>

            <LevelKpi mobile={isMobile} theme={theme} />
        </section>
    );
}
