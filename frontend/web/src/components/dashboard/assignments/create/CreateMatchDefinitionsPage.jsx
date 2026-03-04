// CreateMatchDefinitionsPage.jsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import Page from "../../Page.jsx";
import RectangleGroup from "../../RectangleGroup.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";
import Input from "../../Input.jsx";
import NumberSlider from "../../NumberSlider.jsx";
import DynamicList from "../../DynamicList.jsx";
import EmptyContent from "../../EmptyContent.jsx";
import { Chip } from "../../Chip.jsx";
import { theme } from "../../../../App.jsx";

// ==========================================================
// CreateMatchDefinitionsPage (GoodLang)
// - Build "match" assignments: Term ↔ Definition pairs
// - Supports quick import (one pair per line: "term - definition")
// - Has central editor + right preview/summary panel
// ==========================================================

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

function normalizeText(s) {
    return String(s ?? "")
        .replace(/\s+/g, " ")
        .trim();
}

function clamp(n, a, b) {
    const x = Number.isFinite(n) ? n : a;
    return Math.max(a, Math.min(b, x));
}

function uid() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function parsePairsFromText(text) {
    const raw = String(text ?? "");
    const lines = raw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    const pairs = [];
    for (const line of lines) {
        // accepted separators: " - ", " — ", ":", "|"
        const split =
            line.includes(" — ")
                ? line.split(" — ")
                : line.includes(" - ")
                    ? line.split(" - ")
                    : line.includes(":")
                        ? line.split(":")
                        : line.includes("|")
                            ? line.split("|")
                            : null;

        if (!split || split.length < 2) continue;

        const left = normalizeText(split[0]);
        const right = normalizeText(split.slice(1).join(" ").replace(/^\s*[-—:|]\s*/, ""));

        if (!left || !right) continue;

        pairs.push({
            id: uid(),
            term: left,
            definition: right,
        });
    }
    return pairs;
}

