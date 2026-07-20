import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Buttons.jsx";
import AccountStatusButton from "./subscription/AccountStatusButton.jsx";
import LoginModal from "./subscription/LoginModal.jsx";
import FaqModal from "./subscription/FaqModal.jsx";
import LocaleButton from "./LocaleButton.jsx";
import LevelSwitch from "./training/LevelSwitch.jsx";
import AccountStatusModal from "./subscription/AccountStatusModal.jsx";
import { callAccountInfoApi, callAccountVerifyApi } from "../services/api.js";
import { marathonService } from "../services/marathonService.js";
import { getSavedTrainingLevel, saveTrainingLevel } from "../services/trainingDirector.js";
import { ACTION_TYPES } from "../utils/constants.js";
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
    const [isMarathonLoaded, setIsMarathonLoaded] = useState(false);
    const [faqVisible, setFaqVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);
    const [account, setAccount] = useState(() => readCachedAccountInfo());
    const [accountLoaded, setAccountLoaded] = useState(() => Boolean(readCachedAccountInfo()));

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);

        const checkMarathonView = async () => {
            const result = await marathonService.isMarathonView(true);
            setIsInMarathonView(result);
            setIsMarathonLoaded(true);
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
        callAccountVerifyApi(ACTION_TYPES.PAGE_OPEN_ANALYTICS).then();
        navigate("/analytics");
    };

    const handlePracticeClick = () => {
        navigate("/trainer");
    };

    const handleLogoClick = () => {
        navigate("/trainer");
    };

    const handleVocabularyClick = () => {
        navigate("/vocabulary");
    };

    const handleFaqClick = async () => {
        setFaqVisible(true);
        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_FAQ);
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

    const rightGroupStyle = {
        ...headerGroupStyle,
        flex: "0 0 auto",
        marginLeft: "auto",
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
        width: isMobile ? 36 : 44,
        height: isMobile ? 36 : 44,
        border: "none",
        borderRadius: 8,
        background: "#000",
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
    };

    const logoMarkInnerStyle = {
        position: "absolute",
        inset: isMobile ? 5 : 6,
        border: `${isMobile ? 2 : 3}px solid ${theme?.accent ?? "#95b5fe"}`,
        borderRadius: 5,
        color: theme?.accent ?? "#95b5fe",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-family-base)",
        fontWeight: 800,
        fontSize: isMobile ? "1rem" : "1.18rem",
        lineHeight: 1,
    };

    const logoTextStyle = {
        fontFamily: '"Antonio", sans-serif',
        fontWeight: 200,
        fontSize: isMobile ? "1.35rem" : "1.78rem",
        lineHeight: 1,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
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
                            </span>
                            <span style={logoTextStyle}>GoodLang</span>
                        </button>

                        <Button
                            variant="header"
                            compact
                            isMobile={isMobile}
                            theme={theme}
                            onClick={handleFaqClick}
                        >
                            FAQ
                        </Button>

                        <AccountStatusButton theme={theme} variant="header" />

                        {!isMobile && isMarathonLoaded && !isInMarathonView && (
                            <>
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

                                <LocaleButton
                                    compact
                                    isMobile={isMobile}
                                    theme={theme}
                                    variant="header"
                                />

                                <LevelSwitch
                                    compact
                                    level={level}
                                    loading={loading}
                                    onLevelChange={handleLevelChange}
                                    theme={theme}
                                    variant="header"
                                />
                            </>
                        )}
                    </div>

                    <div style={rightGroupStyle}>
                        {accountLoaded && (
                            isSignedIn ? (
                                <Button
                                    variant="offset"
                                    compact
                                    isMobile={isMobile}
                                    theme={theme}
                                    shadowColor={theme.accent}
                                    shadowOffset={4}
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

            {faqVisible && (
                <FaqModal
                    theme={theme}
                    onClose={() => setFaqVisible(false)}
                />
            )}

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
