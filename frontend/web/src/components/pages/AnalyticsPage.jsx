import React, { useMemo, useState } from "react";
import {
    SAMPLE_RULES,
    seedWordsMap,
    computeKPIs,
    computeVocab,
    statusOf,
    pct,
    fmtDate,
    fmtDateEnShort,
    getSmartQueue,
} from "./analyticsLogic";
import "./analytics.css";

import AnalyticsHeader from "../AnalyticsHeader";
import KPIGrid from "../KPIGrid";
import FiltersBar from "../FiltersBar";
import RulesTable from "../RulesTable";
import WeakFocus from "../WeakFocus";
import QueueSection from "../QueueSection";
import FooterBar from "../FooterBar";
import {useNavigate} from "react-router-dom";
import {getAllStatistics} from "../../services/dataService.js";

export default function AnalyticsPage() {
    // ----- State (mirrors your script) -----
    const [rules, setRules] = useState([...getAllStatistics()]);
    const [words, setWords] = useState(seedWordsMap());
    const [filterLevel, setFilterLevel] = useState("all");
    const [showWeakOnly, setShowWeakOnly] = useState(false);
    const [query, setQuery] = useState("");
    const [queue, setQueue] = useState([]);

    // ----- Derived -----
    const filteredRules = useMemo(() => {
        const q = query.trim().toLowerCase();
        return rules
            .filter(r => filterLevel === "all" || r.level === filterLevel)
            .filter(r => !q || r.name.toLowerCase().includes(q));
    }, [rules, filterLevel, query]);

    const tableRows = useMemo(
        () => (showWeakOnly ? filteredRules.filter(r => statusOf(r).cls === "bad") : filteredRules),
        [filteredRules, showWeakOnly]
    );

    const kpis = useMemo(() => computeKPIs(filteredRules), [filteredRules]);
    const vocab = useMemo(() => computeVocab(words), [words]);

    // ----- Handlers -----
    const onGenerateQueue = () => setQueue(getSmartQueue(words, 10));
    const onStartPractice = () => alert("Почати практику: підʼєднай до екрана практики вашого додатку.");

    const onExportJSON = () => {
        const payload = {
            rules,
            vocab: Array.from(words.values()),
            smartQueue: queue,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "steplang-analytics.json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
    };

    const navigate = useNavigate();
    const handlePracticeClick = () => history.back();

    return (
        <div className="container">
            <AnalyticsHeader onBack={handlePracticeClick} onExport={onExportJSON} />
            <KPIGrid
                accuracy={kpis.accuracy}
                attempts={kpis.totalAttempts}
                masteredRules={kpis.mastered}
                learnedWords={vocab.kpiLearned}
            />
            <FiltersBar
                filterLevel={filterLevel}
                onLevelChange={setFilterLevel}
                query={query}
                onQueryChange={setQuery}
                showWeakOnly={showWeakOnly}
                onToggleWeak={() => setShowWeakOnly(v => !v)}
            />
            <RulesTable
                rows={tableRows}
                pct={pct}
                statusOf={statusOf}
                fmtDate={fmtDate}
                onRowClick={(rule) => {
                    if (rule.name === "To be (am/is/are)")
                        navigate("/rule/to-be");
                }}
            />
            <WeakFocus rows={filteredRules} pct={pct} statusOf={statusOf} fmtDate={fmtDate} />
            {/*<QueueSection*/}
            {/*    queue={queue}*/}
            {/*    onGenerate={onGenerateQueue}*/}
            {/*    onStartPractice={onStartPractice}*/}
            {/*    fmtDateEnShort={fmtDateEnShort}*/}
            {/*/>*/}
            <FooterBar />
        </div>
    );
}
