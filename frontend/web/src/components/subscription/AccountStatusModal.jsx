import React, {useState} from "react";
import {callManageSubscriptionApi} from "../../services/api.js";
import LoginModal from "./LoginModal.jsx";
import {logoStyle} from "./LimitModal.jsx";

export default function AccountStatusModal({ accountInfo, theme, open, onClose, status }) {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [account, setAccount] = useState(accountInfo);

    if (!open) return null;

    const titleMap = {
        paid: "Підписка",
        attention: "Підписка закінчується"
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
        <>
            {
                !loginModalOpen &&
                <div onClick={onClose} style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100%",
                    inset: 0,
                    height: "100dvh",
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
                        {
                            account?.email &&
                            <p style={{
                                marginBottom: 16,
                                marginTop: 0,
                                marginLeft: 0,
                                color: theme.muted,
                                fontSize: "1rem",
                                fontWeight: 500,
                                textAlign: "left"
                            }}>
                                {account?.email}
                            </p>
                        }

                        <div style={{
                            marginLeft: 0,
                            marginBottom: 16,
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <h2 style={{
                                    textAlign: "left",
                                    marginBottom: 0,
                                    marginTop: 0,
                                    color: theme.text,
                                    fontSize: "1.5rem",
                                    fontWeight: 800
                                }}>
                                    {titleMap[status]}
                                </h2>
                                <p style={{
                                    marginBottom: 16,
                                    marginTop: 8,
                                    marginLeft: 0,
                                    color: theme.text,
                                    fontSize: "1rem",
                                    textAlign: "left"
                                }}>
                                    Підписка <strong>₴149.99 / місяць</strong>
                                </p>
                            </div>

                            <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                                <div style={logoStyle(64)}>GL</div>
                            </div>
                        </div>

                        <div style={{textAlign: "left", margin: "0 0 28px 0", maxWidth: 280}}>
                            <ul style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                lineHeight: "1.6",
                                color: theme.text,
                                fontSize: "16px",
                                fontWeight: 500
                            }}>
                                <li>
                                    <span style={{marginRight: 8, color: theme.accent, fontWeight: 700}}>✓</span>
                                    Необмежена кількість завдань
                                </li>
                                <li>
                                    <span style={{marginRight: 8, color: theme.accent, fontWeight: 700}}>✓</span>
                                    Хмарне збереження прогресу
                                </li>
                                <li>
                                    <span style={{marginRight: 8, color: theme.accent, fontWeight: 700}}>✓</span>
                                    Доступ з усіх пристроїв
                                </li>
                                <li>
                                    <span style={{marginRight: 8, color: theme.accent, fontWeight: 700}}>✓</span>
                                    Пріоритетна підтримка
                                </li>
                            </ul>
                        </div>

                        <div style={{
                            display: "flex",
                            marginTop: "12px",
                            flexDirection: "column",
                            gap: "12px",
                            justifyContent: "space-between"
                        }}>
                            {(status === "paid" || status === "attention") && (
                                <button
                                    style={{
                                        background: theme.accent,
                                        boxShadow: `2px 2px 0 ${theme.accentDark}`,
                                        color: "white",
                                        padding: "10px 20px",
                                        borderRadius: theme.radius,
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "1rem",
                                        fontWeight: 700,
                                        width: "100%",
                                        opacity: 1
                                    }}
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
        </>
    );
}
