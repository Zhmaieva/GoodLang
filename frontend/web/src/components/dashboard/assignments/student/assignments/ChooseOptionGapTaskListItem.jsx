import React, { useMemo } from "react";
import ItemCard from "../../../ItemCard.jsx";

function splitByGap(text) {
    const s = String(text ?? "");
    const token = "{GAP}";
    const idx = s.indexOf(token);
    if (idx === -1) return { before: s, after: "" };
    return { before: s.slice(0, idx), after: s.slice(idx + token.length) };
}

function trimOneLine(s, max = 70) {
    const t = String(s ?? "").replace(/\s+/g, " ").trim();
    if (t.length <= max) return t;
    return t.slice(0, max - 1).trimEnd() + "…";
}

export default function ChooseOptionGapTaskListItem({
                                                        task,
                                                        index,
                                                        total,
                                                        selected,
                                                        answer,
                                                        onClick,
                                                    }) {
    const { before, after } = useMemo(
        () => splitByGap(task?.textToTranslate),
        [task?.textToTranslate]
    );

    const filled =
        answer?.selected != null ? String(answer.selected) : null;

    const gapShown =
        filled == null ? "____" : filled === "" ? "" : filled;

    const subtitle = trimOneLine(`${before}${gapShown}${after}`, 64);

    return (
        <ItemCard
            title="Choose option"
            subtitle={subtitle}
            overTitle={`${index + 1}/${total}`}
            rightBigText={answer?.submitted ? "✓" : ""}
            selected={selected}
            selectedShift
            suppressHand
            onClick={onClick}
        />
    );
}
