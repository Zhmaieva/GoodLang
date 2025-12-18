import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: 40, textAlign: "center", display: "flex", flexDirection: "column" }}>
            <h1 style={{ color: "#4ba36e" }}>Оплата успішна!</h1>
            <p>Ви отримали преміум доступ з наступними можливостями:</p>
            <ul style={{ textAlign: "left", display: "inline-block", marginTop: 20 }}>
                <li>Необмежена кількість завдань та перевірок</li>
                <li>Хмарне збереження прогресу</li>
                <li>Доступ з усіх пристроїв</li>
                <li>Пріоритетна підтримка</li>
            </ul>
            <button
                onClick={() => navigate("/")}
                style={{
                    marginTop: 30,
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: "#ff6138",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 16,
                }}
            >
                Повернутися на головну
            </button>
        </div>
    );
}
