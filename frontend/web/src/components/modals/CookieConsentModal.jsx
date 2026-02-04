import React, {useEffect, useState} from "react";
import {clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll} from "body-scroll-lock";

export default function CookieConsentModal({
                                               theme,
                                               onAccept,
                                               onReject,
                                               onOpenPolicy,
                                               disableLinks = false,
                                           }) {
    const [primaryHover, setPrimaryHover] = useState(false);
    const [secondaryHover, setSecondaryHover] = useState(false);

    const onAcceptHandler = () => {
        unlockScroll();
        onAccept();
    }

    const onRejectHandler = () => {
        unlockScroll();
        onReject();
    }

    const lockScroll = () => {
        disableBodyScroll(document.querySelector('#cookie-modal'));
    }

    const unlockScroll = () => {
        clearAllBodyScrollLocks();
        enableBodyScroll(document.querySelector('#cookie-modal'));
    }

    useEffect(() => {
        lockScroll();
    })

    const overlayStyle = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingTop: "env(safe-area-inset-top)",
    };

    const cardStyle = {
        background: theme.bg,
        padding: 28,
        borderRadius: theme.radius * 1.2,
        border: `4px solid ${theme.accent}`,
        width: "90%",
        maxWidth: 460,
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    };

    // MarathonInfoModal-style buttons
    const primaryBtn = {
        appearance: "none",
        padding: "10px 14px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        background: theme.accent,
        color: "#fff",
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
        fontFamily: "Nunito, system-ui, sans-serif",
        whiteSpace: "nowrap",
        opacity: 1,
        transform: primaryHover ? "translateY(1px)" : "none",
        filter: primaryHover ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
        cursor: "pointer",
        width: "100%",
    };

    const secondaryBtn = {
        appearance: "none",
        padding: "10px 14px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        background: "#fff",
        color: theme.text,
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
        fontFamily: "Nunito, system-ui, sans-serif",
        whiteSpace: "nowrap",
        opacity: 1,
        transform: secondaryHover ? "translateY(1px)" : "none",
        filter: secondaryHover ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
        cursor: "pointer",
        width: "100%",
    };

    return (
        <div id={"cookie-modal"} style={overlayStyle}>
            <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
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
                    безпечної автентифікації та обробки платежів, але ти можеш прийняти
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
                    {!disableLinks ? (
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
                    ) : (
                        "політиці конфіденційності та cookies"
                    )}
                    .
                </p>

                <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <button
                            onMouseEnter={() => setSecondaryHover(true)}
                            onMouseLeave={() => setSecondaryHover(false)}
                            onClick={onRejectHandler}
                            style={secondaryBtn}
                        >
                            Відхилити
                        </button>
                    </div>

                    <div style={{ flex: 1 }}>
                        <button
                            onMouseEnter={() => setPrimaryHover(true)}
                            onMouseLeave={() => setPrimaryHover(false)}
                            onClick={onAcceptHandler}
                            style={primaryBtn}
                        >
                            Прийняти
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
