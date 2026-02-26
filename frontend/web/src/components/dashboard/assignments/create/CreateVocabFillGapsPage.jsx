import React, { useMemo, useRef, useState } from "react";
import Page from "../../Page.jsx";
import RectangleGroup from "../../RectangleGroup.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";
import Input from "../../Input.jsx";
import NumberSlider from "../../NumberSlider.jsx";
import { Chip } from "../../Chip.jsx";
import { theme } from "../../../../App.jsx";
import EmptyContent from "../../EmptyContent.jsx";
import {
    apiGenerateStoryFromWords,
    apiGenerateTopicWords,
} from "../../../../services/api.js";

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

/**
 * Loading placeholder inside preview while text is being generated.
 * Uses lightweight inline styles + injected keyframes.
 */
function LoadingPreview({ styles }) {
    return (
        <div style={styles.paper}>
            <div style={styles.miniMeta}>Generating text… please wait.</div>
            <div style={{ height: 10 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
    );
}

export function CreateVocabFillGapsPage() {
    // Setup
    const [topic, setTopic] = useState("");
    const [topicError, setTopicError] = useState("");
    const [level, setLevel] = useState("A2");
    const [count, setCount] = useState(10);

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
            grid: {
                display: "flex",
                gap: t.rowGap,
                width: t.full,
                minHeight: t.minH0,
                alignItems: "stretch",
                paddingLeft: theme.layoutMetrics?.pagePad ?? 16,
                paddingRight: theme.layoutMetrics?.pagePad ?? 16,
                flexWrap: "wrap",
            },

            // --- Setup (left) ---
            setupCol: {
                width: t.leftWidth,
                minWidth: 320,
                flex: "0 0 auto",
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.gap,
                minHeight: 0,
            },

            // --- Content (center) ---
            contentCol: {
                flex: "1 1 520px",
                minWidth: 320,
                maxWidth: t.rightMaxWidth,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.gap,
                minHeight: 0,
            },

            contentGroup: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
            },

            contentScroll: {
                flex: 1,
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
                background: "transparent",
            },

            textPreview: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.subtitle,
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
            },

            // --- Actions (right) ---
            actionsCol: {
                width: 260,
                minWidth: 260,
                flex: "0 0 auto",
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.gap,
                minHeight: 0,
            },

            sticky: {
                position: "sticky",
                top: (theme.layoutMetrics?.pagePad ?? 16) + 8,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.gap,
            },

            rowWrap: {
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.rowGap,
                alignItems: "center",
            },

            miniMeta: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.small,
                lineHeight: theme.type.smallLineHeight,
                color: theme.textMuted,
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
                background: theme.textDark,
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
            title={"Vocabulary gap text generator"}
            subtitle={"Generate vocabulary and create a gap-fill text automatically"}
        >
            {/* keyframes for skeleton animation */}
            <style>{`
                @keyframes gl_skeleton {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            <div style={styles.grid}>
                {/* SETUP */}
                <div style={styles.setupCol}>
                    <RectangleGroup title={"Setup"}>
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
                        />

                        {topicError && (
                            <div style={{ marginTop: 10, ...styles.errorBox }}>
                                {topicError}
                            </div>
                        )}

                        <div style={{ marginTop: theme.spacing.rowGap }}>
                            <div style={styles.miniMeta}>Level</div>
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

                        <div style={{ marginTop: theme.spacing.rowGap }}>
                            <NumberSlider
                                value={count}
                                onChange={(v) => {
                                    setCount(v);
                                    clearTextOnly();
                                    setToast("");
                                    setGlobalError("");
                                }}
                                min={5}
                                max={30}
                                step={1}
                                wordSingular="word"
                                wordPlural="words"
                                postText="to generate"
                                subtitle="Choose how many vocabulary words to generate."
                            />
                        </div>

                        <div
                            style={{
                                marginTop: theme.spacing.rowGap,
                                ...styles.rowWrap,
                            }}
                        >
                            <AwesomeActionButton
                                size="regular"
                                onClick={generateWorksheet}
                                disabled={!canGenerate}
                                variant="ghost"
                                style={styles.darkBtn}
                            >
                                {isGenerating ? "Generating…" : "Generate worksheet"}
                            </AwesomeActionButton>

                            {hasWords && (
                                <AwesomeActionButton
                                    size="regular"
                                    variant="ghost"
                                    onClick={clearAll}
                                    disabled={!canGenerate}
                                >
                                    Clear
                                </AwesomeActionButton>
                            )}
                        </div>
                    </RectangleGroup>

                    {hasWords && (
                        <RectangleGroup title={"Words"}>
                            <div style={styles.miniMeta}>
                                Click a word to remove it. Total:{" "}
                                {generatedWords.length}
                                {hasText
                                    ? " · Text may become outdated after edits."
                                    : ""}
                            </div>

                            <div style={{ marginTop: 10, ...styles.rowWrap }}>
                                {generatedWords.map((w) => (
                                    <div
                                        key={w}
                                        style={styles.wordChip(hoveredWord === w)}
                                        onClick={() => removeWord(w)}
                                        onMouseEnter={() => setHoveredWord(w)}
                                        onMouseLeave={() => setHoveredWord("")}
                                        title="Click to remove"
                                    >
                                        {w}
                                    </div>
                                ))}
                            </div>

                            {coverage.total > 0 && (
                                <div style={{ marginTop: 12 }}>
                                    <div style={styles.miniMeta}>
                                        Words used in gaps: {coverage.usedCount}/
                                        {coverage.total}
                                        {coverage.missing.length
                                            ? ` · Missing: ${coverage.missing.length}`
                                            : ""}
                                    </div>

                                    {!!coverage.missing.length && (
                                        <div style={{ marginTop: 8, ...styles.rowWrap }}>
                                            {coverage.missing.slice(0, 8).map((w) => (
                                                <div
                                                    key={`missing_${w}`}
                                                    style={styles.wordChip(false)}
                                                    title="Not used in gaps (yet)"
                                                >
                                                    {w}
                                                </div>
                                            ))}
                                            {coverage.missing.length > 8 && (
                                                <div style={styles.miniMeta}>
                                                    +{coverage.missing.length - 8} more
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </RectangleGroup>
                    )}

                    {globalError && <div style={styles.errorBox}>{globalError}</div>}
                    {toast && <div style={styles.toast}>{toast}</div>}
                </div>

                {/* CONTENT */}
                <div style={styles.contentCol}>
                    <div ref={contentTopRef} />
                    <RectangleGroup title={"Worksheet preview"} style={styles.contentGroup}>
                        <div style={styles.contentScroll}>
                            {!hasWords ? (
                                <EmptyContent
                                    sourceText={"Generate a worksheet"}
                                    subtitle={
                                        "Enter topic + level, then click “Generate worksheet”."
                                    }
                                />
                            ) : isGenerating ? (
                                <LoadingPreview styles={styles} />
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
                                            <div style={styles.miniMeta}>Word bank</div>
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

                {/* ACTIONS */}
                <div style={styles.actionsCol}>
                    <div style={styles.sticky}>
                        <RectangleGroup title={"Actions"}>
                            <div style={{ ...styles.rowWrap, alignItems: "stretch" }}>
                                <AwesomeActionButton
                                    size="regular"
                                    variant="ghost"
                                    onClick={regenerateText}
                                    disabled={!hasWords || !canGenerate}
                                    style={styles.darkBtn}
                                >
                                    {isGenerating ? "Generating…" : "Regenerate text"}
                                </AwesomeActionButton>

                                <AwesomeActionButton
                                    size="regular"
                                    variant="ghost"
                                    onClick={shuffleWordBank}
                                    disabled={!hasWords || !canGenerate}
                                >
                                    Shuffle word bank
                                </AwesomeActionButton>

                                <AwesomeActionButton
                                    size="regular"
                                    variant="ghost"
                                    onClick={() => setShowWordBank((v) => !v)}
                                    disabled={!hasWords}
                                >
                                    {showWordBank ? "Hide word bank" : "Show word bank"}
                                </AwesomeActionButton>

                                <AwesomeActionButton
                                    size="regular"
                                    variant="ghost"
                                    onClick={() => setShowAnswers((v) => !v)}
                                    disabled={!hasText || !generatedAnswers?.length}
                                >
                                    {showAnswers ? "Hide answers" : "Show answers"}
                                </AwesomeActionButton>

                                <div style={styles.subtleDivider} />

                                <AwesomeActionButton
                                    size="regular"
                                    variant="ghost"
                                    onClick={copyWorksheet}
                                    disabled={!hasText && !(showWordBank && wordBank?.length)}
                                >
                                    Copy
                                </AwesomeActionButton>

                                <AwesomeActionButton
                                    size="regular"
                                    variant="ghost"
                                    onClick={() => {
                                        setToast("");
                                        setGlobalError("");
                                        clearTextOnly();
                                    }}
                                    disabled={!hasText}
                                >
                                    Clear text
                                </AwesomeActionButton>
                            </div>

                            {!hasText && hasWords && (
                                <div style={{ marginTop: 10, ...styles.miniMeta }}>
                                    Tip: “Regenerate text” uses the current word list.
                                </div>
                            )}
                        </RectangleGroup>

                        <RectangleGroup title={"Status"}>
                            <div style={styles.miniMeta}>
                                Topic:{" "}
                                <span style={{ color: theme.textDark }}>
                                    {String(topic || "").trim() || "—"}
                                </span>
                            </div>
                            <div style={{ marginTop: 6, ...styles.miniMeta }}>
                                Level:{" "}
                                <span style={{ color: theme.textDark }}>{level}</span>
                            </div>
                            <div style={{ marginTop: 6, ...styles.miniMeta }}>
                                Words:{" "}
                                <span style={{ color: theme.textDark }}>
                                    {generatedWords.length}
                                </span>
                            </div>
                            <div style={{ marginTop: 6, ...styles.miniMeta }}>
                                Coverage:{" "}
                                <span style={{ color: theme.textDark }}>
                                    {coverage.usedCount}/{coverage.total}
                                </span>
                            </div>
                        </RectangleGroup>
                    </div>
                </div>
            </div>
        </Page>
    );
}