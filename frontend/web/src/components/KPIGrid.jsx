import { useState, useEffect } from "react";
import AccuracyKpi from "./training/AccuracyKpi.jsx";
import LevelKpi from "./training/LevelKpi.jsx";

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

    const cardStyle = {
        background: "#fffdf8",
        border: "3px solid #ff6138",
        borderRadius: "20px",
        boxShadow: "4px 4px 0 #d74e2a",
        padding: isMobile ? "12px" : "18px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        textAlign: "center",
    };

    const labelStyle = {
        fontSize: isMobile ? "0.6rem" : "1rem",
        color: "#a47856",
        textTransform: "uppercase",
        letterSpacing: ".06em",
    };

    const valueStyle = {
        fontSize: isMobile ? "1rem" : "2rem",
        fontWeight: 800,
    };

    const sparkStyle = {
        height: isMobile ? "6px" : "8px",
        borderRadius: "8px",
        background: "#fff",
        border: "2px solid #ff6138",
        marginTop: "6px",
        position: "relative",
        overflow: "hidden",
    };

    const sparkFillStyle = (width) => ({
        display: "block",
        position: "absolute",
        height: "100%",
        width: `${width}%`,
        background: theme.accent,
        left: 0,
        top: 0,
    });

    return (
        <section style={gridStyle} id="kpis">
            <AccuracyKpi mobile={isMobile} theme={theme} />
            <div style={cardStyle}>
                <div style={labelStyle}>Всього результатів</div>
                <div style={valueStyle}>{attempts ?? 0}</div>
                <div style={sparkStyle}><i style={sparkFillStyle(Math.min(100, (attempts ?? 0 / 400)))} /></div>
            </div>
            <div style={cardStyle}>
                <div style={labelStyle}>Вивчені правила</div>
                <div style={valueStyle}>{masteredRules ?? 0}</div>
                <div style={sparkStyle}><i style={sparkFillStyle(Math.min(100, ((masteredRules ?? 0) / 90) * 100))} /></div>
            </div>
            <LevelKpi mobile={isMobile} theme={theme} />
        </section>
    );
}
