import { useNavigate } from "react-router-dom";
import * as rulePages from "../../services/rulePages.js";
import { RULE_LABELS } from "../../utils/rules.js";
import MobileSheet from "./MobileSheet.jsx";
import { mobileCopy as t } from "./mobileCopy.js";

const pagesById = Object.fromEntries(Object.values(rulePages).filter((page) => page?.id).map((page) => [page.id, page]));

export default function MobileRuleSheet({ rule, statistics, onClose, returnToAnswer = false }) {
    const navigate = useNavigate();
    const page = pagesById[rule];
    const meaning = page?.sections.find((section) => section.type === "meaning" || section.type === "form");
    const examples = page?.sections.find((section) => section.type === "examples");
    return <MobileSheet title={page?.title || RULE_LABELS[rule] || rule} onClose={onClose}
        footer={<button className="gl-primary" onClick={onClose}>{returnToAnswer ? t("До відповіді", "Back to answer") : t("Зрозуміло", "Got it")}</button>}>
        {meaning?.html && <p className="gl-rule-meaning" dangerouslySetInnerHTML={{ __html: meaning.html }} />}
        {examples?.items?.length > 0 && <div className="gl-rule-example">{examples.items.slice(0, 2).map((example, index) => <p key={index} dangerouslySetInnerHTML={{ __html: Array.isArray(example) ? example.join(" ") : example }} />)}</div>}
        <details className="gl-rule-details"><summary>{t("Докладне пояснення", "Full explanation")}</summary>
            {statistics && <p>{t("Спроб", "Attempts")}: {statistics.attemptsNumber} · {t("Точність", "Accuracy")}: {statistics.attemptsNumber ? `${Math.round(statistics.accuracy)}%` : "—"}<br />{t("Остання практика", "Last practice")}: {statistics.lastAttemptDate ? new Date(statistics.lastAttemptDate).toLocaleDateString() : "—"}</p>}
            {page?.sections.filter((section) => section !== meaning && section !== examples && section.type !== "trainer").map((section, index) => <section key={index}>
                <h3>{section.title}</h3>
                {section.html && <div dangerouslySetInnerHTML={{ __html: section.html }} />}
                {(section.badges || section.bullets)?.map((html, itemIndex) => <p key={itemIndex} dangerouslySetInnerHTML={{ __html: html }} />)}
                {section.rows && <div className="gl-rule-table"><table><thead><tr>{section.headers?.map((header, i) => <th key={i}>{header}</th>)}</tr></thead><tbody>{section.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />)}</tr>)}</tbody></table></div>}
                {(section.hint || section.note) && <p dangerouslySetInnerHTML={{ __html: section.hint || section.note }} />}
            </section>)}
            <button className="gl-text-button" onClick={() => { onClose(); navigate(`/rule/${encodeURIComponent(rule)}`); }}>{t("Відкрити правило й тренування", "Open rule and practice")}</button>
        </details>
    </MobileSheet>;
}
