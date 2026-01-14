import React, { useState, useEffect, useMemo } from "react";
import {logError} from "../../services/logger.js";
import {dowloadPdf} from "../../services/api.js";
import DownloadLimitModal from "../subscription/DownloadLimitModal.jsx";
import {getPdfDownloads, setPdfDownloads} from "../../services/dataService.js";

export default function RulesTable({ account, rows, pct, statusOf, fmtDate, onRowClick, theme }) {
    const LEVEL_MAP = {
        A1: { label: "Початківець" },
        A2: { label: "Середній" },
        B1: { label: "Середній" },
        B2: { label: "Просунутий" },
    };

    // Hidden sort order (lower -> higher)
    const LEVEL_ORDER = { A1: 1, A2: 2, B1: 3, B2: 4 };

    const STORAGE_KEY = "rules_table_sort_v2";

    const [isMobile, setIsMobile] = useState(false);

    // default sort: by CEFR level (hidden), ascending
    function readSortFromLS() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed?.sortKey || !parsed?.sortDir) return null;
            return parsed;
        } catch (_) {
            return null;
        }
    }

    const saved = readSortFromLS();

    // default: hidden sort by CEFR level
    const [sortKey, setSortKey] = useState(saved?.sortKey ?? "level");
    const [sortDir, setSortDir] = useState(saved?.sortDir ?? "asc");

    const scrollRef = React.useRef(null);
    const rowRefs = React.useRef({});

    const [hover, setHover] = useState(null);
    const [hoverRow, setHoverRow] = useState(null);

    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadingRow, setDownloadingRow] = useState(null);

    const [signUpModalOpen, setSignUpModalOpen] = useState(false);
    const [ruleToDownload, setRuleToDownload] = useState(null);

    const autoDownloadRanRef = React.useRef(false);

    function clearRuleToDownloadFromUrl() {
        try {
            const url = new URL(window.location.href);
            url.searchParams.delete("ruleToDownload");
            window.history.replaceState({}, "", url.pathname + url.search + url.hash);
        } catch (_) {}
    }


    // save whenever user changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ sortKey, sortDir }));
        } catch (_) {}
    }, [sortKey, sortDir]);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // load saved sorting
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;

            const parsed = JSON.parse(raw);

            if (parsed.sortKey === 'ruleName')
                parsed.sortKey = 'level';

            if (parsed?.sortKey) setSortKey(parsed.sortKey);
            if (parsed?.sortDir) setSortDir(parsed.sortDir);
        } catch (_) {}
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

            case "status": {
                return r.attemptsNumber > 0 && Number.isFinite(r.accuracy) ? r.accuracy : -1;
            }

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

            // numeric vs string
            if (typeof av === "number" && typeof bv === "number") {
                if (av !== bv) return (av - bv) * dir;
            } else {
                if (av < bv) return -1 * dir;
                if (av > bv) return 1 * dir;
            }

            // TIE-BREAKERS (always keep stable & useful)
            // 1) Hidden: CEFR level asc (A1 -> B2)
            const aL = LEVEL_ORDER[a.level] ?? 999;
            const bL = LEVEL_ORDER[b.level] ?? 999;
            if (aL !== bL) return aL - bL;

            // 2) rule name asc
            const an = String(a.ruleName ?? "").toLowerCase();
            const bn = String(b.ruleName ?? "").toLowerCase();
            if (an < bn) return -1;
            if (an > bn) return 1;

            return 0;
        });

        return list;
    }, [rows, sortKey, sortDir, statusOf]);

    const barColor = theme.accent;

    // two-arrow UI: only active arrow is full opacity
    const ArrowPair = ({ columnKey }) => {
        const active = sortKey === columnKey;
        const upOpacity = active && sortDir === "asc" ? 1 : 0.25;
        const downOpacity = active && sortDir === "desc" ? 1 : 0.25;

        return (
            <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 0.9, marginLeft: 6 }}>
        <span style={{ opacity: upOpacity, fontSize: 12 }}>▲</span>
        <span style={{ opacity: downOpacity, fontSize: 12 }}>▼</span>
      </span>
        );
    };

    const headerBtnStyle = {
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        userSelect: "none",
        pointerEvents: "auto",
    };

    const iconBtn = (isHover) => ({
        marginTop: 6,
        width: 16,
        height: 16,
        cursor: isDownloading ? "default" : "pointer",
        opacity: isDownloading ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        transform: !isDownloading && isHover ? "scale(1.4)" : "none",
        filter: !isDownloading && isHover ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
    })

    const row = (isHover) => ({
        cursor: "pointer",
        userSelect: "none",

        background: isHover ? "#ededed" : "#fff",
        filter: isHover ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
    })

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

        // must have data loaded
        if (!sortedRows?.length) return;

        // if user is not logged in, let your modal flow handle it (don't auto-trigger here)
        if (!account?.email) return;

        const idx = sortedRows.findIndex(r => r.rule === ruleId);
        if (idx === -1) {
            // still clear param so it doesn't keep trying
            clearRuleToDownloadFromUrl();
            autoDownloadRanRef.current = true;
            setRuleToDownload(null);
            return;
        }

        autoDownloadRanRef.current = true;

        requestAnimationFrame(() => {
            scrollRowToTop(idx, 0);
        });

        // trigger download
        onPrintClick(null, idx, ruleId).then();

        // clear URL + state so it won't repeat on re-render
        clearRuleToDownloadFromUrl();
        setRuleToDownload(null);
    }, [sortedRows, ruleToDownload, account]);


    const onPrintClick = async (e, idx, ruleName) => {
        e?.stopPropagation();

        setIsDownloading(true);
        setDownloadingRow(idx);

        const downloadsNumber = getPdfDownloads();
        const isTeacher = localStorage.getItem("teacher") === "true";

        if (!account?.email && (downloadsNumber > 0 || !isTeacher)) {
            setRuleToDownload(ruleName);
            setSignUpModalOpen(true);
            return;
        }

        try {
            await dowloadPdf(ruleName);
            setPdfDownloads(downloadsNumber + 1);
        } catch (err) {
            logError(err);
        } finally {
            setIsDownloading(false);
            setDownloadingRow(null);
        }
    }

    function scrollRowToTop(idx, topOffset = 0) {
        const container = scrollRef.current;
        const rowEl = rowRefs.current[idx];
        if (!container || !rowEl) return;

        const cRect = container.getBoundingClientRect();
        const rRect = rowEl.getBoundingClientRect();

        // distance from row to container top, plus current scroll
        let targetTop = (rRect.top - cRect.top) + container.scrollTop - topOffset;

        // clamp (prevents overscroll)
        const maxTop = container.scrollHeight - container.clientHeight;
        if (targetTop < 0) targetTop = 0;
        if (targetTop > maxTop) targetTop = maxTop;

        container.scrollTo({
            top: targetTop,
            behavior: "smooth",
        });
    }


    return (
        <div className="table" style={{ height: "100%" }} aria-live="polite">
            {/* DESKTOP HEADERS */}
            {!isMobile && (
                <div className="thead">
                    <div style={{ opacity: 0.8 }}>#</div>

                    <div style={headerBtnStyle} onClick={() => toggleSort("level")} role="button" tabIndex={0}>
                        Правило (Рівень) <ArrowPair columnKey="level" />
                    </div>

                    <div style={headerBtnStyle} onClick={() => toggleSort("accuracy")} role="button" tabIndex={0}>
                        Точність <ArrowPair columnKey="accuracy" />
                    </div>

                    <div style={headerBtnStyle} onClick={() => toggleSort("attempts")} role="button" tabIndex={0}>
                        Спроби <ArrowPair columnKey="attempts" />
                    </div>

                    <div style={headerBtnStyle} onClick={() => toggleSort("lastPractice")} role="button" tabIndex={0}>
                        Остання практика <ArrowPair columnKey="lastPractice" />
                    </div>

                    <div className="col-last" style={headerBtnStyle} onClick={() => toggleSort("status")} role="button" tabIndex={0}>
                        Статус <ArrowPair columnKey="status" />
                    </div>
                </div>
            )}

            <div
                ref={scrollRef}
                style={{
                    height: "100%",
                    overflowY: "auto",
                    WebkitOverflowScrolling: "touch",
                    paddingBottom: 36,
                }}
            >
                <div id="tbody">
                    {sortedRows.map((r, idx) => {
                        const a = r.accuracy;
                        const st = statusOf(r);

                        // MOBILE (no header, but still sorted)
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
                                        borderBottom: "1px solid rgba(0,0,0,0.1)",
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
                                                    color: theme.text,
                                                    fontSize: "1.5rem",
                                                    fontWeight: 800,
                                                }}
                                            >
                                                {r.ruleName}
                                            </h2>

                                            <div style={{ fontSize: "1rem" }}>
                                                Рівень: {LEVEL_MAP[r.level]?.label}
                                            </div>

                                            <div style={{ fontSize: "1rem" }}>
                                                Спроби: {r.attemptsNumber}
                                            </div>

                                            <div style={{ fontSize: "1rem" }}>
                                                Oстання практика: {fmtDate(r.lastAttemptDate)}
                                            </div>

                                            <div style={{
                                                display: "flex",
                                                justifyContent: "start",
                                                gap: "2rem",
                                                marginTop: 6
                                            }}>
                                                <span className={`badge ${st.cls}`}>{st.label}</span>
                                                <div
                                                    key={idx}
                                                    onMouseEnter={() => setHover(idx)}
                                                    onMouseLeave={() => setHover(null)}
                                                    onClick={(e)=>onPrintClick(e, idx, r.rule)}
                                                    style={iconBtn(idx === hover, downloadingRow === idx)}
                                                    title="Друкувати правило"
                                                >
                                                    <img
                                                        src={downloadingRow === idx ? "/loading-icon.svg" : "/print-icon.svg"}
                                                        alt="Print"
                                                        style={{
                                                            width: 56,
                                                            height: 56,
                                                            display: "block",

                                                            animation:
                                                                downloadingRow === idx
                                                                    ? "spin-pause .9s cubic-bezier(0.4, 0.0, 0.2, 1) infinite"
                                                                    : "none",
                                                            transformOrigin: "50% 50%",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{display: "flex", flexDirection: "column"}}>
                                            <div style={{marginTop: 4, width: "80px"}}>
                                                <strong>{a}%</strong>
                                                <div className="bar" aria-label="bar">
                                                    <i style={{width: `${a}%`, background: barColor}}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // DESKTOP ROW
                        return (
                            <div
                                ref={(el) => {
                                    if (el) rowRefs.current[idx] = el;
                                    else delete rowRefs.current[idx];
                                }}
                                onMouseEnter={() => setHoverRow(r.ruleName)}
                                onMouseLeave={() => setHoverRow(null)}
                                className="trow" style={row(hoverRow === r.ruleName)} key={r.ruleName}
                                onClick={() => onRowClick(r)}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-around"
                                }}>
                                    <div>
                                        {idx + 1}
                                    </div>
                                    <div
                                        key={idx}
                                        onMouseEnter={() => setHover(idx)}
                                        onMouseLeave={() => setHover(null)}
                                        onClick={(e)=>onPrintClick(e, idx, r.rule)}
                                        style={iconBtn(idx === hover, downloadingRow === idx)}
                                        title="Друкувати правило"
                                    >
                                        <img
                                            key={downloadingRow === idx ? `loading-${idx}` : `print-${idx}`}
                                            src={downloadingRow === idx ? "/loading-icon.svg" : "/print-icon.svg"}
                                            alt={downloadingRow === idx ? "Loading" : "Print"}
                                            style={{
                                                position: "relative",
                                                top: -4,
                                                width: 38,
                                                height: 38,
                                                display: "block",
                                                animation: downloadingRow === idx
                                                    ? "spin-pause .9s cubic-bezier(0.4, 0.0, 0.2, 1) infinite"
                                                    : "none",
                                                transformOrigin: "50% 50%",
                                            }}
                                        />
                                    </div>


                                </div>
                                <div>
                                    <div className="rule-name">{r.ruleName}</div>
                                    <div className="sub">Рівень: {LEVEL_MAP[r.level]?.label}</div>
                                </div>
                                <div>
                                    <strong>{a}%</strong>
                                    <div className="bar">
                                        <i style={{width: `${a}%`, background: barColor}}/>
                                    </div>
                                </div>
                                <div>{r.attemptsNumber}</div>
                                <div>{fmtDate(r.lastAttemptDate)}</div>
                                <div className="col-last">
                                    <span className={`badge ${st.cls}`}>{st.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <DownloadLimitModal
                ruleToDownload={ruleToDownload}
                theme={theme} open={signUpModalOpen} onClose={() => {
                setSignUpModalOpen(false);
                setDownloadingRow(null);
                setIsDownloading(false);
            }}/>
        </div>
    );
}