function isProbablyGibberish(s) {
    const t = normalizeText(s);
    if (!t) return true;
    if (t.length < 2) return true;
    if (t.length > 120) return true;

    const hasLetter = /[a-zA-Zа-яА-ЯіїєґІЇЄҐ]/.test(t);
    if (!hasLetter) return true;

    // too many weird symbols ratio
    const cleaned = t.replace(/[a-zA-Zа-яА-ЯіїєґІЇЄҐ0-9\s.,!?'"()\-—:;/%]/g, "");
    const weirdRatio = cleaned.length / Math.max(1, t.length);
    if (weirdRatio > 0.25) return true;

    return false;
}

function validatePairs(pairs) {
    const errors = [];
    const seenTerm = new Map();
    const seenDef = new Map();

    pairs.forEach((p, idx) => {
        const term = normalizeText(p.term);
        const def = normalizeText(p.definition);

        if (!term || !def) {
            errors.push({ idx, code: "empty_pair" });
            return;
        }

        if (isProbablyGibberish(term) || isProbablyGibberish(def)) {
            errors.push({ idx, code: "gibberish" });
            return;
        }

        const termKey = term.toLowerCase();
        const defKey = def.toLowerCase();

        if (seenTerm.has(termKey)) {
            errors.push({ idx, code: "duplicate_term", otherIdx: seenTerm.get(termKey) });
        } else {
            seenTerm.set(termKey, idx);
        }

        if (seenDef.has(defKey)) {
            errors.push({ idx, code: "duplicate_definition", otherIdx: seenDef.get(defKey) });
        } else {
            seenDef.set(defKey, idx);
        }
    });

    return errors;
}

function humanizeError(e) {
    if (!e) return "";
    if (e.code === "empty_pair") return "Empty term/definition.";
    if (e.code === "gibberish") return "Looks unclear for AI (gibberish).";
    if (e.code === "duplicate_term") return "Duplicate term.";
    if (e.code === "duplicate_definition") return "Duplicate definition.";
    return "Invalid row.";
}

export function CreateMatchDefinitionsPage() {
    // meta
    const [title, setTitle] = useState("Match definitions");
    const [level, setLevel] = useState("B1");

    // builder state
    const [pairs, setPairs] = useState(() => [
        { id: uid(), term: "sustain", definition: "to keep something going over time" },
        { id: uid(), term: "impact", definition: "a strong effect or influence" },
    ]);

    // quick add
    const [newTerm, setNewTerm] = useState("");
    const [newDef, setNewDef] = useState("");

    // import
    const [importOpen, setImportOpen] = useState(false);
    const [importText, setImportText] = useState("");

    // options
    const [minPairs, setMinPairs] = useState(6);
    const [shufflePreview, setShufflePreview] = useState(true);
    const [showNumbers, setShowNumbers] = useState(true);

    // ui state
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const listRef = useRef(null);

    const errors = useMemo(() => validatePairs(pairs), [pairs]);
    const hasErrors = errors.length > 0;

    const pairsCount = pairs.length;

    const canSave = useMemo(() => {
        if (!title.trim()) return false;
        if (pairsCount < 2) return false;
        if (pairsCount < minPairs) return false;
        if (hasErrors) return false;
        return true;
    }, [title, pairsCount, minPairs, hasErrors]);

    const preview = useMemo(() => {
        const base = pairs
            .map((p) => ({
                id: p.id,
                term: normalizeText(p.term),
                definition: normalizeText(p.definition),
            }))
            .filter((p) => p.term && p.definition);

        if (!shufflePreview) return base;

        // deterministic-ish shuffle per render
        const a = [...base];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }, [pairs, shufflePreview]);

    const previewRight = useMemo(() => {
        const defs = preview.map((p) => p.definition);
        if (!shufflePreview) return defs;

        const a = [...defs];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }, [preview, shufflePreview]);

    const addPair = useCallback(() => {
        setError(null);

        const t = normalizeText(newTerm);
        const d = normalizeText(newDef);

        if (!t || !d) {
            setError("Please enter both term and definition.");
            return;
        }

        if (isProbablyGibberish(t) || isProbablyGibberish(d)) {
            setError("This looks unclear (gibberish). Please rephrase.");
            return;
        }

        setPairs((prev) => [{ id: uid(), term: t, definition: d }, ...prev]);
        setNewTerm("");
        setNewDef("");

        try {
            if (listRef.current?.scrollToTop) listRef.current.scrollToTop();
        } catch {}
    }, [newTerm, newDef]);

    const removePair = useCallback((id) => {
        setPairs((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const updatePair = useCallback((id, patch) => {
        setPairs((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
        );
    }, []);

    const importPairs = useCallback(() => {
        setError(null);

        const parsed = parsePairsFromText(importText);
        if (!parsed.length) {
            setError("No valid pairs found. Use format: term - definition (one per line).");
            return;
        }

        // merge, avoid exact duplicates (term+def)
        const existing = new Set(
            pairs.map((p) => `${normalizeText(p.term).toLowerCase()}__${normalizeText(p.definition).toLowerCase()}`)
        );

        const merged = [];
        for (const p of parsed) {
            const key = `${normalizeText(p.term).toLowerCase()}__${normalizeText(p.definition).toLowerCase()}`;
            if (existing.has(key)) continue;
            merged.push(p);
            existing.add(key);
        }

        if (!merged.length) {
            setError("All imported pairs already exist.");
            return;
        }

        setPairs((prev) => [...merged, ...prev]);
        setImportText("");
        setImportOpen(false);
    }, [importText, pairs]);

    const clearAll = useCallback(() => {
        setError(null);
        setPairs([]);
    }, []);

    const fillDemo = useCallback(() => {
        setError(null);
        setPairs([
            { id: uid(), term: "reliable", definition: "able to be trusted; dependable" },
            { id: uid(), term: "increase", definition: "to become larger in amount or number" },
            { id: uid(), term: "reduce", definition: "to make something smaller or less" },
            { id: uid(), term: "solve", definition: "to find an answer to a problem" },
            { id: uid(), term: "avoid", definition: "to stay away from something" },
            { id: uid(), term: "improve", definition: "to make something better" },
        ]);
    }, []);

    const onSave = useCallback(async () => {
        setError(null);

        if (!canSave) {
            setError("Please fix errors and ensure you have enough pairs.");
            return;
        }

        setSaving(true);
        try {
            // TODO: integrate API
            // payload example:
            // {
            //   title, level, minPairs, options: { shufflePreview, showNumbers }, pairs
            // }
            await new Promise((r) => setTimeout(r, 450));
        } catch (e) {
            setError("Something went wrong while saving.");
        } finally {
            setSaving(false);
        }
    }, [canSave]);

    const headerRight = useMemo(() => {
        return (
            <div style={{ display: "flex", gap: theme.spacing?.xs ?? 8, alignItems: "center" }}>
                <AwesomeActionButton
                    title={saving ? "Saving..." : "Save"}
                    onClick={onSave}
                    isLoading={saving}
                    isDisabled={!canSave || saving}
                    size="regular"
                    variant="accent"
                />
            </div>
        );
    }, [onSave, saving, canSave]);

    const layout = useMemo(() => {
        const gap = theme.spacing?.lg ?? 18;

        return {
            wrap: {
                display: "grid",
                gridTemplateColumns: "1fr 360px",
                gap,
                alignItems: "start",
            },
            leftCol: {
                display: "flex",
                flexDirection: "column",
                gap,
                minWidth: 0,
            },
            rightCol: {
                display: "flex",
                flexDirection: "column",
                gap,
                position: "sticky",
                top: theme.layout?.stickyTop ?? 16,
                alignSelf: "start",
            },
        };
    }, []);

    return (
        <Page
            title="Create match definitions"
            subtitle="Build term ↔ definition pairs for a matching task"
            headerRight={headerRight}
        >
            <div style={layout.wrap}>
                {/* =========================
                   LEFT (central) column
                ========================== */}
                <div style={layout.leftCol}>
                    {/* Meta */}
                    <RectangleGroup
                        title="Task settings"
                        subtitle="Title, level, and requirements"
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing?.md ?? 12 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: theme.spacing?.md ?? 12 }}>
                                <div style={{ minWidth: 0 }}>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e?.target?.value ?? "")}
                                        placeholder="Task title (e.g., Environment vocabulary)"
                                        raw
                                    />
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: theme.spacing?.xs ?? 8 }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing?.xs ?? 8 }}>
                                        {LEVELS.map((lvl) => (
                                            <Chip
                                                key={lvl}
                                                label={lvl}
                                                isSelected={level === lvl}
                                                onClick={() => setLevel(lvl)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: theme.spacing?.md ?? 12 }}>
                                <div>
                                    <div style={{ ...theme.typography?.label, marginBottom: theme.spacing?.xs ?? 8 }}>
                                        Minimum pairs
                                    </div>
                                    <NumberSlider
                                        value={minPairs}
                                        onChange={(v) => setMinPairs(clamp(Number(v), 2, 30))}
                                        min={2}
                                        max={30}
                                    />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing?.xs ?? 8 }}>
                                    <div style={{ ...theme.typography?.label }}>Preview options</div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing?.xs ?? 8 }}>
                                        <Chip
                                            label="Shuffle"
                                            isSelected={shufflePreview}
                                            onClick={() => setShufflePreview((v) => !v)}
                                        />
                                        <Chip
                                            label="Show numbers"
                                            isSelected={showNumbers}
                                            onClick={() => setShowNumbers((v) => !v)}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: theme.spacing?.xs ?? 8 }}>
                                    <AwesomeActionButton
                                        title="Import"
                                        onClick={() => setImportOpen((v) => !v)}
                                        size="compact"
                                        variant="ghost"
                                    />
                                    <AwesomeActionButton
                                        title="Demo"
                                        onClick={fillDemo}
                                        size="compact"
                                        variant="ghost"
                                    />
                                    <AwesomeActionButton
                                        title="Clear"
                                        onClick={clearAll}
                                        size="compact"
                                        variant="ghost"
                                    />
                                </div>
                            </div>

                            {!!error && (
                                <div
                                    style={{
                                        ...theme.alert?.error,
                                    }}
                                >
                                    {error}
                                </div>
                            )}
                        </div>
                    </RectangleGroup>

                    {/* Import panel */}
                    {importOpen && (
                        <RectangleGroup
                            title="Quick import"
                            subtitle='One pair per line. Example: "term - definition"'
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing?.md ?? 12 }}>
                                <textarea
                                    value={importText}
                                    onChange={(e) => setImportText(e.target.value)}
                                    placeholder={`reliable - able to be trusted\nreduce - to make smaller\nimpact - a strong effect`}
                                    style={{
                                        width: "100%",
                                        minHeight: 160,
                                        resize: "vertical",
                                        padding: theme.spacing?.md ?? 12,
                                        borderRadius: theme.radius?.card ?? 16,
                                        border: theme.input?.border,
                                        outline: "none",
                                        fontFamily: theme.fontFamily?.mono ?? theme.fontFamily?.main,
                                        fontSize: theme.typography?.input?.fontSize ?? 14,
                                        background: theme.input?.bg,
                                        color: theme.colors?.text,
                                    }}
                                />

                                <div style={{ display: "flex", justifyContent: "flex-end", gap: theme.spacing?.xs ?? 8 }}>
                                    <AwesomeActionButton
                                        title="Cancel"
                                        onClick={() => setImportOpen(false)}
                                        size="regular"
                                        variant="ghost"
                                    />
                                    <AwesomeActionButton
                                        title="Add pairs"
                                        onClick={importPairs}
                                        size="regular"
                                        variant="accent"
                                    />
                                </div>
                            </div>
                        </RectangleGroup>
                    )}

                    {/* Add pair */}
                    <RectangleGroup
                        title="Add a pair"
                        subtitle="Term on the left, definition on the right"
                    >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: theme.spacing?.md ?? 12 }}>
                            <Input
                                value={newTerm}
                                onChange={(e) => setNewTerm(e?.target?.value ?? "")}
                                placeholder="Term"
                                raw
                            />
                            <Input
                                value={newDef}
                                onChange={(e) => setNewDef(e?.target?.value ?? "")}
                                placeholder="Definition"
                                raw
                            />
                            <AwesomeActionButton
                                title="Add"
                                onClick={addPair}
                                size="regular"
                                variant="accent"
                            />
                        </div>
                    </RectangleGroup>

                    {/* Pairs list */}
                    <RectangleGroup
                        title="Pairs"
                        subtitle={`${pairsCount} pair${pairsCount === 1 ? "" : "s"} · ${hasErrors ? `${errors.length} issue(s)` : "No issues"}`}
                    >
                        {pairs.length === 0 ? (
                            <EmptyContent
                                title="No pairs yet"
                                subtitle="Add a term and a definition, or import multiple pairs."
                                ctaTitle="Add demo pairs"
                                onCtaClick={fillDemo}
                            />
                        ) : (
                            <DynamicList ref={listRef}>
                                <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing?.sm ?? 10 }}>
                                    {pairs.map((p, idx) => {
                                        const rowErr = errors.find((e) => e.idx === idx);
                                        return (
                                            <div
                                                key={p.id}
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 1fr auto",
                                                    gap: theme.spacing?.md ?? 12,
                                                    alignItems: "start",
                                                    padding: theme.spacing?.sm ?? 10,
                                                    borderRadius: theme.radius?.card ?? 16,
                                                    border: rowErr ? theme.borders?.error : theme.borders?.soft,
                                                    background: theme.cards?.bg,
                                                }}
                                            >
                                                <div style={{ minWidth: 0 }}>
                                                    <Input
                                                        value={p.term}
                                                        onChange={(e) => updatePair(p.id, { term: e?.target?.value ?? "" })}
                                                        placeholder="Term"
                                                        raw
                                                    />
                                                    {rowErr && (
                                                        <div style={{ ...theme.typography?.hint, marginTop: theme.spacing?.xs ?? 8 }}>
                                                            {humanizeError(rowErr)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{ minWidth: 0 }}>
                                                    <Input
                                                        value={p.definition}
                                                        onChange={(e) => updatePair(p.id, { definition: e?.target?.value ?? "" })}
                                                        placeholder="Definition"
                                                        raw
                                                    />
                                                </div>

                                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                    <AwesomeActionButton
                                                        title="Remove"
                                                        onClick={() => removePair(p.id)}
                                                        size="compact"
                                                        variant="ghost"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </DynamicList>
                        )}
                    </RectangleGroup>
                </div>

                {/* =========================
                   RIGHT column
                ========================== */}
                <div style={layout.rightCol}>
                    <RectangleGroup
                        title="Summary"
                        subtitle="Validation and readiness"
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing?.sm ?? 10 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: theme.spacing?.sm ?? 10 }}>
                                <div style={theme.typography?.label}>Level</div>
                                <div style={theme.typography?.value}>{level}</div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: theme.spacing?.sm ?? 10 }}>
                                <div style={theme.typography?.label}>Pairs</div>
                                <div style={theme.typography?.value}>{pairsCount}</div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: theme.spacing?.sm ?? 10 }}>
                                <div style={theme.typography?.label}>Minimum required</div>
                                <div style={theme.typography?.value}>{minPairs}</div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: theme.spacing?.sm ?? 10 }}>
                                <div style={theme.typography?.label}>Status</div>
                                <div style={theme.typography?.value}>
                                    {canSave ? "Ready" : hasErrors ? "Fix issues" : pairsCount < minPairs ? "Add more pairs" : "Not ready"}
                                </div>
                            </div>

                            {hasErrors && (
                                <div style={{ ...theme.alert?.warning }}>
                                    {errors.slice(0, 4).map((e, i) => (
                                        <div key={`${e.idx}_${i}`} style={{ marginBottom: i === 3 ? 0 : theme.spacing?.xs ?? 8 }}>
                                            • Row {e.idx + 1}: {humanizeError(e)}
                                        </div>
                                    ))}
                                    {errors.length > 4 && <div>…and {errors.length - 4} more</div>}
                                </div>
                            )}
                        </div>
                    </RectangleGroup>

                    <RectangleGroup
                        title="Preview"
                        subtitle="How it looks for the student"
                    >
                        {preview.length === 0 ? (
                            <EmptyContent
                                title="Nothing to preview"
                                subtitle="Add at least 2 pairs to see the match preview."
                            />
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing?.md ?? 12 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing?.xs ?? 8 }}>
                                    <div style={theme.typography?.label}>Terms</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing?.xs ?? 8 }}>
                                        {preview.map((p, i) => (
                                            <div
                                                key={`t_${p.id}`}
                                                style={{
                                                    padding: theme.spacing?.sm ?? 10,
                                                    borderRadius: theme.radius?.card ?? 16,
                                                    border: theme.borders?.soft,
                                                    background: theme.cards?.bg,
                                                    ...theme.typography?.body,
                                                }}
                                            >
                                                {showNumbers ? `${i + 1}. ` : ""}{p.term}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing?.xs ?? 8 }}>
                                    <div style={theme.typography?.label}>Definitions</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing?.xs ?? 8 }}>
                                        {previewRight.map((d, i) => (
                                            <div
                                                key={`d_${i}`}
                                                style={{
                                                    padding: theme.spacing?.sm ?? 10,
                                                    borderRadius: theme.radius?.card ?? 16,
                                                    border: theme.borders?.soft,
                                                    background: theme.cards?.bg,
                                                    ...theme.typography?.body,
                                                }}
                                            >
                                                {showNumbers ? `${i + 1}. ` : ""}{d}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </RectangleGroup>

                    <RectangleGroup
                        title="Next"
                        subtitle="What you can add later"
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing?.xs ?? 8 }}>
                            <div style={theme.typography?.body}>• Tags (topic / unit)</div>
                            <div style={theme.typography?.body}>• AI “definition quality” check</div>
                            <div style={theme.typography?.body}>• Export to PDF</div>
                            <div style={theme.typography?.body}>• Auto-generate pairs from topic</div>
                        </div>
                    </RectangleGroup>
                </div>
            </div>
        </Page>
    );
}