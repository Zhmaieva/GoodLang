import React, { useState, useEffect } from "react";
import LevelSwitch from "./training/LevelSwitch.jsx";
import AccountStatusButton from "./subscription/AccountStatusButton.jsx";
import AccuracyKpi from "./training/AccuracyKpi.jsx";
import {PrimaryButton} from "./Buttons.jsx";
import TermsOfUseModal from "./subscription/TermsOfUseModal.jsx";
import FaqModal from "./subscription/FaqModal.jsx";

export default function Header({ theme, level, loading, onLevelChange }) {
    const [isMobile, setIsMobile] = useState(false);
    const [faqVisible, setFaqVisible] = useState(false);

    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth < 915);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const styles = {
        header: {
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingBottom: 12,
            borderBottom: `3px solid ${theme.accent}`,
            marginBottom: 20,
        },
        headerMobile: {
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingBottom: 12,
            borderBottom: `3px solid ${theme.accent}`,
            marginBottom: 25,
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
        },
        leftColumn: {
            display: "flex",
            flexDirection: "column",
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
                                Перекладай, поки не вивчиш
                            </div>
                        </div>
                    </div>

                    {/* Under the header: sub + weekly progress */}
                    <div style={{display: "flex", flexDirection: "column", gap: 6}}>
                        <div style={{display: "flex", flexDirection: "row", gap: 12, justifyContent: "space-between"}}>
                            <AccuracyKpi header mobile theme={theme}/>
                            <AccountStatusButton theme={theme}/>
                        </div>

                    </div>

                    {/* LEFT column for buttons */}
                    <div style={styles.leftColumn}>
                        <LevelSwitch
                            level={level}
                            loading={loading}
                            onLevelChange={onLevelChange}
                            theme={theme}
                        />
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
                    height: "100px",
                }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={styles.logo(64)}>GL</div>

                    <div style={styles.titleWrap}>
                        <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                            <h1 style={styles.h1}>GoodLang</h1>
                            <PrimaryButton theme={theme} onClick={() => {
                                setFaqVisible(true);
                            }}>FAQ</PrimaryButton>
                        </div>
                        <div style={styles.sub}>
                            Перекладай, поки не вивчиш
                        </div>
                    </div>
                </div>

                <AccuracyKpi header mobile theme={theme}/>
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
                    <LevelSwitch
                        level={level}
                        loading={loading}
                        onLevelChange={onLevelChange}
                        theme={theme}
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <AccountStatusButton theme={theme} />

                </div>
            </div>
        </header>
    );
}
