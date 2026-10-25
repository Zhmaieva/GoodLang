import { useEffect, useId, useRef, useState } from "react";
import { Lightbulb } from "@phosphor-icons/react";
import MobileSheet from "./MobileSheet.jsx";
import { mobileCopy as t } from "./mobileCopy.js";

export default function MobileExerciseTask({ taskText, answer, setAnswer, textareaRef, onKeyDown,
    isInputDisabled, taskType, gapOptions, gapSelected, setGapSelected, loading,
    checking, buttonText, onMainButtonClick, actionDisabled, hint, hintContent }) {
    const answerId = useId();
    const promptRef = useRef(null);
    const [hintOpen, setHintOpen] = useState(false);
    useEffect(() => {
        setHintOpen(false);
        if (promptRef.current) promptRef.current.scrollTop = 0;
    }, [taskText, hint]);

    const keepAnswerFocused = (event) => {
        if (textareaRef?.current === document.activeElement) event.preventDefault();
    };
    const closeKeyboard = () => textareaRef?.current?.blur();

    return <div className="gl-exercise-task" aria-busy={loading || checking}>
        <section className="gl-exercise-prompt" ref={promptRef} aria-label={t("Завдання", "Exercise")} tabIndex={0}>
            <p>{taskType === "gap" ? t("Доповніть речення", "Complete the sentence") : t("Перекладіть англійською", "Translate into English")}</p>
            {loading ? <div className="gl-exercise-loading" role="status">{t("Готуємо завдання…", "Preparing your exercise…")}</div>
                : <div className="gl-exercise-sentence" dangerouslySetInnerHTML={{ __html: taskText }} />}
        </section>

        <section className="gl-exercise-answer">
            <div className="gl-exercise-answer-label">
                <label htmlFor={taskType === "gap" ? undefined : answerId}>{t("Ваша відповідь", "Your answer")}</label>
                <div><span>EN</span>{taskType !== "gap" && <button type="button" className="gl-exercise-done" onPointerDown={keepAnswerFocused} onClick={closeKeyboard}>{t("Готово", "Done")}</button>}</div>
            </div>
            {taskType === "gap" ? <div className="gl-exercise-options" role="group" aria-label={t("Варіанти відповіді", "Answer choices")}>
                {gapOptions.map((option) => <button key={option} type="button" aria-pressed={gapSelected === option} disabled={loading || isInputDisabled} onClick={() => setGapSelected(option)}>{option || "—"}</button>)}
            </div> : <textarea id={answerId} ref={textareaRef} data-goodlang-answer="true"
                placeholder={t("Напишіть переклад…", "Write your translation…")}
                autoComplete="off" autoCorrect="off" autoCapitalize="sentences" spellCheck={false}
                value={answer} onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={onKeyDown} readOnly={isInputDisabled} />}
        </section>

        <div className="gl-exercise-actions">
            {hint && !loading && <button type="button" className="gl-exercise-hint-button" onPointerDown={keepAnswerFocused} onClick={() => { closeKeyboard(); setHintOpen(true); }}><Lightbulb size={20} aria-hidden="true" />{t("Підказка", "Hint")}</button>}
            <button type="button" className="gl-primary" onPointerDown={keepAnswerFocused} onClick={onMainButtonClick} disabled={actionDisabled}>
                {loading ? t("Завантажуємо…", "Loading…") : checking ? t("Перевіряємо…", "Checking…") : buttonText}
            </button>
        </div>

        <MobileSheet open={hintOpen} title={t("Підказка", "Hint")} onClose={() => setHintOpen(false)}
            footer={<button className="gl-primary" onClick={() => setHintOpen(false)}>{t("До завдання", "Back to exercise")}</button>}>
            <div className="gl-exercise-hint-content">{hintContent}</div>
        </MobileSheet>
    </div>;
}
