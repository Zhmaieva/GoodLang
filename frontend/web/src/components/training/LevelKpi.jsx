import React, { useEffect } from "react";
import { getOverallAccuracy, inferUserLevel } from "../../services/dataService.js";
import { off, on } from "../../services/events.js";

export const LEVEL_MAP = {
    A1: { label: "Початківець", percent: 33 },
    A2: { label: "Середній", percent: 66 },
    B1: { label: "Середній", percent: 66 },
    B2: { label: "Просунутий", percent: 100 },
};

export default function LevelKpi({ mobile, theme }) {
    const [isMobile, setIsMobile] = React.useState(mobile);
    const [accuracy, setAccuracy] = React.useState(0);
    const [attemptsLeft, setAttemptsLeft] = React.useState(0);
    const [levelInfo, setLevelInfo] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);

    const onRefresh = () => {
        const userLevel = inferUserLevel();
        const overall = getOverallAccuracy();
        const acc = Number.isFinite(overall?.accuracy) ? overall.accuracy : 0;

        let inferred = userLevel?.level || "A1";
        if (inferred === "A1" && acc > 40) inferred = "A2";
        if (inferred !== "B2" && acc > 85) inferred = "B2";

        setLevelInfo(LEVEL_MAP[inferred] || LEVEL_MAP.A1);

        setAccuracy(acc);
        setAttemptsLeft(overall.attemptsLeft ?? 0);

        // (unchanged) but set loading false after first refresh
        setIsLoading(false);
    };

    const onResize = () => setIsMobile(window.innerWidth < 915);

    useEffect(() => {
        onRefresh();
        onResize();

        on("weeklyProgressUpdate", onRefresh);
        window.addEventListener("resize", onResize);

        return () => {
            off("weeklyProgressUpdate", onRefresh);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    // ✅ NON-header AccuracyKpi-like card styling tokens
    const CARD_BG = "rgba(255, 243, 223, 0.92)";
    const CARD_BORDER = "rgba(255,97,56,0.70)";
    const CARD_SHADOW = "0 10px 26px rgba(0,0,0,0.12)";

    const cardStyle = {
        // keep layout the same; only style language changes
        background: CARD_BG,
        border: `2px solid ${CARD_BORDER}`,
        borderRadius: "20px",
        boxShadow: CARD_SHADOW,
        padding: isMobile ? "12px" : "18px",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "1px" : "6px",
        textAlign: "center",
        userSelect: "none",
        visibility: isLoading ? "hidden" : "visible",
        justifyContent: "space-between",
    };

    const labelStyle = {
        fontSize: isMobile ? "0.9rem" : "1rem",
        color: "#a47856",
        textTransform: "uppercase",
        letterSpacing: ".06em",
        fontWeight: 900,
    };

    const valueStyle = {
        fontSize: isMobile ? "1rem" : "2rem",
        fontWeight: 800,
        color: theme.text,
    };

    // ✅ your preferred spark style (no border)
    const sparkStyle = {
        height: isMobile ? "6px" : "8px",
        borderRadius: "999px",
        background: "rgba(0,0,0,0.10)",
        border: "none",
        marginTop: "6px",
        position: "relative",
        overflow: "hidden",
        transition: "width 650ms cubic-bezier(0.22, 1, 0.36, 1)",

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

    const showEmpty = attemptsLeft > 0;

    return (
        <div style={cardStyle}>
            {showEmpty ? (
                <>
                    <div style={labelStyle}>Рівень</div>
                    <div style={valueStyle}>
                        {attemptsLeft} {attemptsLeft > 4 ? "речень" : "речення"} до оцінки
                    </div>
                </>
            ) : (
                <>
                    <div style={labelStyle}>Рівень</div>
                    <div style={valueStyle}>{levelInfo?.label}</div>
                    <div style={sparkStyle}>
                        <i style={sparkFillStyle(accuracy ?? 0)} />
                    </div>
                </>
            )}
        </div>
    );
}
