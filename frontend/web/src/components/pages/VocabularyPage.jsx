import React, { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "../AppShell.jsx";
import SiteHeader from "../SiteHeader.jsx";
import FooterBar from "../FooterBar.jsx";
import FiltersBar from "../FiltersBar.jsx";
import Pagination from "../Pagination.jsx";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import {
    APP_ACCENT_COLOR,
    APP_BACKGROUND_COLOR,
    APP_BORDER_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
    LEARNED_STATUS_COLOR,
} from "../../theme.js";
import { callVocabularyApi } from "../../services/api.js";
import { localizationService } from "../../localization/localizationService.js";
import { off, on } from "../../services/events.js";
import { getOverallAccuracy } from "../../services/dataService.js";
import {
    buildLocalVocabularySummary,
    getLocalVocabularyWords,
    mergeVocabularyWords,
} from "../../services/vocabularyService.js";
import "./analytics.css";

const WORDS_PER_PAGE = 10;

const STATUS_META = {
    learned: {
        label: "Learned",
        color: LEARNED_STATUS_COLOR,
        textColor: "#fff",
    },
    needsPractice: {
        label: "Needs practice",
        color: "#fe2f31",
        textColor: "#fff",
    },
};

const STATUS_ORDER = {
    needsPractice: 1,
    recovered: 2,
    learned: 3,
};

const VOCABULARY_LEVEL_ORDER = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
};

const VOCABULARY_LEVEL_NAMES = {
    A1: "Beginner",
    A2: "Intermediate",
    B1: "Intermediate",
    B2: "Advanced",
    C1: "Advanced",
    C2: "Advanced",
};

function getDisplayStatus(word) {
    const status = word?.displayStatus || word?.status;
    return status === "recovered" ? "needsPractice" : status;
}

function getWordAccuracy(word) {
    const attempts = Math.max(0, Number(word?.attempts) || 0);
    const correct = Math.max(0, Math.min(attempts, Number(word?.correctCount) || 0));
    return attempts > 0 ? (correct / attempts) * 100 : 0;
}

function formatLastPractice(value) {
    if (!value) return "—";

    const timestamp = new Date(value).getTime();
    if (!Number.isFinite(timestamp)) return "—";

    const days = Math.max(0, Math.floor((Date.now() - timestamp) / 86400000));
    if (days > 30) return "Ages ago";
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
}

function getVocabularyLevelName(level) {
    return VOCABULARY_LEVEL_NAMES[String(level ?? "").toUpperCase()] || "-";
}

function StatusChip({ status }) {
    const meta = STATUS_META[status] ?? STATUS_META.needsPractice;

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "fit-content",
                minWidth: 0,
                padding: "7px 12px",
                borderRadius: 999,
                background: meta.color,
                color: meta.textColor,
                fontWeight: 800,
                fontSize: "0.78rem",
                lineHeight: 1,
                whiteSpace: "nowrap",
            }}
        >
            {meta.label}
        </span>
    );
}

function SummaryCard({
    label,
    value,
    progress = 0,
    theme,
    isMobile,
    compactValue = false,
    hideProgress = false,
}) {
    const text = theme?.text ?? APP_TEXT_COLOR;
    const muted = theme?.muted ?? APP_MUTED_TEXT_COLOR;
    const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));

    return (
        <article
            style={{
                minHeight: isMobile ? 104 : 120,
                border: `1px solid ${theme?.border ?? APP_BORDER_COLOR}`,
                borderRadius: 18,
                padding: isMobile ? 16 : 22,
                boxSizing: "border-box",
                width: "100%",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 14,
                background: APP_SURFACE_COLOR,
                boxShadow: "0 16px 44px rgba(31, 36, 54, 0.06)",
            }}
        >
            <div>
                <div
                    style={{
                        fontSize: isMobile ? "0.78rem" : "0.82rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight: 800,
                        color: muted,
                    }}
                >
                    {label}
                </div>
                <div
                    style={{
                        marginTop: 10,
                        fontSize: compactValue
                            ? isMobile ? "1.25rem" : "1.55rem"
                            : isMobile ? "2rem" : "2.45rem",
                        lineHeight: compactValue ? 1.15 : 1,
                        fontWeight: 800,
                        color: text,
                        overflowWrap: "anywhere",
                    }}
                >
                    {value}
                </div>
            </div>

            {!hideProgress && (
                <div
                    aria-label={`${label}: ${Math.round(safeProgress)}%`}
                    style={{
                        width: "100%",
                        height: 8,
                        borderRadius: 999,
                        background: "#edf0f7",
                        overflow: "hidden",
                    }}
                >
                    <span
                        style={{
                            display: "block",
                            width: `${safeProgress}%`,
                            height: "100%",
                            borderRadius: 999,
                            background: theme?.accent ?? APP_ACCENT_COLOR,
                        }}
                    />
                </div>
            )}
        </article>
    );
}

