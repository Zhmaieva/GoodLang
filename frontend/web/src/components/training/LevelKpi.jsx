import React, { useEffect } from "react";
import { getOverallAccuracy, inferUserLevel } from "../../services/dataService.js";
import { off, on } from "../../services/events.js";
import { APP_ACCENT_COLOR, APP_BACKGROUND_COLOR } from "../../theme.js";

export const LEVEL_MAP = {
    A1: { label: "Beginner", percent: 33 },
    A2: { label: "Intermediate", percent: 66 },
    B1: { label: "Intermediate", percent: 66 },
    B2: { label: "Advanced", percent: 100 },
};

function getLevelKpiSnapshot() {
    const userLevel = inferUserLevel();
    const overall = getOverallAccuracy();
    const acc = Number.isFinite(overall?.accuracy) ? overall.accuracy : 0;

    let inferred = userLevel?.level || "A1";
    if (inferred === "A1" && acc > 40) inferred = "A2";
    if (inferred !== "B2" && acc > 85) inferred = "B2";

    return {
        accuracy: acc,
        attemptsLeft: overall?.attemptsLeft ?? 0,
        levelInfo: LEVEL_MAP[inferred] || LEVEL_MAP.A1,
    };
}

export default function LevelKpi({ mobile, theme }) {
    const initialSnapshot = React.useMemo(() => getLevelKpiSnapshot(), []);

    const [isMobile, setIsMobile] = React.useState(mobile);
    const [accuracy, setAccuracy] = React.useState(initialSnapshot.accuracy);
    const [attemptsLeft, setAttemptsLeft] = React.useState(initialSnapshot.attemptsLeft);
    const [levelInfo, setLevelInfo] = React.useState(initialSnapshot.levelInfo);
    const [isLoading, setIsLoading] = React.useState(false);

    const onRefresh = () => {
        const snapshot = getLevelKpiSnapshot();

        setLevelInfo(snapshot.levelInfo);
        setAccuracy(snapshot.accuracy);
        setAttemptsLeft(snapshot.attemptsLeft);

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
    const CARD_BG = theme?.bg ?? APP_BACKGROUND_COLOR;
    const CARD_BORDER = "#000";
    const CARD_SHADOW = "none";

    const cardStyle = {
        // keep layout the same; only style language changes
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 5,
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
        transition: "width 650ms cubic-bezier(0.22, 1, 0.36, 1)",

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

    const showEmpty = attemptsLeft > 0;

    return (
        <div style={cardStyle}>
            {showEmpty ? (
                <>
                    <div style={labelStyle}>Level</div>
                    <div style={valueStyle}>
                        {attemptsLeft} {attemptsLeft > 4 ? "sentences" : "sentence"} left for evaluation
                    </div>
                </>
            ) : (
                <>
                    <div style={labelStyle}>Level</div>
                    <div style={valueStyle}>{levelInfo?.label}</div>
                    <div style={sparkStyle}>
                        <i style={sparkFillStyle(accuracy ?? 0)} />
                    </div>
                </>
            )}
        </div>
    );
}
