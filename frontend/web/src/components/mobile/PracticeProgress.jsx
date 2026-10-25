import { ChartBar } from "@phosphor-icons/react";
import usePracticeProgress from "./usePracticeProgress.js";
import { mobileCopy as t } from "./mobileCopy.js";

export default function PracticeProgress({ banner = false, level }) {
    const { attemptsLeft, accuracy } = usePracticeProgress();
    const remaining = Math.max(0, Number(attemptsLeft) || 0);
    if (banner) return <div className="gl-progress-banner"><ChartBar size={22} aria-hidden="true" /><span>{remaining > 0
        ? t(`Ще ${remaining} відповідей — і визначимо ваш рівень.`, `${remaining} more answers to assess your level.`)
        : t(`Ваш прогрес · ${Math.round(accuracy || 0)}%`, `Your progress · ${Math.round(accuracy || 0)}%`)}</span></div>;
    return <div className="gl-practice-progress">
        <div><span>{remaining > 0 ? t("Визначаємо ваш рівень", "Finding your level") : level && level !== "managed" ? t("Практика у вашому темпі", "Practice at your pace") : t("Щоденна практика", "Daily practice")}</span><strong>{remaining > 0 ? t(`${8 - remaining} із 7`, `${8 - remaining} of 7`) : `${Math.round(accuracy || 0)}%`}</strong></div>
        {remaining > 0 && <div className="gl-progress-segments" aria-label={t(`Завершено ${7 - remaining} із 7`, `${7 - remaining} of 7 completed`)}>{Array.from({ length: 7 }, (_, index) => <span key={index} className={index < 7 - remaining ? "is-complete" : ""} />)}</div>}
    </div>;
}
