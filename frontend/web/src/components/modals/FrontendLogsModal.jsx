import React, {useEffect, useState} from "react";
import ModalShell from "./ModalShell.jsx";
import {getFrontendLogs} from "../../services/logger.js";
import {
    APP_BORDER_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_SURFACE_MUTED_COLOR,
    APP_TEXT_COLOR,
} from "../../theme.js";

const LEVEL_COLORS = {
    error: "#b42318",
    warn: "#9a6700",
    info: "#175cd3",
    log: "#344054",
    debug: "#667085",
};

export default function FrontendLogsModal({open, onClose, theme}) {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        if (!open) return undefined;

        setEntries(getFrontendLogs());
        return undefined;
    }, [open]);

    const text = theme?.text ?? APP_TEXT_COLOR;
    const muted = theme?.muted ?? APP_MUTED_TEXT_COLOR;
    const border = theme?.border ?? APP_BORDER_COLOR;
    const mutedSurface = theme?.surfaceMuted ?? APP_SURFACE_MUTED_COLOR;

    return (
        <ModalShell
            open={open}
            id="frontend-logs-modal"
            theme={theme}
            title="Frontend logs"
            subtitle={`${entries.length} entr${entries.length === 1 ? "y" : "ies"} from this page load.`}
            onClose={onClose}
            maxWidth={880}
            width="94%"
            titleStyle={{fontSize: "1.75rem"}}
            panelStyle={{maxHeight: "min(88dvh, 780px)"}}
        >
            <div
                style={{
                    display: "grid",
                    gap: 10,
                    maxHeight: "min(62dvh, 570px)",
                    overflowY: "auto",
                    WebkitOverflowScrolling: "touch",
                    paddingRight: 4,
                }}
            >
                {entries.length === 0 ? (
                    <p style={{margin: 0, color: muted}}>No logs have been recorded.</p>
                ) : [...entries].reverse().map((entry, reversedIndex) => (
                    <article
                        key={`${entry.timestamp}-${entries.length - reversedIndex}`}
                        style={{
                            padding: "12px 14px",
                            border: `1px solid ${border}`,
                            borderRadius: 12,
                            background: mutedSurface,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "baseline",
                                flexWrap: "wrap",
                                gap: "6px 10px",
                                marginBottom: 7,
                                fontSize: 12,
                            }}
                        >
                            <strong
                                style={{
                                    color: LEVEL_COLORS[entry.level] || text,
                                    textTransform: "uppercase",
                                }}
                            >
                                {entry.level}
                            </strong>
                            <time dateTime={entry.timestamp} style={{color: muted}}>
                                {new Date(entry.timestamp).toLocaleString()}
                            </time>
                            <span style={{color: muted}}>{entry.source}</span>
                        </div>
                        <pre
                            style={{
                                margin: 0,
                                color: text,
                                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                                fontSize: 12,
                                lineHeight: 1.45,
                                whiteSpace: "pre-wrap",
                                overflowWrap: "anywhere",
                            }}
                        >
                            {entry.message || "(empty log entry)"}
                        </pre>
                    </article>
                ))}
            </div>
        </ModalShell>
    );
}
