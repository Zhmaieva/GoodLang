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
                                                        onSubmit,          // async (selected) => void | boolean
                                                        onPrev,            // () => void
                                                        onNext,            // () => void
                                                        canPrev = true,
                                                        canNext = true,
                                                    }) {
    const t = theme.chooseOptionGapTaskWorkView;

    const { before, after } = useMemo(
        () => splitByGap(task?.textToTranslate),
        [task?.textToTranslate]
    );

    const options = useMemo(() => {
        const arr = Array.isArray(task?.options) ? task.options : [];
        // Keep empty option as a real selectable option.
        return arr.map((x) => (x == null ? "" : String(x)));
    }, [task?.options]);

    const [selected, setSelected] = useState(null); // string|null
    const [submitted, setSubmitted] = useState(false);

    const selectedText = selected == null ? "" : String(selected);

    const handleSubmit = async () => {
        if (submitted) return;
        // allow submitting empty string if user explicitly selected it
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
                                onClick={() => {
                                    setSelected(opt);
                                    // keep submitted state; user can change before submitting
                                    if (submitted) setSubmitted(false);
                                }}
                            >
                                {label}
                            </Chip>
                        );
                    })}
                </div>

                <div style={t.actionsRow}>
                    <div style={t.navRow}>
                        <AwesomeActionButton
                            variant="ghost"
                            size="regular"
                            symbol={"←"}
                            onClick={onPrev}
                            disabled={!canPrev}
                        >
                            Prev
                        </AwesomeActionButton>

                        <AwesomeActionButton
                            variant="ghost"
                            size="regular"
                            symbol={"→"}
                            onClick={onNext}
                            disabled={!canNext || !submitted}
                        >
                            Next
                        </AwesomeActionButton>
                    </div>

                    <AwesomeActionButton
                        variant="ghost"
                        size="regular"
                        symbol={"✓"}
                        onClick={handleSubmit}
                        disabled={selected == null || submitted}
                    >
                        Submit
                    </AwesomeActionButton>
                </div>

                <div
                    style={{
                        ...t.answerWrap,
                        ...(submitted ? t.answerWrapShown : null),
                    }}
                >
                    <div style={t.answerCard}>
                        <div style={t.answerText}>{answerLine}</div>
                        <div style={t.answerText}>
                            {/* placeholder clarification text — plug real explanation later */}
                            Clarification will appear here after we connect correct answer / rule hint.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
