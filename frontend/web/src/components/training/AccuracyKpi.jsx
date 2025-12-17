
import React, {useEffect} from "react";
import {getOverallAccuracy} from "../../services/dataService.js";
import {off, on} from "../../services/events.js";

export default function AccuracyKpi({ header, mobile, theme }) {
    const [accuracy, setAccuracy] = React.useState(0);
    const [attemptsLeft, setAttemptsLeft] = React.useState(0);
    const [isMobile, setIsMobile] = React.useState(mobile);

    const refresh = () => {
        const overall = getOverallAccuracy();
        setAccuracy(Number.isFinite(overall?.accuracy) ? overall.accuracy : 0);
        setAttemptsLeft(Number.isFinite(overall?.accuracy) ? overall.accuracy : 0);
    }

    useEffect(() => {
        refresh();
        on("weeklyProgressUpdate", refresh);

        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);
        return () => {
            off("weeklyProgressUpdate", refresh);
            window.removeEventListener("resize", onResize);
        }
    }, []);

    const showEmpty = !attemptsLeft > 0;

    const cardStyle = {
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
        fontSize: (header || isMobile) ? "11px" : "12px",
        color: "#a47856",
        textTransform: "uppercase",
        letterSpacing: ".06em",
    };

    const valueStyle = {
        fontSize: header || isMobile ? "20px" : "28px",
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
                    <div style={valueStyle}>Ще кілька речень до оцінки</div>
                </>
            ) : (
                <>
                    {
                        header ? (
                            <>
                                <div style={valueStyle}>Точність {accuracy.toFixed(2)}%</div>
                                <div style={sparkStyle}><i style={sparkFillStyle(Math.min(100, accuracy ?? 0))}/></div>
                            </>
                        ) : (
                            <>
                                <div style={labelStyle}>Точність</div>
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