export default function VocabularyPage({ theme }) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 915 : false
    );
    const [words, setWords] = useState([]);
    const [summary, setSummary] = useState(null);
    const [vocabularyState, setVocabularyState] = useState("loading");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [filterLevel, setFilterLevel] = useState("all");
    const [showWeakOnly, setShowWeakOnly] = useState(false);
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState("level");
    const [sortDir, setSortDir] = useState("asc");
    const [page, setPage] = useState(1);
    const [sentencesLeft, setSentencesLeft] = useState(
        () => Math.max(0, Number(getOverallAccuracy()?.attemptsLeft) || 0)
    );

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
    }, []);

    const loadVocabulary = useCallback(({ silent = false } = {}) => {
        let cancelled = false;

        if (!silent) setLoading(true);
        callVocabularyApi()
            .then((data) => {
                if (cancelled) return;
                const mergedWords = mergeVocabularyWords(data?.words, localizationService.getLocale() || "uk-UA");
                setWords(mergedWords);
                setSummary(buildLocalVocabularySummary(mergedWords));
                setVocabularyState(mergedWords.length > 0 ? "ready" : data?.state ?? "ready");
                setLoadError("");
            })
            .catch((error) => {
                if (cancelled) return;
                console.error("Failed to load vocabulary", error);
                const localWords = getLocalVocabularyWords(localizationService.getLocale() || "uk-UA");
                setWords(localWords);
                setSummary(buildLocalVocabularySummary(localWords));
                setVocabularyState(localWords.length > 0 ? "ready" : "error");
                setLoadError(localWords.length > 0
                    ? ""
                    : "Vocabulary is not available right now. Please try again later.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => loadVocabulary(), [loadVocabulary]);

    useEffect(() => {
        const handleVocabularyUpdated = () => {
            setSentencesLeft(Math.max(0, Number(getOverallAccuracy()?.attemptsLeft) || 0));
            loadVocabulary({ silent: true });
        };

        const handleEvaluationUpdated = () => {
            setSentencesLeft(Math.max(0, Number(getOverallAccuracy()?.attemptsLeft) || 0));
        };

        on("vocabularyUpdated", handleVocabularyUpdated);
        on("weeklyProgressUpdate", handleEvaluationUpdated);
        return () => {
            off("vocabularyUpdated", handleVocabularyUpdated);
            off("weeklyProgressUpdate", handleEvaluationUpdated);
        };
    }, [loadVocabulary]);

    const toggleSort = (key) => {
        if (sortKey === key) {
            setSortDir((direction) => (direction === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const getSortValue = (item, key) => {
        switch (key) {
            case "word":
                return String(item.word ?? "").toLowerCase();
            case "level":
                return VOCABULARY_LEVEL_ORDER[item.level] ?? 999;
            case "accuracy":
                return getWordAccuracy(item);
            case "attempts":
                return Math.max(0, Number(item.attempts) || 0);
            case "lastPractice": {
                const timestamp = new Date(item.lastPracticeAt).getTime();
                return Number.isFinite(timestamp) ? timestamp : 0;
            }
            case "status":
                return STATUS_ORDER[getDisplayStatus(item)] ?? 999;
            default:
                return "";
        }
    };

    const filteredWords = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase();
        const levelFiltered = filterLevel === "all"
            ? [...words]
            : words.filter((word) => getVocabularyLevelName(word.level).toLowerCase() === filterLevel);
        const list = showWeakOnly
            ? levelFiltered.filter((word) => getDisplayStatus(word) === "needsPractice")
            : levelFiltered;
        const direction = sortDir === "asc" ? 1 : -1;

        const matchingWords = normalizedQuery
            ? list.filter((word) => {
                const sourceWord = String(word?.word ?? "").toLocaleLowerCase();
                const selectedLocaleTranslation = String(word?.meaning ?? "").toLocaleLowerCase();
                return sourceWord.includes(normalizedQuery)
                    || selectedLocaleTranslation.includes(normalizedQuery);
            })
            : list;

        matchingWords.sort((a, b) => {
            const av = getSortValue(a, sortKey);
            const bv = getSortValue(b, sortKey);

            if (typeof av === "number" && typeof bv === "number") {
                if (av !== bv) return (av - bv) * direction;
            } else {
                if (av < bv) return -1 * direction;
                if (av > bv) return 1 * direction;
            }

            const aw = String(a.word ?? "").toLowerCase();
            const bw = String(b.word ?? "").toLowerCase();
            if (aw < bw) return -1;
            if (aw > bw) return 1;

            return 0;
        });

        return matchingWords;
    }, [filterLevel, query, showWeakOnly, sortKey, sortDir, words]);

    const totalPages = Math.max(1, Math.ceil(filteredWords.length / WORDS_PER_PAGE));

    const paginatedWords = useMemo(() => {
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * WORDS_PER_PAGE;
        return filteredWords.slice(start, start + WORDS_PER_PAGE);
    }, [filteredWords, page, totalPages]);

    useEffect(() => {
        setPage(1);
    }, [filterLevel, query, showWeakOnly, sortKey, sortDir]);

    useEffect(() => {
        setPage((currentPage) => Math.min(currentPage, totalPages));
    }, [totalPages]);

    const vocabularyLevelSummary = summary?.vocabularyLevel ?? {
        value: loading ? "..." : "-",
        note: loading ? "Loading vocabulary" : "Not enough data yet",
        progress: 0,
    };
    const learnedWordsCount = words.filter((word) => getDisplayStatus(word) === "learned").length;
    const needsPracticeCount = words.filter((word) => getDisplayStatus(word) === "needsPractice").length;
    const categorizedWordsCount = learnedWordsCount + needsPracticeCount;
    const learnedWordsSummary = summary?.learnedWords ?? {
        value: loading ? "..." : learnedWordsCount,
        note: loading ? "Loading vocabulary" : "No learned words yet",
    };
    const needsPracticeSummary = {
        value: loading
            ? "..."
            : needsPracticeCount,
        note: loading ? "Loading vocabulary" : "No weak words yet",
    };
    const learnedWordsProgress = categorizedWordsCount > 0
        ? (learnedWordsCount / categorizedWordsCount) * 100
        : 0;
    const needsPracticeProgress = categorizedWordsCount > 0
        ? (needsPracticeCount / categorizedWordsCount) * 100
        : 0;
    const isVocabularyEvaluationPending = sentencesLeft > 0;

    const pageLayoutStyle = {
        width: "100%",
        minHeight: "var(--app-viewport-height, 100vh)",
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
        padding: isMobile
            ? "18px 12px calc(18px + var(--mobile-nav-clearance, 0px))"
            : "40px 24px",
        background: theme?.bg ?? APP_BACKGROUND_COLOR,
    };

    const pageContentStyle = {
        width: "100%",
        maxWidth: 1180,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        color: theme?.text ?? APP_TEXT_COLOR,
    };

    const summaryGridStyle = {
        display: "grid",
        gap: isMobile ? 12 : 16,
        gridTemplateColumns: isMobile
            ? "repeat(auto-fit, minmax(min(100%, 150px), 1fr))"
            : "repeat(3, 1fr)",
        marginTop: 0,
    };

    const bodyGridStyle = {
        display: "grid",
        gap: isMobile ? 18 : 20,
        gridTemplateColumns: "1fr",
        alignItems: "start",
    };

    const panelStyle = {
        border: "none",
        borderRadius: 0,
        padding: 0,
        background: "transparent",
    };

    const tableStyle = {
        border: `1px solid ${theme?.border ?? APP_BORDER_COLOR}`,
        borderRadius: 18,
        overflowX: "auto",
        overflowY: "hidden",
        background: APP_SURFACE_COLOR,
        boxShadow: "0 16px 44px rgba(31, 36, 54, 0.06)",
    };

    const tableGridStyle = {
        display: "grid",
        gridTemplateColumns: "1.45fr 0.8fr 0.7fr 0.95fr 0.85fr",
        gap: 12,
        alignItems: "center",
        minWidth: 0,
    };

    const tableHeaderStyle = {
        ...tableGridStyle,
        padding: "16px 20px",
        borderBottom: `1px solid ${theme?.border ?? APP_BORDER_COLOR}`,
        fontSize: "0.72rem",
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: theme?.muted ?? APP_MUTED_TEXT_COLOR,
    };

    const tableHeaderButtonStyle = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        width: "fit-content",
        border: "none",
        padding: 0,
        background: "transparent",
        color: theme?.muted ?? APP_MUTED_TEXT_COLOR,
        font: "inherit",
        fontWeight: 800,
        letterSpacing: "inherit",
        textTransform: "inherit",
        cursor: "pointer",
        userSelect: "none",
    };

    const ArrowPair = ({ columnKey }) => {
        const active = sortKey === columnKey;
        const upOpacity = active && sortDir === "asc" ? 1 : 0.25;
        const downOpacity = active && sortDir === "desc" ? 1 : 0.25;

        return (
            <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 0.9 }}>
                <CaretUp size={12} weight="fill" style={{ opacity: upOpacity }} />
                <CaretDown size={12} weight="fill" style={{ opacity: downOpacity }} />
            </span>
        );
    };

    const SortHeader = ({ columnKey, children }) => (
        <button
            type="button"
            style={tableHeaderButtonStyle}
            onClick={() => toggleSort(columnKey)}
        >
            {children}
            <ArrowPair columnKey={columnKey} />
        </button>
    );

    const tableRowStyle = {
        ...tableGridStyle,
        padding: "18px 20px",
        borderBottom: `1px solid ${theme?.border ?? APP_BORDER_COLOR}`,
        color: theme?.text ?? APP_TEXT_COLOR,
    };

    const mobileRowStyle = {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 18,
        padding: "18px 14px",
        borderBottom: `1px solid ${theme?.border ?? APP_BORDER_COLOR}`,
        color: theme?.text ?? APP_TEXT_COLOR,
    };

    const wordNameStyle = {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 0,
    };

    const wordStyle = {
        fontSize: isMobile ? "1.1rem" : "inherit",
        fontWeight: 800,
        color: theme?.text ?? APP_TEXT_COLOR,
    };

    const metaStyle = {
        fontSize: isMobile ? "0.92rem" : "0.86rem",
        fontWeight: isMobile ? 600 : 400,
        color: theme?.muted ?? APP_MUTED_TEXT_COLOR,
    };

    const translationStyle = {
        fontSize: "inherit",
        fontWeight: 400,
        color: theme?.text ?? APP_TEXT_COLOR,
    };

    const tableDataStyle = {
        fontSize: "inherit",
        fontWeight: 400,
        color: theme?.text ?? APP_TEXT_COLOR,
    };

    const emptyStateStyle = {
        padding: "28px 20px",
        color: loadError ? "#9b2c2c" : theme?.muted ?? APP_MUTED_TEXT_COLOR,
        fontSize: "0.95rem",
        fontWeight: 600,
        textAlign: "center",
    };

    const tableMessage = loading
        ? "Loading vocabulary..."
        : loadError
            || (vocabularyState === "noPracticeYet" || words.length === 0
                ? "Your vocabulary will appear here after you complete a few practice tasks."
                : filteredWords.length === 0
                    ? "No words match this filter."
                    : "");

    return (
        <AppShell theme={theme} noPadding>
            <div style={pageLayoutStyle}>
                <SiteHeader theme={theme} />

                <div style={pageShellStyle}>
                    <main style={pageContentStyle}>
                        <section style={summaryGridStyle} aria-label="Vocabulary summary">
                            <SummaryCard
                                theme={theme}
                                isMobile={isMobile}
                                label="Vocabulary level"
                                value={isVocabularyEvaluationPending
                                    ? `${sentencesLeft} ${sentencesLeft === 1 ? "sentence" : "sentences"} left for evaluation`
                                    : vocabularyLevelSummary.value}
                                progress={vocabularyLevelSummary.progress}
                                compactValue={isVocabularyEvaluationPending}
                                hideProgress={isVocabularyEvaluationPending}
                            />
                            <SummaryCard
                                theme={theme}
                                isMobile={isMobile}
                                label="Learned words"
                                value={learnedWordsSummary.value}
                                progress={learnedWordsProgress}
                            />
                            <SummaryCard
                                theme={theme}
                                isMobile={isMobile}
                                label="Needs practice"
                                value={needsPracticeSummary.value}
                                progress={needsPracticeProgress}
                            />
                        </section>

                        <section style={bodyGridStyle}>
                            <section style={panelStyle}>
                                <FiltersBar
                                    filterLevel={filterLevel}
                                    onLevelChange={setFilterLevel}
                                    query={query}
                                    onQueryChange={setQuery}
                                    showWeakOnly={showWeakOnly}
                                    onToggleWeak={() => setShowWeakOnly((current) => !current)}
                                    searchPlaceholder="Search word or translation…"
                                    searchAriaLabel="Search vocabulary by word or translation"
                                    theme={theme}
                                />

                                <div style={tableStyle}>
                                    {!isMobile && (
                                        <div style={tableHeaderStyle}>
                                            <SortHeader columnKey="level">Word (Level)</SortHeader>
                                            <SortHeader columnKey="accuracy">Accuracy</SortHeader>
                                            <SortHeader columnKey="attempts">Attempts</SortHeader>
                                            <SortHeader columnKey="lastPractice">Last practice</SortHeader>
                                            <div style={{ justifySelf: "end" }}>
                                                <SortHeader columnKey="status">Status</SortHeader>
                                            </div>
                                        </div>
                                    )}

                                    {tableMessage ? (
                                        <div style={emptyStateStyle}>{tableMessage}</div>
                                    ) : (
                                        paginatedWords.map((item, index) => {
                                            const isLastRow = index === paginatedWords.length - 1;
                                            const accuracy = getWordAccuracy(item);
                                            const roundedAccuracy = Math.round(accuracy * 100) / 100;
                                            const lastPractice = formatLastPractice(item.lastPracticeAt);

                                            if (isMobile) {
                                                return (
                                                    <article
                                                        key={item.id}
                                                        style={{
                                                            ...mobileRowStyle,
                                                            borderBottom: isLastRow ? "none" : mobileRowStyle.borderBottom,
                                                        }}
                                                    >
                                                        <div style={{ ...wordNameStyle, flex: "1 1 auto" }}>
                                                            <span style={wordStyle}>
                                                                {item.word}
                                                                {item.meaning && (
                                                                    <span style={translationStyle}> / {item.meaning}</span>
                                                                )}
                                                            </span>
                                                            <span style={metaStyle}>
                                                                Level: {getVocabularyLevelName(item.level)}
                                                            </span>
                                                            <div style={{ marginTop: 8 }}>
                                                                <StatusChip status={getDisplayStatus(item)} />
                                                            </div>
                                                        </div>

                                                        <div
                                                            style={{
                                                                flex: "0 0 auto",
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                alignItems: "flex-end",
                                                                gap: 8,
                                                                textAlign: "right",
                                                                width: 92,
                                                            }}
                                                        >
                                                            <div style={{ width: "100%" }}>
                                                                <strong>{roundedAccuracy}%</strong>
                                                                <div className="bar" aria-label={`${roundedAccuracy}% accuracy`}>
                                                                    <i style={{ width: `${accuracy}%`, background: theme?.accent ?? APP_ACCENT_COLOR }} />
                                                                </div>
                                                            </div>
                                                            <span style={{ ...metaStyle, fontSize: "0.78rem", fontWeight: 600 }}>
                                                                {lastPractice}
                                                            </span>
                                                        </div>
                                                    </article>
                                                );
                                            }

                                            return (
                                                <article
                                                    key={item.id}
                                                    style={{
                                                        ...tableRowStyle,
                                                        borderBottom: isLastRow ? "none" : tableRowStyle.borderBottom,
                                                    }}
                                                >
                                                    <div style={wordNameStyle}>
                                                        <span style={wordStyle}>
                                                            {item.word}
                                                            {item.meaning && (
                                                                <span style={translationStyle}> / {item.meaning}</span>
                                                            )}
                                                        </span>
                                                        <span style={metaStyle}>Level: {getVocabularyLevelName(item.level)}</span>
                                                    </div>
                                                    <div>
                                                        <strong>{roundedAccuracy}%</strong>
                                                        <div className="bar" aria-label={`${roundedAccuracy}% accuracy`}>
                                                            <i style={{ width: `${accuracy}%`, background: theme?.accent ?? APP_ACCENT_COLOR }} />
                                                        </div>
                                                    </div>
                                                    <div style={tableDataStyle}>{item.attempts || 0}</div>
                                                    <div style={tableDataStyle}>{lastPractice}</div>
                                                    <div style={{ justifySelf: "end" }}>
                                                        <StatusChip status={getDisplayStatus(item)} />
                                                    </div>
                                                </article>
                                            );
                                        })
                                    )}
                                </div>

                                {!loading && !loadError && filteredWords.length > 0 && (
                                    <Pagination
                                        page={page}
                                        totalPages={totalPages}
                                        onPageChange={setPage}
                                        theme={theme}
                                        isMobile={isMobile}
                                        style={{
                                            marginTop: 12,
                                        }}
                                    />
                                )}
                            </section>

                        </section>
                    </main>
                </div>

                <FooterBar theme={theme} />
            </div>
        </AppShell>
    );
}
