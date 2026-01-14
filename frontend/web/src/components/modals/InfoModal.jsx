import React from "react";

export default function InfoModal({
                                      theme,
                                      title = "Інформація",
                                      message,
                                      buttonText = "OK",
                                      onClose,
                                  }) {
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
            onClick={onClose}
        >
            <div
                style={{
                    background: theme.bg,
                    padding: "28px",
                    borderRadius: theme.radius * 1.2,
                    border: `4px solid ${theme.accent}`,
                    width: "90%",
                    maxWidth: 420,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2
                    style={{
                        marginTop: 0,
                        marginBottom: 14,
                        color: theme.text,
                        fontSize: "1.35rem",
                        fontWeight: 800,
                    }}
                >
                    {title}
                </h2>

                <div
                    style={{
                        marginBottom: 22,
                        color: theme.text,
                        fontSize: "1rem",
                        lineHeight: 1.5,
                    }}
                >
                    {message}
                </div>

                <button
                    onClick={onClose}
                    style={{
                        width: "100%",
                        background: theme.accent,
                        color: "white",
                        border: "none",
                        borderRadius: theme.radius,
                        padding: "12px 16px",
                        fontSize: "1rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        boxShadow: `2px 2px 0 ${theme.accentDark}`,
                    }}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
