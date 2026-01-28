import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    getAllStatistics,
    getOverallAccuracy,
    inferUserLevel,
    syncWithServer,
} from "../../services/dataService.js";
import { off, on } from "../../services/events.js";
import { useNavigate } from "react-router-dom";
import { LEVEL_MAP } from "./LevelKpi.jsx";

// ✅ marathon
import { marathonService, readAccountInfoFromLS } from "../../services/marathonService.js";
import { RULE_LABELS } from "../../utils/rules.js";

function pad2(n) {
    return String(Math.max(0, n | 0)).padStart(2, "0");
}

function formatHMS(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`;
}

function endOfLocalDayMs() {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
}

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

    // ✅ marathon countdown tick (header mode uses it)
    const [tick, setTick] = useState(0);
    const tickTimerRef = useRef(null);
    const [isMarathonView, setIsMarathonView] = useState(false);
    const [tasksRemainingData, setTasksRemainingData] = useState(marathonService.getRulesLeftForToday());

    const navigate = useNavigate();

    const refresh = async (decrementTasks = false) => {
        await syncWithServer();
        const overall = getOverallAccuracy();
        const userLevel = inferUserLevel();
        const acc = Number.isFinite(overall?.accuracy) ? overall.accuracy : 0;

        const isInMarathonView = await marathonService.isMarathonView();
        setTasksRemainingData(marathonService.getRulesLeftForToday());

        setIsMarathonView(isInMarathonView);

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

    const refreshWithTaskDecrement = () => refresh(true);

    useEffect(() => {
        refresh().then();
        on("weeklyProgressUpdate", refresh);
        on("marathonProgressUpdate", refreshWithTaskDecrement);
        on("marathonProgressUpdateHardRefresh", refresh);

        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);

        // ✅ tick for countdowns (header-only UI uses it; harmless elsewhere)
        tickTimerRef.current = window.setInterval(() => setTick((x) => x + 1), 1000);

        return () => {
            off("weeklyProgressUpdate", refresh);
            off("marathonProgressUpdate", refreshWithTaskDecrement);
            window.removeEventListener("resize", onResize);
            if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
        };
    }, []);

    const showEmpty = attemptsLeft > 0;

    const pct = useMemo(() => {
        if (showEmpty) {
            const r = (100 * (7 - attemptsLeft)) / 7;
            return r;
        }

        const v = Math.max(0, Math.min(100, Number(accuracy) || 0));
        return v;
    }, [accuracy, attemptsLeft]);

    const titleDefault = "Знання правил";

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

        const subStyleMulti = {
            ...subStyle,
            whiteSpace: "normal",
            overflow: "visible",
            textOverflow: "clip",
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

        const barFillBase = {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
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

        // =========================
        // ✅ Marathon header logic (ONLY affects header mode)
        // =========================
        const account = readAccountInfoFromLS?.() || marathonService?._getAccountInfo?.() || null;
        const isInMarathon = Boolean(account?.isInMarathon || marathonService?.isInMarathon?.());
        const dayNumberRaw =
            Number(account?.currentDay?.dayNumber ?? account?.currentDay?.day ?? account?.currentDay?.ordinalNumber ?? 1) || 1;
        const dayNumber = Math.max(1, Math.min(7, dayNumberRaw));

        const dayEndAtIso = account?.currentDay?.dayEndAt || account?.currentDay?.day_end_at || null;
        const dayEndMs = Number.isFinite(Date.parse(dayEndAtIso)) ? Date.parse(dayEndAtIso) : endOfLocalDayMs();
        const timeLeftMs = Math.max(0, dayEndMs - Date.now());
        const timeLeftText = formatHMS(timeLeftMs);

        const scheduleHasRemainingTasks = isInMarathon && tasksRemainingData.remaining > 0;

        const nextRuleId = isInMarathon ? marathonService.getNextMarathonRule() : "";
        const nextRuleLabel = RULE_LABELS?.[nextRuleId] || nextRuleId || titleDefault;
        const nextRuleAcc = marathonService.getRuleRecentAccuracy(nextRuleId);

        const levelTextDefault = showEmpty
            ? `Лише ${attemptsLeft} ${attemptsLeft > 4 ? "речень" : "речення"} до оцінки рівня`
            : `Рівень: ${levelInfo.label?.toLowerCase()}${levelNameInfo}`;

        // ✅ marathon “passed” message for day 7 (you asked specifically for it)
        const marathonPassedText =
            isInMarathon && dayNumber >= 7 && Boolean(account?.currentDay?.isDayCompleted) ? "Марафон пройдено.\n Вітаю!" : null;

        // Decide what to render (title/sub/value/progress) based on your rules:
        let headerTitle = titleDefault;
        let headerSub = levelTextDefault;
        let headerValue = showEmpty ? "" : `${(accuracy ?? 0) === 0 ? "0.00" : accuracy.toFixed(2)}%`;

        // fill width for bar + marker position for bubble
        let progressPctForFill = Math.max(10, pct);
        let progressPctForMarker = Math.max(10.0, pct);

        // ====== case: NOT in marathon → unchanged ======
        if (!isInMarathon) {
            // keep defaults (no changes)
        }

        // ====== case: IN marathon AND in marathon view ======
        else if (isMarathonView) {
            // A) tasks are NOT empty (remaining tasks > 0)
            if (scheduleHasRemainingTasks) {
                headerSub = `${dayNumber} день марафону. \nДо дедлайну ${timeLeftText}`;
                headerTitle = `Залишилось завдань`;
                headerValue = `${tasksRemainingData.remaining}`;

                const done = Math.max(0, tasksRemainingData.total - tasksRemainingData.remaining);
                const denom = Math.max(1, tasksRemainingData.total);
                const p = (100 * done) / denom;

                progressPctForFill = Math.max(10, Math.min(100, p));
                progressPctForMarker = Math.max(10.0, Math.min(100, p));
            }
            // B) tasks are empty (remaining tasks == 0)
            else {
                headerTitle = nextRuleLabel;

                const eta = marathonService.estimateEtaForWeakRules(70);
                headerSub = `Підтягни точність правил (до 70%).\nЦе займе ${eta}. До дедлайну ${timeLeftText}`;

                // show current rule accuracy as percentage (per your spec)
                headerValue = `${(nextRuleAcc ?? 0) === 0 ? "0.00" : Number(nextRuleAcc).toFixed(2)}%`;

                // bar: target is 70% (full width), fill is current accuracy relative to 70
                const p = (100 * Math.max(0, Math.min(70, nextRuleAcc))) / 70;
                progressPctForFill = Math.max(10, Math.min(100, p));
                progressPctForMarker = Math.max(10.0, Math.min(100, p));
            }
        }

        // ====== case: IN marathon but NOT in marathon view ======
        else {
            headerTitle = titleDefault;

            if (marathonPassedText) {
                headerSub = marathonPassedText;
            } else {
                // subtitle = existing one + extra line with countdown
                headerSub = `${dayNumber} день марафону пройдено.\n Наступний день починається за ${timeLeftText}`;
            }

            // keep value as normal KPI
            headerValue = showEmpty ? "" : `${(accuracy ?? 0) === 0 ? "0.00" : accuracy.toFixed(2)}%`;
            progressPctForFill = Math.max(10, pct);
            progressPctForMarker = Math.max(10.0, pct);
        }

        // Make sure re-render happens every second (we already tick),
        // and “use” tick so React doesn’t tree-shake it away.
        // eslint-disable-next-line no-unused-vars
        const _tick = tick;

        // Apply computed progress values
        const barFill = {
            ...barFillBase,
            width: `${progressPctForFill}%`,
        };

        const tipBubbleRuntime = {
            ...tipBubble,
            left: `${progressPctForMarker}%`,
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
                        {
                            isMarathonView && <div style={titleStyle}>
                                {headerTitle}
                            </div>

                        }

                        {
                            !isMarathonView && <div style={titleStyle}>
                                {headerTitle}{" "}
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

                        }


                        {/* ✅ allow <br> via \n */}
                        {String(headerSub || "")
                            .split("\n")
                            .map((line, i, arr) => {
                                const highlight = i === 0 && arr.length > 1;
                                return (
                                    <div style={{...subStyleMulti,
                                        color: highlight ? theme.accentDark : theme.text,
                                        opacity: highlight ? 1 : .7}} key={i}>
                                        {line}
                                        {i !== arr.length - 1 ? <br/> : null}
                                    </div>
                                )
                            })}
                    </div>

                    <div style={valueStyle}>{headerValue}</div>
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

                        <span style={tipBubbleRuntime} aria-hidden>
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
            <div style={labelStyle}>{titleDefault}</div>

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
