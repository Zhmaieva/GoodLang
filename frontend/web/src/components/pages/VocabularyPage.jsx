import React, { useEffect, useMemo, useState } from "react";
import AppShell from "../AppShell.jsx";
import SiteHeader from "../SiteHeader.jsx";
import FooterBar from "../FooterBar.jsx";
import { Button } from "../Buttons.jsx";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import {
    APP_ACCENT_COLOR,
    APP_ACCENT_SOFT_COLOR,
    APP_BACKGROUND_COLOR,
    APP_BORDER_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
    LEARNED_STATUS_COLOR,
} from "../../theme.js";

const VOCABULARY_WORDS = [
    {
        id: "appointment",
        word: "appointment",
        meaning: "зустріч, запис",
        level: "B1",
        status: "recovered",
        accuracy: 92,
        previousMistakes: 5,
        correctStreak: 6,
        lastMistake: "Ages ago",
        example: "I have an appointment at nine.",
    },
    {
        id: "borrow",
        word: "borrow",
        meaning: "позичати у когось",
        level: "A2",
        status: "needsPractice",
        accuracy: 38,
        previousMistakes: 7,
        correctStreak: 1,
        lastMistake: "Yesterday",
        example: "Can I borrow your pen?",
    },
    {
        id: "receipt",
        word: "receipt",
        meaning: "чек, квитанція",
        level: "B1",
        status: "needsPractice",
        accuracy: 64,
        previousMistakes: 3,
        correctStreak: 2,
        lastMistake: "Today",
        example: "Keep the receipt after you pay.",
    },
    {
        id: "neighbourhood",
        word: "neighbourhood",
        meaning: "район",
        level: "B1",
        status: "learned",
        accuracy: 100,
        previousMistakes: 2,
        correctStreak: 8,
        lastMistake: "Ages ago",
        example: "This neighbourhood is quiet.",
    },
    {
        id: "afford",
        word: "afford",
        meaning: "мати змогу оплатити",
        level: "B1",
        status: "needsPractice",
        accuracy: 44,
        previousMistakes: 6,
        correctStreak: 0,
        lastMistake: "Today",
        example: "I cannot afford a new laptop.",
    },
    {
        id: "eventually",
        word: "eventually",
        meaning: "зрештою",
        level: "B2",
        status: "recovered",
        accuracy: 88,
        previousMistakes: 4,
        correctStreak: 5,
        lastMistake: "Last week",
        example: "Eventually, we found the answer.",
    },
    {
        id: "refund",
        word: "refund",
        meaning: "повернення коштів",
        level: "B1",
        status: "needsPractice",
        accuracy: 71,
        previousMistakes: 2,
        correctStreak: 3,
        lastMistake: "Last week",
        example: "I asked for a refund.",
    },
];

const FILTERS = [
    { id: "all", label: "All" },
    { id: "needsPractice", label: "Needs practice" },
    { id: "recovered", label: "Recovered" },
    { id: "learned", label: "Learned" },
];

const STATUS_META = {
    learned: {
        label: "Learned",
        color: LEARNED_STATUS_COLOR,
        textColor: "#fff",
    },
    recovered: {
        label: "Recovered",
        color: APP_ACCENT_COLOR,
        textColor: "#000",
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

const LAST_MISTAKE_ORDER = {
    Today: 1,
    Yesterday: 2,
    "Last week": 3,
    "Ages ago": 4,
};

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
                fontWeight: 700,
                fontSize: "0.78rem",
                lineHeight: 1,
                whiteSpace: "nowrap",
            }}
        >
            {meta.label}
        </span>
    );
}

function ProgressBar({ value, theme }) {
    const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

    return (
        <div
            aria-label={`${safeValue}%`}
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
                    width: `${safeValue}%`,
                    height: "100%",
                    background: theme?.accent ?? APP_ACCENT_COLOR,
                }}
            />
        </div>
    );
}

