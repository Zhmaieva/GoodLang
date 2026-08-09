import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../AppShell.jsx";
import SiteHeader from "../SiteHeader.jsx";
import FooterBar from "../FooterBar.jsx";
import { Button } from "../Buttons.jsx";
import {
    APP_ACCENT_COLOR,
    APP_BACKGROUND_COLOR,
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
                padding: "6px 10px",
                borderRadius: 5,
                background: meta.color,
                color: meta.textColor,
                fontWeight: 700,
                fontSize: "12px",
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
                height: 10,
                borderRadius: 5,
                background: "#000",
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
    return (
        <article
            style={{
                minHeight: isMobile ? 132 : 150,
                border: "1px solid #000",
                borderRadius: 5,
                padding: isMobile ? 16 : 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 14,
                background: theme?.bg ?? APP_BACKGROUND_COLOR,
            }}
        >
            <div>
                <div
                    style={{
                        fontSize: isMobile ? "0.9rem" : "1rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        fontWeight: 700,
                        color: "#000",
                    }}
                >
                    {label}
                </div>
                <div
                    style={{
                        marginTop: 10,
                        fontSize: isMobile ? "2rem" : "2.45rem",
                        lineHeight: 1,
                        fontWeight: 700,
                        color: "#000",
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
                        fontSize: isMobile ? "0.92rem" : "1rem",
                        color: "#000",
                        fontWeight: 400,
                    }}
                >
                    {note}
                </div>
            </div>
        </article>
    );
}

export default function VocabularyPage({ theme }) {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 915 : false
    );
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
    }, []);

    const filteredWords = useMemo(() => {
        if (activeFilter === "all") return VOCABULARY_WORDS;
        return VOCABULARY_WORDS.filter((word) => word.status === activeFilter);
    }, [activeFilter]);

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

    const pageContentStyle = {
        width: "100%",
        maxWidth: 1100,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        color: "#000",
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

    const summaryGridStyle = {
        display: "grid",
        gap: isMobile ? 12 : 16,
        gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
        marginTop: 14,
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
        marginTop: 22,
        marginBottom: 10,
    };

    const tableStyle = {
        border: "1px solid #000",
        borderRadius: 5,
        overflowX: "auto",
        overflowY: "hidden",
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
        padding: "10px 14px",
        borderBottom: "1px solid #000",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#000",
    };

    const tableRowStyle = {
        ...tableGridStyle,
        padding: "12px 14px",
        borderBottom: "1px solid #000",
        color: "#000",
    };

    const wordNameStyle = {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 0,
    };

    const wordStyle = {
        fontSize: isMobile ? "1rem" : "1.05rem",
        fontWeight: 700,
        color: "#000",
    };

    const metaStyle = {
        fontSize: isMobile ? "0.9rem" : "0.95rem",
        fontWeight: 400,
        color: "#000",
    };

    return (
        <AppShell theme={theme} noPadding>
            <div style={pageLayoutStyle}>
                <SiteHeader theme={theme} />

                <div style={pageShellStyle}>
                    <main style={pageContentStyle}>
                        <nav style={breadcrumbStyle} aria-label="Breadcrumb">
                            <button
                                type="button"
                                style={breadcrumbButtonStyle}
                                onClick={() => navigate("/trainer")}
                            >
                                Trainer
                            </button>
                            <span>/</span>
                            <span style={{ fontWeight: 600 }} aria-current="page">
                                Vocabulary
                            </span>
                        </nav>

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
                                                shadowColor={selected ? "#000" : theme?.accent ?? APP_ACCENT_COLOR}
                                                shadowOffset={selected ? 0 : 4}
                                                onClick={() => setActiveFilter(filter.id)}
                                                style={{
                                                    backgroundColor: selected ? "#000" : theme?.accent ?? APP_ACCENT_COLOR,
                                                    color: selected ? "#fff" : "#000",
                                                    borderColor: "#000",
                                                }}
                                            >
                                                {filter.label}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <div style={tableStyle}>
                                    <div style={tableHeaderStyle}>
                                        <span>Word</span>
                                        <span>Translation</span>
                                        <span>Progress</span>
                                        <span>Last mistake</span>
                                        <span>Status</span>
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
                                                <strong style={{ fontSize: "1rem", color: "#000" }}>
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
