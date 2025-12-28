import React from "react";

export default function CookieConsentModal({ theme, onAccept, onReject, onOpenPolicy }) {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                paddingBottom: "env(safe-area-inset-bottom)",
                paddingTop: "env(safe-area-inset-top)",
            }}
        >
            <div
                style={{
                    background: theme.bg,
                    padding: "28px",
                    borderRadius: theme.radius * 1.2,
                    border: `4px solid ${theme.accent}`,
                    width: "90%",
                    maxWidth: 460,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                }}
                onClick={e => e.stopPropagation()}
            >
                <h2
                    style={{
                        marginTop: 0,
                        marginBottom: 12,
                        color: theme.text,
                        fontSize: "1.4rem",
                        fontWeight: 800,
                    }}
                >
                    Cookies
                </h2>

                <p
                    style={{
                        marginTop: 0,
                        marginBottom: 16,
                        color: theme.text,
                        fontSize: "1rem",
                        lineHeight: 1.5,
                    }}
                >
                    Ми використовуємо <strong>виключно необхідні cookies</strong> для
                    безпечної автентифікації та обробки платежів, а також
                    <strong> аналітичні cookies</strong> для покращення сервісу.
                </p>

                <p
                    style={{
                        marginTop: 0,
                        marginBottom: 20,
                        fontSize: "0.95rem",
                        color: theme.muted,
                    }}
                >
                    Детальніше — в{" "}
                    <a
                        href="#"
                        onClick={onOpenPolicy}
                        style={{
                            color: theme.accent,
                            fontWeight: 700,
                            textDecoration: "none",
                        }}
                    >
                        політиці конфіденційності та cookies
                    </a>
                    .
                </p>

                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={onReject}
                        style={{
                            flex: 1,
                            background: "#fffdf8",
                            color: theme.text,
                            border: `2px solid ${theme.accent}`,
                            borderRadius: theme.radius,
                            padding: "10px 16px",
                            fontWeight: 800,
                            cursor: "pointer",
                            boxShadow: `2px 2px 0 ${theme.accentDark}`,
                        }}
                    >
                        Відхилити
                    </button>

                    <button
                        onClick={onAccept}
                        style={{
                            flex: 1,
                            background: theme.accent,
                            color: "white",
                            border: "none",
                            borderRadius: theme.radius,
                            padding: "10px 16px",
                            fontWeight: 800,
                            cursor: "pointer",
                            boxShadow: `2px 2px 0 ${theme.accentDark}`,
                        }}
                    >
                        Прийняти
                    </button>
                </div>
            </div>
        </div>
    );
}
