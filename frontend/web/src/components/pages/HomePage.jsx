import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppShell from "../AppShell";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import Trainer from "../training/Trainer.jsx";
import FooterBar from "../FooterBar.jsx";
import { callEmailUnsubscribeApi } from "../../services/api.js";
import InfoModal from "../modals/InfoModal.jsx";
import { getSavedTrainingLevel, saveTrainingLevel } from "../../services/trainingDirector.js";
import { APP_BACKGROUND_COLOR, APP_BORDER_COLOR, APP_SURFACE_COLOR } from "../../theme.js";
import SiteHeader from "../SiteHeader.jsx";

export default function HomePage({ theme }) {
    const [loading, setLoading] = useState(false);
    const [level, setLevel] = useState(getSavedTrainingLevel() || "managed");

    const [isMobile, setIsMobile] = useState(false);

    const [infoOpen, setInfoOpen] = useState(false);
    const [infoTitle, setInfoTitle] = useState("Information");
    const [infoMessage, setInfoMessage] = useState("");

    const { ref: containerRef } = useBreakpoint(880);

    const location = useLocation();

    const gridStyle = {
        display: "flex",
        flexDirection: "column",
        gap: 24,
    };

    const handleLevelChange = (nextLevel) => {
        saveTrainingLevel(nextLevel);
        setLevel(nextLevel);
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
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    const pageLayoutStyle = {
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: theme?.bg ?? APP_BACKGROUND_COLOR,
    };

    const pageShellStyle = {
        width: "100%",
        flex: "1 0 auto",
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "24px 12px" : "64px 24px",
        background: theme?.bg ?? APP_BACKGROUND_COLOR,
    };

    const pageContentStyle = {
        minWidth: 0,
        width: isMobile ? "100%" : "min(880px, 92vw)",
        minHeight: "auto",

        display: "flex",
        flexDirection: "column",

        padding: isMobile ? "24px" : "56px 64px",
        border: `1px solid ${theme?.border ?? APP_BORDER_COLOR}`,
        borderRadius: 24,
        background: theme?.surface ?? APP_SURFACE_COLOR,
        boxShadow: "0 24px 70px rgba(31, 36, 54, 0.08)",
        boxSizing: "border-box",
        transform: "translateY(-20px)",
    };

    const mainContentStyle = {
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
    };

    return (
        <AppShell theme={theme} noPadding>
            <div style={pageLayoutStyle}>
                <SiteHeader
                    theme={theme}
                    loading={loading}
                    level={level}
                    onLevelChange={handleLevelChange}
                />

                <div style={pageShellStyle}>
                    <main style={pageContentStyle} ref={containerRef}>
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
                                <Trainer
                                    freeTraining
                                    theme={theme}
                                    onLoadingChange={setLoading}
                                    nextLevel={level}
                                />
                            </section>
                        </div>
                    </main>
                </div>

                <FooterBar theme={theme} />
            </div>
        </AppShell>
    );
}
