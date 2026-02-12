import React, { useMemo } from "react";
import { themeStyles as theme } from "../../../../utils/theme.js";
import {RULE_LABELS} from "../../../../utils/rules.js";

function safeStr(x) {
    return String(x ?? "").trim();
}


function replaceGap(text) {
    const s = safeStr(text);
    if (!s) return "";
    const token = theme.chooseOptionReadonlyTask?.gapToken || "____";
    return s.split("{GAP}").join(token);
}

export default function ChooseOptionGrammarReadonlyTask({
                                                            task,
                                                            taskNumber, // optional override
                                                            style,
                                                        }) {
    const t = theme.chooseOptionReadonlyTask;

    const model = useMemo(() => {
        const order =
            Number.isFinite(Number(taskNumber))
                ? Number(taskNumber)
                : (Number.isFinite(Number(task?.taskOrderNumber)) ? Number(task?.taskOrderNumber) : null);

        const ruleId = Array.isArray(task?.ruleIds) ? task.ruleIds[0] : "";
        const ruleLabel = RULE_LABELS?.[ruleId] || ruleId;

        const question = replaceGap(task?.textToTranslate);
        const options = Array.isArray(task?.options) ? task.options : [];
        const correct = safeStr(task?.correctAnswer);

        return { order, ruleLabel, question, options, correct };
    }, [task, taskNumber]);

    if (!task) return null;

    return (
        <div style={{ ...t.card, ...style }}>
            <div style={t.metaLine} title={model.ruleLabel}>
                {model.order ? `${model.order}. ` : ""}{model.ruleLabel || "Grammar task"}
            </div>

            <div style={t.question} title={model.question}>
                {model.question}
            </div>

            <div style={t.optionsWrap}>
                {model.options.map((opt, oi) => {
                    const text = safeStr(opt);
                    const isCorrect = text && model.correct && text === model.correct;

                    return (
                        <div
                            key={`${oi}-${text}`}
                            style={{
                                ...t.chip,
                                ...(isCorrect ? t.chipCorrect : null),
                            }}
                            aria-hidden
                        >
                            <div
                                style={{
                                    ...t.chipText,
                                    ...(isCorrect ? t.chipTextCorrect : null),
                                }}
                                title={text}
                            >
                                {`${text}`}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
