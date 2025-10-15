import React, { useRef, useState } from "react";

// ——— Дані ———
const BANK = {
    beginner: [
        { ua: "Я у школі.", en: ["i am at school", "i'm at school"] },
        { ua: "Вона лікар.", en: ["she is a doctor", "she's a doctor"] },
        { ua: "Ми вдома.", en: ["we are at home", "we're at home"] },
        { ua: "Він щасливий.", en: ["he is happy", "he's happy"] },
        { ua: "Вони не готові.", en: ["they are not ready","they aren't ready","they're not ready"] },
        { ua: "Чи ти з України?", en: ["are you from ukraine?"] },
        { ua: "Мені 7 років.", en: ["i am 7","i am seven","i'm 7","i'm seven","i am seven years old","i'm seven years old"] },
    ],
    intermediate: [
        { ua: "Вона не вдома — вона на роботі.", en: [
                "she is not at home — she is at work","she isn't at home — she is at work",
                "she's not at home — she's at work","she isn't at home, she is at work","she's not at home, she's at work"
            ]},
        { ua: "Чи ми запізнилися?", en: ["are we late?"] },
        { ua: "Кіт під столом.", en: ["the cat is under the table"] },
        { ua: "Це важко?", en: ["is it hard?","is it difficult?"] },
        { ua: "Погода сьогодні чудова.", en: ["the weather is great today","the weather is wonderful today"] },
    ],
    advanced: [
        { ua: "Чи вчитель сьогодні вільний?", en: ["is the teacher free today?"] },
        { ua: "Мої батьки зараз у відпустці.", en: ["my parents are on vacation now"] },
        { ua: "Чи все гаразд?", en: ["is everything ok?","is everything okay?"] },
        { ua: "Причина проста: ми втомлені.", en: ["the reason is simple: we are tired"] },
        { ua: "Чи твій брат проти цієї ідеї?", en: ["is your brother against this idea?"] },
    ],
};

const ALL = Object.values(BANK).flat();
const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim().replace(/’/g, "'");
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const ITEMS = [
    { ua: "Я у школі.", en: ["i am at school", "i'm at school"] },
    { ua: "Вона лікар.", en: ["she is a doctor", "she's a doctor"] },
    { ua: "Ми вдома.", en: ["we are at home", "we're at home"] },
    { ua: "Він щасливий.", en: ["he is happy", "he's happy"] },
    { ua: "Вони не готові.", en: ["they are not ready","they aren't ready","they're not ready"] },
    { ua: "Чи ти з України?", en: ["are you from ukraine?"] },
    { ua: "Мені 7 років.", en: ["i am 7","i am seven","i'm 7","i'm seven","i am seven years old","i'm seven years old"] },

    // колишні intermediate:
    { ua: "Вона не вдома — вона на роботі.", en: [
            "she is not at home — she is at work","she isn't at home — she is at work",
            "she's not at home — she's at work","she isn't at home, she is at work","she's not at home, she's at work"
        ]},
    { ua: "Чи ми запізнилися?", en: ["are we late?"] },
    { ua: "Кіт під столом.", en: ["the cat is under the table"] },
    { ua: "Це важко?", en: ["is it hard?","is it difficult?"] },
    { ua: "Погода сьогодні чудова.", en: ["the weather is great today","the weather is wonderful today"] },

    // колишні advanced:
    { ua: "Чи вчитель сьогодні вільний?", en: ["is the teacher free today?"] },
    { ua: "Мої батьки зараз у відпустці.", en: ["my parents are on vacation now"] },
    { ua: "Чи все гаразд?", en: ["is everything ok?","is everything okay?"] },
    { ua: "Причина проста: ми втомлені.", en: ["the reason is simple: we are tired"] },
    { ua: "Чи твій брат проти цієї ідеї?", en: ["is your brother against this idea?"] },
];

