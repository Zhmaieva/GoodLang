import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../AppShell";
import Header from "../Header";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import Trainer from "../training/Trainer.jsx";
import FooterBar from "../FooterBar.jsx";
import {callAccountVerifyApi, callGeneratePdfApi} from "../../services/api.js";
import { ACTION_TYPES } from "../../utils/constants.js";
import { getAllStatistics } from "../../services/dataService.js";
import { on, off } from "../../services/events.js";

export default function HomePage({ theme }) {
    const [loading, setLoading] = useState(false);
    const [level, setLevel] = useState("managed");

    // weakest rules buttons (up to 3)
    const [weakRules, setWeakRules] = useState([]);
    const [hoveredRuleId, setHoveredRuleId] = useState(null);

    const [isMobile, setIsMobile] = useState(false);


    // Responsive grid (container-based)
    const { ref: containerRef } = useBreakpoint(880);

    const navigate = useNavigate();

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

        width: ((weakRules?.length || 0) <= 0) ? "100%" : "initial",

        maxWidth: ((weakRules?.length || 0) <= 0) ? "100%" : (isMobile && !keepFullSize ? 160 : 280),
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
        // ✅ track event
        callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_RULE_PREVIEW).then();

        // adjust route if yours differs
        navigate(`/rule/${encodeURIComponent(ruleId)}`);
    };

    // ✅ Pick up to 3 weakest rules from dataService stats
    const computeWeakRules = () => {
        const stats = getAllStatistics(); // [{rule, ruleName, accuracy, attemptsNumber, status, ...}]
        if (!Array.isArray(stats) || !stats.length) return [];

        // Only rules with attempts (otherwise "weakest" becomes random)
        const attempted = stats.filter((x) => (x?.attemptsNumber ?? 0) > 0);

        // Prefer "needs practice", then lowest accuracy, then fewer attempts (still shaky)
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
        const onRefresh = () => {
            setWeakRules(computeWeakRules());
        };

        // initial
        onRefresh();

        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);

        // ✅ update when dataService emits weeklyProgressUpdate (it calls emit("weeklyProgressUpdate"))
        on("weeklyProgressUpdate", onRefresh);

        return () => {
            off("weeklyProgressUpdate", onRefresh);
            window.removeEventListener("resize", onResize)
        };
    }, []);

    return (
        <AppShell theme={theme}>
            <div ref={containerRef}>
                <Header
                    theme={theme}
                    level={level}
                    defaultLevel="managed"
                    loading={loading}
                    onLevelChange={setLevel}
                />

                <section style={gridStyle}>
                    <div style={topRowStyle}>
                        {
                            localStorage.getItem('EXPERIMENTAL_PDF') &&
                            <button
                                key={"pdf"}
                                onMouseEnter={() => setHoveredRuleId("pdf")}
                                onMouseLeave={() => setHoveredRuleId(null)}
                                style={weakRuleButtonStyle(hoveredRuleId === "pdf")}
                                onClick={async () => {
                                    const { blob } = await callGeneratePdfApi();

                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = "document.pdf";
                                    document.body.appendChild(a);
                                    a.click();

                                    a.remove();
                                    window.URL.revokeObjectURL(url);
                                }}
                            >
                                Download PDF
                            </button>
                        }

                        <button
                            onMouseEnter={() => setHoveredAnalytics(true)}
                            onMouseLeave={() => setHoveredAnalytics(false)}
                            style={weakRuleButtonStyle(hoveredAnalytics, true)}
                            onClick={handleAnalyticsClick}
                        >
                            {!isMobile ? "Що мені підтягнути? →" : "Усі правила"}
                        </button>

                        {weakRules.map((r) => {
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
