import React, {useEffect, useMemo, useState} from "react";
import {
    seedWordsMap,
    computeKPIs,
    computeVocab,
    statusOf,
    pct,
    fmtDate,
    fmtLastPractice,
    getSmartQueue,
} from "./analyticsLogic";
import "./analytics.css";

import KPIGrid from "../KPIGrid";
import FiltersBar from "../FiltersBar";
import RulesTable from "../training/RulesTable.jsx";
import WeakFocus from "../WeakFocus";
import FooterBar from "../FooterBar";
import {useNavigate} from "react-router-dom";
import {getAllStatistics, getOverallAccuracy} from "../../services/dataService.js";
import AppShell from "../AppShell.jsx";
import BrandHeader from "../BrandHeader.jsx";
import {callAccountInfoApi} from "../../services/api.js";
import { Button } from "../Buttons.jsx";
import { APP_ACCENT_COLOR, APP_BACKGROUND_COLOR } from "../../theme.js";
import { ArrowLeft } from "@phosphor-icons/react";

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
    const [isTeacher, setIsTeacher] = useState(false);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        const isTeacher = localStorage.getItem("teacher") === "true";
        setIsTeacher(isTeacher);

        const overall = getOverallAccuracy();
        if (overall.attemptsLeft === 0) {
            setHasData(true);
        }

        const handleResize = () => setIsMobile(window.innerWidth < 915);

        // ✅ initial load
        loadAccountInfo().then();

        // ✅ poll every 5s
        const intervalId = setInterval(() => {
            loadAccountInfo().then();
        }, 5000);

        // ✅ (optional) stop polling when tab is hidden to reduce spam
        const onVis = () => {
            if (document.hidden) return; // keep interval but skip work
            loadAccountInfo().then();
        };
        document.addEventListener("visibilitychange", onVis);

        window.addEventListener("resize", handleResize);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("resize", handleResize);
        };
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
    const onStartPractice = () => alert("Start practicing: connect this button to your app’s practice screen.");

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

    const FRAME_COLOR = theme?.accent ?? APP_ACCENT_COLOR;

    const pageShellStyle = {
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "16px 12px" : "48px 24px",
        background: theme?.bg ?? APP_BACKGROUND_COLOR,
    };

    const pageContentStyle = {
        minWidth: 0,
        width: "100%",
        maxWidth: 1100,
        minHeight: "auto",
        display: "flex",
        flexDirection: "column",
        padding: isMobile ? "24px 16px 32px" : "40px 40px 40px",
        border: `2px solid ${FRAME_COLOR}`,
        borderRadius: 12,
        background: theme?.bg ?? APP_BACKGROUND_COLOR,
        boxShadow: "0 18px 45px rgba(0,0,0,0.10)",
        boxSizing: "border-box",
    };

    return (
        <AppShell theme={theme} noPadding>
            <div style={pageShellStyle}>
                <main style={pageContentStyle}>
                    <BrandHeader theme={theme} title={"GoodLang"} subtitle={"Progress overview and list of rules"}  onExport={onExportJSON}
                                 right={
                                     <Button
                                         variant="offset"
                                         compact
                                         shadowColor={FRAME_COLOR}
                                         shadowOffset={0}
                                         style={{
                                             maxWidth: 180,
                                             whiteSpace: "nowrap",
                                             overflow: "hidden",
                                             textOverflow: "ellipsis",
                                         }}
                                         onClick={handlePracticeClick}
                                     >
                                         <ArrowLeft size={18} weight="bold" aria-hidden />
                                         Go to practice
                                     </Button>
                                 }
                    />
                    {
                        (!isMobile || !isTeacher || hasData) &&
                        <KPIGrid
                            theme={theme}
                            attempts={kpis.totalAttempts}
                            masteredRules={kpis.mastered}
                        />
                    }

                    <FiltersBar
                        advanced={(!isMobile || !isTeacher || hasData)}
                        filterLevel={filterLevel}
                        onLevelChange={setFilterLevel}
                        query={query}
                        onQueryChange={setQuery}
                        showWeakOnly={showWeakOnly}
                        onToggleWeak={() => setShowWeakOnly(v => !v)}
                        theme={theme}
                    />
                    <div style={{ marginBottom: 25 }}>
                        <RulesTable
                            advanced={(!isMobile || !isTeacher || hasData)}
                            account={account}
                            theme={theme}
                            rows={tableRows}
                            pct={pct}
                            statusOf={statusOf}
                            fmtDate={fmtDate}
                            fmtLastPractice={fmtLastPractice}
                            onRowClick={(rule) => {
                                const url = `/rule/${rule.rule}`;
                                window.open(url, "_blank", "noopener,noreferrer");
                            }}
                        />
                    </div>

                    {/*<WeakFocus rows={filteredRules} pct={pct} statusOf={statusOf} fmtDate={fmtDate} theme={theme}
                               onTrainingComplete={(statistics) => setRules(statistics)}
                    />
                    <QueueSection*/}
                    {/*    queue={queue}*/}
                    {/*    onGenerate={onGenerateQueue}*/}
                    {/*    onStartPractice={onStartPractice}*/}
                    {/*    fmtDateEnShort={fmtDateEnShort}*/}
                    {/*/>
                    <FooterBar theme={theme}/>*/}
                </main>

            </div>
        </AppShell>
    );
}
