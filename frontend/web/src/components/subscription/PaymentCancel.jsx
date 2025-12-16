import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{textAlign: "center", maxWidth: 520, width: "100%", padding: "20px 0px"}}>
                <div style={{width: '100%', justifyContent: "center", alignItems: "center", display: "flex"}}>
                    <div className="logo" style={{borderRadius: "20px", marginBottom: 10}}>
                        GL
                    </div>
                </div>

                <h1 style={{color: "var(--accent-dark)"}}>Сталася помилка</h1>

                <p style={{color: "var(--muted)", fontSize: 15, lineHeight: 1.55}}>
                    Оплата не пройшла, але ви все ще можете користуватися безкоштовною версією.
                </p>

                <div style={{display: "flex", justifyContent: "center"}}>
                    <button className="btn" onClick={() => navigate("/")}>
                        Повернутися на головну
                    </button>
                </div>
            </div>
        </div>
    );
}
