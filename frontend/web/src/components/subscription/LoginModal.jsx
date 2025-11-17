import React, { useState } from "react";
import LimitModal from "../subscription/LimitModal.jsx";
import LoginForm from "./LoginForm.jsx";

export default function LoginModal({ theme, open, onClose, account, forceLogin=false }) {
    const [loginMode, setLoginMode] = useState(false);
    const [limitModalOpen, setLimitModalOpen] = useState(false);

    if (!open) return null;

    const modalStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    };

    const contentStyle = {
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        minWidth: 320,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    };

    const buttonStyle = {
        appearance: "none",
        padding: "10px 16px",
        fontWeight: 800,
        fontSize: 14,
        lineHeight: 1,
        borderRadius: 999,
        cursor: "pointer",
        background: theme.accent,
        color: "#fff",
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        transition: "transform 120ms ease",
    };

    const buttonStyleSignIn = {
        appearance: "none",
        padding: "10px 16px",
        fontWeight: 800,
        fontSize: 14,
        lineHeight: 1,
        borderRadius: 999,
        cursor: "pointer",
        background: "#fff",
        color: theme.accent,
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        transition: "transform 120ms ease",
    };

    return (
        <div style={modalStyle}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                {!loginMode && !forceLogin ? (
                    <>
                        {account?.email ? (
                            <div>
                                <h3>Користувач:</h3>
                                <p>{account.email}</p>
                            </div>
                        ) : (<></>)}

                        {account?.status !== 'paid' ? (
                            <div>
                                <h3>Без синхронізації</h3>
                                <p>Активуйте преміум, щоб ввімкнути синхронізацію, та ще багато іншого!</p>
                                <button
                                    style={buttonStyle}
                                    onClick={() => setLimitModalOpen(true)}
                                >
                                    Хочу преміум
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h3>Прогрес синхронізовано</h3>
                                <p>Ви можете продовжити навчання на будь-якому пристрої</p>
                            </div>
                        )}

                        <button
                            style={{...buttonStyleSignIn, marginTop: 12,}}
                            onClick={() => setLoginMode(true)}
                        >
                            {account.email ? "Увійти в інший профіль" : "Увійти або зареєструватися"}
                        </button>

                        <button
                            onClick={onClose}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: theme.muted,
                                fontSize: "0.95rem",
                                cursor: "pointer",
                                textDecoration: "underline",
                                opacity: 1
                            }}
                        >
                            Назад
                        </button>
                    </>
                ) : (
                    <LoginForm theme={theme} account={account} onClose={() => {
                        setLoginMode(false)
                        if (forceLogin)
                            onClose();
                    }}/>
                )}
            </div>

            {
                limitModalOpen && account.email &&
                <LimitModal
                    isLimitReached={false}
                    theme={theme}
                    open={limitModalOpen}
                    onClose={() => setLimitModalOpen(false)}
                />
            }

            {
                limitModalOpen && !account.email &&
                <LoginModal forceLogin={true} theme={theme} account={account} open={limitModalOpen} onClose={() => setLimitModalOpen(false)} />
            }
        </div>
    );
}
