import React, { useEffect, useMemo, useState } from "react";
import { getOverallAccuracy, inferUserLevel, syncWithServer } from "../../services/dataService.js";
import { off, on } from "../../services/events.js";
import { useNavigate } from "react-router-dom";
import { LEVEL_MAP } from "./LevelKpi.jsx";

export default function AccuracyKpi({ header, mobile, theme }) {
    const [accuracy, setAccuracy] = useState(0);
    const [attemptsLeft, setAttemptsLeft] = useState(0);
    const [isMobile, setIsMobile] = useState(mobile);
    const [isLoading, setIsLoading] = useState(true);
    const [hover, setHover] = useState(false);
    const [levelInfo, setLevelInfo] = useState(LEVEL_MAP?.A1 ?? { label: "A1" });
    const [levelNameInfo, setLevelNameInfo] = useState("");

    // ✅ smooth transitions only AFTER first real data render
    const [canAnimate, setCanAnimate] = useState(false);

    const navigate = useNavigate();

    const refresh = async () => {
        await syncWithServer();
        const overall = getOverallAccuracy();
        const userLevel = inferUserLevel();
        const acc = Number.isFinite(overall?.accuracy) ? overall.accuracy : 0;

        setAccuracy(acc);
        setAttemptsLeft(overall?.attemptsLeft ?? 0);

        const originalInferred = userLevel?.level || "A1";
        let inferred = originalInferred;
        if (inferred === "A1" && acc > 40) inferred = "A2";
        if (inferred !== "B2" && acc > 85) inferred = "B2";

        if (originalInferred === "A1" && acc < 30) {
            setLevelNameInfo(", A1");
        } else if ((originalInferred === "A1" && acc >= 30) || (originalInferred === "A2" && acc <= 45)) {
            setLevelNameInfo(", A1-A2");
        } else if ((originalInferred === "A2" || originalInferred === "B1") && acc < 60 || ((originalInferred === "A2" && acc >= 60))) {
            setLevelNameInfo(", A2-B1");
        } else if (originalInferred === "B1" && acc >= 60) {
            setLevelNameInfo(", B1-B2");
        } else if (originalInferred === "B2" && acc < 90) {
            setLevelNameInfo(", B2-C1");
        } else if (originalInferred === "B2" && acc > 90) {
            setLevelNameInfo(", C1");
        }

        setLevelInfo(LEVEL_MAP[inferred] || LEVEL_MAP.A1);
        setIsLoading(false);

        setTimeout(() => setCanAnimate(true), 0);
    };

    useEffect(() => {
        refresh().then();
        on("weeklyProgressUpdate", refresh);

        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);

        return () => {
            off("weeklyProgressUpdate", refresh);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    const showEmpty = attemptsLeft > 0;

    const pct = useMemo(() => {
        if (showEmpty) {
            const r = 100 * (7 - attemptsLeft) / 7;
            return r;
        }

        const v = Math.max(0, Math.min(100, Number(accuracy) || 0));
        return v;
    }, [accuracy, attemptsLeft]);

    const title = "Знання правил";

    const onClick = () => {
        if (!header) return;
        navigate("/analytics");
    };

    // -------------------------
    // HEADER MODE
    // -------------------------
    if (header) {
        // ✅ edge fade for moving content (icons + road dashes)
        const edgeFadeMask = {
            maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
        };

        const ICON_LANE = [
            { src: "/house-icon.svg", gap: 32 },
            { src: "/apple-icon.svg", gap: 32 },
            { src: "/flower-icon.svg", gap: 32 },
            { src: "/computer-icon.svg", gap: 32 },
            { src: "/brain-icon.svg", gap: 32 },
            { src: "/pencil-icon.svg", gap: 32 },
            { src: "/note-icon.svg", gap: 32 },
            { src: "/tree-icon.svg", gap: 32 },
        ];

        const cardStyleHeader = {
            visibility: header && isLoading ? "hidden" : "visible",
            minWidth: 0,
            maxWidth: "490px",
            flex: "1 1 260px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: isMobile ? "12px 12px" : "12px 14px",
            borderRadius: 14,
            background: "rgba(255, 243, 223, 0.92)",
            border: `2px solid ${hover ? "rgba(255,97,56,0.95)" : "rgba(255,97,56,0.70)"}`,
            boxShadow: hover ? "0 14px 34px rgba(0,0,0,0.14)" : "0 10px 26px rgba(0,0,0,0.12)",
            cursor: "pointer",
            userSelect: "none",
            transform: hover ? "translateY(-1px)" : "none",
            transition: "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease",
            ["--scrollSeconds"]: `24s`,
        };

        const headerTopRow = {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            minWidth: 0,
        };

        const leftCol = {
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            flex: "1 1 auto",
        };

        const titleStyle = {
            fontFamily: "Nunito, system-ui, sans-serif",
            fontWeight: 900,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            fontSize: "1rem",
            color: theme.text,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        };

        const subStyle = {
            fontFamily: "Nunito, system-ui, sans-serif",
            fontWeight: 800,
            fontSize: "0.95rem",
            color: theme.text,
            opacity: 0.7,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: 4,
        };

        const valueStyle = {
            fontFamily: "Nunito, system-ui, sans-serif",
            fontWeight: 1000,
            fontSize: isMobile ? "1.55rem" : "1.9rem",
            color: theme.text,
            lineHeight: 1,
            whiteSpace: "nowrap",
            flex: "0 0 auto",
        };

        const trackArea = {
            position: "relative",
            width: "100%",
            minWidth: 0,
            paddingTop: 22,
        };

        const movingIconsLane = {
            position: "absolute",
            left: 12,
            right: 12,
            top: 0,
            height: 20,
            overflow: "hidden",
            opacity: 0.78,
            pointerEvents: "none",

            ...edgeFadeMask,
        };

        const iconLaneWrap = {
            display: "flex",
            width: "200%",
            transform: "translateZ(0)",
            willChange: "transform",
        };

        const half = {
            display: "flex",
            width: "50%",
            alignItems: "center",
        };

        const iconStrip = {
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            flex: "0 0 100%",
        };

        const iconStyle = {
            width: 18,
            height: 18,
            opacity: 0.88,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.10))",
            flex: "0 0 auto",
            display: "block",
        };

        const barOuter = {
            position: "relative",
            height: 32,
            borderRadius: 999,
            background: "rgba(0,0,0,0.10)",
            border: "2px solid rgba(0,0,0,0.12)",
            overflow: "visible",
        };

        const barMask = {
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            overflow: "hidden",
        };

        const barFill = {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${Math.max(10, pct)}%`,
            background: theme.accent,
            borderRadius: 999,
            overflow: "hidden",
            transition: canAnimate ? "width 650ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
            willChange: "width",
        };

        const roadLines = {
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            height: 4,
            pointerEvents: "none",

            ...edgeFadeMask,
        };

        const roadLinesInner = {
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "100%",
            backgroundImage:
                `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='4' viewBox='0 0 34 4'%3E%3Crect x='0' y='0' width='18' height='4' rx='2' ry='2' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "34px 4px",
            backgroundPosition: "0px center",
            ["--bgTravel"]: `${34 * 60}px`,
        };

        const tipBubble = {
            position: "absolute",
            top: "50%",
            left: `${Math.max(10.0, pct)}%`,
            transform: "translate(-100%, -50%)",
            width: 28,
            height: 28,
            pointerEvents: "none",
            backgroundColor: theme.accent,
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transition: canAnimate ? "left 650ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
            willChange: "left",
        };

        const pctText = showEmpty ? "" : `${(accuracy ?? 0) === 0 ? "0.00" : accuracy.toFixed(2)}%`;

        const levelText = showEmpty ? `Лише ${attemptsLeft} ${attemptsLeft > 4 ? "речень" : "речення"} до оцінки рівня` : `Рівень: ${levelInfo.label?.toLowerCase()}${levelNameInfo}`;

        const renderIconSegment = (prefix) => {
            const totalGap = ICON_LANE.reduce((s, it) => s + (it.gap ?? 0), 0) || 1;

            return (
                <div style={iconStrip}>
                    {ICON_LANE.map((it, i) => {
                        const wPct = ((it.gap ?? 0) / totalGap) * 100;

                        return (
                            <React.Fragment key={`${prefix}-${i}`}>
                <span style={{ display: "inline-flex", alignItems: "center", flex: "0 0 auto" }}>
                  <img src={it.src} alt="" style={iconStyle} draggable={false} />
                </span>

                                {i !== ICON_LANE.length - 1 ? (
                                    <span aria-hidden style={{ flex: `${wPct} 1 0%`, minWidth: it.gap ?? 0 }} />
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </div>
            );
        };

        return (
            <div
                style={cardStyleHeader}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={onClick}
            >
                <style>{`
          @keyframes glIconScroll {
            0%   { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .gl-icon-scroll {
            animation: glIconScroll 6s linear infinite;
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
          }

          @keyframes glBgScroll {
            0%   { background-position-x: 0px; }
            100% { background-position-x: calc(-1 * var(--bgTravel, 2040px)); }
          }
          .gl-bg-scroll {
            animation: glBgScroll var(--scrollSeconds, 10s) linear infinite;
            will-change: background-position;
          }
        `}</style>

                <div style={headerTopRow}>
                    <div style={leftCol}>
                        <div style={titleStyle}>
                            {title}{" "}
                            <span
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 800,
                                    textTransform: "none",
                                    letterSpacing: 0,
                                    lineHeight: "1.5rem",
                                    top: ".15rem",
                                    position: "relative",
                                }}
                            >
                ⓘ
              </span>
                        </div>
                        <div style={subStyle}>{levelText}</div>
                    </div>
                    <div style={valueStyle}>{pctText}</div>
                </div>

                <div style={trackArea}>
                    <div style={movingIconsLane}>
                        <div className="gl-icon-scroll" style={iconLaneWrap}>
                            <div style={half}>{renderIconSegment("segA")}</div>
                            <div style={half}>{renderIconSegment("segB")}</div>
                        </div>
                    </div>

                    <div style={barOuter}>
                        <div style={barMask}>
                            <div style={barFill}>
                                <div style={roadLines}>
                                    <div className="gl-bg-scroll" style={roadLinesInner} />
                                </div>
                            </div>
                        </div>

                        <span style={tipBubble} aria-hidden>
              <span
                  style={{
                      width: 16,
                      height: 16,
                      backgroundColor: "#fff",
                      transform: "scale(1.5)",
                      maskImage: "url(/brain-icon.svg)",
                      WebkitMaskImage: "url(/brain-icon.svg)",
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                  }}
              />
            </span>
                    </div>
                </div>
            </div>
        );
    }

    // -------------------------
    // NON-HEADER MODE (RESTORED OLD LOOK WITH PROGRESS BAR)
    // -------------------------
    const labelStyle = {
        fontSize: isMobile ? "0.9rem" : "1rem",
        color: "#a47856",
        textTransform: "uppercase",
        letterSpacing: ".06em",
        fontWeight: 900,
    };

    const valueStyle = {
        fontSize: isMobile ? "1.4rem" : "2rem",
        fontWeight: 900,
        color: theme.text,
        lineHeight: 1.1,
    };

    const cardStyle = {
        visibility: isLoading ? "hidden" : "visible",
        background: "#fffdf8",
        border: "3px solid #ff6138",
        borderRadius: "20px",
        boxShadow: "4px 4px 0 #d74e2a",
        padding: isMobile ? "12px" : "18px",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "2px" : "6px",
        textAlign: "center",
        userSelect: "none",
    };

    // ✅ old spark bar sizes
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
        visibility: !isLoading ? "visible" : "hidden",
        display: "block",
        position: "absolute",
        height: "100%",
        width: `${width}%`,
        background: theme.accent,
        left: 0,
        top: 0,
        transition: canAnimate ? "width 650ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        willChange: "width",
    });

    return (
        <div style={cardStyle}>
            <div style={labelStyle}>{title}</div>

            {showEmpty ? (
                <div style={valueStyle}>
                    {attemptsLeft} {attemptsLeft > 4 ? "речень" : "речення"} до оцінки рівня
                </div>
            ) : (
                <>
                    <div style={valueStyle}>{(accuracy ?? 0) === 0 ? "0.00" : accuracy.toFixed(2)}%</div>
                    <div style={sparkStyle}>
                        <i style={sparkFillStyle(Math.min(100, accuracy ?? 0))} />
                    </div>
                </>
            )}
        </div>
    );
}
