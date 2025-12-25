import React, { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import AnalyticsPage from "./components/pages/AnalyticsPage";
import RulePage from "./components/pages/RulePage.jsx";
import PaymentSuccess from "./components/subscription/PaymentSuccess.jsx";
import PaymentCancel from "./components/subscription/PaymentCancel.jsx";
import SyncOnRouteChange from "./components/SyncOnRouteChange.jsx";

import {
    // --- A1 ---
    RULE_PAGE_TO_BE,
    RULE_PAGE_THERE_IS_ARE,
    RULE_PAGE_HAVE_HAVE_GOT,
    RULE_PAGE_POSSESSIVE_S,
    RULE_PAGE_ARTICLES,
    RULE_PAGE_DEMONSTRATIVES,
    RULE_PAGE_PERSONAL_PRONOUNS,
    RULE_PAGE_SIMPLE_ADJ,
    RULE_PAGE_PRESENT_SIMPLE_FREQ,
    RULE_PAGE_YES_NO_Q,
    RULE_PAGE_WH_Q,
    RULE_PAGE_IMPERATIVES,
    RULE_PAGE_CAN_CANT,
    RULE_PAGE_COUNT_UNCOUNT,
    RULE_PAGE_BE_FROM,
    RULE_PAGE_PRESENT_CONT_NOW,
    RULE_PAGE_PREP_PLACE,
    RULE_PAGE_PREP_TIME,
    RULE_PAGE_ORDINALS_DATES,
    RULE_PAGE_WOULD_LIKE_TO,
    RULE_PAGE_LETS,
    RULE_PAGE_TOO_VERY,

    // --- A2 ---
    RULE_PAGE_PAST_SIMPLE,
    RULE_PAGE_WAS_WERE,
    RULE_PAGE_PAST_CONTINUOUS,
    RULE_PAGE_GOING_TO_PLANS,
    RULE_PAGE_WILL_PREDICTIONS,
    RULE_PAGE_BE_GOING_TO_VS_WILL,
    RULE_PAGE_MUST_MUSTNT,
    RULE_PAGE_SHOULD_SHOULDNT,
    RULE_PAGE_HAVE_TO_DONT_HAVE_TO,
    RULE_PAGE_MAY_MIGHT,
    RULE_PAGE_COMPARATIVES,
    RULE_PAGE_SUPERLATIVES,
    RULE_PAGE_ADVERBS_FREQUENCY_OFTEN_NEVER,
    RULE_PAGE_QUANTIFIERS_SOME_ANY_A_LOT_MUCH_MANY,
    RULE_PAGE_LIKE_LOVE_HATE_ING,
    RULE_PAGE_ZERO_CONDITIONAL,
    RULE_PAGE_FIRST_CONDITIONAL,
    RULE_PAGE_TIME_CLAUSE_FUTURE,
    RULE_PAGE_HOW_OFTEN_LONG_MUCH,
    RULE_PAGE_BECAUSE_SO_BUT_ALTHOUGH,
    RULE_PAGE_BEFORE_AFTER_ING,
    RULE_PAGE_BE_GOOD_AT_INTERESTED_IN_ING,
    RULE_PAGE_MAKE_DO_DIFFERENCE,

    // --- B1 ---
    RULE_PAGE_PRESENT_PERFECT,
    RULE_PAGE_SINCE_FOR,
    RULE_PAGE_PRESENT_PERFECT_CONT,
    RULE_PAGE_ALREADY_YET_JUST,
    RULE_PAGE_PAST_PERFECT,
    RULE_PAGE_USED_TO,
    RULE_PAGE_BE_USED_TO_GET_USED_TO,
    RULE_PAGE_SECOND_CONDITIONAL,
    RULE_PAGE_THIRD_CONDITIONAL,
    RULE_PAGE_WISH_PAST_PAST_PERFECT,
    RULE_PAGE_MODAL_PERFECTS,
    RULE_PAGE_GERUND_VS_INFINITIVE,
    RULE_PAGE_PASSIVE_VOICE_ALL_TENSES,
    RULE_PAGE_GET_PAST_PARTICIPLE,
    RULE_PAGE_REPORTED_SPEECH,
    RULE_PAGE_QUESTION_TAGS,
    RULE_PAGE_ENOUGH_TOO_MUCH_MANY_SO_SUCH,
    RULE_PAGE_RELATIVE_CLAUSES,
    RULE_PAGE_REFLEXIVE_PRONOUNS,
    RULE_PAGE_ADVERBS_OF_MANNER,
    RULE_PAGE_IN_ORDER_TO_SO_THAT,
    RULE_PAGE_MODALS_OF_PROBABILITY,
    RULE_PAGE_BE_SUPPOSED_TO,
    RULE_PAGE_LET_MAKE_ALLOW,
    RULE_PAGE_REPORTED_QUESTIONS,
    RULE_PAGE_CAUSATIVE_HAVE_GET,
    RULE_PAGE_PHRASAL_VERBS_COMMON,
    RULE_PAGE_EACH_OTHER_ONE_ANOTHER,
    RULE_PAGE_SO_DO_I_NEITHER_DO_I,
    RULE_PAGE_ENOUGH_TOO_MUCH_MANY,

    // --- B2 ---
    RULE_PAGE_NOT_ONLY_BUT_ALSO,
    RULE_PAGE_CLEFT_SENTENCES,
    RULE_PAGE_MIXED_CONDITIONALS,
    RULE_PAGE_THIRD_CONDITIONAL_VARIATIONS,
    RULE_PAGE_ADV_PASSIVES_REPORTING_VERBS,
    RULE_PAGE_PARTICIPLE_CLAUSES,
    RULE_PAGE_REDUCED_RELATIVE_CLAUSES,
    RULE_PAGE_COMPLEX_PREPOSITIONS,
    RULE_PAGE_DESPITE_IN_SPITE_OF_ING,
    RULE_PAGE_WOULD_RATHER_PREFER,
    RULE_PAGE_HAD_BETTER,
    RULE_PAGE_ADVANCED_MODALS_OF_DEDUCTION,
    RULE_PAGE_COMPLEX_NOUN_PHRASES,
    RULE_PAGE_INDIRECT_SPEECH_QUESTION_FORMS,
    RULE_PAGE_COMPOUND_SENTENCES,
    RULE_PAGE_COMPLEX_SENTENCES,
    RULE_PAGE_COMPOUND_COMPLEX_SENTENCES,
    RULE_PAGE_CORRELATIVE_CONJUNCTIONS,
    RULE_PAGE_PREP_DIRECTION,
} from "./services/rulePages.js";
import LandingPage from "./components/pages/LandingPage.jsx";
import GoodLangLandingPage from "./components/pages/LandingPage2.jsx";
import GoodLangLandingTeaStyle from "./components/pages/LandingPage2.jsx";

export const theme = {
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

export default function App() {
    const ruleTheme = useMemo(
        () => ({
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
        }),
        []
    );

    return (
        <section>
            <SyncOnRouteChange />
            <Routes>
                {/* Core pages */}
                <Route path="/" element={<HomePage theme={theme} />} />
                <Route path="/welcome" element={<GoodLangLandingTeaStyle theme={theme} />} />
                <Route path="/analytics" element={<AnalyticsPage theme={theme} />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />

                {/* A1 RULES */}
                <Route path="/rule/TO_BE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_TO_BE} />} />
                <Route path="/rule/THERE_IS_ARE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_THERE_IS_ARE} />} />
                <Route path="/rule/HAVE_HAVE_GOT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_HAVE_HAVE_GOT} />} />
                <Route path="/rule/POSSESSIVE_S" element={<RulePage theme={ruleTheme} data={RULE_PAGE_POSSESSIVE_S} />} />
                <Route path="/rule/ARTICLES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ARTICLES} />} />
                <Route path="/rule/DEMONSTRATIVES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_DEMONSTRATIVES} />} />
                <Route path="/rule/PERSONAL_PRONOUNS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PERSONAL_PRONOUNS} />} />
                <Route path="/rule/SIMPLE_ADJ" element={<RulePage theme={ruleTheme} data={RULE_PAGE_SIMPLE_ADJ} />} />
                <Route path="/rule/PRESENT_SIMPLE_FREQ" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PRESENT_SIMPLE_FREQ} />} />
                <Route path="/rule/YES_NO_Q" element={<RulePage theme={ruleTheme} data={RULE_PAGE_YES_NO_Q} />} />
                <Route path="/rule/WH_Q" element={<RulePage theme={ruleTheme} data={RULE_PAGE_WH_Q} />} />
                <Route path="/rule/IMPERATIVES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_IMPERATIVES} />} />
                <Route path="/rule/CAN_CANT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_CAN_CANT} />} />
                <Route path="/rule/COUNT_UNCOUNT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_COUNT_UNCOUNT} />} />
                <Route path="/rule/BE_FROM_NATIONALITY" element={<RulePage theme={ruleTheme} data={RULE_PAGE_BE_FROM} />} />
                <Route path="/rule/PRESENT_CONT_NOW" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PRESENT_CONT_NOW} />} />
                <Route path="/rule/PREP_PLACE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PREP_PLACE} />} />
                <Route path="/rule/PREP_TIME" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PREP_TIME} />} />
                <Route path="/rule/ORDINALS_DATES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ORDINALS_DATES} />} />
                <Route path="/rule/WOULD_LIKE_TO" element={<RulePage theme={ruleTheme} data={RULE_PAGE_WOULD_LIKE_TO} />} />
                <Route path="/rule/LETS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_LETS} />} />
                <Route path="/rule/TOO_VERY" element={<RulePage theme={ruleTheme} data={RULE_PAGE_TOO_VERY} />} />

                {/* A2 RULES */}
                <Route path="/rule/PAST_SIMPLE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PAST_SIMPLE} />} />
                <Route path="/rule/WAS_WERE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_WAS_WERE} />} />
                <Route path="/rule/PAST_CONTINUOUS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PAST_CONTINUOUS} />} />
                <Route path="/rule/GOING_TO_PLANS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_GOING_TO_PLANS} />} />
                <Route path="/rule/WILL_PREDICTIONS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_WILL_PREDICTIONS} />} />
                <Route path="/rule/BE_GOING_TO_VS_WILL" element={<RulePage theme={ruleTheme} data={RULE_PAGE_BE_GOING_TO_VS_WILL} />} />
                <Route path="/rule/MUST_MUSTNT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_MUST_MUSTNT} />} />
                <Route path="/rule/SHOULD_SHOULDNT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_SHOULD_SHOULDNT} />} />
                <Route path="/rule/HAVE_TO_DONT_HAVE_TO" element={<RulePage theme={ruleTheme} data={RULE_PAGE_HAVE_TO_DONT_HAVE_TO} />} />
                <Route path="/rule/MAY_MIGHT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_MAY_MIGHT} />} />
                <Route path="/rule/COMPARATIVES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_COMPARATIVES} />} />
                <Route path="/rule/SUPERLATIVES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_SUPERLATIVES} />} />
                <Route path="/rule/ENOUGH_TOO_MUCH_MANY" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ENOUGH_TOO_MUCH_MANY} />} />
                <Route path="/rule/ADVERBS_FREQUENCY_OFTEN_NEVER" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ADVERBS_FREQUENCY_OFTEN_NEVER} />} />
                <Route path="/rule/QUANTIFIERS_SOME_ANY_A_LOT_MUCH_MANY" element={<RulePage theme={ruleTheme} data={RULE_PAGE_QUANTIFIERS_SOME_ANY_A_LOT_MUCH_MANY} />} />
                <Route path="/rule/LIKE_LOVE_HATE_ING" element={<RulePage theme={ruleTheme} data={RULE_PAGE_LIKE_LOVE_HATE_ING} />} />
                <Route path="/rule/ZERO_CONDITIONAL" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ZERO_CONDITIONAL} />} />
                <Route path="/rule/FIRST_CONDITIONAL" element={<RulePage theme={ruleTheme} data={RULE_PAGE_FIRST_CONDITIONAL} />} />
                <Route path="/rule/TIME_CLAUSE_FUTURE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_TIME_CLAUSE_FUTURE} />} />
                <Route path="/rule/HOW_OFTEN_LONG_MUCH" element={<RulePage theme={ruleTheme} data={RULE_PAGE_HOW_OFTEN_LONG_MUCH} />} />
                <Route path="/rule/BECAUSE_SO_BUT_ALTHOUGH" element={<RulePage theme={ruleTheme} data={RULE_PAGE_BECAUSE_SO_BUT_ALTHOUGH} />} />
                <Route path="/rule/BEFORE_AFTER_ING" element={<RulePage theme={ruleTheme} data={RULE_PAGE_BEFORE_AFTER_ING} />} />
                <Route path="/rule/BE_GOOD_AT_INTERESTED_IN_ING" element={<RulePage theme={ruleTheme} data={RULE_PAGE_BE_GOOD_AT_INTERESTED_IN_ING} />} />
                <Route path="/rule/MAKE_DO_DIFFERENCE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_MAKE_DO_DIFFERENCE} />} />

                {/* B1 RULES */}
                <Route path="/rule/PRESENT_PERFECT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PRESENT_PERFECT} />} />
                <Route path="/rule/SINCE_FOR" element={<RulePage theme={ruleTheme} data={RULE_PAGE_SINCE_FOR} />} />
                <Route path="/rule/PRESENT_PERFECT_CONT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PRESENT_PERFECT_CONT} />} />
                <Route path="/rule/ALREADY_YET_JUST" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ALREADY_YET_JUST} />} />
                <Route path="/rule/PAST_PERFECT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PAST_PERFECT} />} />
                <Route path="/rule/USED_TO" element={<RulePage theme={ruleTheme} data={RULE_PAGE_USED_TO} />} />
                <Route path="/rule/BE_USED_TO_GET_USED_TO" element={<RulePage theme={ruleTheme} data={RULE_PAGE_BE_USED_TO_GET_USED_TO} />} />
                <Route path="/rule/SECOND_CONDITIONAL" element={<RulePage theme={ruleTheme} data={RULE_PAGE_SECOND_CONDITIONAL} />} />
                <Route path="/rule/THIRD_CONDITIONAL" element={<RulePage theme={ruleTheme} data={RULE_PAGE_THIRD_CONDITIONAL} />} />
                <Route path="/rule/WISH_PAST_PAST_PERFECT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_WISH_PAST_PAST_PERFECT} />} />
                <Route path="/rule/MODAL_PERFECTS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_MODAL_PERFECTS} />} />
                <Route path="/rule/GERUND_VS_INFINITIVE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_GERUND_VS_INFINITIVE} />} />
                <Route path="/rule/PASSIVE_VOICE_ALL_TENSES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PASSIVE_VOICE_ALL_TENSES} />} />
                <Route path="/rule/GET_PAST_PARTICIPLE" element={<RulePage theme={ruleTheme} data={RULE_PAGE_GET_PAST_PARTICIPLE} />} />
                <Route path="/rule/REPORTED_SPEECH" element={<RulePage theme={ruleTheme} data={RULE_PAGE_REPORTED_SPEECH} />} />
                <Route path="/rule/QUESTION_TAGS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_QUESTION_TAGS} />} />
                <Route path="/rule/ENOUGH_TOO_MUCH_MANY_SO_SUCH" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ENOUGH_TOO_MUCH_MANY_SO_SUCH} />} />
                <Route path="/rule/RELATIVE_CLAUSES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_RELATIVE_CLAUSES} />} />
                <Route path="/rule/REFLEXIVE_PRONOUNS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_REFLEXIVE_PRONOUNS} />} />
                <Route path="/rule/ADVERBS_OF_MANNER" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ADVERBS_OF_MANNER} />} />
                <Route path="/rule/IN_ORDER_TO_SO_THAT" element={<RulePage theme={ruleTheme} data={RULE_PAGE_IN_ORDER_TO_SO_THAT} />} />
                <Route path="/rule/MODALS_OF_PROBABILITY" element={<RulePage theme={ruleTheme} data={RULE_PAGE_MODALS_OF_PROBABILITY} />} />
                <Route path="/rule/BE_SUPPOSED_TO" element={<RulePage theme={ruleTheme} data={RULE_PAGE_BE_SUPPOSED_TO} />} />
                <Route path="/rule/LET_MAKE_ALLOW" element={<RulePage theme={ruleTheme} data={RULE_PAGE_LET_MAKE_ALLOW} />} />
                <Route path="/rule/REPORTED_QUESTIONS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_REPORTED_QUESTIONS} />} />
                <Route path="/rule/CAUSATIVE_HAVE_GET" element={<RulePage theme={ruleTheme} data={RULE_PAGE_CAUSATIVE_HAVE_GET} />} />
                <Route path="/rule/PHRASAL_VERBS_COMMON" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PHRASAL_VERBS_COMMON} />} />
                <Route path="/rule/EACH_OTHER_ONE_ANOTHER" element={<RulePage theme={ruleTheme} data={RULE_PAGE_EACH_OTHER_ONE_ANOTHER} />} />
                <Route path="/rule/SO_DO_I_NEITHER_DO_I" element={<RulePage theme={ruleTheme} data={RULE_PAGE_SO_DO_I_NEITHER_DO_I} />} />
                <Route path="/rule/ENOUGH_TOO_MUCH_MANY" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ENOUGH_TOO_MUCH_MANY} />} />

                {/* B2 RULES */}
                <Route path="/rule/NOT_ONLY_BUT_ALSO" element={<RulePage theme={ruleTheme} data={RULE_PAGE_NOT_ONLY_BUT_ALSO} />} />
                <Route path="/rule/CLEFT_SENTENCES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_CLEFT_SENTENCES} />} />
                <Route path="/rule/MIXED_CONDITIONALS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_MIXED_CONDITIONALS} />} />
                <Route path="/rule/THIRD_CONDITIONAL_VARIATIONS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_THIRD_CONDITIONAL_VARIATIONS} />} />
                <Route path="/rule/ADV_PASSIVES_REPORTING_VERBS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ADV_PASSIVES_REPORTING_VERBS} />} />
                <Route path="/rule/PARTICIPLE_CLAUSES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PARTICIPLE_CLAUSES} />} />
                <Route path="/rule/REDUCED_RELATIVE_CLAUSES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_REDUCED_RELATIVE_CLAUSES} />} />
                <Route path="/rule/COMPLEX_PREPOSITIONS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_COMPLEX_PREPOSITIONS} />} />
                <Route path="/rule/DESPITE_IN_SPITE_OF_ING" element={<RulePage theme={ruleTheme} data={RULE_PAGE_DESPITE_IN_SPITE_OF_ING} />} />
                <Route path="/rule/WOULD_RATHER_PREFER" element={<RulePage theme={ruleTheme} data={RULE_PAGE_WOULD_RATHER_PREFER} />} />
                <Route path="/rule/HAD_BETTER" element={<RulePage theme={ruleTheme} data={RULE_PAGE_HAD_BETTER} />} />
                <Route path="/rule/ADVANCED_MODALS_OF_DEDUCTION" element={<RulePage theme={ruleTheme} data={RULE_PAGE_ADVANCED_MODALS_OF_DEDUCTION} />} />
                <Route path="/rule/COMPLEX_NOUN_PHRASES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_COMPLEX_NOUN_PHRASES} />} />
                <Route path="/rule/INDIRECT_SPEECH_QUESTION_FORMS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_INDIRECT_SPEECH_QUESTION_FORMS} />} />
                <Route path="/rule/COMPOUND_SENTENCES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_COMPOUND_SENTENCES} />} />
                <Route path="/rule/COMPLEX_SENTENCES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_COMPLEX_SENTENCES} />} />
                <Route path="/rule/COMPOUND_COMPLEX_SENTENCES" element={<RulePage theme={ruleTheme} data={RULE_PAGE_COMPOUND_COMPLEX_SENTENCES} />} />
                <Route path="/rule/CORRELATIVE_CONJUNCTIONS" element={<RulePage theme={ruleTheme} data={RULE_PAGE_CORRELATIVE_CONJUNCTIONS} />} />
                <Route path="/rule/PREP_DIRECTION" element={<RulePage theme={ruleTheme} data={RULE_PAGE_PREP_DIRECTION} />} />
            </Routes>
        </section>
    );
}
