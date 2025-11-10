import React, {useMemo} from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import AnalyticsPage from "./components/pages/AnalyticsPage";
import RuleToBePage from "./components/pages/RuleToBePage.jsx";
import {RULE_PAGE_TO_BE} from "./services/rulePages.jsx";
import {GrammarRule} from "./utils/rules.js";

import noise from './assets/noise.svg';
import background from './assets/background.png';
import AppShell from "./components/AppShell.jsx";

export default function App() {
    // Theme lives here and is passed down
    const theme = {
        bg: `url(${background})`,
        backgroundGlass: "rgba(255, 255, 255, 0.2)",
        backgroundGlassThick: "rgba(255, 255, 255, 0.2)",
        backgroundGlassError: "rgba(255, 100, 255, 0.2)",
        backgroundGlassHighlight: "rgba(100, 255, 255, 0.4)",
        backgroundGlassHighlightBtn: `linear-gradient(rgba(120,200,255, 0.8), rgba(55,155,255,.6))`,
        textHighlight: "rgba(100, 255, 255, .8)",
        borderGlass: ".1vmin solid rgba(219, 219, 219, 0.1)",
        boxShadowGlass: "0 .5vmin 1vmin rgba(0, 0, 0, .4)",
        accent: `linear-gradient(rgba(0,0,0,.1), rgba(125,100,255,.1))`,
        primaryText: "rgba(255,255,255,1)",
        selected: `linear-gradient(rgba(160,80,220,.8), rgba(200,120,255, 0.6))`,
        unselected: "rgba(160,80,220,.8)",
        blue: "#3a6ea5",
        text: "#3a2a1d",
        muted: "rgba(255,255,255,.7)",
        radius: 20,
        height: "100%",
    };

    const ruleTheme = useMemo(() => ({
        bg: `linear-gradient(rgba(255,160,255,.5), rgba(120,100,255,.5)),url(${noise})`,
        card: "#fffdf8",
        accent: "#ff6138",
        accentDark: "#d74e2a",
        green: "#4ba36e",
        greenDark: "#2d6f48",
        blue: "#3a6ea5",
        text: "#3a2a1d",
        muted: "#a47856",
        bad: "#ef476f",
        warn: "#ffd166",
        good: "#4ba36e",
        radius: 20,
    }), []);

    return (
        <AppShell theme={theme}>
            <Routes>
                <Route path="/" element={<HomePage theme={theme} />} />
                <Route path="/analytics" element={<AnalyticsPage theme={theme} />} />
                <Route path="/rule/TO_BE" element={<RuleToBePage theme={ruleTheme} data={RULE_PAGE_TO_BE} />} />
            </Routes>
        </AppShell>
    );
}
