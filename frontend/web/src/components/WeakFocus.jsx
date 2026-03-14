import { useNavigate } from "react-router-dom";
import Trainer from "./training/Trainer.jsx";
import React, { useEffect, useState } from "react";
import { getAllStatistics } from "../services/dataService.js";

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
    const [btnHover, setBtnHover] = useState(false);

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
    const CARD_BG = "rgba(255, 253, 248, 0.88)";
    const CARD_BORDER = "rgba(255, 97, 56, 0.55)";
    const CARD_SHADOW = "0 8px 20px rgba(0,0,0,0.08)";

    const SOFT_INNER = "rgba(255, 250, 243, 0.92)";
    const SOFT_STROKE = "rgba(0,0,0,0.12)";
    const SOFT_STROKE_ACCENT = "rgba(255,97,56,0.55)";

    const cardStyle = {
        background: CARD_BG,
        border: `2px solid ${CARD_BORDER}`,
        borderRadius: 20,
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
        fontFamily: "Nunito, system-ui, sans-serif",
        fontWeight: 900,
        color: theme.text,
        fontSize: "1.15rem",
        lineHeight: 1.1,
    };

    const badgeStyle = {
        fontFamily: "Nunito, system-ui, sans-serif",
        fontWeight: 900,
        color: theme.text,
        background: SOFT_INNER,
        border: `2px solid ${SOFT_STROKE}`,
        borderRadius: 999,
        padding: "4px 10px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
        opacity: 0.95,
        whiteSpace: "nowrap",
    };

    const metaStyle = {
        marginTop: 8,
        fontFamily: "Nunito, system-ui, sans-serif",
        fontWeight: 700,
        color: theme.text,
        opacity: 0.8,
    };

    // ✅ spark track style you liked (no border)
    const sparkStyle = {
        marginTop: 10,
        height: 8,
        borderRadius: 999,
        background: "rgba(0,0,0,0.10)",
        border: "none",
        position: "relative",
        overflow: "hidden",
    };

    const barColor =
        status === "needs practice" ? "#ef476f" : status === "in progress" ? "#ffd166" : "#4ba36e";

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

    const commonButtonStyle = (theme, disabled, hovered) => ({
        appearance: "none",
        padding: "8px 14px",
        fontWeight: 800,
        fontSize: "0.9rem",
        lineHeight: 1,
        borderRadius: 999,
        background: disabled ? "#999" : theme.accent,
        color: "#fff",
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
        fontFamily: "Nunito, system-ui, sans-serif",
        whiteSpace: "nowrap",
        opacity: disabled ? 0.7 : 1,
        transform: hovered && !disabled ? "translateY(1px)" : "none",
        filter: hovered && !disabled ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
        cursor: disabled ? "not-allowed" : "pointer",
    });


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
                        <button
                            className="pill"
                            onMouseEnter={() => setBtnHover(true)}
                            onMouseLeave={() => setBtnHover(false)}
                            style={commonButtonStyle(theme, false, btnHover)}
                            onMouseDown={(e) => {
                                e.currentTarget.style.transform = "translateY(1px)";
                                e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.10)";
                            }}
                            onMouseUp={(e) => {
                                e.currentTarget.style.transform = "none";
                                e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.10)";
                            }}
                            onClick={() => {
                                const url = `/rule/${rule.rule}`;
                                window.open(url, "_blank", "noopener,noreferrer");
                            }}
                        >
                            Rule explanation
                        </button>
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
