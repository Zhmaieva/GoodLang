import React, { useState, useEffect, useMemo } from "react";
import {logError, logInfo} from "../../services/logger.js";
import {dowloadPdf} from "../../services/api.js";
import PdfTypeModal from "../modals/PdfTypeModal.jsx";
import {getPdfDownloads, setPdfDownloads} from "../../services/dataService.js";
import {featureToggleService} from "../../services/featureToggleService.js";
import Pagination from "../Pagination.jsx";
import {
    APP_ACCENT_COLOR,
    APP_BACKGROUND_COLOR,
    APP_BORDER_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
} from "../../theme.js";
import { CaretDown, CaretUp, Printer, SpinnerGap } from "@phosphor-icons/react";

export default function RulesTable({
                                       account,
                                       rows,
                                       pct,
                                       statusOf,
                                       fmtDate,
                                       fmtLastPractice = fmtDate,
                                       onRowClick,
                                       theme,
                                       advanced = true
                                   }) {
    const ROWS_PER_PAGE = 12;

    const LEVEL_MAP = {
        A1: { label: "Beginner" },
        A2: { label: "Intermediate" },
        B1: { label: "Intermediate" },
        B2: { label: "Advanced" },
    };

    // Hidden sort order (lower -> higher)
    const LEVEL_ORDER = { A1: 1, A2: 2, B1: 3, B2: 4 };

    const [isMobile, setIsMobile] = useState(false);

    const [sortKey, setSortKey] = useState("level");
    const [sortDir, setSortDir] = useState("asc");
    const [page, setPage] = useState(1);

    const scrollRef = React.useRef(null);
    const rowRefs = React.useRef({});

    const [hover, setHover] = useState(null);
    const [hoverRow, setHoverRow] = useState(null);

    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadingRow, setDownloadingRow] = useState(null);

    // NEW modal state
    const [pdfTypeModalOpen, setPdfTypeModalOpen] = useState(false);
    const [pendingRule, setPendingRule] = useState(null);
    const [pendingIdx, setPendingIdx] = useState(null);
    const [pendingRuleLabel, setPendingRuleLabel] = useState("PDF");

    const autoDownloadRanRef = React.useRef(false);

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
            logInfo(u);
            const rule = u.searchParams.get("ruleToDownload");
            const pdfType = u.searchParams.get("pdf_type") || "translations";
            return { rule, pdfType };
        } catch (_) {
            return { rule: null, pdfType: "translations" };
        }
    }

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const toggleSort = (key) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const getSortValue = (r, key) => {
        switch (key) {
            case "level":
                return LEVEL_ORDER[r.level] ?? 999;

            case "ruleName":
                return String(r.ruleName ?? "").toLowerCase();

            case "accuracy":
                return Number.isFinite(r.accuracy) ? r.accuracy : -1;

            case "attempts":
                return Number.isFinite(r.attemptsNumber) ? r.attemptsNumber : -1;

            case "lastPractice":
                return r.lastAttemptDate ? new Date(r.lastAttemptDate).getTime() : 0;

            case "status":
                return r.attemptsNumber > 0 && Number.isFinite(r.accuracy) ? r.accuracy : -1;

            default:
                return 0;
        }
    };

    const sortedRows = useMemo(() => {
        const dir = sortDir === "asc" ? 1 : -1;
        const list = [...rows];

        list.sort((a, b) => {
            const av = getSortValue(a, sortKey);
            const bv = getSortValue(b, sortKey);

            if (typeof av === "number" && typeof bv === "number") {
                if (av !== bv) return (av - bv) * dir;
            } else {
                if (av < bv) return -1 * dir;
                if (av > bv) return 1 * dir;
            }

            // TIE-BREAKERS
            const aL = LEVEL_ORDER[a.level] ?? 999;
            const bL = LEVEL_ORDER[b.level] ?? 999;
            if (aL !== bL) return aL - bL;

            const an = String(a.ruleName ?? "").toLowerCase();
            const bn = String(b.ruleName ?? "").toLowerCase();
            if (an < bn) return -1;
            if (an > bn) return 1;

            return 0;
        });

        return list;
    }, [rows, sortKey, sortDir, statusOf]);

    const totalPages = Math.max(1, Math.ceil(sortedRows.length / ROWS_PER_PAGE));

    const paginatedRows = useMemo(() => {
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * ROWS_PER_PAGE;
        return sortedRows.slice(start, start + ROWS_PER_PAGE);
    }, [page, sortedRows, totalPages]);

    useEffect(() => {
        setPage(1);
    }, [rows, sortKey, sortDir]);

    useEffect(() => {
        setPage((currentPage) => Math.min(currentPage, totalPages));
    }, [totalPages]);

    const barColor = theme?.accent ?? APP_ACCENT_COLOR;
    const surface = theme?.surface ?? APP_SURFACE_COLOR;
    const border = theme?.border ?? APP_BORDER_COLOR;
    const text = theme?.text ?? APP_TEXT_COLOR;
    const muted = theme?.muted ?? APP_MUTED_TEXT_COLOR;

    const ArrowPair = ({ columnKey }) => {
        const active = sortKey === columnKey;
        const upOpacity = active && sortDir === "asc" ? 1 : 0.25;
        const downOpacity = active && sortDir === "desc" ? 1 : 0.25;

        return (
            <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 0.9, marginLeft: 6 }}>
        <CaretUp size={12} weight="fill" style={{ opacity: upOpacity }} />
        <CaretDown size={12} weight="fill" style={{ opacity: downOpacity }} />
      </span>
        );
    };

    const headerBtnStyle = {
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        userSelect: "none",
        fontWeight: 800,
        fontFamily: 'var(--font-family-base)',
        color: muted,
        pointerEvents: "auto",
    };

    const iconBtn = (isHover) => ({
        marginTop: 6,
        width: advanced ? 16 : "100%",
        height: 16,
        cursor: isDownloading ? "default" : "pointer",
        opacity: isDownloading ? 0.5 : 1,
        display: featureToggleService.get(featureToggleService.FEATURE_NAME.LOCALIZATION) ? 'none' : "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: !isDownloading && isHover ? "scale(1.4)" : "none",
        filter: !isDownloading && isHover ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
    });

    const row = (isHover) => ({
        cursor: "pointer",
        userSelect: "none",
        background: isHover ? "#faf9ff" : surface,
        transition: "background-color 120ms ease",
    });

    const DownloadIcon = ({ idx, size }) => {
        const downloading = downloadingRow === idx;

        return downloading ? (
            <SpinnerGap
                size={size}
                weight="bold"
                aria-label="Loading"
                style={{
                    display: "block",
                    animation: "spin-pause .9s cubic-bezier(0.4, 0.0, 0.2, 1) infinite",
                    transformOrigin: "50% 50%",
                }}
            />
        ) : (
            <Printer size={size} weight="bold" aria-label="Print" style={{ display: "block" }} />
        );
    };

    function scrollRowToTop(idx, topOffset = 0) {
        const container = scrollRef.current;
        const rowEl = rowRefs.current[idx];
        if (!container || !rowEl) return;

        const cRect = container.getBoundingClientRect();
        const rRect = rowEl.getBoundingClientRect();

        let targetTop = (rRect.top - cRect.top) + container.scrollTop - topOffset;

        const maxTop = container.scrollHeight - container.clientHeight;
        if (targetTop < 0) targetTop = 0;
        if (targetTop > maxTop) targetTop = maxTop;

        container.scrollTo({ top: targetTop, behavior: "smooth" });
    }

    async function startDownload(ruleId, idx, pdfType) {
        setIsDownloading(true);
        setDownloadingRow(idx);

        try {
            await dowloadPdf(ruleId, pdfType);

            setPdfDownloads(getPdfDownloads() + 1);
        } catch (err) {
            logError(err);
        } finally {
            setIsDownloading(false);
            setDownloadingRow(null);
        }
    }

    // URL-triggered auto-download: skip modal completely
    useEffect(() => {
        if (autoDownloadRanRef.current) return;

        const { rule: urlRule, pdfType: urlPdfType } = getDownloadFromUrl();
        if (!urlRule) return;

        if (!sortedRows?.length) return;

        const idx = sortedRows.findIndex(r => r.rule === urlRule);
        if (idx === -1) {
            clearRuleToDownloadFromUrl();
            autoDownloadRanRef.current = true;
            return;
        }

        autoDownloadRanRef.current = true;
        setPage(Math.floor(idx / ROWS_PER_PAGE) + 1);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scrollRowToTop(idx % ROWS_PER_PAGE, 0);
            });
        });

        // ✅ start immediately from URL (no modal)
        startDownload(urlRule, idx, urlPdfType).then();

        // clear URL so it won't repeat
        clearRuleToDownloadFromUrl();
    }, [sortedRows]);

    const onPrintClick = async (e, idx, ruleId, ruleNameHuman) => {
        e?.stopPropagation();

        if (isDownloading) return;

        // open modal instead of downloading immediately
        setPendingRule(ruleId);
        setPendingIdx(idx);
        setPendingRuleLabel(ruleNameHuman || ruleId);
        setPdfTypeModalOpen(true);
    };

    return (
        <div className="table" style={{
            height: "100%",
            background: surface,
            border: `1px solid ${border}`,
            borderRadius: 18,
            boxShadow: "0 16px 44px rgba(31, 36, 54, 0.06)",
            overflow: "hidden",                           // clips header corners cleanly
            fontFamily: 'var(--font-family-base)',
            color: text,
        }} aria-live="polite">
            {!isMobile && (
                <div className="thead">
                    <div style={headerBtnStyle} onClick={() => toggleSort("level")} role="button" tabIndex={0}>
                        Rule (Level) <ArrowPair columnKey="level" />
                    </div>

                    <div style={headerBtnStyle} onClick={() => toggleSort("accuracy")} role="button" tabIndex={0}>
                        Accuracy <ArrowPair columnKey="accuracy" />
                    </div>

                    <div style={headerBtnStyle} onClick={() => toggleSort("attempts")} role="button" tabIndex={0}>
                        Attempts <ArrowPair columnKey="attempts" />
                    </div>

                    <div style={headerBtnStyle} onClick={() => toggleSort("lastPractice")} role="button" tabIndex={0}>
                        Last practice <ArrowPair columnKey="lastPractice" />
                    </div>

                    <div className="col-last" style={headerBtnStyle} onClick={() => toggleSort("status")} role="button" tabIndex={0}>
                        Status <ArrowPair columnKey="status" />
                    </div>
                </div>
            )}

            <div
                ref={scrollRef}
                style={{
                    height: "100%",
                    overflowY: "auto",
                    WebkitOverflowScrolling: "touch",
                    paddingBottom: isMobile ? 36 : 0,
                }}
            >
                <div id="tbody">
                    {paginatedRows.map((r, idx) => {
                        const a = r.accuracy;
                        const st = statusOf(r);

                        if (isMobile) {
                            return (
                                <div
                                    ref={(el) => {
                                        if (el) rowRefs.current[idx] = el;
                                        else delete rowRefs.current[idx];
                                    }}
                                    key={r.ruleName}
                                    onClick={() => onRowClick(r)}
                                    style={{
                                        userSelect: "none",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 6,
                                        padding: "18px 14px 10px 14px",
                                        cursor: "pointer",
                                        textAlign: "left",
                                    }}
                                >
                                    <div
                                        style={{
                                            marginLeft: 0,
                                            marginBottom: 16,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: 12,
                                        }}
                                    >
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <h2
                                                style={{
                                                    textAlign: "left",
                                                    marginBottom: 0,
                                                    marginTop: 0,
                                                    color: text,
                                                    fontSize: "1.1rem",
                                                    fontWeight: 800,
                                                    fontFamily: 'var(--font-family-base)',
                                                }}
                                            >
                                                {r.ruleName}
                                            </h2>

                                            <div style={{ fontSize: "0.92rem", fontWeight: 600, opacity: 1, marginBottom: 8, fontFamily: 'var(--font-family-base)', color: muted }}>
                                                Level: {LEVEL_MAP[r.level]?.label}
                                            </div>

                                            {/*{advanced && <div style={{ fontSize: "1rem", fontWeight: 700, opacity: 0.7 }}>Attempts: {r.attemptsNumber}</div>}*/}
                                            {/*{advanced && <div style={{ fontSize: "1rem", fontWeight: 700, opacity: 0.7 }}>Practice: {fmtDate(r.lastAttemptDate)}</div>}*/}

                                            <div style={{ display: "flex", justifyContent: "start", gap: "2rem", marginTop: 6 }}>
                                                {advanced && <span className={`badge ${st.cls}`}>{st.label}</span>}

                                                {/* Print button is temporarily hidden. */}
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ marginTop: 4, width: "80px" }}>
                                                {advanced && (
                                                    <>
                                                        <strong>{a}%</strong>
                                                        <div className="bar" aria-label="bar">
                                                            <i style={{ width: `${a}%`, background: barColor }} />
                                                        </div>
                                                    </>
                                                )}

                                                {/* Print button is temporarily hidden. */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // DESKTOP
                        return (
                            <div
                                ref={(el) => {
                                    if (el) rowRefs.current[idx] = el;
                                    else delete rowRefs.current[idx];
                                }}
                                onMouseEnter={() => setHoverRow(r.ruleName)}
                                onMouseLeave={() => setHoverRow(null)}
                                className="trow"
                                style={row(hoverRow === r.ruleName)}
                                key={r.ruleName}
                                onClick={() => onRowClick(r)}
                            >
                                <div>
                                    <div className="rule-name">{r.ruleName}</div>
                                    <div className="sub">Level: {LEVEL_MAP[r.level]?.label}</div>
                                </div>

                                <div>
                                    <strong>{a}%</strong>
                                    <div className="bar">
                                        <i style={{ width: `${a}%`, background: barColor }} />
                                    </div>
                                </div>

                                <div>{r.attemptsNumber}</div>
                                <div>{fmtLastPractice(r.lastAttemptDate)}</div>
                                <div className="col-last">
                                    <span className={`badge ${st.cls}`}>{st.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                theme={theme}
                isMobile={isMobile}
                style={{
                    borderTop: `1px solid ${border}`,
                    background: surface,
                }}
            />

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
                    setPendingIdx(null);
                }}
                onConfirm={async (pdfType) => {
                    // set URL params (requested) and start download
                    if (!pendingRule) return;

                    setPdfTypeModalOpen(false);
                    await startDownload(pendingRule, pendingIdx, pdfType);

                    setPendingRule(null);
                    setPendingIdx(null);
                }}
            />
        </div>
    );
}
