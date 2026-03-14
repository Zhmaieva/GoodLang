import React, {useEffect, useMemo, useState} from "react";
import { useNavigate } from "react-router-dom";
import {logoStyle} from "./LimitModal.jsx";
import {legacyGlobalStyling} from "../../App.jsx";
import {setPaymentIntent} from "../../services/dataService.js";
import {syncPrevAccountInfoToLS} from "../../services/marathonService.js";
import {trackMetaEvent} from "../../services/gaService.js";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const [isMarathon, setIsMarathon] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const isMarathon = params.get("type") === "marathon";

        // If teacher=true -> remember it + remove param from URL (no redirect)
        if (isMarathon) {
            params.delete("type");
            setIsMarathon(true);
            syncPrevAccountInfoToLS();
        }

        setPaymentIntent(false);
        localStorage.removeItem("paymentIntentType");

        if (!localStorage.getItem("purchase")) {
            localStorage.setItem("purchase", "true")
            trackMetaEvent("Purchase");
        }
    }, []);

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
            "Unlimited trainer",
            "Cloud progress saving",
            "Access from any device",
            "Priority customer support",
        ];

        if (!isTeacher) return core;

        // teacher/pdfs perks first
        return [
            '1800+ вправ у форматі PDF',
            //"Відсутність вотермарків на усіх PDF",
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
        background: legacyGlobalStyling.accent,
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
                            color: legacyGlobalStyling.text,
                            fontSize: "18pt",
                            fontWeight: 800
                        }}>
                            You're all set
                        </h2>

                        <p style={{
                            marginBottom: 16,
                            marginTop: 8,
                            marginLeft: 0,
                            color: legacyGlobalStyling.text,
                            fontSize: "16px",
                            fontWeight: 500,
                            textAlign: "left",
                            opacity: 0.9,
                        }}>
                            {isMarathon ? "Марафон розпочато" : "Monthly subscription"}
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
                        color: legacyGlobalStyling.text,
                        fontSize: "16px",
                        fontWeight: 500
                    }}>
                        {benefits.map((txt, i) => (
                            <li key={i}>
                                <span style={{marginRight: 8, color: legacyGlobalStyling.accent, fontWeight: 700}}>✓</span>
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
                        onClick={() => navigate("/trainer")}
                        style={buttonStyle}
                    >
                        {isMarathon ? "До марафону" : "Start training"}
                    </button>
                </div>
            </div>
        </div>
    );
}
