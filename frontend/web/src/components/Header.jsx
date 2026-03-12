import React, { useState, useEffect } from "react";
import LevelSwitch from "./training/LevelSwitch.jsx";
import AccountStatusButton from "./subscription/AccountStatusButton.jsx";
import AccuracyKpi from "./training/AccuracyKpi.jsx";
import {PrimaryButton} from "./Buttons.jsx";
import FaqModal from "./subscription/FaqModal.jsx";
import {callAccountVerifyApi} from "../services/api.js";
import {ACTION_TYPES} from "../utils/constants.js";
import {marathonService} from "../services/marathonService.js";
import LocaleButton from "./LocaleButton.jsx";

export default function Header({ theme, level, loading, onLevelChange }) {
    const [isMobile, setIsMobile] = useState(false);
    const [faqVisible, setFaqVisible] = useState(false);
    const [isInMarathonView, setIsInMarathonView] = useState(false);
    const [isMarathonLoaded, setIsMarathonLoaded] = useState(false);

    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth < 915);
        update();
        checkMarathonView().then();

        window.addEventListener("resize", update);
        window.addEventListener("onMarathonUpdate", checkMarathonView);
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("onMarathonUpdate", checkMarathonView);
        }
    }, []);

    useEffect(() => {
        checkMarathonView().then();
    }, [loading])

    const checkMarathonView = async () => {
        const result = await marathonService.isMarathonView(true);
        setIsInMarathonView(result);
        setIsMarathonLoaded(true);
    }

    const styles = {
        header: {
            display: "flex",
            flexDirection: "column",
            gap: marathonService.isInMarathon() ? 24 : 16,
            paddingBottom: 10,
            marginBottom: 6,
        },
        headerMobile: {
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingBottom: 10,
            marginBottom: 6,
        },
        brandRowMobile: {
            display: "flex",
            alignItems: "center",
            gap: 12,
        },
        logo: size => ({
            flex: "0 0 auto",        // НЕ СТИСКАЄТЬСЯ
            width: size,
            height: size,
            borderRadius: 12,
            background: theme.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: size * 0.45,
            boxShadow: `0 2px 0 ${theme.accentDark}`,
        }),
        titleWrap: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
        },
        h1: {
            margin: 0,
            fontWeight: 900,
            fontSize: "2rem",
            lineHeight: 1.2,
            color: theme.accentDark,
        },
        sub: {
            color: theme.muted,
            fontSize: "1rem",
            fontWeight: 700,
            display: "flex",
            justifyContent: 'flex-start',
        },
        leftColumn: {
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 8,
        },

        titleBox: {
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
        },

        h1Brand: {
            margin: 0,
            color: theme.accentDark,
            fontSize: "2rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },

        subBrand: {
            color: theme.muted,
            fontSize: "1rem",
        },

    };

    // ---------------------------------------------------------------------
    // MOBILE LAYOUT (<915px)
    // ---------------------------------------------------------------------
    if (isMobile) {
        return (
            <div>
                {faqVisible && (
                    <FaqModal
                        theme={theme}
                        onClose={() => setFaqVisible(false)}
                    />
                )}
                <div style={styles.headerMobile}>
                    {/* Row: logo + title ONLY */}
                    <div style={{display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8}}>
                        <div style={styles.logo(64)}>GL</div>

                        <div style={styles.titleWrap}>
                            <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                                <h1 style={styles.h1}>GoodLang</h1>
                                <PrimaryButton theme={theme} onClick={() => {
                                    setFaqVisible(true);
                                }}>FAQ</PrimaryButton>
                            </div>

                            <div style={styles.sub}>
                                <AccountStatusButton theme={theme}/>
                            </div>
                        </div>
                    </div>

                    {/* Under the header: sub + weekly progress */}
                    <div style={{display: "flex", flexDirection: "column", gap: 6}}>
                        <div style={{display: "flex", flexDirection: "row", gap: 12, justifyContent: "space-between"}}>
                            <AccuracyKpi header mobile theme={theme}/>
                        </div>

                    </div>

                    {/* LEFT column for buttons */}
                    <div style={styles.leftColumn}>
                        <LocaleButton theme={theme} />
                        {
                            !isInMarathonView && isMarathonLoaded &&
                            <LevelSwitch
                                compact
                                level={level}
                                loading={loading}
                                onLevelChange={onLevelChange}
                                theme={theme}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------
    // DESKTOP LAYOUT (UNCHANGED)
    // ---------------------------------------------------------------------
    return (
        <header style={styles.header}>
            {faqVisible && (
                <FaqModal
                    theme={theme}
                    onClose={() => setFaqVisible(false)}
                />
            )}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                    width: "100%",
                    height: "140px",
                }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={styles.logo(64)}>GL</div>

                    <div style={styles.titleWrap}>
                        <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                            <h1 style={styles.h1}>GoodLang</h1>
                            <PrimaryButton theme={theme} onClick={async () => {
                                setFaqVisible(true);
                                await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_FAQ);
                            }}>FAQ</PrimaryButton>
                        </div>
                        <div style={styles.sub}>
                            Translate until you learn it
                        </div>
                    </div>
                </div>

                <AccuracyKpi header theme={theme}/>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "end",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    {
                        !isInMarathonView && isMarathonLoaded &&
                        <LevelSwitch
                            level={level}
                            loading={loading}
                            onLevelChange={onLevelChange}
                            theme={theme}
                        />
                    }
                    <LocaleButton theme={theme} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <AccountStatusButton theme={theme} />

                </div>
            </div>
        </header>
    );
}
