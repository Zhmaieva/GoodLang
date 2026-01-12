import React, {useEffect, useState} from "react";
import AppShell from "../AppShell";
import BrandHeader from "../BrandHeader";
import Card from "../Card";
import Badge from "../Badge";
import ConjugationTable from "../ConjugationTable";
import Examples from "../Examples";
import Note from "../Note";
import Trainer from "../training/Trainer.jsx";
import {useNavigate} from "react-router-dom";
import FooterBar from "../FooterBar.jsx";
import {callAccountInfoApi, callAccountVerifyApi, dowloadPdf} from "../../services/api.js";
import {logError} from "../../services/logger.js";
import DownloadLimitModal from "../subscription/DownloadLimitModal.jsx";
import CookieConsentModal from "../modals/CookieConsentModal.jsx";
import {acceptCookies, getCookieConsent, rejectCookies} from "../../services/settingsService.js";
import {ensureAnalytics, trackMetaEvent, trackPageView} from "../../services/gaService.js";
import {ACTION_TYPES} from "../../utils/constants.js";

export default function RulePage({ data, theme }) {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 600;

    const [account, setAccount] = useState(null);

    const [hover, setHover] = useState(null);
    const [hoverRow, setHoverRow] = useState(null);

    const [isDownloading, setIsDownloading] = useState(false);

    const [cookieOpen, setCookieOpen] = useState(false);
    const [signUpModalOpen, setSignUpModalOpen] = useState(false);
    const [ruleToDownload, setRuleToDownload] = useState(null);

    const autoDownloadRanRef = React.useRef(false);

    const [goToAnalytics, setGoToAnalytics] = useState(false);

    function clearRuleToDownloadFromUrl() {
        try {
            const url = new URL(window.location.href);
            url.searchParams.delete("ruleToDownload");
            window.history.replaceState({}, "", url.pathname + url.search + url.hash);
        } catch (_) {}
    }

    useEffect(() => {
        // run once
        if (autoDownloadRanRef.current) return;

        // pick rule id from state OR from URL
        const urlRule = (() => {
            try {
                return new URL(window.location.href).searchParams.get("ruleToDownload");
            } catch (_) {
                return null;
            }
        })();

        const ruleId = ruleToDownload || urlRule;
        if (!ruleId) return;

        // if user is not logged in, let your modal flow handle it (don't auto-trigger here)
        if (!account?.email) return;

        autoDownloadRanRef.current = true;

        // trigger download
        onPrintClick(null, ruleId).then();

        // clear URL + state so it won't repeat on re-render
        clearRuleToDownloadFromUrl();
        setRuleToDownload(null);
    }, [ruleToDownload, account]);

    useEffect(() => {
        loadAccountInfo().then();
    }, []);

    const loadAccountInfo = async () => {
        const account = await callAccountInfoApi();
        setAccount(account);
    }

    const container = {
        maxWidth: 980,
        width: "100%",
        padding: isMobile ? "20px 14px 60px" : "36px 20px 80px",
        margin: "0 auto"
    };

    const SectionTitle = ({ children }) => (
        <div
            style={{
                margin: "4px 2px 8px",
                fontSize: isMobile ? 15 : 16,
                letterSpacing: ".05em",
                textTransform: "uppercase",
                fontWeight: 800
            }}
        >
            {children}
        </div>
    );

    const textStyle = {
        fontSize: isMobile ? 14 : 15,
        lineHeight: 1.45
    };

    const renderSection = (section) => {
        switch (section.type) {

            case "meaning":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <p style={textStyle} dangerouslySetInnerHTML={{ __html: section.html }} />
                    </Card>
                );

            case "usage":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                                flexWrap: "wrap",
                            }}
                        >
                            {section.badges.map((b, i) => (
                                <Badge key={i} theme={theme}>
                                    <span dangerouslySetInnerHTML={{ __html: b }} />
                                </Badge>
                            ))}
                        </div>
                        {section.hint && (
                            <p
                                style={{
                                    color: theme.muted,
                                    fontSize: isMobile ? 12 : 13,
                                    marginTop: 6
                                }}
                                dangerouslySetInnerHTML={{ __html: section.hint }}
                            />
                        )}
                    </Card>
                );

            case "forms":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <ConjugationTable
                            theme={theme}
                            headers={section.headers}
                            rows={section.rows}
                        />
                        {section.hint && (
                            <div
                                style={{
                                    color: theme.muted,
                                    fontSize: isMobile ? 12 : 13,
                                    marginTop: 6
                                }}
                                dangerouslySetInnerHTML={{ __html: section.hint }}
                            />
                        )}
                    </Card>
                );

            case "examples":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <Examples
                            theme={theme}
                            items={section.items}
                        />
                    </Card>
                );

            case "mistakes":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>

                        <ul style={{ ...textStyle, paddingLeft: 20 }}>
                            {section.bullets?.map((b, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                            ))}
                        </ul>

                        {section.note && (
                            <Note theme={theme}>
                                <span dangerouslySetInnerHTML={{ __html: section.note }} />
                            </Note>
                        )}
                    </Card>
                );

            case "trainer":
                return (
                    <>
                        <SectionTitle>{section.title}</SectionTitle>
                        <Trainer notFocused nextRule={data.id} theme={theme} />
                    </>
                );

            default:
                return null;
        }
    };

    const navigate = useNavigate();
    const handleAnalyticsClick = async () => {
        if (!getCookieConsent()) {
            setGoToAnalytics(true);
            setCookieOpen(true);
            await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);

            return;
        }

        navigate('/analytics')
    };

    const onPrintClick = async (e, ruleName) => {
        e?.stopPropagation();

        setIsDownloading(true);

        if (!account?.email) {
            setRuleToDownload(ruleName);
            setSignUpModalOpen(true);
            return;
        }

        try {
            await dowloadPdf(ruleName);
        } catch (err) {
            logError(err);
        } finally {
            setIsDownloading(false);
        }
    }

    const iconBtn = (isHover) => ({
        //marginTop: 6,
        maxWidth: 480,
        //height: "100%",
        gap: 8,
        cursor: isDownloading ? "default" : "pointer",
        opacity: isDownloading ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
    })

    return (
        <AppShell theme={theme}>
            <div style={container}>
                <BrandHeader
                    theme={theme}
                    title={"GoodLang"}
                    subtitle={<>{data.title}</>}
                    right={
                        <>
                            <button style={{
                                appearance: "none",
                                padding: "10px 14px",
                                fontWeight: 800,
                                fontSize: "0.95rem",
                                lineHeight: 1,
                                borderRadius: 999,
                                cursor: "pointer",

                                background: theme.green ?? "#4ba36e",
                                color: "#fff",
                                border: "2px solid rgba(0,0,0,0.12)",
                                boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
                                fontFamily: "Nunito, system-ui, sans-serif",

                                /* 👇 REQUIRED for ellipsis */
                                maxWidth: 280,              // ← adjust (px) to fit your layout
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",

                                transform: !isDownloading && hover === "print" ? "translateY(1px)" : "none",
                                filter: !isDownloading && hover === "print" ? "brightness(0.95)" : "none",
                                transition: "transform 120ms ease, filter 120ms ease",
                            }} onClick={handleAnalyticsClick}>
                                <div
                                    key={"print"}
                                    onMouseEnter={() => setHover("print")}
                                    onMouseLeave={() => setHover(null)}
                                    onClick={(e) => onPrintClick(e, data.id)}
                                    style={iconBtn("print" === hover, true)}
                                    title="Друкувати правило"
                                >
                                    <div
                                        aria-label={isDownloading ? "Loading" : "Print"}
                                        style={{
                                            width: 16,
                                            height: 16,
                                            backgroundColor: "white",
                                            WebkitMask: `url(${isDownloading ? "/loading-icon.svg" : "/print-icon.svg"}) no-repeat center / contain`,
                                            mask: `url(${isDownloading ? "/loading-icon.svg" : "/print-icon.svg"}) no-repeat center / contain`,
                                            animation: isDownloading
                                                ? "spin-pause .9s cubic-bezier(0.4, 0.0, 0.2, 1) infinite"
                                                : "none",
                                            transformOrigin: "50% 50%",
                                        }}
                                    />

                                    <div>
                                        {!isDownloading ? "Роздрукувати завдання" : "Готую документ..."}
                                    </div>

                                </div>
                            </button>

                            <button style={{
                                appearance: "none",
                                padding: "10px 14px",
                                fontWeight: 800,
                                fontSize: "0.95rem",
                                lineHeight: 1,
                                borderRadius: 999,
                                cursor: "pointer",

                                background: theme.accent ?? "#4ba36e",
                                color: "#fff",
                                border: "2px solid rgba(0,0,0,0.12)",
                                boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
                                fontFamily: "Nunito, system-ui, sans-serif",

                                /* 👇 REQUIRED for ellipsis */
                                maxWidth: 280,              // ← adjust (px) to fit your layout
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",

                                transition: "transform 120ms ease, filter 120ms ease",
                            }} onClick={handleAnalyticsClick}>
                                ← До списку правил
                            </button>
                        </>
                    }
                />

                <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {data.sections.map((section, i) => (
                        <div key={i}>{renderSection(section)}</div>
                    ))}
                </section>

                <FooterBar theme={theme} />
            </div>

            <DownloadLimitModal
                ruleToDownload={ruleToDownload}
                theme={theme} open={signUpModalOpen}
                onClose={() => {
                    setSignUpModalOpen(false);
                    setIsDownloading(false);
            }}/>

            {cookieOpen && (
                <CookieConsentModal
                    theme={theme}
                    onAccept={async () => {
                        setCookieOpen(false);
                        acceptCookies();
                        ensureAnalytics();
                        trackPageView(window.location.pathname);

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_ACCEPT_COOKIES);

                        if (goToAnalytics)
                            await handleAnalyticsClick()
                    }}
                    onReject={async () => {
                        setCookieOpen(false);
                        rejectCookies();

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_REJECT_COOKIES);

                        if (goToAnalytics)
                            await handleAnalyticsClick()
                    }}
                />
            )}
        </AppShell>
    );
}
