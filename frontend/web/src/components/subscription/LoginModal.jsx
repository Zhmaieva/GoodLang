import React, { useState } from "react";
import LimitModal from "../subscription/LimitModal.jsx";
import LoginForm from "./LoginForm.jsx";

export default function LoginModal({ theme, open, onClose, account }) {
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

    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                {!loginMode ? (
                    <>
                        {account?.email ? (
                            <div>
                                <h3>Logged in as:</h3>
                                <p>{account.email}</p>
                            </div>
                        ) : (
                            <div>
                                <h3>Free Account</h3>
                                <p>Consider upgrading to Premium for extra features!</p>
                                <button
                                    style={buttonStyle}
                                    onClick={() => setLimitModalOpen(true)}
                                >
                                    Buy Premium
                                </button>
                            </div>
                        )}
                        <button
                            style={{ ...buttonStyle, marginTop: 12, }}
                            onClick={() => setLoginMode(true)}
                        >
                            { account.email ? "Sign in to another account" : "Have an account? Sign in"}
                        </button>
                    </>
                ) : (
                    <LoginForm theme={theme} account={account} onClose={() => {setLoginMode(false)}} />
                )}
            </div>

            <LimitModal
                isLimitReached={false}
                theme={theme}
                open={limitModalOpen}
                onClose={() => setLimitModalOpen(false)}
            />
        </div>
    );
}
