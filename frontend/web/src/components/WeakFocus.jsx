import { useNavigate } from "react-router-dom";
import Trainer from "./training/Trainer.jsx";
import React, { useEffect, useState } from "react";
import { getAllStatistics } from "../services/dataService.js";
import { Button } from "./Buttons.jsx";
import { APP_ACCENT_COLOR, APP_BACKGROUND_COLOR } from "../theme.js";

export default function WeakFocus({ rows, pct, statusOf, fmtDate, theme, onTrainingComplete = (_) => {} }) {
    const navigate = useNavigate();

    const levels = {
        A1: 1,
        A2: 2,
        B1: 3,
        B2: 4,
    };

    const [rule, setRule] = useState(null);
    const [accuracy, setAccuracy] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [status, setStatus] = useState("bad");

    useEffect(() => {
        const badRules = rows
            .filter((r) => statusOf(r).cls === "bad")
            .sort(
                (a, b) =>
                    levels[a.level] - levels[b.level] ||
                    a.accuracy - b.accuracy ||
                    new Date(b.lastSeen) - new Date(a.lastSeen)
            );

        if (!badRules.length) {
            setRule(null);
            return;
        }

        setRule(badRules[0]);
        setAccuracy(badRules[0].accuracy);
        setStatus(badRules[0].status);
    }, [rows]);

    // ----- shared visual tokens (NON-header AccuracyKpi / TaskCard vibe) -----
    const CARD_BG = theme?.bg ?? APP_BACKGROUND_COLOR;
    const CARD_BORDER = "#000";
    const CARD_SHADOW = "none";

    const SOFT_INNER = theme?.bg ?? APP_BACKGROUND_COLOR;

    const cardStyle = {
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 5,
        boxShadow: CARD_SHADOW,
        padding: 18,
        userSelect: "none",
    };

    const headStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    };

    const titleStyle = {
        fontFamily: 'var(--font-family-base)',
        fontWeight: 700,
        color: "#000",
        fontSize: "1.15rem",
        lineHeight: 1.1,
    };

    const badgeStyle = {
        fontFamily: 'var(--font-family-base)',
        fontWeight: 700,
        color: "#fff",
        background: "#B85C4A",
        border: "none",
        borderRadius: 5,
        padding: "4px 10px",
        boxShadow: "none",
        opacity: 0.95,
        whiteSpace: "nowrap",
    };

    const metaStyle = {
        marginTop: 8,
        fontFamily: 'var(--font-family-base)',
        fontWeight: 600,
        color: "#000",
        opacity: 0.8,
    };

    // ✅ spark track style you liked (no border)
    const sparkStyle = {
        marginTop: 10,
        height: 8,
        borderRadius: 5,
        background: "#000",
        border: "none",
        position: "relative",
        overflow: "hidden",
    };

    const barColor = theme?.accent ?? APP_ACCENT_COLOR;

    const sparkFillStyle = (width) => ({
        display: "block",
        position: "absolute",
        height: "100%",
        width: `${width}%`,
        background: barColor,
        left: 0,
        top: 0,
    });

    const actionsWrapStyle = { margin: "16px 0px" };

    if (!rule) {
        return (
            <>
                <div className="section-title">Rule for practice</div>
                <div className="weak-list">
                    <div className="focus-card" style={cardStyle}>
                        <div className="focus-head" style={headStyle}>
                            <strong style={titleStyle}>No rules in the “red zone” 🎉</strong>
                        </div>
                        <div className="focus-meta" style={metaStyle}>
                            Keep practicing — the system will highlight a rule that needs attention as soon as one appears.
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="section-title">Rule for practice</div>
            <div className="weak-list">
                <div className="focus-card" style={cardStyle}>
                    <div className="focus-head" style={headStyle}>
                        <strong style={titleStyle}>{rule.ruleName}</strong>
                        <span className={"badge bad"} style={badgeStyle}>
                        {accuracy}%
                    </span>
                    </div>

                    <div className="focus-meta" style={metaStyle}>
                        Attempts: {rule.attemptsNumber} • Last practice: {fmtDate(rule.lastAttemptDate)}
                    </div>

                    <div className="bar" style={sparkStyle}>
                        <i style={sparkFillStyle(accuracy)} />
                    </div>

                    <div className="focus-actions" style={actionsWrapStyle}>
                        <Button
                            variant="offset"
                            compact
                            shadowColor={theme?.accent ?? APP_ACCENT_COLOR}
                            shadowOffset={0}
                            onClick={() => {
                                const url = `/rule/${rule.rule}`;
                                window.open(url, "_blank", "noopener,noreferrer");
                            }}
                        >
                            Rule explanation
                        </Button>
                    </div>

                    <Trainer
                        notFocused
                        nextRule={rule.rule}
                        theme={theme}
                        onAnswerEvaluated={() => {
                            const stats = getAllStatistics();
                            const updatedRule = stats.find((x) => x.rule === rule.rule);

                            setAttempts((prev) => prev + 1);
                            setAccuracy(updatedRule.accuracy);
                            setStatus(updatedRule.status);
                            setRule(updatedRule);

                            onTrainingComplete(stats);
                        }}
                    />
                </div>
            </div>
        </>
    );
}
