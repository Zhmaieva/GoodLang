import React, {useState} from "react";
import {callManageSubscriptionApi} from "../../services/api.js";
import LoginModal from "./LoginModal.jsx";

export default function AccountStatusModal({ theme, open, onClose, status }) {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [account, setAccount] = useState(null);

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
        "Необмежена кількість завдань",
        "Хмарне збереження прогресу",
        "Доступ з усіх пристроїв",
        "Пріоритетна підтримка"
    ];

    // LevelSwitch-style small button
    const manageBtnStyle = {
        appearance: "none",
        padding: "10px 16px",
        fontWeight: 800,
        fontSize: 14,
        lineHeight: 1,
        borderRadius: 999,
        cursor: "pointer",

        background: theme.accent,
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        color: "white",

        justifyContent: "center",
    };



    const closeBtnStyle = {
        appearance: "none",
        padding: "10px 18px",
        fontWeight: 800,
        fontSize: 14,
        lineHeight: 1,
        borderRadius: 999,

        background: "#fffdf8",
        color: theme.text,
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,

        cursor: "pointer",
        transition: "transform 120ms ease",
    };

    const onManage = async () => {
        try {
            const { url } = await callManageSubscriptionApi();
            window.open(url, "_blank"); // open in new tab
        } catch (e) {
            console.error("Failed to open subscription management", e);
        }
    }

    return (
        <div>
            {
                !loginModalOpen &&
                <div onClick={onClose} style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999
                }}>
                    <div onClick={(e) => e.stopPropagation()} style={{
                        background: theme.bg,
                        padding: "36px",
                        borderRadius: theme.radius * 1.2,
                        border: `4px solid ${theme.accent}`,
                        width: "90%",
                        maxWidth: 480,
                        textAlign: "center",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                        gap: "12px"
                    }}>
                        <h2 style={{marginBottom: 16, color: theme.text, fontSize: "1.7rem", fontWeight: 800}}>
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
                                maxWidth: 280,
                                textAlign: "left",
                                fontSize: "1.05rem",
                                lineHeight: "1.6",
                                color: theme.text,
                                fontWeight: 500
                            }}>
                                {benefits.map(b => (

                                    <li key={b}>
                                        <span style={{marginRight: 8, opacity: 0.5}}>•</span> {b}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div style={{
                            display: "flex",
                            marginTop: "12px",
                            flexDirection: "column",
                            gap: "12px",
                            justifyContent: "space-between"
                        }}>
                            {(status === "paid" || status === "attention") && (
                                <button
                                    style={manageBtnStyle}
                                    onClick={onManage} // open stripe portal
                                >
                                    Керувати підпискою
                                </button>
                            )}

                            <button onClick={() => {
                                setLoginModalOpen(true)
                            }} style={closeBtnStyle}>
                                Увійти в інший акаунт
                            </button>
                        </div>
                    </div>
                </div>
            }
            {
                loginModalOpen &&
                <div onClick={(e) => e.stopPropagation()}>
                    <LoginModal forceLogin={true} theme={theme} account={account} open={loginModalOpen}
                                onClose={() => {
                                    setLoginModalOpen(false);
                                    onClose();
                                }
                                }/>
                </div>
            }
        </div>
    );
}
