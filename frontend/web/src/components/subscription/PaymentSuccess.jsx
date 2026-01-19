import React, {useMemo, useState} from "react";
import { useNavigate } from "react-router-dom";
import {logoStyle} from "./LimitModal.jsx";
import {theme} from "../../App.jsx";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    const isTeacher = useMemo(() => {
        try {
            return false;// localStorage.getItem("teacher") === "true";
        } catch (_) {
            return false;
        }
    }, []);

    const benefits = useMemo(() => {
        // core benefits (same as LimitModal list, excluding "Можеш завжди скасувати")
        const core = [
            "Тренажер без обмежень",
            "Хмарне збереження прогресу",
            "Доступ з усіх пристроїв",
            "Пріоритетна підтримка",
        ];

        if (!isTeacher) return core;

        // teacher/pdfs perks first
        return [
            '1800+ вправ у форматі PDF',
            "Відсутність вотермарків на усіх PDF",
            ...core,
        ];
    }, [isTeacher]);

    const buttonStyle = {
        appearance: "none",
        padding: "10px 14px",
        fontWeight: 800,
        fontSize: "clamp(0.9rem, 3.5vw, 1rem)",
        lineHeight: 1,
        borderRadius: 999,
        background: theme.accent,
        color: "#fff",
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
        fontFamily: "Nunito, system-ui, sans-serif",
        whiteSpace: "nowrap",
        width: "100%",
        cursor: "pointer",
        transform: hovered ? "translateY(1px)" : "none",
        filter: hovered ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
        opacity: 1,
    };

    return (
        <div
            className="container"
            style={{maxWidth: 380, display: "flex", alignItems: "center", justifyContent: "center"}}
        >
            <div style={{textAlign: "center", width: "100%", padding: "20px 36px"}}>
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
                            fontSize: "18pt",
                            fontWeight: 800
                        }}>
                            Все супер
                        </h2>

                        <p style={{
                            marginBottom: 16,
                            marginTop: 8,
                            marginLeft: 0,
                            color: theme.text,
                            fontSize: "16px",
                            fontWeight: 500,
                            textAlign: "left",
                            opacity: 0.9,
                        }}>
                            Щомісячна підписка
                        </p>
                    </div>

                    <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                        <div style={logoStyle(64)}>GL</div>
                    </div>
                </div>

                <div style={{textAlign: "left", margin: "0 0 28px 10px", maxWidth: 320}}>
                    <ul style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        lineHeight: "1.6",
                        color: theme.text,
                        fontSize: "16px",
                        fontWeight: 500
                    }}>
                        {benefits.map((txt, i) => (
                            <li key={i}>
                                <span style={{marginRight: 8, color: theme.accent, fontWeight: 700}}>✓</span>
                                {txt}
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{
                    display: "flex",
                    marginTop: "12px",
                    flexDirection: "column",
                    gap: "12px",
                    justifyContent: "space-between"
                }}>
                    <button
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        onClick={() => navigate("/analytics")}
                        style={buttonStyle}
                    >
                        Перейти до списку правил
                    </button>
                </div>
            </div>
        </div>
    );
}
