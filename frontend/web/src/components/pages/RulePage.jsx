import React, { useEffect, useState } from "react";
import AppShell from "../AppShell";
import BrandHeader from "../BrandHeader";
import Badge from "../Badge";
import ConjugationTable from "../ConjugationTable";
import Examples from "../Examples";
import Note from "../Note";
import Trainer from "../training/Trainer.jsx";
import { useNavigate } from "react-router-dom";
import FooterBar from "../FooterBar.jsx";
import { callAccountInfoApi, callAccountVerifyApi, dowloadPdf } from "../../services/api.js";
import { logError } from "../../services/logger.js";
import CookieConsentModal from "../modals/CookieConsentModal.jsx";
import { acceptCookies, getCookieConsent, rejectCookies } from "../../services/settingsService.js";
import { ensureAnalytics, trackPageView } from "../../services/gaService.js";
import { ACTION_TYPES } from "../../utils/constants.js";
import { getPdfDownloads, setPdfDownloads } from "../../services/dataService.js";

// ✅ Pdf type modal
import PdfTypeModal from "../modals/PdfTypeModal.jsx";
import {featureToggleService} from "../../services/featureToggleService.js";
import TermsOfUseModal from "../subscription/TermsOfUseModal.jsx";

export default function RulePage({ data, theme }) {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 600;

    const [account, setAccount] = useState(null);
    const [hover, setHover] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [cookieOpen, setCookieOpen] = useState(false);
    const [touOpen, setTouOpen] = useState(false);

    // ✅ PdfType modal state (same pattern as RulesTable)
    const [pdfTypeModalOpen, setPdfTypeModalOpen] = useState(false);
    const [pendingRule, setPendingRule] = useState(null);
    const [pendingRuleLabel, setPendingRuleLabel] = useState("PDF");

    const autoDownloadRanRef = React.useRef(false);
    const [goToAnalytics, setGoToAnalytics] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadAccountInfo().then();
    }, []);

    const loadAccountInfo = async () => {
        const acc = await callAccountInfoApi();
        setAccount(acc);
    };

    function clearRuleToDownloadFromUrl() {
        try {
            const url = new URL(window.location.href);
            url.searchParams.delete("ruleToDownload");
            url.searchParams.delete("pdf_type");
            window.history.replaceState({}, "", url.pathname + url.search + url.hash);
        } catch (_) {}
    }

    function getDownloadFromUrl() {
        try {
            const u = new URL(window.location.href);
            const rule = u.searchParams.get("ruleToDownload");
            const pdfType = u.searchParams.get("pdf_type") || "translations";
            return { rule, pdfType };
        } catch (_) {
            return { rule: null, pdfType: "translations" };
        }
    }

    // ✅ URL-triggered auto-download: skip modal completely (like RulesTable)
    useEffect(() => {
        if (autoDownloadRanRef.current) return;

        const { rule: urlRule, pdfType: urlPdfType } = getDownloadFromUrl();
        if (!urlRule) return;

        autoDownloadRanRef.current = true;

        // start immediately (no modal)
        startDownload(urlRule, urlPdfType).then();

        clearRuleToDownloadFromUrl();
    }, []);

    const handleAnalyticsClick = async () => {
        if (!getCookieConsent()) {
            setGoToAnalytics(true);
            setCookieOpen(true);
            await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);
            return;
        }
        navigate("/analytics");
    };

    async function startDownload(ruleId, pdfType) {
        setIsDownloading(true);

        try {
            await dowloadPdf(ruleId, pdfType);

            const downloadsNumber = getPdfDownloads();
            setPdfDownloads(downloadsNumber + 1);
        } catch (err) {
            logError(err);
        } finally {
            setIsDownloading(false);
        }
    }

    const onPrintClick = async (e, ruleId) => {
        e?.stopPropagation();

        if (isDownloading) return;

        loadAccountInfo().then();

        // ✅ open PdfTypeModal instead of direct download
        setPendingRule(ruleId);
        setPendingRuleLabel(data?.title || ruleId);
        setPdfTypeModalOpen(true);
    };

    // ----- Styling tokens aligned with NON-header AccuracyKpi / TaskCard -----
    const CARD_BG = "rgba(255, 243, 223, 0.92)";
    const CARD_BORDER = "rgba(255,97,56,0.65)";
    const CARD_SHADOW = "0 10px 26px rgba(0,0,0,0.12)";

    const SOFT_INNER = "rgba(255, 250, 243, 0.92)";
    const SOFT_STROKE = "rgba(0,0,0,0.12)";

    const container = {
        maxWidth: 980,
        width: "100%",
        padding: isMobile ? "20px 0px 60px" : "36px 20px 80px",
        margin: "0 auto",
    };

    // ✅ a subtle canvas behind all sections so cards feel cohesive
    const sectionsCanvas = {
        borderRadius: 22,
        padding: isMobile ? 0 : 12,
        //background: "rgba(0,0,0,0.02)",
    };

    // ✅ local card style for this page only (no need to touch global Card.jsx)
    const SurfaceCard = ({ children }) => (
        <div
            style={{
                background: CARD_BG,
                border: `2px solid ${CARD_BORDER}`,
                borderRadius: 20,
                boxShadow: CARD_SHADOW,
                padding: isMobile ? 14 : 18,
            }}
        >
            {children}
        </div>
    );

    const SectionTitle = ({ children }) => (
        <div
            style={{
                margin: "4px 2px 10px",
                fontSize: isMobile ? 13 : 14,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                fontWeight: 900,
                color: theme.text,
                opacity: 0.9,
                fontFamily: "Nunito, system-ui, sans-serif",
            }}
        >
            {children}
        </div>
    );

    const textStyle = {
        fontSize: isMobile ? 14 : 15,
        lineHeight: 1.45,
        color: theme.text,
        fontFamily: "Nunito, system-ui, sans-serif",
        fontWeight: 700,
        opacity: 0.95,
    };

    const renderSection = (section) => {
        switch (section.type) {
            case "meaning":
                return (
                    <SurfaceCard>
                        <SectionTitle>{section.title}</SectionTitle>
                        <p style={textStyle} dangerouslySetInnerHTML={{ __html: section.html }} />
                    </SurfaceCard>
                );

            case "usage":
                return (
                    <SurfaceCard>
                        <SectionTitle>{section.title}</SectionTitle>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
                                    marginTop: 8,
                                    fontFamily: "Nunito, system-ui, sans-serif",
                                    fontWeight: 700,
                                    opacity: 0.9,
                                }}
                                dangerouslySetInnerHTML={{ __html: section.hint }}
                            />
                        )}
                    </SurfaceCard>
                );

            case "forms":
                return (
                    <SurfaceCard>
                        <SectionTitle>{section.title}</SectionTitle>

                        {/* optional soft inner surface behind the table for the same feel as inputs */}
                        <div
                            style={{
                                background: SOFT_INNER,
                                border: `2px solid ${SOFT_STROKE}`,
                                borderRadius: 16,
                                padding: isMobile ? 10 : 12,
                                boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                            }}
                        >
                            <ConjugationTable theme={theme} headers={section.headers} rows={section.rows} />
                        </div>

                        {section.hint && (
                            <div
                                style={{
                                    color: theme.muted,
                                    fontSize: isMobile ? 12 : 13,
                                    marginTop: 8,
                                    fontFamily: "Nunito, system-ui, sans-serif",
                                    fontWeight: 700,
                                    opacity: 0.9,
                                }}
                                dangerouslySetInnerHTML={{ __html: section.hint }}
                            />
                        )}
                    </SurfaceCard>
                );

            case "examples":
                return (
                    <SurfaceCard>
                        <SectionTitle>{section.title}</SectionTitle>
                        <Examples theme={theme} items={section.items} />
                    </SurfaceCard>
                );

            case "mistakes":
                return (
                    <SurfaceCard>
                        <SectionTitle>{section.title}</SectionTitle>
                        <ul style={{ ...textStyle, paddingLeft: 20, marginTop: 8 }}>
                            {section.bullets?.map((b, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                            ))}
                        </ul>
                        {section.note && (
                            <div style={{ marginTop: 10 }}>
                                <Note theme={theme}>
                                    <span dangerouslySetInnerHTML={{ __html: section.note }} />
                                </Note>
                            </div>
                        )}
                    </SurfaceCard>
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

    const iconBtn = () => ({
        maxWidth: 480,
        gap: 8,
        cursor: isDownloading ? "default" : "pointer",
        opacity: isDownloading ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
    });

    return (
        <AppShell theme={theme}>
            <div style={container}>
                <BrandHeader
                    theme={theme}
                    title={"GoodLang"}
                    subtitle={<>{data.title}</>}
                    right={
                        <>
                            <button
                                style={{
                                    appearance: "none",
                                    padding: "10px 14px",
                                    display: featureToggleService.get(featureToggleService.FEATURE_NAME.LOCALIZATION) ? 'none' : "flex",
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
                                    maxWidth: 280,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    transform: !isDownloading && hover === "print" ? "translateY(1px)" : "none",
                                    filter: !isDownloading && hover === "print" ? "brightness(0.95)" : "none",
                                    transition: "transform 120ms ease, filter 120ms ease",
                                }}
                            >
                                <div
                                    key={"print"}
                                    onMouseEnter={() => setHover("print")}
                                    onMouseLeave={() => setHover(null)}
                                    onClick={(e) => onPrintClick(e, data.id)}
                                    style={iconBtn()}
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
                                            animation: isDownloading ? "spin-pause .9s cubic-bezier(0.4, 0.0, 0.2, 1) infinite" : "none",
                                            transformOrigin: "50% 50%",
                                        }}
                                    />

                                    <div>{!isDownloading ? "Print tasks" : "Preparing document..."}</div>
                                </div>
                            </button>

                            <button
                                style={{
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
                                    maxWidth: 280,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    transition: "transform 120ms ease, filter 120ms ease",
                                }}
                                onClick={handleAnalyticsClick}
                            >
                                ← Back to rules
                            </button>
                        </>
                    }
                />

                <div style={sectionsCanvas}>
                    <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {data.sections.map((section, i) => (
                            <div key={i}>{renderSection(section)}</div>
                        ))}
                    </section>
                </div>

                <FooterBar theme={theme} />
            </div>

            {/* ✅ Pdf type choose modal */}
            <PdfTypeModal
                account={account}
                open={pdfTypeModalOpen}
                theme={theme}
                ruleLabel={pendingRuleLabel}
                defaultValue={"translations"}
                ruleToDownload={pendingRule}
                onClose={() => {
                    if (isDownloading) return;
                    setPdfTypeModalOpen(false);
                    setPendingRule(null);
                }}
                onConfirm={async (pdfType) => {
                    if (!pendingRule) return;

                    setPdfTypeModalOpen(false);
                    await startDownload(pendingRule, pdfType);

                    setPendingRule(null);
                }}
            />

            {touOpen && (
                <TermsOfUseModal
                    readOnly
                    theme={theme}
                    onClose={() => {
                        setTouOpen(false);
                        setCookieOpen(true);
                    }}
                />
            )}

            {cookieOpen && !touOpen && (
                <CookieConsentModal
                    theme={theme}
                    onAccept={async () => {
                        setCookieOpen(false);
                        acceptCookies();
                        ensureAnalytics();
                        trackPageView(window.location.pathname);

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_ACCEPT_COOKIES);

                        if (goToAnalytics) await handleAnalyticsClick();
                    }}
                    onReject={async () => {
                        setCookieOpen(false);
                        rejectCookies();

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_REJECT_COOKIES);

                        if (goToAnalytics) await handleAnalyticsClick();
                    }}
                    onOpenPolicy={async () => {
                        setCookieOpen(false);
                        setTouOpen(true);
                        await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_TOU);
                    }}
                />
            )}
        </AppShell>
    );
}
