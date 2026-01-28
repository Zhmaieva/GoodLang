import React, { useEffect, useState } from "react";

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

export default function DailyTasksNeedMorePracticeModal({
                                                            open,
                                                            onClose,
                                                            theme,
                                                        }) {
    const [btnHover, setBtnHover] = useState(false);

    useEffect(() => {
        if (!open) return;
        setBtnHover(false);
    }, [open]);

    if (!open) return null;

    const onCloseHandler = () => {
        onClose?.();
    };

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
                    maxWidth: 500,
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
                                lineHeight: 0.95,
                            }}
                        >
                            Завдання зроблено
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
                            Але є ще дещо
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
                        marginBottom: 12,
                        textAlign: "left",
                        color: theme.text,
                        fontWeight: 800,
                        lineHeight: 1.35,
                        fontSize: 14.5,
                    }}
                >
                    Всі завдання виконано на сьогодні, але деякі правила ще потребують
                    додаткової практики, щоб пройти марафон.
                </div>

                <div
                    style={{
                        background: "rgba(255,255,255,0.35)",
                        border: "2px solid rgba(0,0,0,0.08)",
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
                    <span style={{ opacity: 0.85 }}>
                        Дороби практику{" "}
                    </span>
                    <span style={{ color: theme.accent, opacity: 1 }}>
                        до дедлайну
                    </span>
                    <span style={{ opacity: 0.85 }}>
                        , щоб не вилетіти з марафону.
                    </span>
                </div>

                <button
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    onClick={onCloseHandler}
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
                    Добре
                </button>
            </div>
        </div>
    );
}