function SummaryCard({ label, value, note, progress, theme, isMobile }) {
    const surface = theme?.surface ?? APP_SURFACE_COLOR;
    const border = theme?.border ?? APP_BORDER_COLOR;
    const text = theme?.text ?? APP_TEXT_COLOR;
    const muted = theme?.muted ?? APP_MUTED_TEXT_COLOR;

    return (
        <article
            style={{
                minHeight: isMobile ? 132 : 150,
                border: `1px solid ${border}`,
                borderRadius: 18,
                padding: isMobile ? 16 : 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 14,
                background: surface,
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
                        fontSize: isMobile ? "2rem" : "2.45rem",
                        lineHeight: 1,
                        fontWeight: 800,
                        color: text,
                    }}
                >
                    {value}
                </div>
            </div>
            <div>
                {typeof progress === "number" && (
                    <ProgressBar value={progress} theme={theme} />
                )}
                <div
                    style={{
                        marginTop: 9,
                        fontSize: isMobile ? "0.86rem" : "0.92rem",
                        color: muted,
                        fontWeight: 600,
                    }}
                >
                    {note}
                </div>
            </div>
        </article>
    );
}

export default function VocabularyPage({ theme }) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 915 : false
    );
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortKey, setSortKey] = useState("level");
    const [sortDir, setSortDir] = useState("asc");

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
    }, []);

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
            case "meaning":
                return String(item.meaning ?? "").toLowerCase();
            case "accuracy":
                return Number.isFinite(item.accuracy) ? item.accuracy : -1;
            case "lastMistake":
                return LAST_MISTAKE_ORDER[item.lastMistake] ?? 999;
            case "status":
                return STATUS_ORDER[item.status] ?? 999;
            default:
                return "";
        }
    };

    const filteredWords = useMemo(() => {
        const list = activeFilter === "all"
            ? [...VOCABULARY_WORDS]
            : VOCABULARY_WORDS.filter((word) => word.status === activeFilter);
        const direction = sortDir === "asc" ? 1 : -1;

        list.sort((a, b) => {
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

        return list;
    }, [activeFilter, sortKey, sortDir]);

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
        padding: isMobile ? "18px 12px" : "40px 24px",
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

    const pageIntroStyle = {
        marginBottom: isMobile ? 22 : 28,
    };

    const pageTitleStyle = {
        margin: 0,
        color: theme?.text ?? APP_TEXT_COLOR,
        fontSize: isMobile ? "2rem" : "2.4rem",
        lineHeight: 1.08,
        fontWeight: 850,
        letterSpacing: "-0.02em",
    };

    const pageSubtitleStyle = {
        margin: "10px 0 0",
        color: theme?.muted ?? APP_MUTED_TEXT_COLOR,
        fontSize: isMobile ? "1rem" : "1.05rem",
        lineHeight: 1.5,
        fontWeight: 600,
    };

    const summaryGridStyle = {
        display: "grid",
        gap: isMobile ? 12 : 16,
        gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
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

    const filterRowStyle = {
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginTop: 28,
        marginBottom: 14,
    };

    const tableStyle = {
        border: `1px solid ${theme?.border ?? APP_BORDER_COLOR}`,
        borderRadius: 18,
        overflowX: "auto",
        overflowY: "hidden",
        background: theme?.surface ?? APP_SURFACE_COLOR,
        boxShadow: "0 16px 44px rgba(31, 36, 54, 0.06)",
    };

    const tableGridStyle = {
        display: "grid",
        gridTemplateColumns: isMobile
            ? "160px 160px 120px 150px 140px"
            : "1.1fr 1.1fr 0.8fr 0.9fr 0.9fr",
        gap: 10,
        alignItems: "center",
        minWidth: isMobile ? 730 : 0,
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

    const wordNameStyle = {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 0,
    };

    const wordStyle = {
        fontSize: isMobile ? "1rem" : "1.05rem",
        fontWeight: 800,
        color: theme?.text ?? APP_TEXT_COLOR,
    };

    const metaStyle = {
        fontSize: isMobile ? "0.9rem" : "0.95rem",
        fontWeight: 400,
        color: theme?.muted ?? APP_MUTED_TEXT_COLOR,
    };

    return (
        <AppShell theme={theme} noPadding>
            <div style={pageLayoutStyle}>
                <SiteHeader theme={theme} />

                <div style={pageShellStyle}>
                    <main style={pageContentStyle}>
                        <section style={pageIntroStyle}>
                            <h1 style={pageTitleStyle}>Vocabulary</h1>
                            <p style={pageSubtitleStyle}>
                                Track the words you know, recover weak spots, and build confident recall.
                            </p>
                        </section>

                        <section style={summaryGridStyle} aria-label="Vocabulary summary">
                            <SummaryCard
                                theme={theme}
                                isMobile={isMobile}
                                label="Vocabulary level"
                                value="B1"
                                progress={62}
                                note="Moving toward B2"
                            />
                            <SummaryCard
                                theme={theme}
                                isMobile={isMobile}
                                label="Learned words"
                                value="148"
                                progress={74}
                                note="Stable in recent tasks"
                            />
                            <SummaryCard
                                theme={theme}
                                isMobile={isMobile}
                                label="Needs practice"
                                value="17"
                                progress={28}
                                note="Should return in the queue"
                            />
                            <SummaryCard
                                theme={theme}
                                isMobile={isMobile}
                                label="Recovered"
                                value="23"
                                progress={58}
                                note="Was weak, now correct"
                            />
                        </section>

                        <section style={bodyGridStyle}>
                            <section style={panelStyle}>
                                <div style={filterRowStyle} role="group" aria-label="Vocabulary filters">
                                    {FILTERS.map((filter) => {
                                        const selected = activeFilter === filter.id;

                                        return (
                                            <Button
                                                key={filter.id}
                                                variant="offset"
                                                compact
                                                isMobile={isMobile}
                                                theme={theme}
                                                shadowOffset={0}
                                                onClick={() => setActiveFilter(filter.id)}
                                                style={{
                                                    backgroundColor: selected
                                                        ? theme?.accentSoft ?? APP_ACCENT_SOFT_COLOR
                                                        : theme?.surface ?? APP_SURFACE_COLOR,
                                                    color: selected
                                                        ? theme?.accent ?? APP_ACCENT_COLOR
                                                        : theme?.text ?? APP_TEXT_COLOR,
                                                    borderColor: selected
                                                        ? theme?.accent ?? APP_ACCENT_COLOR
                                                        : theme?.border ?? APP_BORDER_COLOR,
                                                }}
                                            >
                                                {filter.label}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <div style={tableStyle}>
                                    <div style={tableHeaderStyle}>
                                        <SortHeader columnKey="level">Word (Level)</SortHeader>
                                        <div>Translation</div>
                                        <SortHeader columnKey="accuracy">Progress</SortHeader>
                                        <SortHeader columnKey="lastMistake">Last mistake</SortHeader>
                                        <SortHeader columnKey="status">Status</SortHeader>
                                    </div>

                                    {filteredWords.map((item, index) => (
                                        <article
                                            key={item.id}
                                            style={{
                                                ...tableRowStyle,
                                                borderBottom:
                                                    index === filteredWords.length - 1 ? "none" : tableRowStyle.borderBottom,
                                            }}
                                        >
                                            <div style={wordNameStyle}>
                                                <span style={wordStyle}>{item.word}</span>
                                                <span style={metaStyle}>Level: {item.level}</span>
                                            </div>
                                            <div style={metaStyle}>{item.meaning}</div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                <strong style={{ fontSize: "1rem", color: theme?.text ?? APP_TEXT_COLOR }}>
                                                    {item.accuracy}%
                                                </strong>
                                                <ProgressBar value={item.accuracy} theme={theme} />
                                            </div>
                                            <div style={metaStyle}>{item.lastMistake}</div>
                                            <StatusChip status={item.status} />
                                        </article>
                                    ))}
                                </div>
                            </section>

                        </section>
                    </main>
                </div>

                <FooterBar theme={theme} />
            </div>
        </AppShell>
    );
}
