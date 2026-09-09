import { useState, useEffect } from "react";
import AccuracyKpi from "./training/AccuracyKpi.jsx";
import LevelKpi from "./training/LevelKpi.jsx";
import {
    APP_ACCENT_COLOR,
    APP_BACKGROUND_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_TEXT_COLOR,
} from "../theme.js";

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
        gap: isMobile ? "12px" : "18px",
        marginTop: 0,
        gridTemplateColumns: isMobile
            ? "repeat(auto-fit, minmax(min(100%, 150px), 1fr))"
            : "repeat(4, 1fr)",
    };

    const CARD_BG = theme?.bg ?? APP_BACKGROUND_COLOR;
    const TEXT = theme?.text ?? APP_TEXT_COLOR;
    const MUTED = theme?.muted ?? APP_MUTED_TEXT_COLOR;

    const cardStyle = {
        background: CARD_BG,
        border: "none",
        borderRadius: 0,
        boxShadow: "none",
        boxSizing: "border-box",
        width: "100%",
        minWidth: 0,
        minHeight: isMobile ? 132 : 150,
        padding: isMobile ? 16 : 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        textAlign: "left",
        userSelect: "none",
        justifyContent: "space-between",
    };

    const labelStyle = {
        fontSize: isMobile ? "0.78rem" : "0.82rem",
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: ".08em",
        fontWeight: 800,
        fontFamily: "var(--font-family-base)",
    };

    const valueStyle = {
        marginTop: 10,
        fontSize: isMobile ? "2rem" : "2.45rem",
        lineHeight: 1,
        fontWeight: 800,
        color: TEXT,
        fontFamily: "var(--font-family-base)",
        overflowWrap: "anywhere",
    };

    const sparkStyle = {
        width: "100%",
        height: 8,
        borderRadius: 999,
        background: "#edf0f7",
        border: "none",
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
                <div>
                    <div style={labelStyle}>Attempts</div>
                    <div style={valueStyle}>{attempts ?? 0}</div>
                </div>
                <div>
                    <div style={sparkStyle}>
                        <i style={sparkFillStyle(attemptsPct)} />
                    </div>
                </div>
            </div>

            <div style={cardStyle}>
                <div>
                    <div style={labelStyle}>Rules learned</div>
                    <div style={valueStyle}>{masteredRules ?? 0}</div>
                </div>
                <div>
                    <div style={sparkStyle}>
                        <i style={sparkFillStyle(masteredPct)} />
                    </div>
                </div>
            </div>

            <LevelKpi mobile={isMobile} theme={theme} />
        </section>
    );
}
