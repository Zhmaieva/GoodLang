import React, { useState, useRef, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {callAccountInfoApi, callCheckoutApi} from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../../services/accountService.js";
import LoginModal from "./LoginModal.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function LimitModal({ isLimitReached, theme, open, onClose, waitTimeSeconds }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const checkoutRef = useRef(null);

    const [timeLeft, setTimeLeft] = useState(0);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [account, setAccount] = useState(null);


    // ⏳ Countdown timer — only when limit is reached
    useEffect(() => {
        if (!open || !isLimitReached) return;

        setTimeLeft(waitTimeSeconds || 0);

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [open, isLimitReached, waitTimeSeconds, onClose]);

    function formatTime(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    if (!open) return null;

    async function handleSubscribe() {
        try {
            setLoading(true);

            if (isLimitReached) {
                const account = await callAccountInfoApi();
                if (!account.email) {
                    setAccount(account);
                    setLoginModalOpen(true);
                    return;
                }
            }

            const stripe = await stripePromise;

            const { clientSecret, isSuccess } = await callCheckoutApi(getUserId());
            if (!isSuccess) {
                navigate("/payment/cancel");
                setLoading(false);
                return;
            }

            if (!checkoutRef.current) {
                setIsPaying(true);
                checkoutRef.current = await stripe.initEmbeddedCheckout({ clientSecret });
                checkoutRef.current.mount("#embedded-checkout-container");
            }

            document.getElementById("embedded-checkout-container").style.display = "block";
            setLoading(false);
        } catch (err) {
            console.error("Stripe error:", err);
            setLoading(false);
        }
    }

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
        }}>
            <div style={{
                background: theme.bg,
                padding: "32px",
                borderRadius: theme.radius * 1.2,
                border: `4px solid ${theme.accent}`,
                width: "90%",
                maxWidth: 460,
                textAlign: "center",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                display: !isPaying ? "block" : "none",
            }}>
                <h2 style={{ marginBottom: 16, color: theme.text, fontSize: "1.6rem", fontWeight: 800 }}>
                    {isLimitReached ? "Ліміт вичерпано" : "Навчання в повну силу"}
                </h2>

                {isLimitReached && timeLeft > 0 && (
                    <div
                        style={{
                            marginBottom: 16,
                            fontSize: "1.2rem",
                            fontWeight: 700,
                            color: theme.accent,
                            fontFamily: "monospace",
                            letterSpacing: "0.5px",
                            width: "100%",
                            display: "inline-block",
                            textAlign: "center"
                        }}
                    >
                        Залишилось чекати:{" "}
                        <span style={{ display: "inline-block", minWidth: "110px", textAlign: "center" }}>
            {formatTime(timeLeft)}
        </span>
                    </div>
                )}

                <p style={{ color: theme.muted, fontSize: "1.05rem", marginBottom: 24, lineHeight: "1.45" }}>
                    Щоб продовжити тренуватися без обмежень
                    та відкрити всі можливості GoodLang —
                    оформіть підписку.
                </p>

                <div style={{ textAlign: "left", margin: "0 auto 28px", maxWidth: 340 }}>
                    <ul style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        lineHeight: "1.6",
                        color: theme.text,
                        fontSize: "1.05rem",
                        fontWeight: 500
                    }}>
                        <li>✅ Необмежена кількість завдань</li>
                        <li>✅ Хмарне збереження прогресу</li>
                        <li>✅ Синхронізація на всіх пристроях</li>
                        <li>✅ Пріоритетна підтримка</li>
                    </ul>
                </div>

                <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    style={{
                        background: loading ? "#999" : theme.accent,
                        color: "white",
                        padding: "14px 28px",
                        borderRadius: theme.radius,
                        border: "none",
                        cursor: loading ? "default" : "pointer",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        marginBottom: 16,
                        width: "100%",
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? "Завантаження…" : "Оформити підписку"}
                </button>

                <button
                    onClick={onClose}
                    disabled={loading}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: theme.muted,
                        fontSize: "0.95rem",
                        cursor: loading ? "default" : "pointer",
                        textDecoration: "underline",
                        opacity: loading ? 0.5 : 1
                    }}
                >
                    Пізніше
                </button>
            </div>

            <div id="embedded-checkout-container" style={{ display: "none", marginTop: 24 }}></div>

            <LoginModal forceLogin={true} theme={theme} account={account} open={loginModalOpen} onClose={() => {
                setLoginModalOpen(false);
                setLoading(false);
                onClose();
            }}/>
        </div>
    );
}
