
import React, {useEffect} from "react";
import {getOverallAccuracy, syncWithServer} from "../../services/dataService.js";
import {off, on} from "../../services/events.js";

export default function AccuracyKpi({ header, mobile, theme }) {
    const [accuracy, setAccuracy] = React.useState(0);
    const [attemptsLeft, setAttemptsLeft] = React.useState(0);
    const [isMobile, setIsMobile] = React.useState(mobile);
    const [isLoading, setIsLoading] = React.useState(true);

    const refresh = async () => {
        await syncWithServer();
        const overall = getOverallAccuracy();
        setAccuracy(Number.isFinite(overall?.accuracy) ? overall.accuracy : 0);
        setAttemptsLeft(overall.attemptsLeft ?? 0);

        setIsLoading(false);
    }

    useEffect(() => {
        refresh().then();
        on("weeklyProgressUpdate", refresh);

        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();

        window.addEventListener("resize", onResize);
        return () => {
            off("weeklyProgressUpdate", refresh);
            window.removeEventListener("resize", onResize);
        }
    }, []);

    const showEmpty = attemptsLeft > 0;

    const cardStyle = {
        visibility: "visible",
        background: "#fffdf8",
        border: "3px solid #ff6138",
        borderRadius: "20px",
        boxShadow: "4px 4px 0 #d74e2a",
        padding: isMobile || header ? "12px" : "18px",
        display: "flex",
        flexDirection: "column",
        gap: header || isMobile ? "1px" : "6px",
        textAlign: "center",
        width: header ? (isMobile ? '220px' : '320px') : 'default',
    };

    const labelStyle = {
        visibility: !isLoading ? "visible" : "hidden",
        fontSize: (header || isMobile) ? "0.6rem" : "1rem",
        color: "#a47856",
        textTransform: "uppercase",
        letterSpacing: ".06em",
    };

    const valueStyle = {
        visibility: !isLoading ? "visible" : "hidden",
        fontSize: header || isMobile ? "1rem" : "2rem",
        fontWeight: 800,
    };

    const sparkStyle = {
        height: header ? (isMobile ? "10px" : "12px") : (isMobile ? "6px" : "8px"),
        borderRadius: "8px",
        background: "#fff",
        border: "2px solid #ff6138",
        marginTop: "6px",
        position: "relative",
        overflow: "hidden",
    };

    const sparkFillStyle = (width) => ({
        visibility: !isLoading ? "visible" : "hidden",
        display: "block",
        position: "absolute",
        height: "100%",
        width: `${width}%`,
        background: theme.accent,
        left: 0,
        top: 0,
    });

    return (
        <div style={cardStyle}>
            {showEmpty ? (
                <>
                    {!header && (<div style={labelStyle}>Знання правил</div>)}
                    <div style={valueStyle}>{attemptsLeft} {attemptsLeft > 4 ? 'речень' : 'речення'} до оцінки{header ? ' рівня' : ''}</div>
                </>
            ) : (
                <>
                {
                        header ? (
                            <>
                                <div style={valueStyle}>Знання правил {accuracy.toFixed(2)}%</div>
                                <div style={sparkStyle}><i style={sparkFillStyle(Math.min(100, accuracy ?? 0))}/></div>
                            </>
                        ) : (
                            <>
                                <div style={labelStyle}>Знання правил</div>
                                <div style={valueStyle}>{accuracy.toFixed(2)}%</div>
                                <div style={sparkStyle}><i style={sparkFillStyle(Math.min(100, accuracy ?? 0))}/></div>
                            </>
                        )
                }
                </>
            )}
        </div>
    );
}
