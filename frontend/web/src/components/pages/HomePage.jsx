import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppShell from "../AppShell";
import Header from "../Header";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import Trainer from "../training/Trainer.jsx";
import FooterBar from "../FooterBar.jsx";
import { callAccountVerifyApi, dowloadPdf, callEmailUnsubscribeApi } from "../../services/api.js";
import { ACTION_TYPES } from "../../utils/constants.js";
import { getAllStatistics } from "../../services/dataService.js";
import { on, off } from "../../services/events.js";
import InfoModal from "../modals/InfoModal.jsx";
import {getSavedTrainingLevel, saveTrainingLevel} from "../../services/trainingDirector.js"; // ✅ adjust path if needed

export default function HomePage({ theme }) {
    const [loading, setLoading] = useState(false);
    const [level, setLevel] = useState(getSavedTrainingLevel() || "managed");

    // weakest rules buttons (up to 3)
    const [weakRules, setWeakRules] = useState([]);
    const [allRulesVisible, setAllRulesVisible] = useState(false);
    const [hoveredRuleId, setHoveredRuleId] = useState(null);

    const [isMobile, setIsMobile] = useState(false);
    const [isInMarathonView, setIsInMarathonView] = useState(false);

    // ✅ Info modal state (for unsubscribe)
    const [infoOpen, setInfoOpen] = useState(false);
    const [infoTitle, setInfoTitle] = useState("Інформація");
    const [infoMessage, setInfoMessage] = useState("");

    // Responsive grid (container-based)
    const { ref: containerRef } = useBreakpoint(880);

    const navigate = useNavigate();
    const location = useLocation();

    const gridStyle = {
        display: "flex",
        flexDirection: "column",
        gap: 24,
    };

    // Row: analytics + weakest rules
    const topRowStyle = {
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "center",
        margin: "10px 0 0",
    };

    // Analytics button (LevelSwitch style)
    const [hoveredAnalytics, setHoveredAnalytics] = useState(false);

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
        boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
        fontFamily: "Nunito, system-ui, sans-serif",

        width: (isMobile || (weakRules?.length || 0) <= 0) ? "100%" : "initial",

        maxWidth: (isMobile || (weakRules?.length || 0) <= 0) ? "100%" : (isMobile && !keepFullSize ? 140 : 280),
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

    // ✅ Pick up to 3 weakest rules from dataService stats
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

    // ✅ Unsubscribe flow: read token -> call API -> show InfoModal -> remove param from URL
    useEffect(() => {
        let cancelled = false;

        async function runUnsubscribeFromUrl() {
            const params = new URLSearchParams(location.search);
            const token = params.get("email_unsubscribe_token");
            if (!token) return;

            // remove param from URL ASAP (so refresh doesn't re-trigger)
            params.delete("email_unsubscribe_token");
            const nextSearch = params.toString();
            window.history.replaceState(
                {},
                "",
                `${location.pathname}${nextSearch ? `?${nextSearch}` : ""}${location.hash || ""}`
            );

            // call API (graceful)
            const res = await callEmailUnsubscribeApi(token);

            if (cancelled) return;

            if (res?.isSuccess) {
                setInfoTitle("Готово");
                setInfoMessage("Ми більше не турбуватимемо імейлами від GoodLang. Ми надсилатимемо тільки необхідні для роботи додатку повідомлення — наприклад, код входу");
            } else {
                setInfoTitle("Ой...");
                setInfoMessage("Сталася помилка. Напиши на goodlang.app@gmail.com i ми все виправимо.");
            }

            setInfoOpen(true);
        }

        runUnsubscribeFromUrl().catch(() => {
            // don't crash page if something unexpected happens
            if (!cancelled) {
                setInfoTitle("Ой...");
                setInfoMessage("Сталася помилка. Напиши на goodlang.app@gmail.com i ми все виправимо.");
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
    }, [loading])

    const checkMarathonView = async () => {
        const result = await marathonService.isMarathonView();
        setIsInMarathonView(result);
    }

    return (
        <AppShell theme={theme}>
            {infoOpen && (
                <InfoModal
                    theme={theme}
                    title={infoTitle}
                    message={infoMessage}
                    buttonText="Добре"
                    onClose={() => setInfoOpen(false)}
                />
            )}

            <div ref={containerRef}>
                <Header
                    theme={theme}
                    level={level}
                    defaultLevel="managed"
                    loading={loading}
                    onLevelChange={(level) => {
                        setLevel(level);
                        saveTrainingLevel(level);
                    }}
                />

                <section style={gridStyle}>
                    {
                        !isMobile &&    !isInMarathonView &&
                        <div style={topRowStyle}>
                            {
                                !isMobile && allRulesVisible && <button
                                    onMouseEnter={() => setHoveredAnalytics(true)}
                                    onMouseLeave={() => setHoveredAnalytics(false)}
                                    style={weakRuleButtonStyle(hoveredAnalytics, true)}
                                    onClick={handleAnalyticsClick}
                                >
                                    {!isMobile ? "Список усіх правил →" : "Усі правила"}
                                </button>
                            }


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

                    <Trainer
                        freeTraining
                        theme={theme}
                        onLoadingChange={setLoading}
                        nextLevel={level}
                    />
                </section>

                <FooterBar theme={theme} />
            </div>
        </AppShell>
    );
}
