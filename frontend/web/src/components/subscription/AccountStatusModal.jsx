import React from "react";

export default function AccountStatusModal({ theme, open, onClose, status }) {
    if (!open) return null;

    const titleMap = {
        paid: "Преміум акаунт",
        attention: "Потрібна увага"
    };

    const textMap = {
        paid: `
            Ви користуєтеся преміум-підпискою GoodLang!
            Дякуємо за підтримку ❤️
        `,
        attention: `
            Ваш акаунт потребує уваги.
            Можливо, виникла проблема з оплатою або завершився період підписки. Незабаром ви отримаєте листа з інструкціями оплати від goodlang.billing@gmail.com"
        `
    };

    const benefits = [
        "✔️ Необмежена кількість завдань",
        "✔️ Хмарне збереження прогресу",
        "✔️ Синхронізація на всіх пристроях",
        "✔️ Пріоритетна підтримка"
    ];

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
        }}>
            <div style={{
                background: theme.bg,
                padding: "36px",
                borderRadius: theme.radius * 1.2,
                border: `4px solid ${theme.accent}`,
                width: "90%",
                maxWidth: 480,
                textAlign: "center",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            }}>
                <h2 style={{ marginBottom: 16, color: theme.text, fontSize: "1.7rem", fontWeight: 800 }}>
                    {titleMap[status]}
                </h2>

                <p style={{
                    whiteSpace: "pre-line",
                    color: theme.muted,
                    fontSize: "1.1rem",
                    marginBottom: 20,
                    lineHeight: "1.45"
                }}>
                    {textMap[status]}
                </p>

                {status === "paid" && (
                    <ul style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "0 auto",
                        maxWidth: 340,
                        textAlign: "left",
                        fontSize: "1.05rem",
                        lineHeight: "1.6",
                        color: theme.text,
                        fontWeight: 500
                    }}>
                        {benefits.map(b => (
                            <li key={b}>{b}</li>
                        ))}
                    </ul>
                )}

                <button
                    onClick={onClose}
                    style={{
                        background: theme.accent,
                        color: "white",
                        padding: "12px 26px",
                        borderRadius: theme.radius,
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        marginTop: 28
                    }}
                >
                    Закрити
                </button>
            </div>
        </div>
    );
}
