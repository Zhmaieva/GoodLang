import { useState } from "react";
import { ArrowRight, BookOpen, CaretRight } from "@phosphor-icons/react";
import MobileSheet from "./MobileSheet.jsx";
import MobileRuleSheet from "./MobileRuleSheet.jsx";
import { mobileCopy as t } from "./mobileCopy.js";

function normalizedWord(word) {
    return word.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9']/g, "");
}

function CorrectedAnswer({ answer, original }) {
    // Align words so insertions are highlighted without coloring the unchanged tail.
    const before = original.split(/\s+/).filter(Boolean).map(normalizedWord);
    const after = answer.split(/\s+/).filter(Boolean);
    const table = Array.from({ length: before.length + 1 }, () => Array(after.length + 1).fill(0));
    for (let i = before.length - 1; i >= 0; i--) {
        for (let j = after.length - 1; j >= 0; j--) {
            table[i][j] = before[i] === normalizedWord(after[j])
                ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
        }
    }
    const unchanged = new Set();
    let i = 0;
    let j = 0;
    while (i < before.length && j < after.length) {
        if (before[i] === normalizedWord(after[j])) { unchanged.add(j); i++; j++; }
        else if (table[i + 1][j] >= table[i][j + 1]) i++;
        else j++;
    }
    return after.map((word, index) => <span key={index}>{index > 0 ? " " : ""}{unchanged.has(index) ? word : <mark>{word}</mark>}</span>);
}

export default function MobileFeedback({ isCorrect, answer, userAnswer, naturalAnswer, explanation, vocabularyFeedback, pending, disabled, grammarRule, onContinue }) {
    const [open, setOpen] = useState(true);
    const [ruleOpen, setRuleOpen] = useState(false);
    return <>
        {!open && <button className="gl-text-button gl-result-reopen" onClick={() => setOpen(true)}>{t("Переглянути результат", "View feedback")}</button>}
        <MobileSheet open={open && !ruleOpen} onClose={() => setOpen(false)} title={pending ? t("Перевіряємо відповідь…", "Checking your answer…") : isCorrect ? t("Правильно!", "Correct!") : t("Майже! Є що покращити", "Almost there!")}
            footer={<button className="gl-primary" disabled={disabled || pending} onClick={onContinue}>{t("Далі", "Continue")}<ArrowRight size={21} /></button>}>
            {answer && <>
                <p className="gl-eyebrow">{isCorrect ? t("Ваша відповідь", "Your answer") : t("Правильний варіант", "Correct answer")}</p>
                <p className="gl-feedback-answer"><CorrectedAnswer answer={answer} original={userAnswer} /></p>
            </>}
            {naturalAnswer && <><p className="gl-eyebrow">{t("Природніше звучить", "A more natural way")}</p><div className="gl-rule-example">{naturalAnswer}</div></>}
            {pending ? <p className="gl-muted" role="status">{t("Готуємо пояснення…", "Preparing feedback…")}</p> : <>
                {(!isCorrect || vocabularyFeedback) && <p className="gl-feedback-explanation">{explanation}{disabled && <span role="status"> …</span>}</p>}
                {vocabularyFeedback && <p className="gl-feedback-explanation">{vocabularyFeedback}</p>}
                {!isCorrect && grammarRule && <button className="gl-text-button" disabled={disabled} onClick={() => setRuleOpen(true)}><BookOpen size={22} />{t("Пояснення правила", "Grammar explanation")}<CaretRight size={18} /></button>}
            </>}
        </MobileSheet>
        {ruleOpen && <MobileRuleSheet rule={grammarRule} returnToAnswer onClose={() => setRuleOpen(false)} />}
    </>;
}
