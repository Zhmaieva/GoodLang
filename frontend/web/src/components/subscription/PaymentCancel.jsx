import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {logoStyle} from "./LimitModal.jsx";
import {legacyGlobalStyling} from "../../App.jsx";
import {callAccountVerifyApi} from "../../services/api.js";
import {ACTION_TYPES} from "../../utils/constants.js";

export default function PaymentCancel() {
    const navigate = useNavigate();

    useEffect(() => {
        callAccountVerifyApi(ACTION_TYPES.ERROR_PURCHASE_MARATHON).then();
    })

    return (
        <div className="container" style={{ maxWidth: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{textAlign: "center", width: "90%", padding: "20px 36px"}}>
                <div style={{display: "flex", justifyContent: "center", gap: 12, marginBottom: 16}}>
                    <div style={logoStyle(64)}>GL</div>
                </div>

                <h1 style={{
                    textAlign: "center",
                    marginBottom: 0,
                    marginTop: 0,
                    color: legacyGlobalStyling.text,
                    fontSize: "18pt",
                    fontWeight: 800}}>Ой, помилка :(</h1>

                <p style={{
                    color: legacyGlobalStyling.text,
                    fontSize: "16px",
                    fontWeight: 500
                }}>

                    Напиши до <a style={{
                        color: legacyGlobalStyling.accent,
                        textDecoration: "none",
                    }} href="mailto:goodlang.app@gmail.com">goodlang.app@gmail.com</a> і ми допоможемо.
                </p>

                <div style={{display: "flex", justifyContent: "center"}}>
                    <button style={{
                        background: legacyGlobalStyling.accent,
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: legacyGlobalStyling.radius,
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