// ——— Компонент ———
export default function TrainerToBePretty({ theme }) {
    // базова тема за замовчуванням, якщо не передали
    const t = {
        bg: "#fff3df",
        card: "#fffdf8",
        accent: "#ff6138",
        accentDark: "#d74e2a",
        blue: "#3a6ea5",
        text: "#3a2a1d",
        muted: "#a47856",
        green: "#4ba36e",
        greenDark: "#2d6f48",
        radius: 22,
        ...theme,
    };

    const [task, setTask] = useState(() => sample(ALL));
    const [answer, setAnswer] = useState("");
    const [mode, setMode] = useState("check"); // 'check' | 'next'
    const [feedback, setFeedback] = useState("Порада: перекладіть і натисніть «Перевірити»");
    const [correct, setCorrect] = useState("");
    const inputRef = useRef(null);

    // стилі в одному місці, щоб легко крутити тему
    const S = {
        wrap: { display: "grid", gap: 18 },
        card: {
            background: t.card,
            border: `4px solid ${t.accent}`,
            borderRadius: 28,
            boxShadow: `6px 6px 0 ${t.accentDark}`,
            padding: 18,
        },
        ua: { fontSize: 20, fontWeight: 800, color: t.text, margin: "4px 6px 14px" },
        textareaWrap: { padding: 6, borderRadius: 28, border: `0 solid transparent` },
        textarea: {
            width: "100%",
            minHeight: 84,
            borderRadius: 28,
            border: "3px solid transparent",
            outline: `3px solid ${t.blue}`,
            background: "#fff",
            padding: "14px 18px",
            fontSize: 16,
            color: t.text,
        },
        bigBtn: (hover) => ({
            width: "100%",
            marginTop: 6,
            background: hover ? t.accentDark : t.accent,
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "16px 20px",
            fontWeight: 800,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: `6px 6px 0 ${t.accentDark}`,
            transition: "background .15s ease, transform .1s ease",
            transform: hover ? "translateY(1px)" : "none",
        }),
        title: { fontSize: 14, letterSpacing: ".08em", fontWeight: 900, textTransform: "uppercase", marginBottom: 10 },
        feedbackCard: {
            background: t.card,
            border: `4px solid ${t.accent}`,
            borderRadius: 28,
            boxShadow: `6px 6px 0 ${t.accentDark}`,
            padding: 18,
        },
        feedbackPill: {
            border: `2px dashed ${t.accent}`,
            borderRadius: 999,
            padding: "12px 14px",
            fontSize: 16,
            color: t.text,
            background: "#fff",
        },
        correctWrap: {
            marginTop: 10,
            background: "#fff",
            border: `2px solid ${t.green}`,
            borderRadius: 22,
            boxShadow: `2px 2px 0 ${t.greenDark}`,
            padding: "10px 12px",
        },
        correctTitle: {
            fontSize: 12,
            fontWeight: 900,
            color: t.green,
            textTransform: "uppercase",
            letterSpacing: ".06em",
            marginBottom: 6,
        },
        correctText: {
            fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: 16,
            background: "#f4fff7",
            border: `1.5px solid ${t.green}`,
            borderRadius: 12,
            padding: "8px 10px",
            display: "inline-block",
        },
    };

    const [hover, setHover] = useState(false);

    const check = () => {
        if (!task) return;
        const ok = task.en.some((a) => norm(a) === norm(answer));
        if (ok) {
            setFeedback("✔ Молодець! Все правильно.");
            setCorrect("");
            if (window.StepLangAnalytics) {
                window.StepLangAnalytics.updateRuleStat?.(1, true);
                ["am", "is", "are"].forEach((w) => window.StepLangAnalytics.noteWordResult?.(w, true));
            }
        } else {
            setFeedback('✘ Спробуй ще. Підказка: зверни увагу на форму am/is/are і порядок слів.');
            setCorrect(task.en[0]);
            if (window.StepLangAnalytics) {
                window.StepLangAnalytics.updateRuleStat?.(1, false);
                ["am", "is", "are"].forEach((w) => window.StepLangAnalytics.noteWordResult?.(w, false));
            }
        }
        setMode("next");
    };

    const next = () => {
        const n = sample(ALL);
        setTask(n);
        setAnswer("");
        setFeedback("Порада: перекладіть і натисніть «Перевірити»");
        setCorrect("");
        setMode("check");
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const onMain = () => (mode === "check" ? check() : next());

    const onKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); onMain(); }
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onMain(); }
    };

    return (
        <div style={S.wrap}>
            {/* Верхня картка з реченням + інпут + велика кнопка */}
            <div style={S.card} aria-live="polite">
                <div style={S.ua}>{task?.ua || "…"}</div>

                <div style={S.textareaWrap}>
          <textarea
              ref={inputRef}
              placeholder="Введіть переклад англійською…"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={mode === "next" && false /* залишаємо активним як на скріні */}
              style={S.textarea}
          />
                </div>

                <button
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    style={S.bigBtn(hover)}
                    onClick={onMain}
                >
                    {mode === "check" ? "Перевірити" : "Наступне речення"}
                </button>
            </div>

            {/* Результат */}
            <div style={S.feedbackCard}>
                <div style={S.title}>Результат</div>
                <div style={S.feedbackPill}>{feedback}</div>

                {correct && (
                    <div style={S.correctWrap}>
                        <div style={S.correctTitle}>Правильна відповідь</div>
                        <div style={S.correctText}>{correct}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
