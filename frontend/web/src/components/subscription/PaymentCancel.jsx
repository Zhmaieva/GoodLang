import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: 40, textAlign: "center" }}>
            <h1 style={{ color: "#ef476f" }}>Сталася помилка 😕</h1>
            <p>
                Оплата не пройшла, але ви все ще можете користуватися безкоштовною версією.
            </p>
            <button
                onClick={() => navigate("/")}
                style={{
                    marginTop: 30,
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: "#3a6ea5",
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
