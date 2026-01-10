import React, {useEffect, useMemo, useState} from "react";
import {
    seedWordsMap,
    computeKPIs,
    computeVocab,
    statusOf,
    pct,
    fmtDate,
    getSmartQueue,
} from "./analyticsLogic";
import "./analytics.css";

import KPIGrid from "../KPIGrid";
import FiltersBar from "../FiltersBar";
import RulesTable from "../training/RulesTable.jsx";
import WeakFocus from "../WeakFocus";
import FooterBar from "../FooterBar";
import {useNavigate} from "react-router-dom";
import {getAllStatistics, inferUserLevel} from "../../services/dataService.js";
import AppShell from "../AppShell.jsx";
import BrandHeader from "../BrandHeader.jsx";
import {callAccountInfoApi} from "../../services/api.js";

export default function AnalyticsPage({theme}) {
    // ----- State (mirrors your script) -----
    const [rules, setRules] = useState([...getAllStatistics()]);
    const [words, setWords] = useState(seedWordsMap());
    const [filterLevel, setFilterLevel] = useState("all");
    const [showWeakOnly, setShowWeakOnly] = useState(false);
    const [query, setQuery] = useState("");
    const [queue, setQueue] = useState([]);
    const [account, setAccount] = useState(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 915);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 915);
        };

        loadAccountInfo().then();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const loadAccountInfo = async () => {
        const account = await callAccountInfoApi();
        setAccount(account);
    }


    // ----- Derived -----
    const filteredRules = useMemo(() => {
        const q = query.trim().toLowerCase();

        // Map GoodLang levels → CEFR ranges
        const LEVEL_TO_DIFFICULTY = {
            beginner: ["A1"],
            intermediate: ["A2", "B1"],
            advanced: ["B2"],
        };

        return rules
            .filter(r => {
                if (filterLevel === "all") return true;

                const group = LEVEL_TO_DIFFICULTY[filterLevel] || [];
                // keep rule if its level is within this group
                return group.includes(r.level);
            })
            .filter(r => !q || r.ruleName.toLowerCase().includes(q));
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
        a.download = "GoodLang-analytics.json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
    };

    const navigate = useNavigate();
    const handlePracticeClick = () => navigate('/');

    return (
        <AppShell theme={theme}>
            <div style={{height: "100vh"}}>
                <BrandHeader theme={theme} title={"GoodLang"} subtitle={"Огляд прогресу та список правил"}  onExport={onExportJSON}
                             right={
                                 <button style={{
                                     appearance: "none",
                                     padding: "10px 14px",
                                     fontWeight: 800,
                                     fontSize: "0.95rem",
                                     lineHeight: 1,
                                     borderRadius: 999,
                                     cursor: "pointer",

                                     background: theme.accent ?? "#4ba36e",
                                     color: "#fff",
                                     border: "2px solid rgba(0,0,0,0.12)",
                                     boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
                                     fontFamily: "Nunito, system-ui, sans-serif",

                                     /* 👇 REQUIRED for ellipsis */
                                     maxWidth: 180,              // ← adjust (px) to fit your layout
                                     whiteSpace: "nowrap",
                                     overflow: "hidden",
                                     textOverflow: "ellipsis",

                                     transition: "transform 120ms ease, filter 120ms ease",
                                 }} onClick={handlePracticeClick}>
                                     ← До тренування
                                 </button>
                             }
                />
                <KPIGrid
                    theme={theme}
                    attempts={kpis.totalAttempts}
                    masteredRules={kpis.mastered}
                />
                <FiltersBar
                    filterLevel={filterLevel}
                    onLevelChange={setFilterLevel}
                    query={query}
                    onQueryChange={setQuery}
                    showWeakOnly={showWeakOnly}
                    onToggleWeak={() => setShowWeakOnly(v => !v)}
                />
                <div style={{height: '50%'}}>
                    <RulesTable
                        account={account}
                        theme={theme}
                        rows={tableRows}
                        pct={pct}
                        statusOf={statusOf}
                        fmtDate={fmtDate}
                        onRowClick={(rule) => {
                            const url = `/rule/${rule.rule}`;
                            window.open(url, "_blank", "noopener,noreferrer");
                        }}
                    />
                </div>

                <WeakFocus rows={filteredRules} pct={pct} statusOf={statusOf} fmtDate={fmtDate} theme={theme}
                           onTrainingComplete={(statistics) => setRules(statistics)}
                />
                {/*<QueueSection*/}
                {/*    queue={queue}*/}
                {/*    onGenerate={onGenerateQueue}*/}
                {/*    onStartPractice={onStartPractice}*/}
                {/*    fmtDateEnShort={fmtDateEnShort}*/}
                {/*/>*/}
                <FooterBar theme={theme}/>
            </div>

        </AppShell>
    );
}
