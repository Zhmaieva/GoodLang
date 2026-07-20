import React, { useEffect, useLayoutEffect, useState } from "react";
import AppShell from "../AppShell";
import Badge from "../Badge";
import ConjugationTable from "../ConjugationTable";
import Examples from "../Examples";
import Note from "../Note";
import Trainer from "../training/Trainer.jsx";
import { useLocation, useNavigate } from "react-router-dom";
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
import { APP_ACCENT_COLOR, APP_BACKGROUND_COLOR, LEARNED_STATUS_COLOR } from "../../theme.js";
import SiteHeader from "../SiteHeader.jsx";

export default function RulePage({ data, theme }) {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
    const BUTTON_OFFSET = 4;

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
    const location = useLocation();

    useLayoutEffect(() => {
        const scrollToPageStart = () => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        scrollToPageStart();
        requestAnimationFrame(scrollToPageStart);
    }, [location.pathname]);

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

    const FRAME_COLOR = theme?.accent ?? APP_ACCENT_COLOR;
    const FORMS_TABLE_COLOR = LEARNED_STATUS_COLOR;

    const SOFT_INNER = "transparent";

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
        alignItems: "flex-start",
        justifyContent: "center",
        padding: isMobile ? "16px 12px" : "48px 24px",
        background: theme?.bg ?? APP_BACKGROUND_COLOR,
    };

    const container = {
        maxWidth: 1100,
        width: "100%",
        padding: 0,
        margin: 0,
        border: "none",
        borderRadius: 0,
        background: theme?.bg ?? APP_BACKGROUND_COLOR,
        boxShadow: "none",
        boxSizing: "border-box",
    };

    const sectionsCanvas = {
        padding: 0,
    };

    const breadcrumbStyle = {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: isMobile ? 18 : 24,
        color: "#000",
        fontSize: isMobile ? "1rem" : "1.05rem",
        fontWeight: 400,
    };

    const breadcrumbButtonStyle = {
        appearance: "none",
        border: "none",
        background: "transparent",
        padding: 0,
        margin: 0,
        color: "#000",
        font: "inherit",
        fontWeight: 500,
        textDecoration: "underline",
        textUnderlineOffset: 3,
        cursor: "pointer",
    };

    const breadcrumbCurrentStyle = {
        color: "#000",
        fontWeight: 600,
    };

    const ruleContentStyle = {
        background: "transparent",
        border: "1px solid #000",
        borderRadius: 5,
        padding: isMobile ? 18 : 24,
        boxShadow: "none",
    };

    const getRuleSectionStyle = (isFirst) => ({
        borderTop: isFirst ? "none" : "1px solid #000",
        marginTop: isFirst ? 0 : isMobile ? 18 : 24,
        paddingTop: isFirst ? 0 : isMobile ? 18 : 24,
    });

    const SectionTitle = ({ children }) => (
        <div
            style={{
                margin: "4px 2px 10px",
                fontSize: isMobile ? 13 : 20,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                fontWeight: 900,
                color: "#000",
                fontFamily: 'var(--font-family-base)',
            }}
        >
            {children}
        </div>
    );

    const ruleBodyFontSize = isMobile ? 14 : 16;
    const mistakeWrongColor = theme?.bad ?? "#fe2f31";
    const mistakeCorrectColor = LEARNED_STATUS_COLOR;

    const textStyle = {
        fontSize: ruleBodyFontSize,
        lineHeight: 1.45,
        color: theme.text,
        fontFamily: 'var(--font-family-base)',
        fontWeight: 400,
    };

    const removeLeadingExampleIcon = (value) =>
        String(value ?? "").replace(/^[\p{Extended_Pictographic}\uFE0F]+\s*/u, "");

    const cleanMistakeText = (value) =>
        String(value ?? "")
            .replace(/❌|✅|×|✓/g, "")
            .replace(/<\/?(em|strong)>/g, "")
            .trim();

    const escapeHtml = (value) =>
        String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    const splitTrailingNote = (value) => {
        const match = String(value ?? "").match(/^(.*?)(\s+\([^)]*\))$/);
        return match ? { sentence: match[1], note: match[2] } : { sentence: value, note: "" };
    };

    const tokenizeForDiff = (value) =>
        String(value ?? "").match(/\s+|[\p{L}\p{N}’'-]+|[^\s\p{L}\p{N}]/gu) ?? [];

    const isWordToken = (token) => /[\p{L}\p{N}]/u.test(token);

    const getChangedWordIndexes = (source, target) => {
        const sourceWords = source
            .map((token, index) => ({ token, index }))
            .filter(({ token }) => isWordToken(token));
        const targetWords = target
            .map((token, index) => ({ token, index }))
            .filter(({ token }) => isWordToken(token));

        const matrix = Array.from({ length: sourceWords.length + 1 }, () =>
            Array(targetWords.length + 1).fill(0)
        );

        for (let i = sourceWords.length - 1; i >= 0; i -= 1) {
            for (let j = targetWords.length - 1; j >= 0; j -= 1) {
                if (sourceWords[i].token.toLowerCase() === targetWords[j].token.toLowerCase()) {
                    matrix[i][j] = matrix[i + 1][j + 1] + 1;
                } else {
                    matrix[i][j] = Math.max(matrix[i + 1][j], matrix[i][j + 1]);
                }
            }
        }

        const unchanged = new Set();
        let i = 0;
        let j = 0;

        while (i < sourceWords.length && j < targetWords.length) {
            if (sourceWords[i].token.toLowerCase() === targetWords[j].token.toLowerCase()) {
                unchanged.add(sourceWords[i].index);
                i += 1;
                j += 1;
            } else if (matrix[i + 1][j] >= matrix[i][j + 1]) {
                i += 1;
            } else {
                j += 1;
            }
        }

        return new Set(sourceWords.map(({ index }) => index).filter((index) => !unchanged.has(index)));
    };

    const highlightChangedWords = (value, comparisonValue, highlightColor) => {
        const tokens = tokenizeForDiff(value);
        const comparisonTokens = tokenizeForDiff(comparisonValue);
        const changedIndexes = getChangedWordIndexes(tokens, comparisonTokens);

        return tokens
            .map((token, index) => {
                const escaped = escapeHtml(token);
                return changedIndexes.has(index)
                    ? `<strong style="color: ${highlightColor}">${escaped}</strong>`
                    : escaped;
            })
            .join("");
    };

    const formatMistakeBullet = (bullet) => {
        const raw = String(bullet ?? "");

        if (!/[❌✅×✓]/u.test(raw)) {
            return raw;
        }

        const parts = raw.split("→");
        const correctIndex = parts.findIndex((part, index) => index > 0 && /[✅✓]/u.test(part));

        if (correctIndex !== -1) {
            const wrong = cleanMistakeText(parts.slice(0, correctIndex).join(" → "));
            const correct = cleanMistakeText(parts.slice(correctIndex).join(" → "));
            const { sentence: correctSentence, note: correctNote } = splitTrailingNote(correct);
            const { sentence: wrongSentence, note: wrongNote } = splitTrailingNote(wrong);

            const wrongHtml =
                highlightChangedWords(wrongSentence, correctSentence, mistakeWrongColor) + escapeHtml(wrongNote);
            const correctHtml =
                highlightChangedWords(correctSentence, wrongSentence, mistakeCorrectColor) + escapeHtml(correctNote);

            return `<span style="font-weight: 350">× ${wrongHtml}</span> → <span style="font-weight: 400">✓ ${correctHtml}</span>`;
        }

        return `<span style="font-weight: 350">× ${cleanMistakeText(raw)}</span>`;
    };

    const renderSection = (section) => {
        switch (section.type) {
            case "meaning":
                return (
                    <>
                        <SectionTitle>{section.title}</SectionTitle>
                        <p style={textStyle} dangerouslySetInnerHTML={{ __html: section.html }} />
                    </>
                );

            case "form":
            case "clarification":
            case "short_answers":
                return (
                    <>
                        <SectionTitle>{section.title}</SectionTitle>
                        <div style={textStyle} dangerouslySetInnerHTML={{ __html: section.html }} />
                    </>
                );

            case "usage":
                return (
                    <>
                        <SectionTitle>{section.title}</SectionTitle>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {section.badges.map((b, i) => (
                                <Badge
                                    key={i}
                                    theme={theme}
                                    borderColor={theme.warn}
                                    fontSize={ruleBodyFontSize}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: removeLeadingExampleIcon(b) }} />
                                </Badge>
                            ))}
                        </div>
                        {section.hint && (
                            <p
                                style={{
                                    color: "#000",
                                    fontSize: ruleBodyFontSize,
                                    marginTop: 8,
                                    fontFamily: 'var(--font-family-base)',
                                    fontWeight: 400,
                                }}
                                dangerouslySetInnerHTML={{ __html: section.hint }}
                            />
                        )}
                    </>
                );

            case "forms":
                return (
                    <>
                        <SectionTitle>{section.title}</SectionTitle>

                        {/* optional soft inner surface behind the table for the same feel as inputs */}
                        <div
                            style={{
                                background: SOFT_INNER,
                                border: `2px solid ${FORMS_TABLE_COLOR}`,
                                borderRadius: 5,
                                padding: 0,
                                overflow: "hidden",
                                boxShadow: "none",
                            }}
                        >
                            <ConjugationTable
                                theme={{ ...theme, accent: FORMS_TABLE_COLOR }}
                                headers={section.headers}
                                rows={section.rows}
                                headerBackground={FORMS_TABLE_COLOR}
                                headerColor={APP_BACKGROUND_COLOR}
                                fontSize={ruleBodyFontSize}
                            />
                        </div>

                        {section.hint && (
                            <div
                                style={{
                                    color: "#000",
                                    fontSize: ruleBodyFontSize,
                                    marginTop: 8,
                                    fontFamily: 'var(--font-family-base)',
                                    fontWeight: 400,
                                }}
                                dangerouslySetInnerHTML={{ __html: section.hint }}
                            />
                        )}
                    </>
                );

            case "examples":
                return (
                    <>
                        <SectionTitle>{section.title}</SectionTitle>
                        <Examples theme={theme} items={section.items} fontSize={ruleBodyFontSize} />
                    </>
                );

            case "mistakes":
                return (
                    <>
                        <SectionTitle>{section.title}</SectionTitle>
                        <ul
                            style={{
                                ...textStyle,
                                listStyle: "none",
                                paddingLeft: 0,
                                marginTop: 8,
                                marginBottom: 0,
                            }}
                        >
                            {section.bullets?.map((b, i) => (
                                <li
                                    key={i}
                                    style={{ marginBottom: 6 }}
                                    dangerouslySetInnerHTML={{ __html: formatMistakeBullet(b) }}
                                />
                            ))}
                        </ul>
                        {section.note && (
                            <div style={{ marginTop: 10 }}>
                                <Note theme={theme} borderColor={theme.bad} fontSize={ruleBodyFontSize}>
                                    <span dangerouslySetInnerHTML={{ __html: section.note }} />
                                </Note>
                            </div>
                        )}
                    </>
                );

            case "trainer":
                return <Trainer notFocused nextRule={data.id} theme={theme} />;

            default:
                return null;
        }
    };

    const showPrintButton = !featureToggleService.get(featureToggleService.FEATURE_NAME.LOCALIZATION);

    return (
        <AppShell theme={theme} noPadding>
            <div style={pageLayoutStyle}>
                <SiteHeader theme={theme} />
                <div style={pageShellStyle}>
                    <main style={container}>
                <nav style={breadcrumbStyle} aria-label="Breadcrumb">
                    <button
                        type="button"
                        style={breadcrumbButtonStyle}
                        onClick={() => navigate("/trainer")}
                    >
                        Trainer
                    </button>
                    <span>/</span>
                    <button
                        type="button"
                        style={breadcrumbButtonStyle}
                        onClick={handleAnalyticsClick}
                    >
                        Rules
                    </button>
                    <span>/</span>
                    <span style={breadcrumbCurrentStyle} aria-current="page">
                        {data.title}
                    </span>
                </nav>

                <div style={sectionsCanvas}>
                    <section style={ruleContentStyle}>
                        {data.sections
                            .map((section) => ({ section, rendered: renderSection(section) }))
                            .filter(({ rendered }) => rendered)
                            .map(({ section, rendered }, i) => (
                                <div key={`${section.type}-${i}`} style={getRuleSectionStyle(i === 0)}>
                                    {rendered}
                                </div>
                            ))}
                    </section>
                </div>

                    </main>
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
