import { useState } from "react";
import { CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import MobileRuleSheet from "./MobileRuleSheet.jsx";
import PracticeProgress from "./PracticeProgress.jsx";
import { mobileCopy as t } from "./mobileCopy.js";

export default function MobileGrammar({ rows, query, setQuery, statusFilter, setStatusFilter, filterLevel, setFilterLevel, kpis }) {
    const [selectedRule, setSelectedRule] = useState(null);
    return <main className="gl-mobile-page gl-grammar-page">
        <PracticeProgress banner />
        <label className="gl-search"><MagnifyingGlass size={23} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Знайти правило", "Find a grammar rule")} aria-label={t("Знайти правило", "Find a grammar rule")} /></label>
        <div className="gl-segments" aria-label={t("Фільтр тем", "Filter topics")}>
            <button aria-pressed={statusFilter === "all"} onClick={() => setStatusFilter("all")}>{t("Усі теми", "All topics")}</button>
            <button aria-pressed={statusFilter === "weak"} onClick={() => setStatusFilter("weak")}>{t("Повторити", "Review")}</button>
        </div>
        <details className="gl-more-options"><summary>{t("Прогрес і фільтри", "Progress and filters")}</summary>
            <div className="gl-stat-line"><span>{t("Відповідей", "Answers")}<strong>{kpis.totalAttempts}</strong></span><button onClick={() => setStatusFilter(statusFilter === "learned" ? "all" : "learned")} aria-pressed={statusFilter === "learned"}>{t("Вивчено тем", "Topics learned")}<strong>{kpis.mastered}</strong></button></div>
            <label className="gl-filter-label">{t("Рівень", "Level")}<select value={filterLevel} onChange={(event) => setFilterLevel(event.target.value)}><option value="all">{t("Усі рівні", "All levels")}</option><option value="beginner">Beginner · A1</option><option value="intermediate">Intermediate · A2–B1</option><option value="advanced">Advanced · B2</option></select></label>
            {statusFilter === "learned" && <button className="gl-text-button" onClick={() => setStatusFilter("all")}>{t("Показати всі теми", "Show all topics")}</button>}
        </details>
        <div className="gl-list">
            {[...rows].sort((a, b) => String(a.level).localeCompare(String(b.level)) || a.ruleName.localeCompare(b.ruleName)).map((row) => <button key={row.rule} className="gl-rule-row" onClick={() => setSelectedRule(row)}>
                <span><strong>{row.ruleName}</strong><span className="gl-row-subtitle">{!row.attemptsNumber ? t("Ще не оцінено", "Not assessed yet") : row.status === "learned" ? t("Засвоєно", "Learned") : row.status === "needs practice" ? t("Варто повторити", "Needs practice") : t("Вивчаємо", "In progress")}{row.attemptsNumber > 0 && <span> · {Math.round(row.accuracy)}%</span>}</span></span><CaretRight size={19} aria-hidden="true" />
            </button>)}
            {rows.length === 0 && <p className="gl-empty">{statusFilter === "weak" && !query ? t("Тут з’являться теми, які варто повторити після практики.", "Topics to review will appear here after practice.") : t("За цими фільтрами тем немає.", "No topics match these filters.")}</p>}
        </div>
        {selectedRule && <MobileRuleSheet rule={selectedRule.rule} statistics={selectedRule} onClose={() => setSelectedRule(null)} />}
    </main>;
}
