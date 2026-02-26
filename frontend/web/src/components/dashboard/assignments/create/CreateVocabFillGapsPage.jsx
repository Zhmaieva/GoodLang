import React, { useMemo, useState } from "react";
import Page from "../../Page.jsx";
import RectangleGroup from "../../RectangleGroup.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";
import Input from "../../Input.jsx";
import NumberSlider from "../../NumberSlider.jsx";
import { Chip } from "../../Chip.jsx";
import { theme } from "../../../../App.jsx";
import EmptyContent from "../../EmptyContent.jsx";
import {apiGenerateStoryFromWords, apiGenerateTopicWords} from "../../../../services/api.js";

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

export function CreateVocabFillGapsPage() {
    const [topic, setTopic] = useState("");
    const [topicError, setTopicError] = useState("");

    const [level, setLevel] = useState("A2");
    const [count, setCount] = useState(10);

    const [generatedWords, setGeneratedWords] = useState([]);
    const [customWord, setCustomWord] = useState("");

    const [generatedText, setGeneratedText] = useState("");

    const generateWords = async () => {
        const t = String(topic || "").trim();
        setTopicError("");

        if (!t) {
            setTopicError("Please enter a topic (e.g. Food, Travel, Work).");
            return;
        }

        if (isProbablyGibberishTopic(t)) {
            setTopicError(
                "I couldn’t understand this topic. Try a clearer word or phrase like “Food”, “Travel”, “Shopping”, “Health”, etc."
            );
            return;
        }

        const { words } = await apiGenerateTopicWords({
            topic: t,
            level: level,
            numberOfWords: count,
        });

        setGeneratedWords(words);
        setGeneratedText("");
    };

    const removeWord = (word) => {
        setGeneratedWords((prev) => prev.filter((w) => w !== word));
    };

    const addCustomWord = () => {
        const w = String(customWord || "").trim();
        if (!w) return;
        if (generatedWords.includes(w)) return;
        setGeneratedWords((prev) => [...prev, w]);
        setCustomWord("");
    };

    const generateText = async () => {
        if (!generatedWords.length) return;

        const res = await apiGenerateStoryFromWords({
            words: generatedWords,
            level: level,
            topicHint: topic,
        });

        //console.log(res.text);     // story with {GAP}
        console.log(res.answers);  // ["telescope","orbit","gravity","scientist","crater"] matching the order of the gaps

        setGeneratedText(`   ${res.text}`.split('[[p]]').join('\n\n   '));
    };

    const styles = useMemo(() => ({
        row: {
            display: "flex",
            gap: theme.spacing.gap,
            width: "100%",
            minHeight: 0,
        },
        left: {
            width: "40%",
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.gap,
        },
        right: {
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.gap,
        },
        wordsRow: {
            display: "flex",
            flexWrap: "wrap",
            gap: theme.spacing.rowGap,
        },
        wordChip: {
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 12px",
            borderRadius: theme.radius.card,
            border: theme.borders.card,
            fontFamily: theme.fontFamily,
            fontSize: theme.type.subtitle,
            background: "transparent",
            cursor: "pointer",
            userSelect: "none",
            transition: `background ${theme.motion.fast} ${theme.motion.ease}`,
        },
        textPreview: {
            fontFamily: theme.fontFamily,
            fontSize: theme.type.subtitle,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
        },
        errorBox: {
            marginTop: theme.spacing.rowGap,
            fontFamily: theme.fontFamily,
            fontSize: theme.type.subtitle,
            lineHeight: theme.type.subtitleLineHeight,
            color: theme.textMutedDark,
            border: theme.borders.card,
            borderRadius: theme.radius.card,
            padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
            background: "transparent",
        },
        darkBtn: {
            background: theme.textDark,
            border: theme.borders.card,
            color: theme.bg,
        },
    }), []);

    return (
        <Page
            title={"Vocabulary gap text generator"}
            subtitle={"Generate vocabulary and create a gap-fill text automatically"}
        >
            <div style={styles.row}>
                {/* LEFT */}
                <div style={styles.left}>
                    <RectangleGroup title={"Topic"}>
                        <Input
                            placeholder="Enter topic (e.g. Food)"
                            value={topic}
                            onChange={(v) => {
                                setTopic(v);
                                if (topicError) setTopicError("");
                            }}
                            charLimit={80}
                        />

                        {topicError && (
                            <div style={styles.errorBox}>{topicError}</div>
                        )}
                    </RectangleGroup>

                    <RectangleGroup title={"Level"}>
                        <div style={styles.wordsRow}>
                            {LEVELS.map((l) => (
                                <Chip
                                    key={l}
                                    active={level === l}
                                    onClick={() => setLevel(l)}
                                >
                                    {l}
                                </Chip>
                            ))}
                        </div>
                    </RectangleGroup>

                    <NumberSlider
                        value={count}
                        onChange={setCount}
                        min={5}
                        max={30}
                        step={1}
                        wordSingular="word"
                        wordPlural="words"
                        postText="to generate"
                        subtitle="Choose how many vocabulary words to generate."
                    />

                    <AwesomeActionButton
                        size="regular"
                        onClick={generateWords}
                        disabled={!topic.trim()}
                        variant="ghost"
                        style={styles.darkBtn}
                    >
                        Generate words
                    </AwesomeActionButton>

                    {generatedWords.length > 0 && (
                        <RectangleGroup title={"Generated words"}>
                            <div style={styles.wordsRow}>
                                {generatedWords.map((w) => (
                                    <div
                                        key={w}
                                        style={styles.wordChip}
                                        onClick={() => removeWord(w)}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                "rgba(0,0,0,0.05)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background =
                                                "transparent")
                                        }
                                        title="Click to remove"
                                    >
                                        {w}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: theme.spacing.rowGap }}>
                                <Input
                                    placeholder="Add custom word"
                                    value={customWord}
                                    onChange={setCustomWord}
                                />

                                <div style={{ marginTop: 8 }}>
                                    <AwesomeActionButton
                                        size="regular"
                                        title="Add custom word"
                                        variant={"ghost"}
                                        onClick={addCustomWord}
                                        //style={styles.darkBtn}
                                    >
                                        Add a word
                                    </AwesomeActionButton>
                                </div>
                            </div>
                        </RectangleGroup>
                    )}
                </div>

                {/* RIGHT */}
                <div style={styles.right}>
                    <RectangleGroup title={"Generated text"}>
                        {!generatedWords.length ? (
                            <EmptyContent
                                sourceText={"Generate vocabulary first"}
                                subtitle={"Once you generate words, you’ll be able to create a gap-fill text."}
                            />
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: theme.spacing.gap,
                                }}
                            >
                                <AwesomeActionButton
                                    size="regular"
                                    variant="ghost"
                                    onClick={generateText}
                                    style={styles.darkBtn}
                                >
                                    Generate text
                                </AwesomeActionButton>

                                {generatedText && (
                                    <div style={styles.textPreview}>
                                        {generatedText}
                                    </div>
                                )}
                            </div>
                        )}
                    </RectangleGroup>
                </div>
            </div>
        </Page>
    );
}