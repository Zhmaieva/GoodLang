import React, {useMemo} from "react";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import AnalyticsPage from "./components/pages/AnalyticsPage";
import {
    RULE_PAGE_ARTICLES,
    RULE_PAGE_BE_FROM,
    RULE_PAGE_CAN_CANT,
    RULE_PAGE_COUNT_UNCOUNT,
    RULE_PAGE_DEMONSTRATIVES,
    RULE_PAGE_HAVE_HAVE_GOT,
    RULE_PAGE_IMPERATIVES,
    RULE_PAGE_LETS, RULE_PAGE_LIKE_ING,
    RULE_PAGE_NEGATION_DONT_DOESNT, RULE_PAGE_ORDINALS_DATES,
    RULE_PAGE_PERSONAL_PRONOUNS,
    RULE_PAGE_POSSESSIVE_S, RULE_PAGE_PREP_PLACE, RULE_PAGE_PREP_TIME, RULE_PAGE_PRESENT_CONT_NOW,
    RULE_PAGE_PRESENT_SIMPLE_FREQ,
    RULE_PAGE_SIMPLE_ADJ,
    RULE_PAGE_THERE_IS_ARE, RULE_PAGE_THERE_ISNT_ARENT_ANY,
    RULE_PAGE_TO_BE, RULE_PAGE_TOO_VERY, RULE_PAGE_WH_Q, RULE_PAGE_WOULD_LIKE_TO,
    RULE_PAGE_YES_NO_Q
} from "./services/rulePages.jsx";
import RulePage from "./components/pages/RulePage.jsx";
import PaymentSuccess from "./components/subscription/PaymentSuccess.jsx";
import PaymentCancel from "./components/subscription/PaymentCancel.jsx";
import SyncOnRouteChange from "./components/SyncOnRouteChange.jsx";

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
        <section>
            <SyncOnRouteChange />
            <Routes>
                <Route path="/" element={<HomePage theme={theme} />} />
                <Route path="/analytics" element={<AnalyticsPage theme={theme} />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />

                <Route path="/rule/TO_BE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_TO_BE} />} />
                <Route path="/rule/BE_FROM" element={<RulePage theme={ruleTheme} data={RULE_PAGE_BE_FROM} />} />
                <Route path="/rule/CAN_CANT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_CAN_CANT} />} />
                <Route path="/rule/COUNT_UNCOUNT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_COUNT_UNCOUNT} />} />
                <Route path="/rule/THERE_IS_ARE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_THERE_IS_ARE} />} />
                <Route path="/rule/HAVE_HAVE_GOT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_HAVE_HAVE_GOT} />} />
                <Route path="/rule/POSSESSIVE_S" element={<RulePage theme={ruleTheme} data={RULE_PAGE_POSSESSIVE_S} />} />
                <Route path="/rule/IMPERATIVES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_IMPERATIVES} />} />
                <Route path="/rule/LETS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_LETS} />} />
                <Route path="/rule/LIKE_ING" element={<RulePage theme={ruleTheme} data={RULE_PAGE_LIKE_ING} />} />
                <Route path="/rule/ORDINALS_DATES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ORDINALS_DATES} />} />
                <Route path="/rule/PREP_PLACE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PREP_PLACE} />} />
                <Route path="/rule/PREP_TIME" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PREP_TIME} />} />
                <Route path="/rule/PRESENT_CONT_NOW" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PRESENT_CONT_NOW} />} />
                <Route path="/rule/THERE_ISNT_ARENT_ANY" element={<RulePage theme={ruleTheme} data={RULE_PAGE_THERE_ISNT_ARENT_ANY} />} />
                <Route path="/rule/TOO_VERY" element={<RulePage theme={ruleTheme} data={RULE_PAGE_TOO_VERY} />} />
                <Route path="/rule/WH_Q" element={<RulePage theme={ruleTheme} data={RULE_PAGE_WH_Q} />} />
                <Route path="/rule/WOULD_LIKE_TO" element={<RulePage theme={ruleTheme} data={RULE_PAGE_WOULD_LIKE_TO} />} />
                <Route path="/rule/ARTICLES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ARTICLES} />} />
                <Route path="/rule/DEMONSTRATIVES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_DEMONSTRATIVES} />} />
                <Route path="/rule/PERSONAL_PRONOUNS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PERSONAL_PRONOUNS} />} />
                <Route path="/rule/SIMPLE_ADJ" element={<RulePage theme={ruleTheme} data={RULE_PAGE_SIMPLE_ADJ} />} />
                <Route path="/rule/PRESENT_SIMPLE_FREQ" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PRESENT_SIMPLE_FREQ} />} />
                <Route path="/rule/NEGATION_DONT_DOESNT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_NEGATION_DONT_DOESNT} />} />
                <Route path="/rule/YES_NO_Q" element={<RulePage theme={ruleTheme} data={RULE_PAGE_YES_NO_Q} />} />
            </Routes>
        </section>
    );
}
