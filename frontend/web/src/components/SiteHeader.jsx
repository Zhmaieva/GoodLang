import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./Buttons.jsx";
import LimitModal from "./subscription/LimitModal.jsx";
import LocaleButton from "./LocaleButton.jsx";
import LevelSwitch from "./training/LevelSwitch.jsx";
import ModalShell from "./modals/ModalShell.jsx";
import { callAccountInfoApi } from "../services/api.js";
import { marathonService } from "../services/marathonService.js";
import { getSavedTrainingLevel, saveTrainingLevel } from "../services/trainingDirector.js";
import { off, on } from "../services/events.js";
import {
    APP_ACCENT_COLOR,
    APP_ACCENT_SOFT_COLOR,
    APP_BORDER_COLOR,
    APP_DARK_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
} from "../theme.js";

function readCachedAccountInfo() {
    try {
        return JSON.parse(localStorage.getItem("account_info") || "null");
    } catch {
        return null;
    }
}

export default function SiteHeader({
    theme,
    loading = false,
    level: controlledLevel,
    onLevelChange,
    showPracticeButton = false,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [internalLevel, setInternalLevel] = useState(getSavedTrainingLevel() || "managed");
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 915 : false
    );
    const [isInMarathonView, setIsInMarathonView] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [subscribeVisible, setSubscribeVisible] = useState(false);
    const [profileHovered, setProfileHovered] = useState(false);
    const [account, setAccount] = useState(() => readCachedAccountInfo());
    const [accountLoaded, setAccountLoaded] = useState(() => Boolean(readCachedAccountInfo()));

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);

        const checkMarathonView = async () => {
            const result = await marathonService.isMarathonView(true);
            setIsInMarathonView(result);
        };

        onResize();
        checkMarathonView().then();

        window.addEventListener("resize", onResize);
        window.addEventListener("onMarathonUpdate", checkMarathonView);

        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("onMarathonUpdate", checkMarathonView);
        };
    }, []);

    useEffect(() => {
        if (controlledLevel) return;

        const saved = getSavedTrainingLevel();
        if (saved) setInternalLevel(saved);
    }, [controlledLevel]);

    const loadAccountInfo = async () => {
        try {
            const data = await callAccountInfoApi();
            setAccount(data);
        } catch (error) {
            console.error("Failed to load account info", error);
            setAccount(null);
        } finally {
            setAccountLoaded(true);
        }
    };

    useEffect(() => {
        loadAccountInfo().then();

        on("refreshAccount", loadAccountInfo);
        return () => off("refreshAccount", loadAccountInfo);
    }, []);

    const handleAnalyticsClick = async () => {
        navigate("/analytics");
    };

    const handleBackToRulesClick = async () => {
        await handleAnalyticsClick();
    };

    const handleLogoClick = () => {
        navigate("/trainer");
    };

    const handlePracticeClick = () => {
        navigate("/trainer");
    };

    const handleVocabularyClick = () => {
        navigate("/vocabulary");
    };

    const handleLevelChange = (nextLevel) => {
        if (onLevelChange) {
            onLevelChange(nextLevel);
            return;
        }

        saveTrainingLevel(nextLevel);
        setInternalLevel(nextLevel);
    };

    const level = controlledLevel ?? internalLevel;
    const pathname = location.pathname;
    const isRulePage = pathname.startsWith("/rule/");
    const isSignedIn = Boolean(account?.email);
    const accent = theme?.accent ?? APP_ACCENT_COLOR;
    const accentSoft = theme?.accentSoft ?? APP_ACCENT_SOFT_COLOR;
    const border = theme?.border ?? APP_BORDER_COLOR;
    const surface = theme?.surface ?? APP_SURFACE_COLOR;
    const text = theme?.text ?? APP_TEXT_COLOR;
    const muted = theme?.muted ?? APP_MUTED_TEXT_COLOR;
    const dark = theme?.dark ?? APP_DARK_COLOR;

    const headerStyle = {
        width: "100%",
        minHeight: 76,
        background: surface,
        borderBottom: `1px solid ${border}`,
        boxShadow: "0 8px 28px rgba(31, 36, 54, 0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "0 14px" : "0 28px",
        boxSizing: "border-box",
        flexShrink: 0,
    };

    const innerStyle = {
        width: "100%",
        maxWidth: 1180,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: isMobile ? 14 : 24,
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        paddingBottom: 0,
        paddingRight: 0,
        boxSizing: "border-box",
        fontFamily: "var(--font-family-base)",
        fontWeight: 700,
    };

    const headerGroupStyle = {
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 10 : 14,
        flexWrap: "nowrap",
        flex: "0 0 auto",
        minWidth: "max-content",
    };

    const centerGroupStyle = {
        ...headerGroupStyle,
        position: isMobile ? "static" : "absolute",
        left: isMobile ? "auto" : "50%",
        transform: isMobile ? "none" : "translateX(-50%)",
        justifyContent: "center",
        gap: isMobile ? 18 : 36,
    };

    const rightGroupStyle = {
        ...headerGroupStyle,
        flex: "0 0 auto",
        marginLeft: "auto",
        gap: isMobile ? 8 : 12,
    };

    const logoButtonStyle = {
        appearance: "none",
        border: "none",
        background: "transparent",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: 0,
        margin: 0,
        color: text,
        cursor: "pointer",
        flex: "0 0 auto",
    };

    const logoMarkStyle = {
        width: isMobile ? 38 : 44,
        height: isMobile ? 38 : 44,
        border: `1px solid ${border}`,
        borderRadius: 14,
        background: accentSoft,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        boxSizing: "border-box",
        overflow: "hidden",
        boxShadow: "0 8px 22px rgba(123, 97, 216, 0.10)",
    };

    const logoMarkInnerStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        color: accent,
        fontFamily: "var(--font-family-base)",
        fontWeight: 900,
        fontSize: isMobile ? "1.05rem" : "1.18rem",
        lineHeight: 1,
        letterSpacing: "-0.04em",
        textTransform: "uppercase",
    };

    const logoRegistrationStyle = {
        display: "none",
    };

    const backToRulesButtonStyle = {
        color: muted,
        fontFamily: "var(--font-family-base)",
        fontSize: isMobile ? "0.92rem" : "0.98rem",
        fontWeight: 500,
        letterSpacing: 0,
        marginLeft: isRulePage && !isMobile ? 42 : 0,
        padding: 0,
        textDecoration: "none",
    };

    const settingsContentStyle = {
        display: "grid",
        gap: 14,
    };

    return (
        <>
            <header style={headerStyle}>
                <div style={innerStyle}>
                    <div style={headerGroupStyle}>
                        <button
                            type="button"
                            style={logoButtonStyle}
                            aria-label="Go to GoodLang home page"
                            onClick={handleLogoClick}
                        >
                            <span style={logoMarkStyle}>
                                <span style={logoMarkInnerStyle}>GL</span>
                                <span style={logoRegistrationStyle}>R</span>
                            </span>
                        </button>

                        {isRulePage && !isInMarathonView && (
                            <Button
                                variant="plain"
                                compact
                                isMobile={isMobile}
                                theme={theme}
                                style={backToRulesButtonStyle}
                                onClick={handleBackToRulesClick}
                            >
                                ← Back to rules
                            </Button>
                        )}
                    </div>

                    {!isMobile && !isInMarathonView && (
                        <nav style={centerGroupStyle} aria-label="Main navigation">
                            <Button
                                variant="header"
                                compact
                                active={pathname === "/" || pathname.startsWith("/trainer")}
                                isMobile={isMobile}
                                theme={theme}
                                onClick={handlePracticeClick}
                            >
                                Practice
                            </Button>

                            <Button
                                variant="header"
                                compact
                                active={pathname.startsWith("/analytics") || pathname.startsWith("/rule")}
                                isMobile={isMobile}
                                theme={theme}
                                onClick={handleAnalyticsClick}
                            >
                                Grammar
                            </Button>

                            <Button
                                variant="header"
                                compact
                                active={pathname.startsWith("/vocabulary")}
                                isMobile={isMobile}
                                theme={theme}
                                onClick={handleVocabularyClick}
                            >
                                Vocabulary
                            </Button>
                        </nav>
                    )}

                    <div style={rightGroupStyle}>
                        {accountLoaded && (
                            isSignedIn ? (
                                <Button
                                    variant="secondary"
                                    compact
                                    isMobile={isMobile}
                                    theme={theme}
                                    shadowOffset={0}
                                    onMouseEnter={() => setProfileHovered(true)}
                                    onMouseLeave={() => setProfileHovered(false)}
                                    style={{
                                        minWidth: isMobile ? 82 : 96,
                                        backgroundColor: profileHovered ? dark : surface,
                                        color: profileHovered ? "#fff" : text,
                                    }}
                                    onClick={() => navigate("/profile")}
                                >
                                    PROFILE
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    compact
                                    isMobile={isMobile}
                                    theme={theme}
                                    shadowOffset={0}
                                    style={{ minWidth: isMobile ? 82 : 96 }}
                                    onClick={() => setSubscribeVisible(true)}
                                >
                                    SUBSCRIBE
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </header>

            <ModalShell
                open={settingsVisible}
                id="site-settings-modal"
                theme={theme}
                title="Settings"
                subtitle="Update your translation direction and training level."
                onClose={() => setSettingsVisible(false)}
                maxWidth={520}
                contentStyle={settingsContentStyle}
            >
                <LocaleButton
                    compact
                    fullWidth
                    isMobile={isMobile}
                    theme={theme}
                    variant="secondary"
                    style={{ width: "100%" }}
                />

                <LevelSwitch
                    compact
                    fullWidth
                    level={level}
                    loading={loading}
                    onLevelChange={handleLevelChange}
                    theme={theme}
                    variant="secondary"
                />
            </ModalShell>

            <LimitModal
                subscribeIntent
                isLimitReached={false}
                theme={theme}
                open={subscribeVisible}
                onClose={() => {
                    setSubscribeVisible(false);
                    loadAccountInfo().then();
                }}
            />
        </>
    );
}
