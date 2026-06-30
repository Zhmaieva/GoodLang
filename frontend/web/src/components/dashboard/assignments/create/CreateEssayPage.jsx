import React, { useMemo, useRef, useState } from "react";
import Page from "../../Page.jsx";
import RectangleGroup from "../../RectangleGroup.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";
import Input from "../../Input.jsx";
import NumberSlider from "../../NumberSlider.jsx";
import { Chip } from "../../Chip.jsx";
import { theme } from "../../../../App.jsx";
import EmptyContent from "../../EmptyContent.jsx";
// import {
//     apiGenerateStoryFromWords,
//     apiGenerateTopicWords,
// } from "../../../../services/api.js";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

function isProbablyGibberishTopic(s) {
    const t = String(s || "").trim();

    if (t.length < 2) return true;
    if (t.length > 40) return true;

    const hasLetter = /[a-zA-Zа-яА-ЯіїєґІЇЄҐ]/.test(t);
    if (!hasLetter) return true;

    const weirdRatio =
        t.replace(/[a-zA-Zа-яА-ЯіїєґІЇЄҐ0-9\s\-&']/g, "").length / t.length;
    if (weirdRatio > 0.25) return true;

    if (/(.)\1\1\1/.test(t)) return true;

    const lettersOnly = t.replace(/[^a-zA-Zа-яА-ЯіїєґІЇЄҐ]/g, "");
    if (!lettersOnly) return true;

    const vowels =
        lettersOnly.match(/[aeiouyAEIOUYаеєиіїоуюяАЕЄИІЇОУЮЯ]/g)?.length || 0;

    const vowelRatio = vowels / lettersOnly.length;

    if (lettersOnly.length >= 6 && vowelRatio < 0.18) return true;

    return false;
}

function normalizeWord(w) {
    return String(w || "")
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .slice(0, 64);
}

function uniqueWordsCaseInsensitive(words) {
    const out = [];
    const seen = new Set();
    for (const w of words || []) {
        const nw = normalizeWord(w);
        if (!nw) continue;
        const key = nw.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(nw);
    }
    return out;
}

function shuffleArray(arr) {
    const a = [...(arr || [])];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function friendlyApiError(e) {
    const msg = String(e?.message || "").toLowerCase();
    if (msg.includes("network"))
        return "Network error. Please check your connection and try again.";
    if (msg.includes("timeout"))
        return "The request took too long. Please try again.";
    if (msg.includes("401") || msg.includes("403"))
        return "You’re not authorized for this action.";
    return "Something went wrong. Please try again.";
}

function buildPrettyText(rawText) {
    const raw = String(rawText || "").trim();
    if (!raw) return "";
    return `   ${raw}`.split("[[p]]").join("\n\n   ");
}

function computeCoverage(words, answers) {
    const w = uniqueWordsCaseInsensitive(words || []);
    const a = Array.isArray(answers) ? answers : [];

    const wordSet = new Set(w.map((x) => String(x).toLowerCase()));
    const used = new Set();

    for (const ans of a) {
        const k = String(ans || "").trim().toLowerCase();
        if (!k) continue;
        if (wordSet.has(k)) used.add(k);
    }

    const usedCount = used.size;
    const total = w.length;

    const missing = w.filter((x) => !used.has(String(x).toLowerCase()));
    return { usedCount, total, missing };
}

function LoadingPreview({ styles }) {
    return (
        <div style={{ width: "100%", minWidth: 0, alignSelf: "stretch" }}>
            <div style={{ ...styles.paper, width: "100%", minWidth: 0, boxSizing: "border-box" }}>
                <div style={styles.miniMeta}>Generating text… please wait.</div>
                <div style={{ height: 10 }} />

                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                    <div style={styles.skeletonLine(92)} />
                    <div style={styles.skeletonLine(98)} />
                    <div style={styles.skeletonLine(86)} />
                    <div style={styles.skeletonLine(94)} />
                    <div style={styles.skeletonLine(78)} />
                    <div style={styles.skeletonLine(90)} />
                    <div style={{ height: 6 }} />
                    <div style={styles.skeletonLine(88)} />
                    <div style={styles.skeletonLine(74)} />
                </div>
            </div>
        </div>
    );
}

export function CreateEssayPage() {
    // Setup
    const [topic, setTopic] = useState("");
    const [topicError, setTopicError] = useState("");
    const [level, setLevel] = useState("A2");
    const [count, setCount] = useState(200);
    const [questionsCount, setQuestionsCount] = useState(5);


    // Data
    const [generatedWords, setGeneratedWords] = useState([]);
    const [generatedText, setGeneratedText] = useState("");
    const [generatedAnswers, setGeneratedAnswers] = useState([]);

    // UI states
    const [globalError, setGlobalError] = useState("");
    const [toast, setToast] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const [showWordBank, setShowWordBank] = useState(true);
    const [showAnswers, setShowAnswers] = useState(false);
    const [wordBank, setWordBank] = useState([]);

    // Refs
    const topicRef = useRef(null);
    const contentTopRef = useRef(null);

    const t = theme.createGrammarChooseOption;

    const styles = useMemo(
        () => ({
            // 2-column layout: left ~60%, right ~40%
            grid: {
                display: "grid",
                gap: t.rowGap,
                width: "100%",
                minHeight: t.minH0,
                alignItems: "start",
                paddingLeft: theme.layoutMetrics?.pagePad ?? 16,
                paddingRight: theme.layoutMetrics?.pagePad ?? 16,
                gridTemplateColumns: "minmax(520px, 1fr) minmax(520px,1fr)"
            },

            // LEFT: main setup mass
            setupCol: {
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                //gap: theme.spacing.gap,
                minHeight: 0,
                //marginTop: 15,
            },

            // RIGHT: stack (preview, actions, status)
            rightCol: {
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.gap,
                minHeight: 0,
            },

            contentGroup: {
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                width: "100%",
            },

            contentScroll: {
                minHeight: 0,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.gap,
            },

            paper: {
                border: theme.borders.card,
                borderRadius: theme.radius.card,
                padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
                background: theme.bgSoft ?? "rgba(0,0,0,0.02)",
                width: "100%",
                flex: "1 1 100%"
            },

            textPreview: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.subtitle,
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
            },

            rowWrap: {
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.rowGap,
                alignItems: "center",
                marginBottom: "25px"
            },

            // Actions should be one under another
            actionsStack: {
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.rowGap,
                alignItems: "stretch",
            },

            miniMeta: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.small,
                lineHeight: theme.type.titleLineHeight,
                color: theme.textDark,
            },

            errorBox: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.subtitle,
                lineHeight: theme.type.subtitleLineHeight,
                color: theme.textMutedDark,
                border: theme.borders.card,
                borderRadius: theme.radius.card,
                padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
                background: "transparent",
            },

            toast: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.small,
                lineHeight: theme.type.smallLineHeight,
                color: theme.textMutedDark,
                border: theme.borders.card,
                borderRadius: theme.radius.card,
                padding: "8px 10px",
                background: "transparent",
            },

            darkBtn: {
                background: theme.accentDark,
                border: theme.borders.card,
                color: theme.bg,
            },

            wordChip: (isHovered) => ({
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 12px",
                borderRadius: theme.radius.card,
                border: theme.borders.card,
                fontFamily: theme.fontFamily,
                fontSize: theme.type.subtitle,
                background: isHovered
                    ? theme.bgSoft ?? "rgba(0,0,0,0.04)"
                    : "transparent",
                cursor: "pointer",
                userSelect: "none",
                transition: `background ${theme.motion.fast} ${theme.motion.ease}`,
            }),

            subtleDivider: {
                height: 1,
                width: "100%",
                background: theme.borders?.dividerColor ?? "rgba(0,0,0,0.06)",
                marginTop: theme.spacing.rowGap,
                marginBottom: theme.spacing.rowGap,
            },

            answersBox: {
                border: theme.borders.card,
                borderRadius: theme.radius.card,
                padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
                background: "transparent",
                display: "flex",
                flexDirection: "column",
                gap: 6,
            },

            answerItem: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.subtitle,
                lineHeight: theme.type.subtitleLineHeight,
                color: theme.textDark,
                display: "flex",
                gap: 10,
                alignItems: "baseline",
            },

            answerIndex: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.small,
                lineHeight: theme.type.smallLineHeight,
                color: theme.textMuted,
                minWidth: 18,
                textAlign: "right",
            },

            // Status: each row one under another (no wrapping)
            statusBlock: {
                display: "flex",
                flexDirection: "column",
                gap: 6,
            },

            statusRow: {
                display: "block",
            },

            titleCustom: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.title,
                fontWeight: theme.weights.title,
                lineHeight: theme.type.titleLineHeight,
                color: theme.textDark,
                whiteSpace: "nowrap",
                marginBottom: "10px",
                marginTop: "10px",
            },

            skeletonLine: (pct) => ({
                height: 16,
                width: `${pct}%`,
                borderRadius: 6,
                border: theme.borders.card,
                background:
                    theme.bgSoft ??
                    "linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%)",
                backgroundSize: "200% 100%",
                animation: "gl_skeleton 1.2s ease-in-out infinite",
            }),
        }),
        [t]
    );

    const [hoveredWord, setHoveredWord] = useState("");

    const clearAll = () => {
        setGeneratedWords([]);
        setWordBank([]);
        setGeneratedText("");
        setGeneratedAnswers([]);
        setShowAnswers(false);
        setShowWordBank(true);
        setGlobalError("");
        setToast("");
    };

    const clearTextOnly = () => {
        setGeneratedText("");
        setGeneratedAnswers([]);
        setShowAnswers(false);
    };

    const removeWord = (word) => {
        setGeneratedWords((prev) => {
            const next = prev.filter((w) => w !== word);
            const nextUnique = uniqueWordsCaseInsensitive(next);
            setWordBank((prevBank) =>
                prevBank.filter(
                    (w) =>
                        String(w).toLowerCase() !== String(word).toLowerCase()
                )
            );

            clearTextOnly();
            return nextUnique;
        });
    };

    const validateTopic = () => {
        const tt = String(topic || "").trim();
        setTopicError("");
        setGlobalError("");
        setToast("");

        if (!tt) {
            setTopicError("Please enter a topic (e.g. Food, Travel, Work).");
            topicRef.current?.focus?.();
            return { ok: false };
        }

        if (isProbablyGibberishTopic(tt)) {
            setTopicError(
                "I couldn’t understand this topic. Try a clearer word or phrase like “Food”, “Travel”, “Shopping”, “Health”, etc."
            );
            topicRef.current?.focus?.();
            return { ok: false };
        }

        return { ok: true, topic: tt };
    };

    const generateWordsOnly = async () => {
        const v = validateTopic();
        if (!v.ok) return null;

        const res = await apiGenerateTopicWords({
            topic: v.topic,
            level,
            numberOfWords: count,
        });

        const words = uniqueWordsCaseInsensitive(res?.words || []);
        setGeneratedWords(words);
        setWordBank(shuffleArray(words));
        clearTextOnly();
        return words;
    };

    const generateTextFromCurrentWords = async (words) => {
        const ww = uniqueWordsCaseInsensitive(words || generatedWords);
        if (!ww.length) return;

        const res = await apiGenerateStoryFromWords({
            words: ww,
            level,
            topicHint: String(topic || "").trim(),
        });

        const rawText = String(res?.text || "").trim();
        const answers = Array.isArray(res?.answers) ? res.answers : [];

        const textWithGaps = rawText.replace(/\{\s*GAP\s*\}/gi, "__________");

        setGeneratedText(buildPrettyText(textWithGaps));
        setGeneratedAnswers(answers);
    };

    const generateWorksheet = async () => {
        const v = validateTopic();
        if (!v.ok) return;

        setIsGenerating(true);
        setGlobalError("");
        setToast("");
        try {
            const words = await generateWordsOnly();
            if (words?.length) {
                await generateTextFromCurrentWords(words);
                window.setTimeout(() => {
                    contentTopRef.current?.scrollIntoView?.({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 50);
            }
        } catch (e) {
            setGlobalError(friendlyApiError(e));
        } finally {
            setIsGenerating(false);
        }
    };

    const regenerateText = async () => {
        setGlobalError("");
        setToast("");
        setIsGenerating(true);
        try {
            await generateTextFromCurrentWords(generatedWords);
            window.setTimeout(() => {
                contentTopRef.current?.scrollIntoView?.({
                    behavior: "smooth",
                    block: "start",
                });
            }, 50);
        } catch (e) {
            setGlobalError(friendlyApiError(e));
        } finally {
            setIsGenerating(false);
        }
    };

    const shuffleWordBank = () => {
        setWordBank(shuffleArray(generatedWords));
        setToast("Word bank shuffled.");
        window.setTimeout(() => setToast(""), 900);
    };

    const buildCopyPayload = () => {
        const parts = [];

        if (showWordBank && wordBank?.length) {
            parts.push(`Word bank: ${wordBank.join(", ")}`);
            parts.push("");
        }

        if (generatedText) {
            parts.push(generatedText);
        }

        if (showAnswers && generatedAnswers?.length) {
            parts.push("");
            parts.push("Answers (gap order):");
            generatedAnswers.forEach((a, idx) => {
                parts.push(`${idx + 1}. ${String(a)}`);
            });
        }

        return parts.join("\n");
    };

    const copyWorksheet = async () => {
        if (!generatedText && !(showWordBank && wordBank?.length)) return;
        try {
            await navigator.clipboard.writeText(buildCopyPayload());
            setToast("Copied.");
            window.setTimeout(() => setToast(""), 900);
        } catch {
            setGlobalError("Couldn’t copy. Please copy manually.");
        }
    };

    const canGenerate = !isGenerating;
    const hasWords = generatedWords.length > 0;
    const hasText = !!generatedText;

    const coverage = useMemo(
        () => computeCoverage(generatedWords, generatedAnswers),
        [generatedWords, generatedAnswers]
    );

    return (
        <Page
            title={"Essay"}
            subtitle={"Create an essay assignment "}
        >
            <style>{`
                @keyframes gl_skeleton {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                .gl_vocab_grid {
                    box-sizing: border-box;
                }

                /* Collapse to 1 column on smaller screens */
                @media (max-width: 980px) {
                    .gl_vocab_grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            <div className="gl_vocab_grid" style={styles.grid}>
                {/* LEFT: SETUP (dominant, ~60%) */}
                <div style={styles.setupCol}>
                    <Input
                        inputRef={topicRef}
                        placeholder="Enter topic (e.g. Food)"
                        value={topic}
                        onChange={(v) => {
                            setTopic(v);
                            if (topicError) setTopicError("");
                            if (globalError) setGlobalError("");
                            if (toast) setToast("");
                        }}
                        charLimit={80}
                        shuffleItems={[
                            "Food",
                            "Travel",
                            "Technology",
                            "Education",
                            "Health",
                        ]}
                        shuffleTitle="Random topic"
                        shuffleSymbol="🔀"
                    />

                    {topicError && (
                        <div style={{marginTop: 10, ...styles.errorBox}}>
                            {topicError}
                        </div>
                    )}

                    <div>

                        <div style={styles.rowWrap}>
                            {LEVELS.map((l) => (
                                <Chip
                                    key={l}
                                    active={level === l}
                                    onClick={() => {
                                        setLevel(l);
                                        clearTextOnly();
                                        setToast("");
                                        setGlobalError("");
                                    }}
                                >
                                    {l}
                                </Chip>
                            ))}
                        </div>
                    </div>

                    <div style={{marginBottom: "25px"}}>
                        <NumberSlider
                            value={questionsCount}
                            onChange={(v) => {
                                setQuestionsCount(v);
                                clearTextOnly();
                                setToast("");
                                setGlobalError("");
                            }}
                            min={5}
                            max={10}
                            step={1}
                            //wordSingular="word"
                            wordPlural="questions (with A/B/C/D options)"
                            defaultValue={5}
                            persistKey="gl.createAssignment.tasksCount"
                        />
                    </div>

                    <AwesomeActionButton
                        size="regular"
                        onClick={generateWorksheet}
                        disabled={!canGenerate}
                        variant="ghost"
                        style={styles.darkBtn}
                    >
                        {isGenerating ? "Generating…" : "Generate worksheet"}
                    </AwesomeActionButton>


                    {globalError && <div style={styles.errorBox}>{globalError}</div>}
                    {toast && <div style={styles.toast}>{toast}</div>}
                </div>

                {/* RIGHT: Worksheet preview + Actions + Status stacked */}
                <div style={styles.rightCol}>
                    <div ref={contentTopRef}/>

                    <RectangleGroup title={"Worksheet preview"} style={styles.contentGroup}>
                        <div style={styles.contentScroll}>
                            {!hasWords ? (
                                <EmptyContent
                                    sourceText={"Enter topic + level, then click “Generate worksheet”."}
                                    subtitle={""}
                                />
                            ) : isGenerating ? (
                                <LoadingPreview styles={styles}/>
                            ) : !hasText ? (
                                <div style={styles.paper}>
                                    <div style={styles.miniMeta}>
                                        Your words are ready. Generate the worksheet to
                                        see the gap-fill text.
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {showWordBank && wordBank?.length > 0 && (
                                        <div style={styles.paper}>
                                            <div style={{ marginTop: 8, ...styles.rowWrap }}>
                                                {wordBank.map((w) => (
                                                    <div
                                                        key={`wb_${w}`}
                                                        style={styles.wordChip(false)}
                                                    >
                                                        {w}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={styles.paper}>
                                        <div style={styles.textPreview}>{generatedText}</div>
                                    </div>

                                    {showAnswers && !!generatedAnswers?.length && (
                                        <div style={styles.paper}>
                                            <div style={styles.miniMeta}>
                                                Answers (gap order)
                                            </div>
                                            <div style={{ marginTop: 10, ...styles.answersBox }}>
                                                {generatedAnswers.map((a, idx) => (
                                                    <div
                                                        key={`${a}_${idx}`}
                                                        style={styles.answerItem}
                                                    >
                                                        <div style={styles.answerIndex}>
                                                            {idx + 1}.
                                                        </div>
                                                        <div>{String(a)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </RectangleGroup>
                </div>
            </div>
        </Page>
    );
}