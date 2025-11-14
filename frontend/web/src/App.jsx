import React, {useMemo} from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import AnalyticsPage from "./components/pages/AnalyticsPage";
import {RULE_PAGE_TO_BE} from "./services/rulePages.jsx";
import RulePage from "./components/pages/RulePage.jsx";
import PaymentSuccess from "./components/subscription/PaymentSuccess.jsx";
import PaymentCancel from "./components/subscription/PaymentCancel.jsx";

export default function App() {
    // Theme lives here and is passed down
    const theme = {
        bg: "#fff3df",
        accent: "#ff6138",
        accentDark: "#d74e2a",
        green: "#4ba36e",
        greenDark: "#2d6f48",
        blue: "#3a6ea5",
        text: "#3a2a1d",
        muted: "#a47856",
        radius: 20,
    };

    const ruleTheme = useMemo(() => ({
        bg: "#fff3df",
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
        <Routes>
            <Route path="/" element={<HomePage theme={theme} />} />
            <Route path="/analytics" element={<AnalyticsPage theme={theme} />} />
            <Route path="/rule/TO_BE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_TO_BE} />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
        </Routes>
    );
}
