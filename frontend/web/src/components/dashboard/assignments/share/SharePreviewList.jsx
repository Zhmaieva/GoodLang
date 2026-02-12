import React, { useMemo } from "react";
import DynamicList from "../../DynamicList.jsx"; // adjust path if needed
import ChooseOptionGrammarReadonlyTask from "../tasks/ChooseOptionGrammarReadonlyTask.jsx"; // adjust path if needed
import { themeStyles as theme } from "../../../../utils/theme.js";

function safeStr(x) {
    return String(x ?? "").trim();
}

export default function SharePreviewList({
                                             tasks = [],
                                             style,
                                         }) {
    const items = useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);

    const wrapStyle = useMemo(() => ({
        width: "100%",
        minWidth: 0,
        ...style,
    }), [style]);

    return (
        <div style={wrapStyle}>
            <DynamicList
                ariaLabel="Assignment preview"
                items={items}
                renderItem={(task, index) => {
                    const type = safeStr(task?.taskType);

                    // ✅ for now: only gap
                    if (type === "gap") {
                        return (
                            <ChooseOptionGrammarReadonlyTask
                                key={safeStr(task?.id) || `${type}-${index}`}
                                task={task}
                                taskNumber={
                                    Number.isFinite(Number(task?.taskOrderNumber))
                                        ? Number(task.taskOrderNumber)
                                        : index + 1
                                }
                            />
                        );
                    }

                    // fallback (unknown type)
                    return (
                        <div
                            key={safeStr(task?.id) || `unknown-${index}`}
                            style={{
                                border: theme.borders.card,
                                borderRadius: theme.radius.card,
                                background: theme.surface,
                                padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
                                opacity: 0.65,
                                fontFamily: theme.fontFamily,
                                color: theme.textMutedDark,
                            }}
                        >
                            Unsupported task type: {type || "unknown"}
                        </div>
                    );
                }}
            />
        </div>
    );
}
