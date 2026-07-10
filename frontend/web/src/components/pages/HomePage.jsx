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
import { Button } from "../Buttons.jsx";
import { APP_BACKGROUND_COLOR } from "../../theme.js";

export default function HomePage({ theme }) {
    const [loading, setLoading] = useState(false);
    const [level, setLevel] = useState(getSavedTrainingLevel() || "managed");

    const [weakRules, setWeakRules] = useState([]);
    const [allRulesVisible, setAllRulesVisible] = useState(false);

    const [isMobile, setIsMobile] = useState(false);
    const [isInMarathonView, setIsInMarathonView] = useState(false);
    const [isMarathonLoaded, setIsMarathonLoaded] = useState(false);

    const [infoOpen, setInfoOpen] = useState(false);
    const [infoTitle, setInfoTitle] = useState("Information");
    const [infoMessage, setInfoMessage] = useState("");

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

    const weakRuleButtonLayoutStyle = (keepFullSize = false) => ({
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
    const SIDE_WALL_SECOND_LINE_GAP = 10;
    const SIDE_WALL_LINE_WIDTH = 1;

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
        borderRight: `${SIDE_WALL_LINE_WIDTH}px solid ${SIDE_WALL_COLOR}`,
        background: `linear-gradient(to left, transparent ${SIDE_WALL_SECOND_LINE_GAP}px, ${SIDE_WALL_COLOR} ${SIDE_WALL_SECOND_LINE_GAP}px, ${SIDE_WALL_COLOR} ${SIDE_WALL_SECOND_LINE_GAP + SIDE_WALL_LINE_WIDTH}px, transparent ${SIDE_WALL_SECOND_LINE_GAP + SIDE_WALL_LINE_WIDTH}px), ${theme?.bg ?? APP_BACKGROUND_COLOR}`,
        minHeight: "100vh",
    };

    const rightWallStyle = {
        borderLeft: `${SIDE_WALL_LINE_WIDTH}px solid ${SIDE_WALL_COLOR}`,
        background: `linear-gradient(to right, transparent ${SIDE_WALL_SECOND_LINE_GAP}px, ${SIDE_WALL_COLOR} ${SIDE_WALL_SECOND_LINE_GAP}px, ${SIDE_WALL_COLOR} ${SIDE_WALL_SECOND_LINE_GAP + SIDE_WALL_LINE_WIDTH}px, transparent ${SIDE_WALL_SECOND_LINE_GAP + SIDE_WALL_LINE_WIDTH}px), ${theme?.bg ?? APP_BACKGROUND_COLOR}`,
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

    const mainContentStyle = {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    };

    return (
        <AppShell theme={theme} noPadding>
            <div style={pageShellStyle}>
                <div style={leftWallStyle} aria-hidden="true" />

                <main style={pageContentStyle} ref={containerRef}>
                    <header style={headerStyle}>
                        <nav style={navStyle}>
                            <Button
                                variant="offset"
                                compact
                                isMobile={isMobile}
                                shadowColor={SIDE_WALL_COLOR}
                                shadowOffset={BUTTON_OFFSET}
                                onClick={() => navigate("/trainer")}
                            >
                                Trainer
                            </Button>
                            <Button
                                variant="offset"
                                compact
                                isMobile={isMobile}
                                shadowColor={SIDE_WALL_COLOR}
                                shadowOffset={BUTTON_OFFSET}
                                onClick={() => navigate("/analytics")}
                            >
                                Progress
                            </Button>
                            <Button
                                variant="offset"
                                compact
                                isMobile={isMobile}
                                shadowColor={SIDE_WALL_COLOR}
                                shadowOffset={BUTTON_OFFSET}
                                onClick={() => navigate("/welcome")}
                            >
                                About
                            </Button>
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
                            {!isMobile && isMarathonLoaded && !isInMarathonView && (
                                <div style={topRowStyle}>
                                    {!isMobile && allRulesVisible && (
                                        <Button
                                            variant="offset"
                                            compact
                                            isMobile={isMobile}
                                            shadowColor={SIDE_WALL_COLOR}
                                            shadowOffset={BUTTON_OFFSET}
                                            style={weakRuleButtonLayoutStyle(true)}
                                            onClick={handleAnalyticsClick}
                                        >
                                            {!isMobile ? "View all rules →" : "All rules"}
                                        </Button>
                                    )}

                                    {!isMobile && weakRules.map((r) => {
                                        return (
                                            <Button
                                                key={r.id}
                                                variant="offset"
                                                compact
                                                isMobile={isMobile}
                                                shadowColor={SIDE_WALL_COLOR}
                                                shadowOffset={BUTTON_OFFSET}
                                                style={weakRuleButtonLayoutStyle()}
                                                onClick={() => handleRuleClick(r.id)}
                                                title={`Open rule: ${r.label}`}
                                            >
                                                {r.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}

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
