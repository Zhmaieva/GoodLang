import { useNavigate } from "react-router-dom";
import { ArrowRight, MagnifyingGlass, Stack } from "@phosphor-icons/react";
import Pagination from "../Pagination.jsx";
import { mobileCopy as t } from "./mobileCopy.js";

export default function MobileVocabulary({ words, totalWords, loading, error, query, setQuery, statusFilter, setStatusFilter, filterLevel, setFilterLevel, sortKey, setSortKey, sortDir, setSortDir, page, totalPages, setPage, theme, getAccuracy, getStatus, formatDate, summary, sentencesLeft }) {
    const navigate = useNavigate();
    return <main className="gl-mobile-page">
        <p className="gl-vocab-intro">{t("Слова з вашої практики", "Words from your practice")}</p>
        {totalWords > 0 && <>
            <label className="gl-search"><MagnifyingGlass size={23} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Знайти слово", "Find a word")} aria-label={t("Слово або переклад", "Word or translation")} /></label>
            <details className="gl-more-options"><summary>{t("Прогрес і фільтри", "Progress and filters")}</summary>
                <p>{sentencesLeft > 0 ? t(`Ще ${sentencesLeft} відповідей до визначення рівня.`, `${sentencesLeft} more answers to assess your level.`) : `${t("Рівень словника", "Vocabulary level")}: ${summary?.vocabularyLevel?.value || "—"}`}</p>
                <label className="gl-filter-label">{t("Статус", "Status")}<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">{t("Усі слова", "All words")}</option><option value="needsPractice">{t("Варто повторити", "Needs practice")}</option><option value="learned">{t("Засвоєно", "Learned")}</option></select></label>
                <label className="gl-filter-label">{t("Рівень", "Level")}<select value={filterLevel} onChange={(event) => setFilterLevel(event.target.value)}><option value="all">{t("Усі рівні", "All levels")}</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
                <label className="gl-filter-label">{t("Сортувати", "Sort by")}<select value={sortKey} onChange={(event) => setSortKey(event.target.value)}><option value="word">{t("Слово", "Word")}</option><option value="level">{t("Рівень", "Level")}</option><option value="accuracy">{t("Точність", "Accuracy")}</option><option value="attempts">{t("Спроби", "Attempts")}</option><option value="lastPractice">{t("Остання практика", "Last practice")}</option><option value="status">{t("Статус", "Status")}</option></select></label>
                <button className="gl-text-button" onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}>{sortDir === "asc" ? t("За зростанням ↑", "Ascending ↑") : t("За спаданням ↓", "Descending ↓")}</button>
            </details>
        </>}
        {loading ? <p className="gl-empty" role="status">{t("Завантажуємо слова…", "Loading words…")}</p> : error ? <p className="gl-empty" role="alert">{error}</p> : totalWords === 0 ? <div className="gl-empty">
            <Stack size={38} className="gl-empty-illustration" aria-hidden="true" />
            <p>{t("Ваш словник починається з практики. Перекладайте речення — тут з’являтимуться слова, які варто запам’ятати.", "Your vocabulary starts with practice. Translate sentences to collect words to remember here.")}</p>
        </div> : <div className="gl-list">
            {words.map((word) => <details className="gl-word" key={word.id || word.word}>
                <summary><strong>{word.word}</strong><span className="gl-row-subtitle">{word.meaning || "—"}{word.partOfSpeech ? ` · ${word.partOfSpeech}` : ""}</span></summary>
                <div className="gl-word-details"><p>{t("Рівень", "Level")}: {word.level || "—"} · {getStatus(word) === "learned" ? t("Засвоєно", "Learned") : t("Варто повторити", "Needs practice")}</p><p>{t("Точність", "Accuracy")}: {Math.round(getAccuracy(word))}% · {t("Спроб", "Attempts")}: {word.attempts || 0}</p><p>{t("Остання практика", "Last practice")}: {formatDate(word.lastPracticeAt)}</p></div>
            </details>)}
            {words.length === 0 && <p className="gl-empty">{t("За цими фільтрами слів немає.", "No words match these filters.")}</p>}
        </div>}
        {!loading && totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} theme={theme} isMobile />}
        <div className="gl-vocab-action"><button className="gl-primary" onClick={() => navigate("/trainer")}>{t("До практики", "Back to practice")}<ArrowRight size={21} /></button></div>
    </main>;
}
