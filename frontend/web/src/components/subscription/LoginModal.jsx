import React, { useState } from "react";
import LimitModal from "../subscription/LimitModal.jsx";
import LoginForm from "./LoginForm.jsx";

export default function LoginModal({ theme, open, onClose, account, forceLogin = false }) {
    const [loginMode, setLoginMode] = useState(false);
    const [limitModalOpen, setLimitModalOpen] = useState(false);

    if (!open) return null;

    const wrapperStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    };

    const boxStyle = {
        background: theme.bg,
        padding: "36px",
        borderRadius: theme.radius * 1.2,
        border: `4px solid ${theme.accent}`,
        width: "90%",
        maxWidth: 480,
        textAlign: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    };

    const primaryButton = {
        background: theme.accent,
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        color: "white",
        padding: "12px 26px",
        borderRadius: theme.radius,
        cursor: "pointer",
        fontSize: "1.1rem",
        fontWeight: 700,
        marginTop: 20,
    };

    const outlineButton = {
        appearance: "none",
        padding: "12px 20px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        background: "#fffdf8",
        color: theme.text,
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        cursor: "pointer",
        marginTop: 16,
        transition: "transform 120ms ease",
    };

    const textButton = {
        background: "transparent",
        border: "none",
        color: theme.muted,
        fontSize: "0.95rem",
        cursor: "pointer",
        marginTop: 16,
        textDecoration: "underline",
    };

    return (
        <div style={wrapperStyle} onClick={() => {
                setLoginMode(false);
                if (forceLogin)
                    onClose();
                onClose(); }}>
            <div style={boxStyle} onClick={e => e.stopPropagation()}>
                {!loginMode && !forceLogin ? (
                    <>
                        {/* Logged-in user email */}
                        {account?.email && (
                            <div style={{ marginBottom: 24 }}>
                                <h2 style={{
                                    marginBottom: 8,
                                    color: theme.text,
                                    fontSize: "1.6rem",
                                    fontWeight: 800
                                }}>
                                    Ваш акаунт
                                </h2>

                                <p style={{ color: theme.muted, fontSize: "1.05rem" }}>
                                    {account.email}
                                </p>
                            </div>
                        )}

                        {/* Account status block */}
                        {account?.status !== 'paid' ? (
                            <>
                                <h3 style={{
                                    marginBottom: 12,
                                    color: theme.text,
                                    fontSize: "1.3rem",
                                    fontWeight: 800
                                }}>
                                    ❌ Без синхронізації
                                </h3>

                                <p style={{
                                    color: theme.muted,
                                    fontSize: "1.05rem",
                                    lineHeight: "1.45",
                                    marginBottom: 12
                                }}>
                                    Активуйте преміум, щоб увімкнути синхронізацію
                                    та отримати всі можливості GoodLang!
                                </p>

                                <button
                                    style={primaryButton}
                                    onClick={() => setLimitModalOpen(true)}
                                >
                                    Хочу преміум
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 style={{
                                    marginBottom: 12,
                                    color: theme.text,
                                    fontSize: "1.3rem",
                                    fontWeight: 800
                                }}>
                                    ✅ Прогрес синхронізовано
                                </h3>

                                <p style={{
                                    color: theme.muted,
                                    fontSize: "1.05rem",
                                    lineHeight: "1.45",
                                }}>
                                    Ви можете продовжити навчання на будь-якому пристрої
                                </p>
                            </>
                        )}

                        <div style={{display: "flex", justifyContent: "space-between", flexDirection: "column"}}>
                            {/* Login / switch account */}
                            <button
                                style={outlineButton}
                                onClick={() => setLoginMode(true)}
                            >
                                {account.email ? "Увійти в інший аккаунт" : "Увійти або зареєструватися"}
                            </button>
                        </div>
                    </>
                ) : (
                    <LoginForm
                        theme={theme}
                        account={account}
                        onClose={() => {
                            setLoginMode(false);
                            if (forceLogin) onClose();
                        }}
                    />
                )}
            </div>

            {/* Limit modal */}
            {limitModalOpen && account.email && (
                <LimitModal
                    isLimitReached={false}
                    theme={theme}
                    open={limitModalOpen}
                    onClose={() => setLimitModalOpen(false)}
                />
            )}

            {/* Force login inside modal */}
            {limitModalOpen && !account.email && (
                <LoginModal
                    forceLogin={true}
                    theme={theme}
                    account={account}
                    open={limitModalOpen}
                    onClose={() => setLimitModalOpen(false)}
                />
            )}
        </div>
    );
}
