import React from "react";
import { logoStyle } from "./LimitModal.jsx";

export default function FaqModal({
                                     theme,
                                     onClose = () => {},
                                 }) {
    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        inset: 0,
        height: "100dvh",
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    };

    const cardStyle = {
        background: theme.bg,
        padding: "28px",
        borderRadius: theme.radius * 1.2,
        border: `4px solid ${theme.accent}`,
        width: "92%",
        maxWidth: 560,
        textAlign: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    };

    const contentStyle = {
        textAlign: "left",
        background: "#fffdf8",
        borderRadius: theme.radius,
        border: `3px solid ${theme.accent}`,
        padding: "14px 14px",
        maxHeight: 320,
        overflowY: "auto",
        lineHeight: 1.55,
        color: theme.text,
        fontSize: "1rem",
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
    };

    const closeBtn = {
        fontFamily: "Nunito, system-ui, sans-serif",
        appearance: "none",
        padding: "10px 16px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        cursor: "pointer",
        background: "#fffdf8",
        color: theme.text,
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        width: "100%",
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
                <div style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                    <div>
                        <h2 style={{
                            margin: 0,
                            color: theme.text,
                            fontSize: "1.5rem",
                            fontWeight: 800,
                            textAlign: "left"
                        }}>
                            Часті питання
                        </h2>
                        <p style={{
                            marginTop: 8,
                            color: theme.text,
                            fontSize: "1rem",
                            fontWeight: 500,
                            textAlign: "left"
                        }}>
                            Коротко про сервіс GoodLang
                        </p>
                    </div>

                    <div style={logoStyle(64)}>GL</div>
                </div>

                <div style={contentStyle}>
                    <h3 style={{ marginTop: 0 }}>1. Що це?</h3>
                    <p>
                        <strong>GoodLang</strong> — це персональний тренажер англійської мови, який допомагає
                        <strong> розібратися саме з тими правилами, де ти застряг(ла)</strong>.
                        Сервіс показує прогрес, слабкі місця та зручну аналітику.
                        Усі правила зібрані в одному місці.
                        Можеш користуватися самостійно або разом з учителем.
                    </p>

                    <h3>2. Скільки це коштує?</h3>
                    <p>
                        <strong>GoodLang</strong> можна користуватися <strong>безкоштовно</strong>.
                        Безкоштовний доступ включає оцінку рівня англійської
                        та щоденну практику з достатньою кількістю речень,
                        щоб побачити реальний прогрес.
                    </p>

                    <h3>3. Чи потрібна мені підписка?</h3>
                    <p>
                        Підписка знімає обмеження на щоденну кількість перекладів
                        і дозволяє користуватися своїм навчанням з необмеженої
                        кількості пристроїв, зберігаючи весь прогрес.
                    </p>

                    <h3>4. Чи можу я отримати знижку?</h3>
                    <p>
                        Ми підтримуємо індивідуальний підхід.
                        Можливі спеціальні умови та окремі програми
                        для учбових закладів, викладачів, учнів і навчальних груп.
                    </p>

                    <h3>5. Хто ми?</h3>
                    <p>
                        <strong>GoodLang</strong> створюють <strong>Юля</strong> та <strong>Артем</strong> — засновники стартапу
                        та ентузіасти, які постійно розвивають сервіс.
                        Ми уважно ставимося до фідбеку і попереду маємо багато крутих фіч.
                    </p>
                </div>

                <div style={{ marginTop: 16 }}>
                    <button style={closeBtn} onClick={onClose}>
                        Добре
                    </button>
                </div>
            </div>
        </div>
    );
}
