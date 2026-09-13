import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./Buttons.jsx";
import LocaleButton from "./LocaleButton.jsx";
import LevelSwitch from "./training/LevelSwitch.jsx";
import ModalShell from "./modals/ModalShell.jsx";
import { callAccountInfoApi } from "../services/api.js";
import { marathonService } from "../services/marathonService.js";
import { getSavedTrainingLevel, saveTrainingLevel } from "../services/trainingDirector.js";
import { emit, off, on } from "../services/events.js";
import {
    TRAINER_ANIMATION_EVENTS,
    TRAINER_ANIMATION_PENDING_KEY,
} from "../animations/shakespeareAnimation.js";
import {
    APP_BORDER_COLOR,
    APP_DARK_COLOR,
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

    const handleLogoClick = () => {
        const trainerIsMounted = ["/", "/trainer", "/greetings", "/hello"].includes(location.pathname);

        if (trainerIsMounted) {
            emit(TRAINER_ANIMATION_EVENTS.START);
        } else {
            try {
                sessionStorage.setItem(TRAINER_ANIMATION_PENDING_KEY, "true");
            } catch {
                // Navigation still works when session storage is unavailable.
            }
        }

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
    const isProfilePage = pathname.startsWith("/profile");
    const border = theme?.border ?? APP_BORDER_COLOR;
    const surface = theme?.surface ?? APP_SURFACE_COLOR;
    const text = theme?.text ?? APP_TEXT_COLOR;
    const dark = theme?.dark ?? APP_DARK_COLOR;

    const headerStyle = {
        width: "100%",
        minHeight: 76,
        position: isMobile ? "fixed" : "relative",
        top: isMobile ? 0 : undefined,
        left: isMobile ? 0 : undefined,
        right: isMobile ? 0 : undefined,
        zIndex: isMobile ? 1001 : undefined,
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

    const mobileHeaderSpacerStyle = {
        display: isMobile ? "block" : "none",
        width: "100%",
        height: 76,
        flex: "0 0 76px",
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

    const logoWordmarkStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        color: "#000",
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontWeight: 700,
        fontSize: isMobile ? "1.28rem" : "1.48rem",
        lineHeight: 1,
        letterSpacing: "-0.035em",
        whiteSpace: "nowrap",
    };

    const settingsContentStyle = {
        display: "grid",
        gap: 14,
    };

    const mobileNavStyle = {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        background: surface,
        borderTop: `1px solid ${border}`,
        boxShadow: "0 -8px 28px rgba(31, 36, 54, 0.08)",
        padding: "8px 12px calc(8px + env(safe-area-inset-bottom))",
    };

    const mobileNavInnerStyle = {
        width: "100%",
        maxWidth: 520,
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        alignItems: "center",
        gap: 12,
    };

    const mobileNavButtonStyle = {
        width: "100%",
        minWidth: 0,
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
                            <span style={logoWordmarkStyle}>Good Lang</span>
                        </button>

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
                            <Button
                                variant="secondary"
                                compact
                                isMobile={isMobile}
                                theme={theme}
                                shadowOffset={0}
                                style={{
                                    minWidth: isMobile ? 82 : 96,
                                    backgroundColor: dark,
                                    color: "#fff",
                                    borderColor: dark,
                                }}
                                onClick={() => navigate("/profile")}
                                aria-current={isProfilePage ? "page" : undefined}
                            >
                                PROFILE
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <div aria-hidden="true" style={mobileHeaderSpacerStyle} />

            {isMobile && !isInMarathonView && (
                <>
                    <style>{`
                        @media (max-width: 914px) {
                            :root {
                                --mobile-nav-clearance: calc(64px + env(safe-area-inset-bottom));
                            }
                        }
                    `}</style>
                    <nav style={mobileNavStyle} aria-label="Main navigation">
                        <div style={mobileNavInnerStyle}>
                            <Button
                                variant="header"
                                compact
                                active={pathname === "/" || pathname.startsWith("/trainer")}
                                isMobile
                                theme={theme}
                                style={mobileNavButtonStyle}
                                onClick={handlePracticeClick}
                                aria-current={pathname === "/" || pathname.startsWith("/trainer") ? "page" : undefined}
                            >
                                Practice
                            </Button>

                            <Button
                                variant="header"
                                compact
                                active={pathname.startsWith("/analytics") || pathname.startsWith("/rule")}
                                isMobile
                                theme={theme}
                                style={mobileNavButtonStyle}
                                onClick={handleAnalyticsClick}
                                aria-current={pathname.startsWith("/analytics") || pathname.startsWith("/rule") ? "page" : undefined}
                            >
                                Grammar
                            </Button>

                            <Button
                                variant="header"
                                compact
                                active={pathname.startsWith("/vocabulary")}
                                isMobile
                                theme={theme}
                                style={mobileNavButtonStyle}
                                onClick={handleVocabularyClick}
                                aria-current={pathname.startsWith("/vocabulary") ? "page" : undefined}
                            >
                                Vocabulary
                            </Button>
                        </div>
                    </nav>
                </>
            )}

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

        </>
    );
}
