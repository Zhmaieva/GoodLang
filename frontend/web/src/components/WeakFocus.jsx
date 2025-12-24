import {useNavigate} from "react-router-dom";
import Trainer from "./training/Trainer.jsx";
import React, {useEffect, useState} from "react";
import {getTrainingLevel} from "../services/trainingDirector.js";
import {getAllStatistics} from "../services/dataService.js";

export default function WeakFocus({ rows, pct, statusOf, fmtDate, theme, onTrainingComplete= _=>{} }) {
    const navigate = useNavigate();

    const levels = {
        "A1" : 1,
        "A2" : 2,
        "B1" : 3,
        "B2" : 4,
    }

    const [rule, setRule] = useState(null);
    const [accuracy, setAccuracy] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [status, setStatus] = useState("bad");

    useEffect(() => {
        const badRules =
            rows.filter(r => statusOf(r).cls === "bad")
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
    },[rows]);

    if (!rule) {
        return (
            <>
                <div className="section-title">Правило для практики</div>
                <div className="weak-list">
                    <div className="focus-card">
                        <div className="focus-head">
                            <strong>Немає правил у «червоній зоні» 🎉</strong>
                        </div>
                        <div className="focus-meta">
                            Продовжуй практику — система підсвітить правило, що потребує уваги, щойно воно зʼявиться.
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const barColor = status === 'needs practice' ? "#ef476f" : status === 'in progress' ? "#ffd166" : "#4ba36e";

    return (
        <>
            <div className="section-title">Правило для практики</div>
            <div className="weak-list">
                <div className="focus-card">
                    <div className="focus-head">
                        <strong>{rule.ruleName}</strong>
                        <span className={"badge bad"}>{accuracy}%</span>
                    </div>
                    <div className="focus-meta">
                        Спроб: {rule.attemptsNumber} • Остання практика: {fmtDate(rule.lastAttemptDate)}
                    </div>
                    <div className="bar" style={{ marginTop: 8 }}>
                        <i style={{ width: `${accuracy}%`, background: barColor }} />
                    </div>
                    <div className="focus-actions" style={{margin: '16px 0px'}}>
                        <button style={{
                            fontSize: "1rem",
                            fontWeight: "800",
                            fontFamily: "Nunito, system-ui, sans-serif",
                        }} onClick={() => {
                            const url = `/rule/${rule.rule}`;
                            window.open(url, "_blank", "noopener,noreferrer");
                        }} className="pill">Пояснення правила</button>
                    </div>
                    <Trainer
                        notFocused
                        nextRule={rule.rule}
                        theme={theme}
                        onAnswerEvaluated={() => {
                            const stats = getAllStatistics();
                            const updatedRule = stats.find(x => x.rule === rule.rule);

                            setAttempts(prev => prev + 1);
                            setAccuracy(updatedRule.accuracy);
                            setStatus(updatedRule.status);
                            setRule(updatedRule); // оновлюємо rule цілком, щоб attemptsNumber теж оновився

                            onTrainingComplete(stats); // оновлюємо глобальний state у AnalyticsPage
                        }}
                    />
                </div>
            </div>
        </>
    );
}
