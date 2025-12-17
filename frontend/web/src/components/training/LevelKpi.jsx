
import React, {useEffect} from "react";
import {getOverallAccuracy, inferUserLevel} from "../../services/dataService.js";

export default function LevelKpi({ mobile, theme }) {
    const [isMobile, setIsMobile] = React.useState(mobile);

    const userLevel = inferUserLevel();
    const LEVEL_MAP = {
        A1: { label: "Початківець", percent: 33 },
        A2: { label: "Середній", percent: 66 },
        B1: { label: "Середній", percent: 66 },
        B2: { label: "Просунутий", percent: 100 },
    };

    const inferred = userLevel?.level || "A1";
    const levelInfo = LEVEL_MAP[inferred] || LEVEL_MAP.A1;

    const overall = getOverallAccuracy();
    const accuracy = Number.isFinite(overall?.accuracy) ? overall.accuracy : 0;
    const attemptsLeft = overall.attemptsLeft ?? 0;

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();

        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);


    const cardStyle = {
        background: "#fffdf8",
        border: "3px solid #ff6138",
        borderRadius: "20px",
        boxShadow: "4px 4px 0 #d74e2a",
        padding: isMobile ? "12px" : "18px",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "1px" : "6px",
        textAlign: "center",
    };

    const labelStyle = {
        fontSize: (isMobile) ? "11px" : "12px",
        color: "#a47856",
        textTransform: "uppercase",
        letterSpacing: ".06em",
    };

    const valueStyle = {
        fontSize: isMobile ? "20px" : "28px",
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

    const showEmpty = attemptsLeft > 0;

    return (
        <div style={cardStyle}>
            {showEmpty ? (
                <>
                    <div style={labelStyle}>Рекомендований рівень</div>
                    <div style={valueStyle}>{attemptsLeft} {attemptsLeft > 4 ? 'речень' : 'речення'} до оцінки</div>
                </>
            ) : (
                <>
                    {(
                        <>
                            <div style={labelStyle}>Рекомендований рівень</div>
                            <div style={valueStyle}>{levelInfo?.label}</div>
                            <div style={sparkStyle}><i style={sparkFillStyle(accuracy ?? 0)}/></div>
                        </>
                    )
                }
                </>
            )}
        </div>
    );
}
