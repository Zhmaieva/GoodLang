import React, { useState } from "react";
import LimitModal from "../subscription/LimitModal.jsx";
import LoginForm from "./LoginForm.jsx";
import AccountStatusButton from "./AccountStatusButton.jsx";

export default function LoginModal({
                                       mobile,
                                       theme,
                                       open,
                                       onClose,
                                       account,
                                       forceLogin = false,
                                   }) {
    const [loginMode, setLoginMode] = useState(false);
    const [limitModalOpen, setLimitModalOpen] = useState(false);

    if (!open) return null;

    const wrapperStyle = {
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

    const boxStyle = {
        background: theme.bg,
        padding: "36px",
        borderRadius: theme.radius * 1.2,
        border: `4px solid ${theme.accent}`,
        width: "90%",
        maxWidth: 480,
        textAlign: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        fontFamily: "Nunito, system-ui, sans-serif",
        lineHeight: 1.4,
    };

    const primaryButton = {
        background: theme.accent,
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        color: "white",
        padding: "8px 14px",
        borderRadius: theme.radius,
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: 700,
        marginTop: 20,
    };

    const outlineButton = {
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
        justifyContent: "center",
    };

    return (
        <div
            style={wrapperStyle}
        >
            <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
                {!loginMode && !forceLogin ? (
                    // ✅ No global gap here — we control spacing per section
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {/* Logged-in user email */}
                        {account?.email && (
                            <div style={{ marginBottom: 8 }}>
                                <h2
                                    style={{
                                        marginBottom: 10,
                                        color: theme.text,
                                        fontSize: "1.6rem",
                                        fontWeight: 800,
                                    }}
                                >
                                    Ваш акаунт
                                </h2>

                                <p
                                    style={{
                                        color: theme.muted,
                                        fontSize: "1rem",
                                        marginBottom: 20, // ✅ prevents extra space
                                    }}
                                >
                                    {account.email}
                                </p>
                            </div>
                        )}

                        {/* Account status block */}
                        {account?.status !== "paid" ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                <h3
                                    style={{
                                        margin: 0,
                                        color: theme.text,
                                        fontSize: "1.3rem",
                                        fontWeight: 800,
                                    }}
                                >
                                    ❌ Прогрес збережено локально
                                </h3>

                                <p
                                    style={{
                                        color: theme.muted,
                                        fontSize: "1rem",
                                        lineHeight: "1.45",
                                        margin: 0,
                                    }}
                                >
                                    Активуй підписку, щоб мати доступ до навчання де і коли завгодно - на повну з GoodLang!
                                </p>

                                <button style={primaryButton} onClick={() => setLimitModalOpen(true)}>
                                    Хочу підписку
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <h3
                                    style={{
                                        margin: 0,
                                        color: theme.text,
                                        fontSize: "1.3rem",
                                        fontWeight: 800,
                                    }}
                                >
                                    ✅ Прогрес синхронізовано
                                </h3>

                                <p
                                    style={{
                                        color: theme.muted,
                                        fontSize: "1rem",
                                        lineHeight: "1.45",
                                        margin: 0,
                                    }}
                                >
                                    Ви можете продовжити навчання на будь-якому пристрої
                                </p>
                            </div>
                        )}

                        {/* ✅ Separate bottom actions block with its own spacing */}
                        <div
                            style={{
                                marginTop: 12,
                                display: "flex",
                                flexDirection: "column",
                                gap: 12, // ✅ number, not "12px" string required but ok either way
                                justifyContent: "space-between",
                            }}
                        >
                            {mobile && <AccountStatusButton mobile theme={theme} />}

                            {/* Login / switch account */}
                            <button style={outlineButton} onClick={() => setLoginMode(true)}>
                                {account?.email ? "Увійти в інший аккаунт" : "Увійти або зареєструватися"}
                            </button>
                        </div>
                    </div>
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
            {limitModalOpen && account?.email && (
                <LimitModal
                    accountInfo={account}
                    isLimitReached={false}
                    theme={theme}
                    open={limitModalOpen}
                    onClose={() => setLimitModalOpen(false)}
                />
            )}

            {/* Force login inside modal */}
            {limitModalOpen && !account?.email && (
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
