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
import {getAllStatistics, getOverallAccuracy} from "../../services/dataService.js";
import AppShell from "../AppShell.jsx";
import BrandHeader from "../BrandHeader.jsx";
import {callAccountInfoApi} from "../../services/api.js";
import { Button } from "../Buttons.jsx";
import { APP_BACKGROUND_COLOR } from "../../theme.js";

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

    const SIDE_WALL_COLOR = "#40a6ff";
    const SIDE_WALL_SECOND_LINE_GAP = 10;
    const SIDE_WALL_LINE_WIDTH = 2;

    const pageShellStyle = {
        width: "100%",
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: isMobile
            ? "12px minmax(0, 1fr) 12px"
            : "minmax(96px, 1fr) minmax(0, 980px) minmax(96px, 1fr)",
        columnGap: isMobile ? 12 : 36,
    };

    const leftWallStyle = {
        borderRight: `${SIDE_WALL_LINE_WIDTH}px solid ${SIDE_WALL_COLOR}`,
        background: `linear-gradient(to left, transparent ${SIDE_WALL_SECOND_LINE_GAP}px, ${SIDE_WALL_COLOR} ${SIDE_WALL_SECOND_LINE_GAP}px, ${SIDE_WALL_COLOR} ${SIDE_WALL_SECOND_LINE_GAP + SIDE_WALL_LINE_WIDTH}px, transparent ${SIDE_WALL_SECOND_LINE_GAP + SIDE_WALL_LINE_WIDTH}px), ${theme?.bg ?? APP_BACKGROUND_COLOR}`,
        minHeight: "100vh",
    };

    const rightWallStyle = {
        borderLeft: `${SIDE_WALL_LINE_WIDTH}px solid ${SIDE_WALL_COLOR}`,
        background: `linear-gradient(to right, transparent ${SIDE_WALL_SECOND_LINE_GAP}px, ${SIDE_WALL_COLOR} ${SIDE_WALL_SECOND_LINE_GAP}px, ${SIDE_WALL_COLOR} ${SIDE_WALL_SECOND_LINE_GAP + SIDE_WALL_LINE_WIDTH}px, transparent ${SIDE_WALL_SECOND_LINE_GAP + SIDE_WALL_LINE_WIDTH}px), ${theme?.bg ?? APP_BACKGROUND_COLOR}`,
        minHeight: "100vh",
    };

    const pageContentStyle = {
        minWidth: 0,
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: isMobile ? "24px 0 40px" : "25px 0 0px",
    };

    return (
        <AppShell theme={theme} noPadding>
            <div style={pageShellStyle}>
                <div style={leftWallStyle} aria-hidden="true" />

                <main style={pageContentStyle}>
                    <BrandHeader theme={theme} title={"GoodLang"} subtitle={"Progress overview and list of rules"}  onExport={onExportJSON}
                                 right={
                                     <Button
                                         variant="offset"
                                         compact
                                         shadowColor={SIDE_WALL_COLOR}
                                         shadowOffset={0}
                                         style={{
                                             maxWidth: 180,
                                             whiteSpace: "nowrap",
                                             overflow: "hidden",
                                             textOverflow: "ellipsis",
                                         }}
                                         onClick={handlePracticeClick}
                                     >
                                         ← Go to practice
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

                <div style={rightWallStyle} aria-hidden="true" />
            </div>
        </AppShell>
    );
}
