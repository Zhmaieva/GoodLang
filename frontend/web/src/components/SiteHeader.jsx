import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Button } from "./Buttons.jsx";
import AccountStatusButton from "./subscription/AccountStatusButton.jsx";
import FaqModal from "./subscription/FaqModal.jsx";
import LocaleButton from "./LocaleButton.jsx";
import LevelSwitch from "./training/LevelSwitch.jsx";
import { APP_ACCENT_COLOR, APP_BACKGROUND_COLOR } from "../theme.js";
import { callAccountVerifyApi } from "../services/api.js";
import { marathonService } from "../services/marathonService.js";
import { getSavedTrainingLevel, saveTrainingLevel } from "../services/trainingDirector.js";
import { ACTION_TYPES } from "../utils/constants.js";

const BUTTON_OFFSET = 4;

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

    const frameColor = theme?.accent ?? APP_ACCENT_COLOR;

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

    const handleAnalyticsClick = async () => {
        callAccountVerifyApi(ACTION_TYPES.PAGE_OPEN_ANALYTICS).then();
        navigate("/analytics");
    };

    const handlePracticeClick = () => {
        navigate("/trainer");
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

    const headerStyle = {
        width: "100%",
        minHeight: 100,
        background: APP_BACKGROUND_COLOR,
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
        justifyContent: "flex-end",
        gap: 12,
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        overflowX: "auto",
        paddingBottom: BUTTON_OFFSET,
        paddingRight: BUTTON_OFFSET,
        boxSizing: "border-box",
    };

    return (
        <>
            <header style={headerStyle}>
                <div style={innerStyle}>
                    <Button
                        variant="offset"
                        compact
                        isMobile={isMobile}
                        theme={theme}
                        shadowColor={frameColor}
                        shadowOffset={BUTTON_OFFSET}
                        onClick={handleFaqClick}
                        style={{ minWidth: 86 }}
                    >
                        FAQ
                    </Button>

                    <LocaleButton
                        compact
                        isMobile={isMobile}
                        theme={theme}
                        shadowColor={frameColor}
                        shadowOffset={BUTTON_OFFSET}
                    />

                    <AccountStatusButton theme={theme} />

                    {!isMobile && isMarathonLoaded && !isInMarathonView && (
                        <>
                            {showPracticeButton && (
                                <Button
                                    variant="offset"
                                    compact
                                    isMobile={isMobile}
                                    theme={theme}
                                    shadowColor={frameColor}
                                    shadowOffset={BUTTON_OFFSET}
                                    onClick={handlePracticeClick}
                                >
                                    <ArrowLeft size={18} weight="bold" aria-hidden />
                                    Go to practice
                                </Button>
                            )}

                            <Button
                                variant="offset"
                                compact
                                isMobile={isMobile}
                                theme={theme}
                                shadowColor={frameColor}
                                shadowOffset={BUTTON_OFFSET}
                                onClick={handleAnalyticsClick}
                            >
                                View all rules
                                <ArrowRight size={18} weight="bold" aria-hidden />
                            </Button>

                            <LevelSwitch
                                compact
                                level={level}
                                loading={loading}
                                onLevelChange={handleLevelChange}
                                theme={theme}
                            />
                        </>
                    )}
                </div>
            </header>

            {faqVisible && (
                <FaqModal
                    theme={theme}
                    onClose={() => setFaqVisible(false)}
                />
            )}
        </>
    );
}
