import React from "react";
import { useNavigate } from "react-router-dom";
import {logoStyle} from "./LimitModal.jsx";
import {theme} from "../../App.jsx";


export default function PaymentSuccess() {
    const navigate = useNavigate();

    return (
        <div className="container"
             style={{maxWidth: 380, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div style={{textAlign: "center", width: "100%", padding: "20px 36px"}}>
                <div style={{
                    marginLeft: 10,
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                    <div style={{display: "flex", flexDirection: "column", maxHeight: 105}}>
                        <h2 style={{
                            textAlign: "left",
                            marginBottom: 0,
                            marginTop: 0,
                            color: theme.text,
                            fontSize: "18pt",
                            fontWeight: 800
                        }}>
                            Преміум акаунт
                        </h2>
                        <p style={{
                            marginBottom: 16,
                            marginTop: 8,
                            marginLeft: 0,
                            color: theme.text,
                            fontSize: "16px",
                            fontWeight: 500,
                            textAlign: "left"
                        }}>
                            Підписка ₴149.99 / місяць
                        </p>
                    </div>

                    <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                        <div style={logoStyle(64)}>GL</div>
                    </div>
                </div>

                <div style={{textAlign: "left", margin: "0 0 28px 10px", maxWidth: 280}}>
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
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            background: theme.accent,
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
                    >
                        Повернутися на головну
                    </button>
                </div>
            </div>
        </div>
            )
            }
