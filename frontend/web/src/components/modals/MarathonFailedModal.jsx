import React, { useEffect, useState } from "react";
import MarathonInfoModal from "./MarathonInfoModal.jsx";

const logoStyle = (size, theme) => ({
    flex: "0 0 auto",
    width: size,
    height: size,
    borderRadius: 12,
    background: theme.accent,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 800,
    fontSize: size * 0.45,
    boxShadow: `0 2px 0 ${theme.accentDark}`,
});

export default function MarathonFailedModal({
                                                open,
                                                onClose,
                                                theme,
                                                account = null,
                                                ruleIds = [],
                                            }) {
    const [btnHover, setBtnHover] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        setBtnHover(false);
        setInfoOpen(false);
    }, [open]);

    const onCloseHandler = () => {
        onClose?.();
    };

    // ✅ IMPORTANT: keep hooks above any conditional returns.
    // (We have no other hooks below now.)

    if (!open) return null;

    const handleStartNew = () => {
        setInfoOpen(true);
    };

    // ✅ Safe now because there are no hooks after this point.
    if (infoOpen) {
        return (
            <MarathonInfoModal
                open={true}
                onClose={() => {
                    setInfoOpen(false);
                    onCloseHandler();
                }}
                theme={theme}
                account={account}
                ruleIds={ruleIds}
            />
        );
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9998,
                paddingBottom: "env(safe-area-inset-bottom)",
                paddingTop: "env(safe-area-inset-top)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
            }}
            onClick={onCloseHandler}
        >
            <div
                style={{
                    background: theme.bg,
                    padding: "28px",
                    paddingTop: 0,
                    borderRadius: theme.radius * 1.2,
                    border: `4px solid ${theme.accent}`,
                    width: "90%",
                    maxWidth: 480,
                    textAlign: "center",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div />
                    <p
                        onClick={onCloseHandler}
                        style={{
                            marginBottom: 0,
                            marginTop: 4,
                            marginRight: -16,
                            color: theme.accent,
                            fontSize: "1.3rem",
                            fontWeight: 500,
                            textAlign: "left",
                            cursor: "pointer",
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            WebkitTouchCallout: "none",
                            opacity: 1,
                        }}
                    >
                        ✕
                    </p>
                </div>

                <div
                    style={{
                        marginLeft: 0,
                        marginBottom: 16,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h2
                            style={{
                                textAlign: "left",
                                marginBottom: 0,
                                marginTop: 0,
                                color: theme.text,
                                fontSize: "2rem",
                                fontWeight: 800,
                                lineHeight: 0.8,
                            }}
                        >
                            Кінець марафону
                        </h2>

                        <p
                            style={{
                                marginBottom: 0,
                                marginTop: 8,
                                marginLeft: 0,
                                color: theme.text,
                                fontWeight: 800,
                                opacity: 0.55,
                                fontSize: "1rem",
                                textAlign: "left",
                            }}
                        >
                            Але можна постаратися краще
                        </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={logoStyle(56, theme)}>GL</div>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: 14,
                        background: "rgba(255,255,255,0.55)",
                        border: "2px solid rgba(0,0,0,0.10)",
                        borderRadius: theme.radius,
                        padding: 14,
                        marginBottom: 20,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: 800,
                        lineHeight: 1.35,
                        fontSize: 14.5,
                    }}
                >
                    Завдання марафону не було зроблено вчасно, тому він був автоматично завершений.
                    <br/>
                    <br/>
                    <span style={{opacity: 0.8}}>
                        Доступ до підписки було скасовано.
                    </span>
                    <br/>
                    <br/>
                    <span style={{opacity: 0.8}}>
                        Щоб тренуватися далі без обмежень — почни новий марафон.
                    </span>
                </div>

                <button
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    onClick={handleStartNew}
                    style={{
                        appearance: "none",
                        padding: "10px 14px",
                        fontWeight: 800,
                        fontSize: "clamp(0.95rem, 3.5vw, 1rem)",
                        lineHeight: 1,
                        borderRadius: 999,
                        background: theme.accent,
                        color: "#fff",
                        border: "2px solid rgba(0,0,0,0.12)",
                        boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
                        fontFamily: "Nunito, system-ui, sans-serif",
                        whiteSpace: "nowrap",
                        opacity: 1,
                        transform: btnHover ? "translateY(1px)" : "none",
                        filter: btnHover ? "brightness(0.95)" : "none",
                        transition: "transform 120ms ease, filter 120ms ease",
                        cursor: "pointer",
                        width: "100%",
                    }}
                >
                    Почати новий марафон
                </button>
            </div>
        </div>
    );
}
