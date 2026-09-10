import React, { useEffect } from "react";
import { getOverallAccuracy, inferUserLevel } from "../../services/dataService.js";
import { off, on } from "../../services/events.js";
import {
    APP_ACCENT_COLOR,
    APP_BACKGROUND_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_TEXT_COLOR,
} from "../../theme.js";

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
        minHeight: isMobile ? 104 : 120,
        padding: isMobile ? 16 : 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        textAlign: "left",
        userSelect: "none",
        visibility: isLoading ? "hidden" : "visible",
        justifyContent: "space-between",
    };

    const labelStyle = {
        fontSize: isMobile ? "0.78rem" : "0.82rem",
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: ".08em",
        fontWeight: 800,
        fontFamily: 'var(--font-family-base)',
    };

    const showEmpty = attemptsLeft > 0;

    const valueStyle = {
        marginTop: 10,
        fontSize: showEmpty
            ? isMobile ? "1.25rem" : "1.55rem"
            : isMobile ? "1.5rem" : "2.45rem",
        lineHeight: showEmpty ? 1.15 : 1,
        fontWeight: 800,
        color: TEXT,
        fontFamily: 'var(--font-family-base)',
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

    return (
        <div style={cardStyle}>
            {showEmpty ? (
                <div>
                    <div style={labelStyle}>Level</div>
                    <div style={valueStyle}>
                        {attemptsLeft} {attemptsLeft > 4 ? "sentences" : "sentence"} left for evaluation
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        <div style={labelStyle}>Level</div>
                        <div style={valueStyle}>{levelInfo?.label}</div>
                    </div>
                    <div>
                        <div style={sparkStyle}>
                            <i style={sparkFillStyle(accuracy ?? 0)} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
