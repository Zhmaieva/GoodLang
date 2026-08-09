import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Buttons.jsx";
import LoginModal from "./subscription/LoginModal.jsx";
import LocaleButton from "./LocaleButton.jsx";
import LevelSwitch from "./training/LevelSwitch.jsx";
import AccountStatusModal from "./subscription/AccountStatusModal.jsx";
import ModalShell from "./modals/ModalShell.jsx";
import { GearSix } from "@phosphor-icons/react";
import { callAccountInfoApi } from "../services/api.js";
import { marathonService } from "../services/marathonService.js";
import { getSavedTrainingLevel, saveTrainingLevel } from "../services/trainingDirector.js";
import { off, on } from "../services/events.js";

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
    const [internalLevel, setInternalLevel] = useState(getSavedTrainingLevel() || "managed");
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 915 : false
    );
    const [isInMarathonView, setIsInMarathonView] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);
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

    const handleLogoClick = () => {
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
    const isSignedIn = Boolean(account?.email);

    const headerStyle = {
        width: "100%",
        minHeight: 100,
        background: "#95b5fe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        boxSizing: "border-box",
        flexShrink: 0,
    };

    const innerStyle = {
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        paddingBottom: 0,
        paddingRight: 0,
        boxSizing: "border-box",
        fontFamily: '"Antonio", sans-serif',
        fontWeight: 200,
    };

    const headerGroupStyle = {
        display: "flex",
        alignItems: "center",
        gap: 32,
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
        gap: isMobile ? 24 : 56,
    };

    const rightGroupStyle = {
        ...headerGroupStyle,
        flex: "0 0 auto",
        marginLeft: "auto",
        gap: 24,
    };

    const logoButtonStyle = {
        appearance: "none",
        border: "none",
        background: "transparent",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: 0,
        margin: 0,
        color: "#000",
        cursor: "pointer",
        flex: "0 0 auto",
    };

    const logoMarkStyle = {
        width: isMobile ? 62 : 78,
        height: isMobile ? 34 : 42,
        border: "2px solid #000",
        borderRadius: 0,
        background: theme?.accent ?? "#95b5fe",
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        boxSizing: "border-box",
        overflow: "hidden",
    };

    const logoMarkInnerStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        color: "#000",
        fontFamily: '"Antonio", sans-serif',
        fontWeight: 700,
        fontSize: isMobile ? "2.18rem" : "2.85rem",
        lineHeight: 0.78,
        letterSpacing: "-0.08em",
        textTransform: "uppercase",
        transform: "scaleX(1.22)",
    };

    const logoRegistrationStyle = {
        position: "absolute",
        top: isMobile ? 2 : 3,
        right: isMobile ? 3 : 4,
        width: isMobile ? 9 : 11,
        height: isMobile ? 9 : 11,
        border: "1px solid #000",
        borderRadius: "50%",
        color: "#000",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        fontWeight: 800,
        fontSize: isMobile ? "0.42rem" : "0.5rem",
        lineHeight: 1,
        background: "transparent",
    };

    const settingsContentStyle = {
        display: "grid",
        gap: 14,
    };

    const settingsIconButtonStyle = {
        appearance: "none",
        border: "none",
        background: "transparent",
        color: "#000",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        lineHeight: 1,
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
                    </div>

                    {!isMobile && !isInMarathonView && (
                        <nav style={centerGroupStyle} aria-label="Main navigation">
                            <Button
                                variant="header"
                                compact
                                isMobile={isMobile}
                                theme={theme}
                                onClick={handleAnalyticsClick}
                            >
                                GRAMMAR
                            </Button>

                            <Button
                                variant="header"
                                compact
                                isMobile={isMobile}
                                theme={theme}
                                onClick={handleVocabularyClick}
                            >
                                VOCABULARY
                            </Button>
                        </nav>
                    )}

                    <div style={rightGroupStyle}>
                        {!isInMarathonView && (
                            <Button
                                variant="plain"
                                aria-label="Open settings"
                                onClick={() => setSettingsVisible(true)}
                                style={settingsIconButtonStyle}
                            >
                                <GearSix size={isMobile ? 24 : 30} weight="regular" aria-hidden />
                            </Button>
                        )}

                        {accountLoaded && (
                            isSignedIn ? (
                                <Button
                                    variant="offset"
                                    compact
                                    isMobile={isMobile}
                                    theme={theme}
                                    shadowColor={theme.accent}
                                    shadowOffset={4}
                                    onMouseEnter={() => setProfileHovered(true)}
                                    onMouseLeave={() => setProfileHovered(false)}
                                    style={{
                                        backgroundColor: profileHovered ? "#000" : theme.accent,
                                        color: profileHovered ? theme.bg : "#000",
                                    }}
                                    onClick={() => setProfileVisible(true)}
                                >
                                    PROFILE
                                </Button>
                            ) : (
                                <Button
                                    variant="offset"
                                    compact
                                    isMobile={isMobile}
                                    theme={theme}
                                    shadowColor={theme.accent}
                                    shadowOffset={4}
                                    onClick={() => setLoginVisible(true)}
                                >
                                    SIGN IN
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
                subtitle="Language direction and training difficulty."
                onClose={() => setSettingsVisible(false)}
                maxWidth={520}
                contentStyle={settingsContentStyle}
            >
                <LocaleButton
                    compact
                    fullWidth
                    isMobile={isMobile}
                    theme={theme}
                    variant="offset"
                    style={{ width: "100%" }}
                />

                <LevelSwitch
                    compact
                    fullWidth
                    level={level}
                    loading={loading}
                    onLevelChange={handleLevelChange}
                    theme={theme}
                    variant="offset"
                />
            </ModalShell>

            <LoginModal
                forceLogin
                theme={theme}
                account={account}
                open={loginVisible}
                onClose={() => {
                    setLoginVisible(false);
                    loadAccountInfo().then();
                }}
            />

            {isSignedIn && (
                <AccountStatusModal
                    accountInfo={account}
                    theme={theme}
                    open={profileVisible}
                    onClose={() => {
                        setProfileVisible(false);
                        loadAccountInfo().then();
                    }}
                    status={account?.status}
                />
            )}
        </>
    );
}
