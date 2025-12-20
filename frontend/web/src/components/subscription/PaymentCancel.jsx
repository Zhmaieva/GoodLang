import React from "react";
import { useNavigate } from "react-router-dom";
import {logoStyle} from "./LimitModal.jsx";
import {theme} from "../../App.jsx";

export default function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{textAlign: "center", maxWidth: 400, width: "100%", padding: "20px 0px"}}>
                <div style={{display: "flex", justifyContent: "center", gap: 12, marginBottom: 16}}>
                    <div style={logoStyle(64)}>GL</div>
                </div>

                <h1 style={{
                    textAlign: "center",
                    marginBottom: 0,
                    marginTop: 0,
                    color: theme.text,
                    fontSize: "18pt",
                    fontWeight: 800}}>Ой, помилка :(</h1>

                <p style={{
                    color: theme.text,
                    fontSize: "16px",
                    fontWeight: 500
                }}>

                    Напишіть до <a style={{
                        color: theme.accent,
                        textDecoration: "none",
                    }} href="mailto:goodlang.app@gmail.com">goodlang.app@gmail.com</a> і ми допоможемо.
                </p>

                <div style={{display: "flex", justifyContent: "center"}}>
                    <button style={{
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
                    }} onClick={() => navigate("/")}>
                        Повернутися на головну
                    </button>
                </div>
            </div>
        </div>
    );
}
