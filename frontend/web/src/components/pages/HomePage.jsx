import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppShell from "../AppShell";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import Trainer from "../training/Trainer.jsx";
import FooterBar from "../FooterBar.jsx";
import { callAccountVerifyApi, callEmailUnsubscribeApi } from "../../services/api.js";
import { ACTION_TYPES } from "../../utils/constants.js";
import { getAllStatistics } from "../../services/dataService.js";
import { on, off } from "../../services/events.js";
import InfoModal from "../modals/InfoModal.jsx";
import { getSavedTrainingLevel } from "../../services/trainingDirector.js";
import { marathonService } from "../../services/marathonService.js";

export default function HomePage({ theme }) {
    const [loading, setLoading] = useState(false);
    const [level, setLevel] = useState(getSavedTrainingLevel() || "managed");

    const [weakRules, setWeakRules] = useState([]);
    const [allRulesVisible, setAllRulesVisible] = useState(false);
    const [hoveredRuleId, setHoveredRuleId] = useState(null);

    const [isMobile, setIsMobile] = useState(false);
    const [isInMarathonView, setIsInMarathonView] = useState(false);
    const [isMarathonLoaded, setIsMarathonLoaded] = useState(false);

    const [infoOpen, setInfoOpen] = useState(false);
    const [infoTitle, setInfoTitle] = useState("Information");
    const [infoMessage, setInfoMessage] = useState("");

    const [hoveredAnalytics, setHoveredAnalytics] = useState(false);
    const [hoveredHeaderBtn, setHoveredHeaderBtn] = useState(null);

    const { ref: containerRef } = useBreakpoint(880);

    const navigate = useNavigate();
    const location = useLocation();

    const gridStyle = {
        display: "flex",
        flexDirection: "column",
        gap: 24,
    };

    const topRowStyle = {
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "center",
        margin: "10px 0 0",
    };

    const weakRuleButtonStyle = (isHover, keepFullSize = false) => ({
        appearance: "none",
        padding: "10px 14px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        cursor: "pointer",
        background: theme.accent ?? "#4ba36e",
        color: "#fff",
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
        fontFamily: '"Source Serif 4", Georgia, serif',

        width: isMobile || (weakRules?.length || 0) <= 0 ? "100%" : "initial",
        maxWidth:
            isMobile || (weakRules?.length || 0) <= 0
                ? "100%"
                : isMobile && !keepFullSize
                    ? 140
                    : 280,

        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",

        transform: isHover ? "translateY(1px)" : "none",
        filter: isHover ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
    });

    const handleAnalyticsClick = async () => {
        callAccountVerifyApi(ACTION_TYPES.PAGE_OPEN_ANALYTICS).then();
        navigate("/analytics");
    };

    const handleRuleClick = async (ruleId) => {
        callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_RULE_PREVIEW).then();
        navigate(`/rule/${encodeURIComponent(ruleId)}`);
    };

    const computeWeakRules = () => {
        const stats = getAllStatistics();
        if (!Array.isArray(stats) || !stats.length) return [];

        const attempted = stats.filter((x) => (x?.attemptsNumber ?? 0) > 0);

        const sorted = attempted.sort((a, b) => {
            const aNeeds = a.status === "needs practice" ? 0 : 1;
            const bNeeds = b.status === "needs practice" ? 0 : 1;
            if (aNeeds !== bNeeds) return aNeeds - bNeeds;

            const accA = Number.isFinite(a.accuracy) ? a.accuracy : 0;
            const accB = Number.isFinite(b.accuracy) ? b.accuracy : 0;
            if (accA !== accB) return accA - accB;

            const attA = a.attemptsNumber ?? 0;
            const attB = b.attemptsNumber ?? 0;
            return attA - attB;
        });

        return sorted.slice(0, 3).map((x) => ({
            id: x.rule,
            label: x.ruleName || x.rule,
        }));
    };

    useEffect(() => {
        let cancelled = false;

        async function runUnsubscribeFromUrl() {
            const params = new URLSearchParams(location.search);
            const token = params.get("email_unsubscribe_token");
            if (!token) return;

            params.delete("email_unsubscribe_token");
            const nextSearch = params.toString();

            window.history.replaceState(
                {},
                "",
                `${location.pathname}${nextSearch ? `?${nextSearch}` : ""}${location.hash || ""}`
            );

            const res = await callEmailUnsubscribeApi(token);

            if (cancelled) return;

            if (res?.isSuccess) {
                setInfoTitle("Done");
                setInfoMessage(
                    "We will no longer send you emails from GoodLang. You will only receive essential messages required for the app to work, such as login codes."
                );
            } else {
                setInfoTitle("Oops...");
                setInfoMessage(
                    "Something went wrong. Please contact us at goodlang.app@gmail.com and we will fix it."
                );
            }

            setInfoOpen(true);
        }

        runUnsubscribeFromUrl().catch(() => {
            if (!cancelled) {
                setInfoTitle("Oops...");
                setInfoMessage(
                    "Something went wrong. Please contact us at goodlang.app@gmail.com and we’ll fix it."
                );
                setInfoOpen(true);
            }
        });

        const saved = getSavedTrainingLevel();
        if (saved) setLevel(saved);

        return () => {
            cancelled = true;
        };
    }, [location.pathname, location.search, location.hash]);

    useEffect(() => {
        const onRefresh = () => {
            setWeakRules(computeWeakRules());
            setAllRulesVisible(true);
        };

        onRefresh();

        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();

        checkMarathonView().then();

        window.addEventListener("resize", onResize);
        window.addEventListener("onMarathonUpdate", checkMarathonView);

        on("weeklyProgressUpdate", onRefresh);

        return () => {
            off("weeklyProgressUpdate", onRefresh);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("onMarathonUpdate", checkMarathonView);
        };
    }, []);

    useEffect(() => {
        checkMarathonView().then();
    }, [loading]);

    const checkMarathonView = async () => {
        const result = await marathonService.isMarathonView(true);
        setIsInMarathonView(result);
        setIsMarathonLoaded(true);
    };

    const SIDE_WALL_COLOR = "#40a6ff";
    const BUTTON_OFFSET = 5;

    const pageShellStyle = {
        width: "100%",
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: isMobile
            ? "12px minmax(0, 1fr) 12px"
            : "minmax(96px, 1fr) minmax(0, 980px) minmax(96px, 1fr)",
        columnGap: isMobile ? 12 : 36,
    };

    const leftWallStyle = {
        borderRight: `3px solid ${SIDE_WALL_COLOR}`,
        background: '#fffbf0',
        minHeight: "100vh",
    };

    const rightWallStyle = {
        borderLeft: `3px solid ${SIDE_WALL_COLOR}`,
        background: '#fffbf0',
        minHeight: "100vh",
    };

    const pageContentStyle = {
        minWidth: 0,
        width: "100%",
        minHeight: "100vh",

        display: "flex",
        flexDirection: "column",

        padding: isMobile ? "24px 0 40px" : "25px 0 0px",
    };

    const headerStyle = {
        width: "100%",
        minHeight: "48px",

        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",

        marginBottom: 0,
    };

    const navStyle = {
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 12 : 16,
        paddingBottom: BUTTON_OFFSET,
        paddingRight: BUTTON_OFFSET,
        flexWrap: "wrap",
    };

    const headerBtnWrapStyle = {
        position: "relative",
        display: "inline-block",
        isolation: "isolate",
    };

    const headerBtnBgStyle = (isHover) => ({
        position: "absolute",
        width: "100%",
        height: "100%",
        top: isHover ? 0 : BUTTON_OFFSET,
        left: isHover ? 0 : BUTTON_OFFSET,
        backgroundColor: SIDE_WALL_COLOR,
        transition: "top 0.2s ease, left 0.2s ease",
        zIndex: 0,
        pointerEvents: "none",
        borderRadius: 5,
    });

    const headerBtnStyle = {
        position: "relative",
        zIndex: 1,

        minWidth: isMobile ? "92px" : "120px",
        height: "40px",
        padding: "8px 16px",

        fontWeight: 600,
        fontSize: isMobile ? "0.95rem" : "1rem",
        letterSpacing: "0.3px",
        fontFamily: '"Source Serif 4", Georgia, serif',

        borderRadius: 5,
        border: "1px solid #000",
        backgroundColor: "transparent",
        color: "#33302E",

        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "manipulation",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        transition: "color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
    };

    const mainContentStyle = {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    };

    const renderHeaderButton = (id, label, onClick) => {
        const isHover = hoveredHeaderBtn === id;

        return (
            <div
                key={id}
                style={headerBtnWrapStyle}
                onMouseEnter={() => setHoveredHeaderBtn(id)}
                onMouseLeave={() => setHoveredHeaderBtn(null)}
            >
                <div style={headerBtnBgStyle(isHover)} />

                <button
                    type="button"
                    style={headerBtnStyle}
                    onClick={onClick}
                >
                    {label}
                </button>
            </div>
        );
    };

    return (
        <AppShell theme={theme} noPadding>
            <div style={pageShellStyle}>
                <div style={leftWallStyle} aria-hidden="true" />

                <main style={pageContentStyle} ref={containerRef}>
                    <header style={headerStyle}>
                        <nav style={navStyle}>
                            {renderHeaderButton("trainer", "Trainer", () => navigate("/trainer"))}
                            {renderHeaderButton("progress", "Progress", () => navigate("/analytics"))}
                            {renderHeaderButton("about", "About", () => navigate("/welcome"))}
                        </nav>
                    </header>

                    {infoOpen && (
                        <InfoModal
                            theme={theme}
                            title={infoTitle}
                            message={infoMessage}
                            buttonText="OK"
                            onClose={() => setInfoOpen(false)}
                        />
                    )}

                    <div style={mainContentStyle}>
                        <section style={gridStyle}>
                            {/*
                            {!isMobile && isMarathonLoaded && !isInMarathonView && (
                                <div style={topRowStyle}>
                                    {!isMobile && allRulesVisible && (
                                        <button
                                            onMouseEnter={() => setHoveredAnalytics(true)}
                                            onMouseLeave={() => setHoveredAnalytics(false)}
                                            style={weakRuleButtonStyle(hoveredAnalytics, true)}
                                            onClick={handleAnalyticsClick}
                                        >
                                            {!isMobile ? "View all rules →" : "All rules"}
                                        </button>
                                    )}

                                    {!isMobile && weakRules.map((r) => {
                                        const isHover = hoveredRuleId === r.id;

                                        return (
                                            <button
                                                key={r.id}
                                                style={weakRuleButtonStyle(isHover)}
                                                onMouseEnter={() => setHoveredRuleId(r.id)}
                                                onMouseLeave={() => setHoveredRuleId(null)}
                                                onClick={() => handleRuleClick(r.id)}
                                                title={`Open rule: ${r.label}`}
                                            >
                                                {r.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            */}

                            <Trainer
                                freeTraining
                                theme={theme}
                                onLoadingChange={setLoading}
                                nextLevel={level}
                            />
                        </section>

                        <FooterBar theme={theme} />
                    </div>
                </main>

                <div style={rightWallStyle} aria-hidden="true" />
            </div>
        </AppShell>
    );
}