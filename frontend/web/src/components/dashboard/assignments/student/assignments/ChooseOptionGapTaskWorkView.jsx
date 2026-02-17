import React, { useMemo, useState } from "react";
import { theme } from "../../../../../App.jsx";
import { Chip } from "../../../Chip.jsx";
import AwesomeActionButton from "../../../AwesomeActionButton.jsx";

function splitByGap(text) {
    const s = String(text ?? "");
    const token = "{GAP}";
    const idx = s.indexOf(token);
    if (idx === -1) return { before: s, after: "" };
    return { before: s.slice(0, idx), after: s.slice(idx + token.length) };
}

export default function ChooseOptionGapTaskWorkView({
                                                        task,
                                                        initialSelected = null,        // string|null
                                                        initialSubmitted = false,      // boolean
                                                        onSelect,                      // (value: string) => void
                                                        onSubmit,                      // async (selected: string) => void | boolean
                                                        onBack,
                                                        onNext,
                                                        canBack = false,
                                                        canNext = false,
                                                    }) {
    const t = theme.chooseOptionGapTaskWorkView;


    const { before, after } = useMemo(
        () => splitByGap(task?.textToTranslate),
        [task?.textToTranslate]
    );

    const options = useMemo(() => {
        const arr = Array.isArray(task?.options) ? task.options : [];
        return arr.map((x) => (x == null ? "" : String(x)));
    }, [task?.options]);

    const [selected, setSelected] = useState(initialSelected);  // ✅ init from parent
    const [submitted, setSubmitted] = useState(initialSubmitted);

    const selectedText = selected == null ? "" : String(selected);

    const handleSubmit = async () => {
        if (submitted) return;
        if (selected == null) return;

        const ok = await onSubmit?.(selectedText);
        if (ok === false) return;

        setSubmitted(true);
    };

    const answerLine = useMemo(() => {
        if (!submitted) return "";
        const shown = selectedText === "" ? "— (no article)" : `"${selectedText}"`;
        return `Your answer: ${shown}`;
    }, [submitted, selectedText]);

    const showBack = Boolean(canBack);
    const showNext = Boolean(submitted && canNext);
    const showSubmit = Boolean(!submitted);

    return (
        <div style={t.wrap}>
            <div style={t.card}>
                <div style={t.text}>
                    {before}
                    <span
                        style={{
                            ...t.gapInline,
                            ...(selectedText === "" && selected != null ? t.gapInlineEmpty : null),
                        }}
                    >
                        {selected == null ? "" : selectedText}
                    </span>
                    {after}
                </div>

                <div style={t.optionsWrap}>
                    {options.map((opt, i) => {
                        const label = opt === "" ? "—" : opt;
                        const isActive = selected === opt;

                        return (
                            <Chip
                                key={`${opt}__${i}`}
                                active={isActive}
                                title={opt === "" ? "Empty" : opt}
                                // ✅ not clickable upon submission
                                onClick={
                                    submitted
                                        ? undefined
                                        : () => {
                                            setSelected(opt);
                                            onSelect?.(opt);     // ✅ persist in parent
                                        }
                                }

                            >
                                {label}
                            </Chip>
                        );
                    })}
                </div>

                {/* actions: Back + (Submit OR Next) in same row */}
                <div style={t.actionsRow}>
                    <div
                        style={{
                            ...t.fadeSlot,
                            ...(showBack ? t.fadeSlotShown : null),
                        }}
                    >
                        {showBack ? (
                            <AwesomeActionButton
                                variant="ghost"
                                size="regular"
                                symbol={"←"}
                                onClick={onBack}
                            >
                                Back
                            </AwesomeActionButton>
                        ) : null}
                    </div>

                    <div style={{ flex: 1 }} />

                    <div
                        style={{
                            ...t.fadeSlot,
                            ...(showSubmit ? t.fadeSlotShown : null),
                        }}
                    >
                        {showSubmit ? (
                            <AwesomeActionButton
                                variant="ghost"
                                size="regular"
                                symbol={"✓"}
                                onClick={handleSubmit}
                                disabled={selected == null || submitted}
                            >
                                Submit
                            </AwesomeActionButton>
                        ) : null}
                    </div>

                    <div
                        style={{
                            ...t.fadeSlot,
                            ...(showNext ? t.fadeSlotShown : null),
                        }}
                    >
                        {showNext ? (
                            <AwesomeActionButton
                                variant="ghost"
                                size="regular"
                                symbol={"→"}
                                onClick={onNext}
                            >
                                Next
                            </AwesomeActionButton>
                        ) : null}
                    </div>
                </div>

                {/* answer panel (expand + fade after submit) */}
                <div
                    style={{
                        ...t.answerWrap,
                        ...(submitted ? t.answerWrapShown : null),
                    }}
                >
                    <div style={t.answerCard}>
                        <div style={t.answerText}>{answerLine}</div>
                        <div style={t.answerText}>
                            Clarification will appear here after we connect correct answer / rule hint.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
